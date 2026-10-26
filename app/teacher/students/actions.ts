"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { generateLoginCode, hashLoginCode } from "@/lib/classroom/login-code";
import { COURSE_IDS, accessUntil, isPlanId, planForCourses } from "@/lib/classroom/plans";
import { kstDate } from "@/lib/classroom/stats";
import { TALK_PASS } from "@/lib/classroom/interview-scenarios";
import { randomBytes } from "node:crypto";
import { hashPassword } from "@/lib/classroom/password";

export type StudentFormState =
  | { status: "success"; name: string; code: string }
  | { status: "error"; message: string }
  | undefined;

/** 코드 해시 충돌(극히 드묾) 시 재시도하며 insert/update */
async function withFreshCode(
  run: (hash: string) => Promise<{ code?: string } | null>,
): Promise<string> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = generateLoginCode();
    const result = await run(hashLoginCode(code));
    if (result?.code !== "23505") return code;
  }
  throw new Error("로그인 코드 생성에 실패했어요.");
}

export async function createStudent(
  _prev: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  await requireTeacher();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/[^0-9]/g, "");
  const memo = String(formData.get("memo") ?? "").trim();
  const plan = String(formData.get("plan") ?? "bootcamp");
  if (!name) return { status: "error", message: "이름을 입력해주세요." };
  if (!isPlanId(plan)) return { status: "error", message: "수강권을 선택해주세요." };

  const supabase = createServerSupabaseClient();
  if (phone) {
    const { data: dup } = await supabase.from("students").select("id").eq("phone", phone).maybeSingle();
    if (dup) return { status: "error", message: "이미 등록된 전화번호예요." };
  }
  try {
    const code = await withFreshCode(async (hash) => {
      const { error } = await supabase.from("students").insert({
        name,
        phone: phone || null,
        memo: memo || null,
        login_code_hash: hash,
        plan,
        access_until: accessUntil(plan, kstDate(new Date())),
      });
      if (error && error.code !== "23505") throw new Error(error.message);
      return error;
    });
    revalidatePath("/teacher/students");
    return { status: "success", name, code };
  } catch (e) {
    console.error("학생 등록 실패:", e);
    return { status: "error", message: "등록 중 오류가 발생했어요." };
  }
}

export async function regenerateCode(
  _prev: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  await requireTeacher();
  const id = String(formData.get("id"));
  const name = String(formData.get("name"));
  const supabase = createServerSupabaseClient();
  try {
    const { data: current } = await supabase
      .from("students")
      .select("session_version")
      .eq("id", id)
      .single();
    // 세션 버전을 올려서 예전 코드로 로그인해 둔 기기도 바로 로그아웃시킨다
    const nextVersion = (current?.session_version ?? 1) + 1;
    const code = await withFreshCode(async (hash) => {
      const { error } = await supabase
        .from("students")
        .update({ login_code_hash: hash, session_version: nextVersion })
        .eq("id", id);
      if (error && error.code !== "23505") throw new Error(error.message);
      return error;
    });
    return { status: "success", name, code };
  } catch (e) {
    console.error("코드 재발급 실패:", e);
    return { status: "error", message: "재발급 중 오류가 발생했어요." };
  }
}

export async function setStudentActive(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const isActive = formData.get("is_active") === "true";
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/teacher/students");
}

/** 가입 신청 승인: 수강권과 시작일을 정하면 종료일이 자동 계산된다 (keep=1이면 기존 종료일 유지) */
export async function approveStudent(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const plan = String(formData.get("plan"));
  const start = String(formData.get("start") || kstDate(new Date()));
  if (!isPlanId(plan) || !/^\d{4}-\d{2}-\d{2}$/.test(start)) return;
  const supabase = createServerSupabaseClient();
  const { data: cur } = await supabase.from("students").select("access_until").eq("id", id).maybeSingle();
  const until =
    formData.get("keep") === "1" && cur?.access_until ? (cur.access_until as string) : accessUntil(plan, start);
  await supabase
    .from("students")
    .update({ approval: "approved", is_active: true, stage: "enrolled", plan, access_until: until })
    .eq("id", id);
  revalidatePath("/teacher/students");
  revalidatePath("/teacher/crm");
}

/**
 * 가입 신청을 시트에서 가져온 기존 학생 카드와 합친다.
 * 신청서의 전화번호·비밀번호를 기존 카드로 옮기고, 신청서는 지운다 (프로필·메모·결제 기록 유지)
 */
/** 합칠 카드 id를 버튼에 묶어서 쓴다: formAction={mergeSignupInto.bind(null, cardId)} */
export async function mergeSignupInto(targetId: string, formData: FormData) {
  formData.set("target_id", targetId);
  return mergeSignup(formData);
}

export async function mergeSignup(formData: FormData) {
  await requireTeacher();
  // 실패하면 이유를 화면 위에 띄운다 (조용히 아무 일도 안 일어나지 않게)
  const fail = (why: string): never => {
    console.error("학생 합치기 실패:", why);
    redirect(`/teacher/students?merge_error=${encodeURIComponent(why)}`);
  };
  // 승인 폼 안의 '합치기' 버튼으로 오면 신청서 id는 "id"로 온다
  const pendingId = String(formData.get("pending_id") ?? formData.get("id"));
  const targetId = String(formData.get("target_id") ?? "");
  const plan = String(formData.get("plan"));
  const start = String(formData.get("start") || kstDate(new Date()));
  if (!targetId || targetId === "null") fail("합칠 카드 정보가 안 넘어왔어요");
  if (!isPlanId(plan)) fail(`수강권을 알 수 없어요 (${plan})`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) fail(`시작일 형식이 이상해요 (${start})`);
  if (pendingId === targetId) fail("같은 카드끼리는 합칠 수 없어요");
  const supabase = createServerSupabaseClient();
  const [{ data: pending, error: e1 }, { data: target, error: e2 }] = await Promise.all([
    supabase.from("students").select("phone, nickname, password_hash, privacy_agreed_at, approval").eq("id", pendingId).maybeSingle(),
    supabase.from("students").select("access_until, password_hash, login_code_hash").eq("id", targetId).maybeSingle(),
  ]);
  if (e1 || e2) fail(`불러오기 오류: ${(e1 ?? e2)!.message}`);
  if (!pending) fail("가입 신청서를 못 찾았어요");
  if (pending!.approval !== "pending") fail("이미 처리된 신청이에요");
  if (!target) fail("합칠 카드를 못 찾았어요");
  if (target!.password_hash || target!.login_code_hash) fail("합칠 카드에 이미 로그인 정보가 있어요");
  // 전화번호는 한 사람만 쓸 수 있어서, 신청서의 번호를 먼저 비우고 옮긴 뒤 신청서를 지운다
  const { error: e3 } = await supabase.from("students").update({ phone: null, nickname: null }).eq("id", pendingId);
  if (e3) fail(`신청서 정리 오류: ${e3.message}`);
  const { error } = await supabase
    .from("students")
    .update({
      phone: pending!.phone,
      nickname: pending!.nickname,
      password_hash: pending!.password_hash,
      privacy_agreed_at: pending!.privacy_agreed_at,
      approval: "approved",
      is_active: true,
      stage: "enrolled",
      plan,
      // 시트의 예전 종료일이 이미 지났으면 새 시작일 기준으로 다시 계산 (안 그러면 바로 '기간 만료')
      access_until:
        target!.access_until && (target!.access_until as string) >= kstDate(new Date())
          ? (target!.access_until as string)
          : accessUntil(plan as Parameters<typeof accessUntil>[0], start),
    })
    .eq("id", targetId);
  if (error) {
    await supabase.from("students").update({ phone: pending!.phone, nickname: pending!.nickname }).eq("id", pendingId);
    fail(`합치기 오류: ${error.message}`);
  }
  const { error: e4 } = await supabase.from("students").delete().eq("id", pendingId);
  if (e4) console.error("신청서 지우기 실패:", e4.message);
  revalidatePath("/teacher/students");
  revalidatePath("/teacher/crm");
}

export async function rejectStudent(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update({ approval: "rejected", is_active: false }).eq("id", String(formData.get("id")));
  revalidatePath("/teacher/students");
}

/** 수강권·종료일 변경 (연장 포함) */
export async function updatePlan(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const until = String(formData.get("until") ?? "");
  const trial = formData.get("trial") === "on";
  const courses = COURSE_IDS.filter((c) => formData.getAll("courses").map(String).includes(c));
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^\d{4}-\d{2}-\d{2}$/.test(until) || courses.length === 0) return;
  const supabase = createServerSupabaseClient();
  const { data: cur } = await supabase.from("students").select("plan").eq("id", id).maybeSingle();
  // 체험은 부트캠프만 열린다. 아니면 고른 과정과 같은 수강권, 없으면 맞춤 수강(custom)
  const plan = trial ? "trial1" : planForCourses(courses, cur?.plan as string | null);
  // 무료회원이 수강권을 사면 여기서 수강권을 주면 바로 등록생이 된다
  await supabase
    .from("students")
    .update({
      plan,
      courses: plan === "custom" ? courses : null,
      access_until: until,
      stage: "enrolled",
      approval: "approved",
      is_active: true,
    })
    .eq("id", id);
  revalidatePath("/teacher/students");
  revalidatePath("/teacher/crm");
  revalidatePath(`/teacher/students/${id}`);
}

/** 상담·관리 기록 추가 */
export async function addNote(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
  if (!body) return;
  const supabase = createServerSupabaseClient();
  await supabase.from("teacher_notes").insert({ student_id: id, body });
  revalidatePath(`/teacher/students/${id}`);
}

export async function deleteNote(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("teacher_notes").delete().eq("id", String(formData.get("note_id")));
  revalidatePath(`/teacher/students/${String(formData.get("id"))}`);
}

/** 학생 한 줄 메모 (목록에 보임) */
export async function updateMemo(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const memo = String(formData.get("memo") ?? "").trim().slice(0, 200);
  const supabase = createServerSupabaseClient();
  await supabase.from("students").update({ memo: memo || null }).eq("id", id);
  revalidatePath(`/teacher/students/${id}`);
  revalidatePath("/teacher/students");
}

/** 준비 중인 과정을 이 학생에게만 미리 열어주기 */
export async function setEarlyCourses(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const courses = formData
    .getAll("early")
    .map(String)
    .filter((c) => (COURSE_IDS as readonly string[]).includes(c));
  const supabase = createServerSupabaseClient();
  // '보카 전체 열기'(voca) 표시는 과정 체크와 따로 관리하니 그대로 둔다
  const { data: row } = await supabase.from("students").select("early_courses").eq("id", id).maybeSingle();
  const keep = ((row?.early_courses as string[] | null) ?? []).filter((c) => c === "voca");
  await supabase.from("students").update({ early_courses: [...courses, ...keep] }).eq("id", id);
  revalidatePath(`/teacher/students/${id}`);
}

/** 수강권 없는 학생(예: 초급반)에게 보카 세트 전체 열어주기 / 닫기 */
export async function setVocaFull(id: string, on: boolean) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const { data: row } = await supabase.from("students").select("early_courses").eq("id", id).maybeSingle();
  const rest = ((row?.early_courses as string[] | null) ?? []).filter((c) => c !== "voca");
  await supabase.from("students").update({ early_courses: on ? [...rest, "voca"] : rest }).eq("id", id);
  revalidatePath(`/teacher/students/${id}`);
}

/** 선생님이 학생 휴대폰으로 알림 보내기 */
export async function sendTeacherPush(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const body = String(formData.get("body") ?? "").trim().slice(0, 140);
  if (!/^[0-9a-f-]{36}$/.test(id) || !body) return;
  const { sendPushToStudent } = await import("@/lib/classroom/push");
  await sendPushToStudent(id, { title: "💬 다니엘쌤", body, url: "/student", tag: "teacher" }, "teacher");
  revalidatePath(`/teacher/students/${id}`);
}

export type TempPasswordState = { status: "success"; password: string } | { status: "error"; message: string } | undefined;

/**
 * 비밀번호를 잊은 학생: 임시 비밀번호를 만들어 선생님 화면에 한 번만 보여준다.
 * 다른 기기에 로그인돼 있던 것도 로그아웃된다.
 */
export async function makeTempPassword(_prev: TempPasswordState, formData: FormData): Promise<TempPasswordState> {
  await requireTeacher();
  const id = String(formData.get("id"));
  const supabase = createServerSupabaseClient();
  const { data: cur } = await supabase.from("students").select("session_version, phone").eq("id", id).maybeSingle();
  if (!cur) return { status: "error", message: "학생을 찾지 못했어요." };
  if (!cur.phone) return { status: "error", message: "전화번호로 가입한 학생이 아니에요. 로그인 코드를 재발급해 주세요." };
  // 헷갈리는 글자(0/o, 1/l/i)는 빼고 8자리
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(8);
  const password = [...bytes].map((b) => chars[b % chars.length]).join("");
  const { error } = await supabase
    .from("students")
    .update({ password_hash: await hashPassword(password), session_version: (cur.session_version ?? 1) + 1 })
    .eq("id", id);
  if (error) return { status: "error", message: "만들지 못했어요. 다시 시도해 주세요." };
  return { status: "success", password };
}

/** AI 면접 패스 열어주기: 오늘(또는 남은 기간 끝)부터 1개월 */
export async function grantTalkPass(formData: FormData) {
  await requireTeacher();
  const id = String(formData.get("id"));
  const supabase = createServerSupabaseClient();
  const { data: st } = await supabase.from("students").select("talk_until").eq("id", id).maybeSingle();
  const today = kstDate(new Date());
  const from = st?.talk_until && (st.talk_until as string) >= today ? (st.talk_until as string) : today;
  const d = new Date(`${from}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + TALK_PASS.months);
  await supabase.from("students").update({ talk_until: d.toISOString().slice(0, 10) }).eq("id", id);
  await supabase.from("talk_requests").delete().eq("student_id", id);
  revalidatePath("/teacher/students");
  revalidatePath(`/teacher/students/${id}`);
}

export async function dismissTalkRequest(formData: FormData) {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  await supabase.from("talk_requests").delete().eq("student_id", String(formData.get("id")));
  revalidatePath("/teacher/students");
}

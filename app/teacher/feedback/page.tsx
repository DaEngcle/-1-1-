import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { cardClass } from "@/app/_ui/styles";
import { toggleFeedbackDone } from "./actions";

const KIND_LABEL: Record<string, string> = {
  inconvenient: "😣 불편",
  idea: "💡 바라는 기능",
  praise: "🥰 좋았어요",
};

export default async function TeacherFeedbackPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("student_feedback")
    .select("id, kind, message, page, done, created_at, students(name, nickname)")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = data ?? [];
  const fresh = rows.filter((r) => !r.done).length;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900">💬 학생 의견</h1>
        <p className="mt-1 text-sm text-zinc-600">
          학생 화면에 가끔(10일에 한 번 정도, 랜덤) &ldquo;불편한 점이나 있었으면 하는 기능 있어요?&rdquo; 질문이 떠요. 답한 내용이 여기 모여요.
          {fresh > 0 && <b className="ml-1 text-[#6C5CFF]">새 의견 {fresh}개</b>}
        </p>
      </div>
      {rows.length === 0 ? (
        <p className={`${cardClass} text-sm text-zinc-500`}>아직 들어온 의견이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => {
            const st = r.students as unknown as { name: string; nickname: string | null } | null;
            return (
              <li key={r.id} className={`${cardClass} flex flex-col gap-1.5 ${r.done ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-zinc-700">{KIND_LABEL[r.kind] ?? r.kind}</span>
                  <span className="font-semibold text-zinc-800">{st ? (st.nickname ?? st.name) : "(탈퇴한 학생)"}</span>
                  <span>{new Date(r.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short" })}</span>
                  {r.page && <span className="text-zinc-400">{r.page}</span>}
                </div>
                <p className="whitespace-pre-wrap text-zinc-900">{r.message}</p>
                <form action={toggleFeedbackDone.bind(null, r.id, !r.done)} className="self-end">
                  <button className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                    {r.done ? "↩ 새 의견으로" : "✓ 확인함"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

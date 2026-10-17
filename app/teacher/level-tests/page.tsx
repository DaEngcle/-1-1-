import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { requireTeacher } from "@/lib/classroom/dal";
import { LEVELS } from "@/lib/classroom/levels";
import { isPostTestOpen, type LevelTestRow } from "@/lib/classroom/level-test-data";
import { getWeeklyRanking } from "@/lib/classroom/engagement";
import { WeeklyRanking } from "@/app/_ui/engagement";
import { togglePostTest } from "./actions";
import { cardClass, primaryButtonClass, secondaryButtonClass } from "@/app/_ui/styles";

export default async function TeacherLevelTestsPage() {
  await requireTeacher();
  const supabase = createServerSupabaseClient();
  const [{ data: studentRows }, { data: testRows }, postOpen, ranking] = await Promise.all([
    supabase.from("students").select("id, name").eq("is_active", true).order("name"),
    supabase.from("level_tests").select("*").not("finished_at", "is", null),
    isPostTestOpen(),
    getWeeklyRanking({ masked: false }),
  ]);
  const students = studentRows ?? [];
  const tests = (testRows ?? []) as LevelTestRow[];
  const testOf = (id: string, kind: "pre" | "post") => tests.find((t) => t.student_id === id && t.kind === kind);
  const count = (kind: "pre" | "post", level: number) =>
    students.filter((s) => testOf(s.id, kind)?.level === level).length;
  const maxCount = Math.max(1, ...LEVELS.flatMap((l) => [count("pre", l.level), count("post", l.level)]));

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">📈 레벨 · 랭킹</h1>

      <section className={`${cardClass} flex flex-wrap items-center justify-between gap-3`}>
        <div>
          <p className="font-semibold text-zinc-900">수강 후 레벨테스트 {postOpen ? "열림" : "닫힘"}</p>
          <p className="text-xs text-zinc-500">
            수료할 때 열어주세요. 열면 수강 전 테스트를 본 학생 화면에 &lsquo;수강 후 테스트&rsquo;가 나타나요.
          </p>
        </div>
        <form action={togglePostTest}>
          <input type="hidden" name="open" value={String(!postOpen)} />
          <button type="submit" className={postOpen ? secondaryButtonClass : primaryButtonClass}>
            {postOpen ? "닫기" : "수강 후 테스트 열기"}
          </button>
        </form>
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">반 전체 레벨 분포</h2>
        <div className="flex flex-col gap-1.5 text-sm">
          {LEVELS.map((l) => (
            <div key={l.level} className="grid grid-cols-[5.5rem_1fr] items-center gap-2">
              <span className="text-xs text-zinc-600">
                Lv.{l.level} {l.name}
              </span>
              <div className="flex flex-col gap-0.5">
                {(["pre", "post"] as const).map((kind) => (
                  <div key={kind} className="flex items-center gap-1.5">
                    <span
                      className={`h-2.5 rounded-sm ${kind === "pre" ? "bg-zinc-300" : "bg-brand-500"}`}
                      style={{ width: `${(count(kind, l.level) / maxCount) * 100}%`, minWidth: count(kind, l.level) ? 6 : 0 }}
                    />
                    <span className="text-[11px] text-zinc-500">{count(kind, l.level) || ""}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">
          <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-zinc-300" />
          수강 전 <span className="ml-2 mr-1 inline-block h-2 w-2 rounded-sm bg-brand-500" />
          수강 후
        </p>
      </section>

      <section className={cardClass}>
        <h2 className="mb-2 font-bold text-zinc-900">학생별 성장</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500">
                <th className="py-1 pr-2 font-normal">학생</th>
                <th className="py-1 pr-2 font-normal">수강 전</th>
                <th className="py-1 pr-2 font-normal">수강 후</th>
                <th className="py-1 font-normal">성장</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {students.map((s) => {
                const pre = testOf(s.id, "pre");
                const post = testOf(s.id, "post");
                const growth = pre && post ? (post.total_score ?? 0) - (pre.total_score ?? 0) : null;
                return (
                  <tr key={s.id}>
                    <td className="py-1.5 pr-2">
                      <Link href={`/teacher/students/${s.id}`} className="hover:underline">
                        {s.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap py-1.5 pr-2 text-zinc-600">
                      {pre ? `Lv.${pre.level} · ${pre.total_score}점` : "미응시"}
                    </td>
                    <td className="whitespace-nowrap py-1.5 pr-2 text-zinc-600">
                      {post ? `Lv.${post.level} · ${post.total_score}점` : "-"}
                    </td>
                    <td
                      className={`whitespace-nowrap py-1.5 font-semibold ${
                        growth == null ? "text-zinc-400" : growth >= 0 ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {growth == null ? "-" : growth >= 0 ? `+${growth}` : growth}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <WeeklyRanking rows={ranking} limit={20} />
      <p className="-mt-4 text-xs text-zinc-500">
        학생 화면에는 상위 5명만 이름 가운데를 가려서(예: 김*수) 보여줘요.
      </p>
    </>
  );
}

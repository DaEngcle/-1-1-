import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { lessonHref, roleplay } from "@/lib/classroom/roleplays";
import { FREE_ROLEPLAYS_PER_DAY, roleplayQuota } from "@/lib/classroom/roleplay-data";
import { RoleplayPlayer } from "./roleplay-player";

export const metadata: Metadata = { title: "상황극 · 다잉클" };

export default async function RoleplayPage({ params }: { params: Promise<{ id: string }> }) {
  const student = await requireStudent();
  const r = roleplay((await params).id);
  if (!r) notFound();
  const quota = await roleplayQuota(student);
  const back = lessonHref(r);
  if (!quota.unlimited && quota.left <= 0 && !quota.started.includes(r.id)) {
    return (
      <section className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
        <p className="text-4xl">🎭</p>
        <p className="text-lg font-extrabold text-zinc-900">오늘 상황극 {FREE_ROLEPLAYS_PER_DAY}개를 다 했어요</p>
        <p className="text-sm text-zinc-600">무료회원은 하루 {FREE_ROLEPLAYS_PER_DAY}개까지 해요. 오늘 한 상황극은 다시 할 수 있어요. 다잉클 수강생은 제한 없이 해요.</p>
        <Link href={back} className="mt-1 rounded-2xl bg-brand-600 px-5 py-3 font-extrabold text-white">
          목록으로
        </Link>
      </section>
    );
  }
  return <RoleplayPlayer scenario={r} backHref={back} />;
}

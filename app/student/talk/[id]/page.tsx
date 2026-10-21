import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { scenario } from "@/lib/classroom/interview-scenarios";
import { aiReady } from "@/lib/classroom/interview-ai";
import { Conversation } from "./conversation";

export default async function TalkScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStudent();
  const s = scenario((await params).id);
  if (!s) notFound();
  return (
    <>
      <Link href="/student/talk" className="text-sm text-zinc-600 underline">
        ← 다른 상황 고르기
      </Link>
      <Conversation scenario={s} ready={aiReady()} />
    </>
  );
}

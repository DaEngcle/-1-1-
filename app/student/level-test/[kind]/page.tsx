import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStudent } from "@/lib/classroom/dal";
import { isAzureConfigured } from "@/lib/classroom/azure-speech";
import { publicQuestions } from "@/lib/classroom/level-test";
import { canTakeTest, getAnswers, getTests } from "@/lib/classroom/level-test-data";
import { LevelTestRunner } from "./runner";

export default async function LevelTestRunPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (kind !== "pre" && kind !== "post") notFound();
  const student = await requireStudent();

  const allowed = await canTakeTest(student.id, kind);
  const back = (
    <Link href="/student/level-test" className="text-sm text-zinc-600 underline">
      ← 레벨테스트
    </Link>
  );
  if (!allowed.ok) {
    return (
      <>
        {back}
        <p className="text-sm text-zinc-600">{allowed.reason}</p>
      </>
    );
  }
  if (!isAzureConfigured()) {
    return (
      <>
        {back}
        <p className="text-sm text-zinc-600">말하기 채점 준비 중이에요. 준비되면 선생님이 알려드릴게요.</p>
      </>
    );
  }

  const tests = await getTests(student.id);
  const current = kind === "pre" ? tests.pre : tests.post;
  const answers = current ? await getAnswers(current.id) : [];
  const answeredSpeaking = Object.fromEntries(
    answers.filter((a) => a.audio_path).map((a) => [a.question_id, a.score]),
  );
  const questions = publicQuestions();

  return (
    <>
      {back}
      <h1 className="text-xl font-bold text-zinc-900">
        {kind === "pre" ? "수강 전" : "수강 후"} 레벨테스트
      </h1>
      <LevelTestRunner
        kind={kind}
        speaking={questions.speaking}
        listening={questions.listening}
        answeredSpeaking={answeredSpeaking}
      />
    </>
  );
}

import { requireTeacher } from "@/lib/classroom/dal";
import { VoiceCompare } from "./voice-compare";

export default async function TeacherVoicesPage() {
  await requireTeacher();
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900">🔊 목소리 비교</h1>
        <p className="mt-1 text-sm text-zinc-600">
          쉐도잉에서 학생들이 듣는 원어민 목소리를 골라요. 같은 문장을 여러 목소리로 들어보세요.
        </p>
      </div>
      <VoiceCompare />
    </section>
  );
}

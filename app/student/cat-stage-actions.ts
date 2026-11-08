"use server";

import { revalidatePath } from "next/cache";
import { requireStudent } from "@/lib/classroom/dal";
import { markCatStageSeen, studyDayCount } from "@/lib/classroom/cat-stage-data";
import { catStageForDays } from "@/lib/classroom/cat";

/** 성장 축하 화면을 봤다고 표시 (지금 단계까지. 화면에서 온 숫자는 믿지 않는다) */
export async function seeCatStage() {
  const student = await requireStudent();
  // catStage()는 요청 안에서 캐시되므로 여기서 부르지 않는다 (다시 그릴 때 옛 '본 단계'가 남지 않게)
  await markCatStageSeen(student.id, catStageForDays(await studyDayCount(student.id)));
  revalidatePath("/student", "layout");
}

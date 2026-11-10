import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getRoleplayStars } from "./roleplay-data";
import { listenDeck, phraseDeckKey, type Roleplay } from "./roleplays";

/** 상황 하나의 세 파트 진행 */
export type LessonParts = { listen: boolean; phrase: boolean; roleplay: number };

export type LessonProgress = {
  parts: (id: string) => LessonParts;
  /** 세 파트를 다 했을 때 */
  done: (id: string) => boolean;
};

/** 리스닝·표현 연습(voca_progress의 ls-/ex- 키)과 상황극 별을 한 번에 읽는다 */
export async function getLessonProgress(studentId: string): Promise<LessonProgress> {
  const [{ data, error }, stars] = await Promise.all([
    createServerSupabaseClient().from("voca_progress").select("deck, stars").eq("student_id", studentId).or("deck.like.ls-%,deck.like.ex-%"),
    getRoleplayStars(studentId),
  ]);
  if (error) console.error("상황 진행 조회 실패:", error.message);
  const played = new Set((data ?? []).filter((r) => ((r.stars as number) ?? 0) > 0).map((r) => r.deck as string));
  const parts = (id: string): LessonParts => ({ listen: played.has(listenDeck(id)), phrase: played.has(phraseDeckKey(id)), roleplay: stars.get(id) ?? 0 });
  return {
    parts,
    done: (id) => {
      const p = parts(id);
      return p.listen && p.phrase && p.roleplay > 0;
    },
  };
}

/** 다음에 할 상황: 다 안 끝낸 첫 상황 */
export function nextLesson(list: Roleplay[], p: LessonProgress) {
  return list.find((r) => !p.done(r.id)) ?? null;
}

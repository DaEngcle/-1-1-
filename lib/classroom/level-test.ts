import "server-only";

// 레벨테스트 문제. 수강 전·후 같은 문제로 비교한다.
// 문제를 바꾸면 이미 본 학생과 점수 비교가 어긋나므로 기수 중간에는 바꾸지 않는다.

export interface SpeakingQuestion {
  id: string;
  sentence: string;
}

export interface ListeningQuestion {
  id: string;
  sentence: string;
  choices: string[];
  answer: number;
}

// 쉬운 문장 → 어려운 문장
export const SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  { id: "s1", sentence: "What do you do?" },
  { id: "s2", sentence: "Reckon so." },
  { id: "s3", sentence: "How old do I look?" },
  { id: "s4", sentence: "Are bills included?" },
  { id: "s5", sentence: "Can I grab a magic takeaway please?" },
  { id: "s6", sentence: "Is the rent per week or per month?" },
  { id: "s7", sentence: "Can you please cover my shift on Friday?" },
  { id: "s8", sentence: "I haven't even had a coffee yet." },
  { id: "s9", sentence: "I've been coughing a lot, especially when I talk." },
  { id: "s10", sentence: "I just topped it up, but it didn't go through." },
];

export const LISTENING_QUESTIONS: ListeningQuestion[] = [
  {
    id: "l1",
    sentence: "Where're you living these days?",
    choices: ["요즘 어디 살아?", "요즘 뭐 하고 지내?", "어디서 왔어?", "언제 이사 가?"],
    answer: 0,
  },
  {
    id: "l2",
    sentence: "Is this position still available?",
    choices: ["이 자리에 앉아도 되나요?", "이 일자리 아직 구하고 있나요?", "이 가게 언제 문 열어요?", "이 일 시급이 얼마예요?"],
    answer: 1,
  },
  {
    id: "l3",
    sentence: "You look knackered.",
    choices: ["너 오늘 멋져 보여.", "너 화난 것 같아.", "너 엄청 피곤해 보여.", "너 배고파 보여."],
    answer: 2,
  },
  {
    id: "l4",
    sentence: "How long is the minimum stay?",
    choices: ["집까지 얼마나 걸려요?", "방이 얼마나 넓어요?", "언제 들어올 수 있어요?", "최소 얼마나 살아야 해요?"],
    answer: 3,
  },
  {
    id: "l5",
    sentence: "This one's on the house.",
    choices: ["이건 서비스예요.", "이건 집에서 만들었어요.", "이건 포장해 드릴게요.", "이건 오늘의 메뉴예요."],
    answer: 0,
  },
  {
    id: "l6",
    sentence: "You might want to go half a size up.",
    choices: ["반 사이즈 작은 게 좋겠어요.", "반 사이즈 큰 걸로 신어 보세요.", "반값 할인 중이에요.", "위층에 더 있어요."],
    answer: 1,
  },
  {
    id: "l7",
    sentence: "Will I be charged after today?",
    choices: ["오늘 충전할 수 있나요?", "오늘 이후에도 일하나요?", "오늘 이후에 요금이 나가나요?", "오늘까지 내야 하나요?"],
    answer: 2,
  },
  {
    id: "l8",
    sentence: "I think I missed my stop.",
    choices: ["버스를 놓친 것 같아요.", "길을 잃은 것 같아요.", "카드를 잃어버린 것 같아요.", "내릴 정류장을 지나친 것 같아요."],
    answer: 3,
  },
  {
    id: "l9",
    sentence: "Not that I know of.",
    choices: ["제가 알기로는 없어요.", "저는 잘 몰라요.", "그건 제 것이 아니에요.", "아직 못 들었어요."],
    answer: 0,
  },
  {
    id: "l10",
    sentence: "I don't think a Band-Aid's gonna work.",
    choices: ["밴드가 다 떨어진 것 같아.", "밴드로는 안 될 것 같아.", "밴드 공연은 안 갈 것 같아.", "밴드 붙이면 괜찮을 거야."],
    answer: 1,
  },
];

export const SPEAKING_WEIGHT = 0.6;

/** 브라우저로 보낼 문제 (듣기 정답 제외) */
export function publicQuestions() {
  return {
    speaking: SPEAKING_QUESTIONS,
    listening: LISTENING_QUESTIONS.map(({ id, sentence, choices }) => ({ id, sentence, choices })),
  };
}

export function listeningScore(questionId: string, choice: number) {
  const q = LISTENING_QUESTIONS.find((x) => x.id === questionId);
  if (!q) return null;
  return q.answer === choice ? 100 : 0;
}

/** 문항 점수(0~100)로 영역 점수와 종합 점수 계산. 안 푼 문항은 0점 */
export function summarize(answers: { question_id: string; score: number }[]) {
  const byId = new Map(answers.map((a) => [a.question_id, a.score]));
  const avg = (ids: string[]) =>
    Math.round(ids.reduce((sum, id) => sum + (byId.get(id) ?? 0), 0) / ids.length);
  const speaking = avg(SPEAKING_QUESTIONS.map((q) => q.id));
  const listening = avg(LISTENING_QUESTIONS.map((q) => q.id));
  const total = Math.round(speaking * SPEAKING_WEIGHT + listening * (1 - SPEAKING_WEIGHT));
  return { speaking, listening, total };
}

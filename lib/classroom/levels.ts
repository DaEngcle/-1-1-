// 레벨 이름 (워홀 테마). 서버·브라우저 공용

export const LEVELS = [
  { level: 1, name: "공항 도착", min: 0, desc: "짧은 표현을 하나씩 익히는 단계" },
  { level: 2, name: "셀프 체크인", min: 40, desc: "기본 인사와 질문을 따라 말할 수 있어요" },
  { level: 3, name: "잡 인터뷰", min: 55, desc: "자주 쓰는 문장을 알아듣고 말할 수 있어요" },
  { level: 4, name: "바리스타", min: 68, desc: "일상 대화를 무리 없이 주고받아요" },
  { level: 5, name: "하우스메이트 토크", min: 80, desc: "긴 문장도 자연스럽게 말해요" },
  { level: 6, name: "로컬 오지", min: 90, desc: "현지인처럼 듣고 말해요" },
] as const;

// shortcut: 점수 구간은 임시 기준, 실제 학생 결과가 쌓이면 조정
export function levelForScore(score: number) {
  return [...LEVELS].reverse().find((l) => score >= l.min) ?? LEVELS[0];
}

export function levelInfo(level: number) {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0];
}

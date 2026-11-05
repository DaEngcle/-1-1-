// 고양이 마을 말하기 연습: 브라우저 음성 인식이 받아 적은 말을 정답 문장과 비교한다 (비용 없음)

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/** 정답과 들은 말을 단어 순서대로 비교해 점수(0~100)와 빠진 단어를 돌려준다 */
export function compareSpoken(target: string, heard: string) {
  const a = words(target);
  const b = words(heard);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const missing: string[] = [];
  for (let i = 0, j = 0; i < a.length; ) {
    if (j < b.length && a[i] === b[j]) {
      i++;
      j++;
    } else if (j < b.length && dp[i][j + 1] >= dp[i + 1][j]) {
      j++;
    } else {
      missing.push(a[i]);
      i++;
    }
  }
  const total = a.length + b.length;
  return { score: total ? Math.round((200 * dp[0][0]) / total) : 0, missing };
}

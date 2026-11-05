// AI 코치 피드백 나누기: "요약 / 자세히" 형식이면 요약 3줄과 본문으로. 예전 피드백은 본문만.
export function splitFeedback(text: string): { summary: string[]; detail: string } {
  const m = text.match(/^\s*요약\s*\n([\s\S]*?)\n\s*자세히\s*\n([\s\S]*)$/);
  if (!m) return { summary: [], detail: text };
  const summary = m[1]
    .split("\n")
    .map((l) => l.replace(/^\s*[-•·]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
  return summary.length ? { summary, detail: m[2].trim() } : { summary: [], detail: text };
}

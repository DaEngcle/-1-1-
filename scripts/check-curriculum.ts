// 커리큘럼 데이터 검사: npx tsx scripts/check-curriculum.ts cafe kitchen ... (없으면 전부)
import { readdirSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "lib/classroom/curriculum");
const jobs = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "kit.ts" && f !== "index.ts").map((f) => f.replace(/\.ts$/, ""));
const low = (s: string) => s.toLowerCase().replace(/[’]/g, "'");

let bad = 0;
const err = (job: string, where: string, msg: string) => {
  bad++;
  console.log(`✗ ${job} ${where}: ${msg}`);
};

async function main() {
for (const job of jobs) {
  const mod = await import(path.join(dir, `${job}.ts`));
  const c = mod.default;
  if (!c?.steps || c.steps.length !== 5) err(job, "steps", "STEP 제목 5개가 필요해요");
  const ls = c?.lessons ?? [];
  if (ls.length !== 30) err(job, "lessons", `상황이 ${ls.length}개 (30개 필요)`);
  const ids = new Set<string>();
  for (let s = 1; s <= 5; s++) {
    const k = ls.filter((x: { step: number }) => x.step === s).length;
    if (k !== 6) err(job, `STEP ${s}`, `${k}개 (6개 필요)`);
  }
  const seenEx = new Set<string>();
  for (const l of ls) {
    const w = `#${l.n} ${l.title}`;
    if (ids.has(l.n)) err(job, w, "번호 중복");
    ids.add(l.n);
    if (!/^\d+$/.test(l.n)) err(job, w, "번호는 숫자 문자열");
    if (l.lines.length !== 5) err(job, w, `핵심 문장 ${l.lines.length}개 (5개 필요)`);
    for (const x of l.lines) {
      if (!low(x.example).includes(low(x.term))) err(job, w, `문장에 표현이 없어요: "${x.term}" / "${x.example}"`);
      if (!x.ko || !x.example_ko) err(job, w, `번역 빠짐: ${x.example}`);
      if (seenEx.has(low(x.example))) err(job, w, `같은 문장 중복: ${x.example}`);
      seenEx.add(low(x.example));
      if (x.example.split(/\s+/).length > 16) err(job, w, `문장이 너무 길어요(16단어 넘음): ${x.example}`);
    }
    if (l.turns.length < 3 || l.turns.length > 4) err(job, w, `턴 ${l.turns.length}개 (3~4개)`);
    for (const tn of l.turns) {
      if (!tn.keys.length || !low(tn.model).includes(low(tn.keys[0]))) err(job, w, `모범 답에 첫 핵심 표현이 없어요: "${tn.keys[0]}" / "${tn.model}"`);
      if (tn.keys.length > 4) err(job, w, "핵심 표현은 4개까지");
    }
    if (!l.outro?.line) err(job, w, "outro 빠짐");
  }
  console.log(`${job}: 상황 ${ls.length}개 검사 끝`);
}
console.log(bad ? `문제 ${bad}개` : "모두 통과");
process.exit(bad ? 1 : 0);
}
void main();

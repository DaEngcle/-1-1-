"use client";

import { useRef, useState } from "react";
import type { CatBreed } from "@/lib/classroom/cat";
import {
  CITIES,
  COURSE_LEVELS,
  JOBS,
  MINUTES,
  STAGES,
  WORRIES,
  type CityId,
  type CourseAnswers,
  type CourseLevel,
  type DailyMinutes,
  type JobId,
  type StageId,
  type WorryId,
} from "@/lib/classroom/course-questions";
import { courseTopic, topicPhrases, type ChosenTopic } from "@/lib/classroom/course-topics";
import type { ChatTurn } from "@/lib/classroom/course-ai";
import { courseChat, recommendCourse, saveCourse, type Recommendation } from "../actions";
import { BottomButton, CatSays, FullScreen, TopBar } from "../course-ui";

type Screen = "intro" | "cities" | "stage" | "jobs" | "level" | "worries" | "minutes" | "chat" | "building" | "ready" | "cards" | "done";
const ORDER: Screen[] = ["intro", "cities", "stage", "jobs", "level", "worries", "minutes", "chat", "building", "ready", "cards", "done"];

type Draft = {
  cities: CityId[];
  stage: StageId | null;
  jobs: JobId[];
  level: CourseLevel | null;
  worries: WorryId[];
  minutes: DailyMinutes | null;
};

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex min-h-12 items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-left text-[15px] font-bold transition-colors ${
        on ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-zinc-800 hover:border-brand-200"
      }`}
    >
      {children}
    </button>
  );
}

function Option({ on, onClick, title, desc, emoji }: { on: boolean; onClick: () => void; title: string; desc?: string; emoji?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
        on ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white hover:border-brand-200"
      }`}
    >
      {emoji && <span className="text-2xl">{emoji}</span>}
      <span className="flex min-w-0 flex-col">
        <span className={`font-extrabold ${on ? "text-brand-700" : "text-zinc-900"}`}>{title}</span>
        {desc && <span className="text-sm text-zinc-500">{desc}</span>}
      </span>
    </button>
  );
}

function Question({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">{title}</h1>
        {sub && <p className="text-sm text-zinc-500">{sub}</p>}
      </div>
      {children}
    </section>
  );
}

export function Onboarding({
  breed,
  name,
  initial,
  testLevel,
  access,
}: {
  breed: CatBreed;
  name: string;
  initial: CourseAnswers | null;
  /** 레벨테스트 결과로 미리 고를 레벨 */
  testLevel: CourseLevel | null;
  access: { fullVoca: boolean; freePhraseSets: number };
}) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [d, setD] = useState<Draft>({
    cities: initial?.cities ?? [],
    stage: initial?.stage ?? null,
    jobs: initial?.jobs ?? [],
    level: testLevel ?? initial?.level ?? null,
    worries: initial?.worries ?? [],
    minutes: initial?.minutes ?? null,
  });
  const answers: CourseAnswers | null =
    d.stage && d.level && d.minutes ? { cities: d.cities, stage: d.stage, jobs: d.jobs, level: d.level, worries: d.worries, minutes: d.minutes } : null;

  // 고양이와 짧은 대화
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [reply, setReply] = useState("");
  const [thinking, setThinking] = useState(false);
  const chatStarted = useRef(false);
  const chatDone = useRef(false);

  // 코스 짜기 · 토픽 카드
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [checks, setChecks] = useState(0);
  const [card, setCard] = useState(0);
  const [picks, setPicks] = useState<Record<string, boolean>>({});
  const [showList, setShowList] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "error">("idle");

  const go = (s: Screen) => setScreen(s);
  const next = () => go(ORDER[ORDER.indexOf(screen) + 1]);
  const back = () => {
    if (screen === "cards" && card > 0) return undoCard();
    if (screen === "building" || screen === "ready" || screen === "cards") {
      run.current++;
      return go("minutes");
    }
    go(ORDER[Math.max(0, ORDER.indexOf(screen) - 1)]);
  };
  const percent = Math.round((ORDER.indexOf(screen) / (ORDER.length - 1)) * 100);

  // 질문을 다 고르면 고양이 대화로. 첫 질문을 받고, AI를 못 쓰면 바로 코스 짜기로
  function enterChat() {
    if (!answers) return;
    // 대화가 이미 끝났으면(또는 AI를 못 쓰면) 다시 묻지 않고 바로 코스 짜기
    if (chatDone.current) return startBuilding(turns);
    go("chat");
    if (chatStarted.current) return;
    chatStarted.current = true;
    setThinking(true);
    courseChat(answers, [])
      .then((r) => {
        if ("question" in r) setTurns([{ role: "cat", text: r.question }]);
        else startBuilding([]);
      })
      .catch(() => startBuilding([]))
      .finally(() => setThinking(false));
  }

  async function sendReply() {
    const text = reply.trim().slice(0, 300);
    if (!text || !answers || thinking) return;
    const nextTurns: ChatTurn[] = [...turns, { role: "me", text }];
    setTurns(nextTurns);
    setReply("");
    setThinking(true);
    try {
      const r = await courseChat(answers, nextTurns);
      if ("question" in r) setTurns([...nextTurns, { role: "cat", text: r.question }]);
      else startBuilding(nextTurns);
    } catch {
      startBuilding(nextTurns);
    } finally {
      setThinking(false);
    }
  }

  // 코스 짜는 중: 체크 3개가 차례로 켜지고, 추천이 오면 다음으로 (뒤로 가면 run이 바뀌어 무시)
  const run = useRef(0);
  function startBuilding(finalTurns: ChatTurn[]) {
    if (!answers) return;
    chatDone.current = true;
    const me = ++run.current;
    setChecks(0);
    setRec(null);
    go("building");
    [700, 1400, 2100].forEach((ms, i) => setTimeout(() => run.current === me && setChecks(i + 1), ms));
    const wait = new Promise((r) => setTimeout(r, 2300));
    Promise.all([recommendCourse(answers, finalTurns).catch(() => null), wait]).then(([r]) => {
      if (run.current !== me) return;
      if (r) {
        setRec(r);
        setCard(0);
        setPicks({});
        go("ready");
      } else go("minutes");
    });
  }

  function decide(id: string, keep: boolean) {
    setPicks((p) => ({ ...p, [id]: keep }));
    setShowList(false);
    if (rec && card + 1 < rec.topics.length) setCard(card + 1);
    else finish({ ...picks, [id]: keep });
  }
  function undoCard() {
    if (card === 0 || !rec) return;
    const prev = rec.topics[card - 1].id;
    setPicks((p) => {
      const n = { ...p };
      delete n[prev];
      return n;
    });
    setShowList(false);
    setCard(card - 1);
  }

  async function finish(final: Record<string, boolean>) {
    if (!rec || !answers) return;
    let chosen: ChosenTopic[] = rec.topics.filter((t) => final[t.id] || rec.required.includes(t.id));
    if (chosen.length === 0) chosen = rec.topics.slice(0, 1); // 하나는 있어야 연습할 수 있다
    go("done");
    setSaved("saving");
    try {
      const r = await saveCourse(answers, chosen, turns, { summary: rec.summary, source: rec.source, suggested: rec.topics.map((t) => t.id) });
      setSaved(r.ok ? "ok" : "error");
    } catch {
      setSaved("error");
    }
  }

  const canNext: Partial<Record<Screen, boolean>> = {
    intro: true,
    cities: d.cities.length > 0,
    stage: !!d.stage,
    jobs: d.jobs.length > 0,
    level: !!d.level,
    worries: d.worries.length > 0,
    minutes: !!d.minutes,
  };

  const topic = rec?.topics[card];
  const topicDef = topic ? courseTopic(topic.id) : null;
  const phrases = topicDef ? topicPhrases(topicDef, access) : [];
  const chosenTitles = rec ? rec.topics.filter((t) => picks[t.id] || rec.required.includes(t.id)) : [];

  return (
    <FullScreen>
      {screen !== "done" && <TopBar percent={percent} onBack={screen === "intro" ? undefined : back} backHref="/student" />}

      {screen === "intro" && (
        <>
          <div className="mt-10">
            <CatSays breed={breed} big>
              안녕하세요! 저는 {name}님의 고양이예요.
              <br />
              워홀 영어 코스를 같이 짜 볼게요.
            </CatSays>
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">지금 상황을 몇 가지 고르면, 앱에 있는 표현·문법·AI 면접을 {name}님에게 필요한 순서로 묶어 드려요.</p>
          <BottomButton onClick={next}>시작하기</BottomButton>
        </>
      )}

      {screen === "cities" && (
        <Question title="어디로 가요?" sub="여러 곳 골라도 돼요">
          <CatSays breed={breed}>도시마다 분위기가 달라요. 생각 중인 곳을 다 골라 주세요.</CatSays>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map((c) => (
              <Chip key={c.id} on={d.cities.includes(c.id)} onClick={() => setD({ ...d, cities: toggle(d.cities, c.id) })}>
                <span>{c.emoji}</span>
                {c.label}
              </Chip>
            ))}
          </div>
        </Question>
      )}

      {screen === "stage" && (
        <Question title="지금 어느 단계예요?">
          <div className="flex flex-col gap-2">
            {STAGES.map((s) => (
              <Option key={s.id} on={d.stage === s.id} onClick={() => setD({ ...d, stage: s.id })} title={s.label} desc={s.desc} emoji={s.emoji} />
            ))}
          </div>
        </Question>
      )}

      {screen === "jobs" && (
        <Question title="어떤 일을 하고 싶어요?" sub="여러 개 골라도 돼요">
          <div className="grid grid-cols-2 gap-2">
            {JOBS.map((j) => (
              <Chip key={j.id} on={d.jobs.includes(j.id)} onClick={() => setD({ ...d, jobs: toggle(d.jobs, j.id) })}>
                <span>{j.emoji}</span>
                <span className="leading-tight">{j.label}</span>
              </Chip>
            ))}
          </div>
        </Question>
      )}

      {screen === "level" && (
        <Question title="영어 실력은 어느 정도예요?" sub={testLevel ? "레벨테스트 결과로 미리 골라 뒀어요. 바꿔도 돼요." : "느낌대로 골라도 괜찮아요"}>
          <div className="flex flex-col gap-2">
            {COURSE_LEVELS.map((l) => (
              <Option key={l.id} on={d.level === l.id} onClick={() => setD({ ...d, level: l.id })} title={l.label} desc={l.desc} />
            ))}
          </div>
        </Question>
      )}

      {screen === "worries" && (
        <Question title="제일 걱정되는 순간은요?" sub="여러 개 골라도 돼요">
          <div className="grid grid-cols-2 gap-2">
            {WORRIES.map((w) => (
              <Chip key={w.id} on={d.worries.includes(w.id)} onClick={() => setD({ ...d, worries: toggle(d.worries, w.id) })}>
                <span>{w.emoji}</span>
                {w.label}
              </Chip>
            ))}
          </div>
        </Question>
      )}

      {screen === "minutes" && (
        <Question title="하루에 얼마나 할까요?" sub="나중에 다시 바꿀 수 있어요">
          <div className="flex flex-col gap-2">
            {MINUTES.map((m) => (
              <Option key={m.id} on={d.minutes === m.id} onClick={() => setD({ ...d, minutes: m.id })} title={m.label} desc={m.desc} />
            ))}
          </div>
        </Question>
      )}

      {screen === "chat" && (
        <section className="mt-4 flex flex-1 flex-col gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">조금만 더 물어볼게요</h1>
          <p className="-mt-2 text-sm text-zinc-500">짧게 답해도 돼요. 전화번호 같은 개인정보는 쓰지 마세요.</p>
          <div className="flex flex-col gap-2">
            {turns.map((t, i) =>
              t.role === "cat" ? (
                <CatSays key={i} breed={breed}>
                  {t.text}
                </CatSays>
              ) : (
                <p key={i} className="ml-10 self-end rounded-2xl rounded-br-sm bg-brand-600 px-4 py-2.5 text-[15px] font-semibold text-white">
                  {t.text}
                </p>
              ),
            )}
            {thinking && <p className="text-sm text-zinc-400">고양이가 생각하는 중…</p>}
          </div>
          <div className="sticky bottom-0 mt-auto flex flex-col gap-2 bg-gradient-to-t from-[#fff8e8] via-[#fff8e8] to-transparent pt-4">
            <div className="flex items-end gap-2">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value.slice(0, 300))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                rows={2}
                maxLength={300}
                placeholder="여기에 답을 써 주세요"
                disabled={thinking || turns.length === 0}
                className="min-w-0 flex-1 resize-none rounded-2xl border-2 border-slate-200 bg-white px-3 py-2 text-base text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={sendReply}
                disabled={thinking || !reply.trim()}
                className="shrink-0 rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-4 py-3 font-extrabold text-white disabled:border-slate-300 disabled:bg-slate-300"
              >
                보내기
              </button>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>{reply.length}/300</span>
              <button type="button" onClick={() => startBuilding(turns)} className="font-semibold text-zinc-500 underline">
                건너뛰고 코스 짜기
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === "building" && (
        <section className="mt-10 flex flex-col items-center gap-6">
          <CatSays breed={breed} big>
            코스를 짜는 중…
          </CatSays>
          <ul className="flex w-full flex-col gap-2">
            {["일·관심사", "영어 레벨", "걱정되는 상황"].map((label, i) => (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-bold shadow-sm transition-opacity duration-500 ${checks > i ? "opacity-100" : "opacity-40"}`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm text-white transition-colors ${checks > i ? "bg-brand-500" : "bg-slate-200"}`}
                >
                  {checks > i ? "✓" : ""}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </section>
      )}

      {screen === "ready" && rec && (
        <>
          <section className="mt-8 flex flex-col items-center gap-4 text-center">
            <CatSays breed={breed} mood="happy" big>
              코스가 준비됐어요!
            </CatSays>
            <p className="rounded-2xl bg-brand-600 px-4 py-3 text-[15px] font-bold leading-snug text-white">{rec.summary}</p>
            <p className="text-sm text-zinc-500">추천 토픽 {rec.topics.length}개를 하나씩 보여 드릴게요. 넣을지 뺄지 골라 주세요.</p>
          </section>
          <BottomButton onClick={() => go("cards")}>토픽 보기</BottomButton>
        </>
      )}

      {screen === "cards" && rec && topic && topicDef && (
        <>
          <section className="mt-4 flex flex-col gap-3">
            <p className="text-sm font-bold text-zinc-500">
              추천 토픽 {card + 1} / {rec.topics.length}
            </p>
            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-4xl">{topicDef.emoji}</span>
              <h2 className="text-xl font-extrabold leading-snug text-zinc-900">{topic.title}</h2>
              <p className="text-sm text-zinc-600">{topic.desc}</p>
              {rec.required.includes(topic.id) && (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">일하는 분 코스에는 기본으로 들어가요</p>
              )}
              <button type="button" onClick={() => setShowList(!showList)} className="self-start text-sm font-bold text-brand-700 underline">
                표현 {phrases.length}개 {showList ? "접기" : "보기"}
              </button>
              {showList && (
                <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto rounded-2xl bg-slate-50 p-3 text-sm">
                  {phrases.map((p) => (
                    <li key={p.key} className="flex flex-col">
                      <span className="font-bold text-zinc-900">{p.term}</span>
                      <span className="text-zinc-500">{p.ko}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {card > 0 && (
              <button type="button" onClick={undoCard} className="self-center text-sm font-semibold text-zinc-500 underline">
                ← 이전 카드
              </button>
            )}
          </section>
          <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-3 bg-gradient-to-t from-[#fff8e8] via-[#fff8e8] to-transparent pt-4">
            <button
              type="button"
              onClick={() => decide(topic.id, false)}
              disabled={rec.required.includes(topic.id)}
              className="rounded-2xl border-2 border-b-4 border-slate-200 bg-white px-4 py-4 text-lg font-extrabold text-zinc-700 active:translate-y-0.5 disabled:opacity-40"
            >
              빼기
            </button>
            <button
              type="button"
              onClick={() => decide(topic.id, true)}
              className="rounded-2xl border-b-4 border-brand-800 bg-brand-600 px-4 py-4 text-lg font-extrabold text-white active:translate-y-0.5 active:border-b-2"
            >
              넣기
            </button>
          </div>
        </>
      )}

      {screen === "done" && (
        <>
          <section className="mt-12 flex flex-col items-center gap-4 text-center">
            <CatSays breed={breed} mood="happy" big>
              {name}님 코스가 만들어졌어요!
            </CatSays>
            {chosenTitles.length > 0 && (
              <ul className="flex w-full flex-col gap-2 text-left">
                {chosenTitles.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-zinc-800 shadow-sm">
                    <span className="text-xl">{courseTopic(t.id)?.emoji}</span>
                    {t.title}
                  </li>
                ))}
              </ul>
            )}
            {saved === "error" && <p className="text-sm font-semibold text-red-600">저장하지 못했어요. 잠시 뒤 다시 해 주세요.</p>}
          </section>
          {saved === "error" ? (
            <BottomButton onClick={() => finish(picks)}>다시 저장하기</BottomButton>
          ) : saved === "ok" ? (
            <BottomButton href="/student/course">내 코스 보러 가기</BottomButton>
          ) : (
            <BottomButton disabled>저장하는 중…</BottomButton>
          )}
        </>
      )}

      {canNext[screen] !== undefined && screen !== "intro" && (
        <BottomButton disabled={!canNext[screen]} onClick={screen === "minutes" ? enterChat : next}>
          다음
        </BottomButton>
      )}
    </FullScreen>
  );
}

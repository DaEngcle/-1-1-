import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase";
import { kstDate } from "./stats";
import seedNews from "@/content/news-seed.json";

export type NewsExpression = {
  phrase: string;
  meaning: string;
  example: string;
  example_ko: string;
  note?: string;
};
export type NewsQuiz = { question: string; choices: string[]; answer: number; explain: string };
export type NewsLesson = {
  id: string;
  source_url: string;
  source_name: string;
  source_title: string;
  title_ko: string;
  topic: string;
  level: string;
  published_on: string;
  summary_en: string;
  summary_ko: string;
  expressions: NewsExpression[];
  quiz: NewsQuiz[];
  is_published: boolean;
  image_url: string | null;
};

// ABC News 최신 기사 피드 (제목·짧은 소개·링크만 쓴다. 본문은 가져오지 않는다)
const FEEDS = [
  "https://www.abc.net.au/news/feed/51120/rss.xml",
  "https://www.abc.net.au/news/feed/45910/rss.xml",
];

type Headline = { title: string; teaser: string; url: string; date: string; image: string | null };

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export async function fetchAbcHeadlines(): Promise<Headline[]> {
  const seen = new Set<string>();
  const out: Headline[] = [];
  for (const feed of FEEDS) {
    const res = await fetch(feed, { cache: "no-store" });
    if (!res.ok) continue;
    const xml = await res.text();
    for (const item of xml.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
      const get = (tag: string) => decode(item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "");
      const url = get("link");
      if (!url || seen.has(url)) continue;
      seen.add(url);
      const pub = Date.parse(get("pubDate"));
      // 16:9 대표 사진 (없으면 아무 사진)
      const imgs = [...item.matchAll(/<media:content\s+url="([^"]+)"[^>]*?width="(\d+)"\s+height="(\d+)"/g)];
      const wide = imgs.find((m) => Number(m[2]) / Number(m[3]) > 1.6) ?? imgs[0];
      out.push({
        title: get("title"),
        teaser: get("description").slice(0, 400),
        url,
        date: kstDate(Number.isNaN(pub) ? new Date() : new Date(pub)),
        image: wide ? decode(wide[1]) : null,
      });
    }
  }
  return out;
}

const SYSTEM_PROMPT = `당신은 호주 워킹홀리데이를 준비하는 한국인 학생(영어 초중급)을 가르치는 영어 선생님입니다.
호주 뉴스 헤드라인 목록을 보고, 학생에게 도움이 될 기사를 골라 '뉴스로 공부하기' 레슨을 만듭니다.

고르는 기준:
- 1순위: 워홀러 생활에 바로 쓸모 있는 주제 — 일자리·최저임금, 집·렌트, 물가·장보기, 교통, 비자, 날씨·계절, 음식·카페, 여행지, 동물·자연, 축제·문화, 건강·안전 수칙.
- 2순위: 누구나 이해할 수 있는 가볍고 재미있는 동네 소식.
- 고르지 말 것: 범죄·사고·사망·폭력·재판·전쟁·선정적인 주제, 정치 갈등, 스포츠 경기 결과(크리켓 점수 등), 주식·기업·산업 뉴스, 해외 뉴스.
- 알맞은 기사가 부족하면 개수를 줄여도 돼요.

쓰는 원칙:
- 헤드라인과 소개글(teaser)에 있는 사실만 쓰세요. 없는 숫자·이름·사실을 지어내지 마세요.
- summary_en: 기사 문장을 베끼지 말고 직접 쉬운 영어(B1)로 3~4문장. 호주 배경지식이 필요하면 한 문장 덧붙여도 됩니다.
- summary_ko: summary_en의 자연스러운 한국어 번역.
- expressions: 5개. 기사 속 핵심 표현이나 호주 생활에서 바로 쓰는 표현. example은 워홀 생활(카페·쉐어하우스·농장·대중교통 등) 상황의 새 문장.
  호주식 표현이면 note에 짧게 설명 (예: arvo = afternoon).
- quiz: 2~3개, 3지선다. 내용 이해 1개 + 표현 뜻 1~2개. answer는 0부터 시작하는 정답 번호.
- level: "쉬움" | "보통" | "어려움", topic: 이모지 + 짧은 한국어 (예: "✈️ 여행").

반드시 JSON 배열만 출력하세요 (마크다운 없이):
[{"source_url","source_title","title_ko","topic","level","summary_en","summary_ko",
  "expressions":[{"phrase","meaning","example","example_ko","note?"}],
  "quiz":[{"question","choices":["","",""],"answer":0,"explain"}]}]`;

/** 처음 올린 레슨들(content/news-seed.json)을 넣는다. 이미 있으면 건너뛴다 */
export async function ensureSeedNews() {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("news_lessons")
    .upsert(seedNews, { onConflict: "source_url", ignoreDuplicates: true });
  if (error) console.error("기본 뉴스 넣기 실패:", error.message);
  // 사진이 나중에 생긴 기본 뉴스는 사진만 채운다
  for (const n of seedNews) {
    if (!n.image_url) continue;
    await supabase.from("news_lessons").update({ image_url: n.image_url }).eq("source_url", n.source_url).is("image_url", null);
  }
}

/** ABC 헤드라인에서 레슨 count개를 Claude로 만들어 저장. 이미 있는 기사는 건너뛴다 */
export async function generateNewsLessons(count = 2): Promise<{ created: number; reason?: string }> {
  if (!process.env.ANTHROPIC_API_KEY) return { created: 0, reason: "ANTHROPIC_API_KEY가 없어요" };
  const supabase = createServerSupabaseClient();
  const headlines = await fetchAbcHeadlines();
  if (headlines.length === 0) return { created: 0, reason: "뉴스를 못 가져왔어요" };
  const { data: existing } = await supabase
    .from("news_lessons")
    .select("source_url")
    .in("source_url", headlines.map((h) => h.url));
  const done = new Set((existing ?? []).map((e) => e.source_url as string));
  const fresh = headlines.filter((h) => !done.has(h.url)).slice(0, 40);
  if (fresh.length === 0) return { created: 0, reason: "새 기사가 없어요" };

  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: "claude-sonnet-5-5",
    max_tokens: 8000,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `오늘 레슨 ${count}개를 만들어 주세요.\n\n${JSON.stringify(fresh.map((h) => ({ title: h.title, teaser: h.teaser, url: h.url, date: h.date })))}`,
      },
    ],
  });
  const text = response.content
    .flatMap((b) => (b.type === "text" ? [b.text] : []))
    .join("")
    .trim()
    .replace(/^```(?:json)?\s*|\s*```$/g, "");
  let lessons: Partial<NewsLesson>[];
  try {
    lessons = JSON.parse(text);
  } catch {
    console.error("뉴스 레슨 JSON 파싱 실패:", text.slice(0, 300));
    return { created: 0, reason: "AI 응답을 읽지 못했어요" };
  }
  const byUrl = new Map(fresh.map((h) => [h.url, h]));
  const rows = lessons
    .filter((l) => l.source_url && byUrl.has(l.source_url) && l.summary_en && l.title_ko)
    .slice(0, count)
    .map((l) => ({
      source_url: l.source_url!,
      source_title: byUrl.get(l.source_url!)!.title,
      title_ko: l.title_ko!,
      topic: l.topic ?? "📰 뉴스",
      level: ["쉬움", "보통", "어려움"].includes(l.level ?? "") ? l.level! : "보통",
      published_on: byUrl.get(l.source_url!)!.date,
      image_url: byUrl.get(l.source_url!)!.image,
      summary_en: l.summary_en!,
      summary_ko: l.summary_ko ?? "",
      expressions: l.expressions ?? [],
      quiz: (l.quiz ?? []).filter((q) => q.choices?.length && q.answer >= 0 && q.answer < q.choices.length),
    }));
  if (rows.length === 0) return { created: 0, reason: "알맞은 기사가 없었어요" };
  const { error } = await supabase.from("news_lessons").upsert(rows, { onConflict: "source_url", ignoreDuplicates: true });
  if (error) {
    console.error("뉴스 레슨 저장 실패:", error.message);
    return { created: 0, reason: "저장 실패" };
  }
  return { created: rows.length };
}

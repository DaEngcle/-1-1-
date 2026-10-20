import reviews from "@/content/reviews.json";

type Review = { masked: string; text: string };
const ALL = reviews as Review[];

const short = (t: string, n = 70) =>
  t.length > n ? `${t.slice(0, n).trim()}…` : t;

function Card({ r, clamp }: { r: Review; clamp?: boolean }) {
  return (
    <figure className="flex flex-col gap-1.5 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-md shadow-brand-900/10">
      <blockquote
        className={`text-sm leading-relaxed text-zinc-800 ${clamp ? "line-clamp-3" : ""}`}
      >
        {r.text}
      </blockquote>
      <figcaption className="text-xs font-semibold text-zinc-500">
        💬 {r.masked}
      </figcaption>
    </figure>
  );
}

/** 위쪽: 옆으로 흘러가는 후기 두 줄 (짧게) */
export function ReviewMarquee() {
  const half = Math.ceil(ALL.length / 2);
  const rows = [ALL.slice(0, half), ALL.slice(half)];
  return (
    <section
      className="flex w-full flex-col gap-2 overflow-hidden py-1"
      aria-label="수강생 후기"
    >
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex w-max gap-2 review-marquee"
          style={{ ["--marquee-duration" as string]: `${70 + i * 15}s` }}
        >
          {[...row, ...row].map((r, k) => (
            <div
              key={k}
              className="w-60 shrink-0 rounded-2xl border border-slate-100 bg-white px-3 py-2 text-left shadow"
            >
              <p className="text-xs leading-relaxed text-zinc-800">
                “{short(r.text)}”
              </p>
              <p className="mt-1 text-[10px] font-semibold text-zinc-400">
                {r.masked}
              </p>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export const REVIEW_COUNT = ALL.length;

/** 아래쪽: 후기 전체 벽 (처음엔 일부, 더 보기로 전부). tone="light"는 흰 배경용 */
export function ReviewWall({
  tone = "dark",
  initial = 12,
}: {
  tone?: "dark" | "light";
  initial?: number;
}) {
  const light = tone === "light";
  const first = ALL.slice(0, initial);
  const rest = ALL.slice(initial);
  return (
    <section className="flex w-full max-w-3xl flex-col gap-4">
      <div
        className={`flex flex-col items-center gap-1 text-center ${light ? "text-zinc-900" : "text-white"}`}
      >
        <p
          className={`text-4xl font-extrabold ${light ? "text-brand-600" : ""}`}
        >
          {ALL.length}개
        </p>
        <h2 className="text-xl font-extrabold">먼저 들은 분들의 진짜 후기</h2>
        <p className={`text-xs ${light ? "text-zinc-500" : "text-brand-100"}`}>
          카카오톡 오픈채팅에 남겨주신 후기를 그대로 옮겼어요. 이름은 가렸어요.
        </p>
      </div>
      <div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {first.map((r, i) => (
          <Card key={i} r={r} />
        ))}
      </div>
      {rest.length > 0 && (
        <details className="group">
          <summary
            className={`mx-auto w-fit cursor-pointer list-none rounded-full px-5 py-2 text-sm font-bold ${
              light
                ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <span className="group-open:hidden">
              후기 {rest.length}개 더 보기 ▾
            </span>
            <span className="hidden group-open:inline">접기 ▴</span>
          </summary>
          <div className="mt-3 columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
            {rest.map((r, i) => (
              <Card key={i} r={r} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

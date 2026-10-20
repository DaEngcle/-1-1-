import reviews from "@/content/review-images.json";

/** 수강생 후기 (카톡 캡처 그대로 + 설문 후기를 카톡 말풍선 이미지로). 이름·프로필은 가림 */
type Shot = { src: string; w: number; h: number; alt: string };
const ALL = reviews as Shot[];

function Img({ r, eager }: { r: Shot; eager?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 정적 후기 이미지
    <img
      src={r.src}
      width={r.w}
      height={r.h}
      alt={`수강생 후기: ${r.alt.slice(0, 120)}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="h-auto w-full rounded-xl shadow-md shadow-black/20"
    />
  );
}

/** 옆으로 흘러가는 후기 띠 두 줄 */
export function ReviewMarquee() {
  const pick = ALL.slice(0, 24);
  const rows = [pick.filter((_, i) => i % 2 === 0), pick.filter((_, i) => i % 2 === 1)];
  return (
    <section className="flex w-full flex-col gap-2 overflow-hidden py-1" aria-label="수강생 후기">
      {rows.map((row, i) => (
        <div
          key={i}
          className="review-marquee flex w-max items-start gap-2"
          style={{ ["--marquee-duration" as string]: `${90 + i * 20}s` }}
        >
          {[...row, ...row].map((r, k) => (
            <div key={k} className="h-36 w-56 shrink-0 overflow-hidden rounded-xl bg-[#1e1e1e]">
              <Img r={r} eager={k < 4} />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

/** 후기 벽: 처음엔 일부, '더 보기'로 전부. tone="light"는 흰 배경용 */
export function ReviewWall({ tone = "dark", initial = 12 }: { tone?: "dark" | "light"; initial?: number }) {
  const light = tone === "light";
  const first = ALL.slice(0, initial);
  const rest = ALL.slice(initial);
  const grid = "columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid";
  return (
    <section className="flex w-full max-w-4xl flex-col gap-4">
      <div className={`flex flex-col items-center gap-1 text-center ${light ? "text-zinc-900" : "text-white"}`}>
        <p className="text-3xl">💬</p>
        <h2 className="text-2xl font-extrabold">먼저 들은 분들의 진짜 후기</h2>
        <p className={`text-xs ${light ? "text-zinc-500" : "text-brand-100"}`}>
          단톡방·설문에 남겨주신 후기 그대로예요. 이름과 프로필은 가렸어요.
        </p>
      </div>
      <div className={grid}>
        {first.map((r, i) => (
          <Img key={r.src} r={r} eager={i < 3} />
        ))}
      </div>
      {rest.length > 0 && (
        <details className="group">
          <summary
            className={`mx-auto w-fit cursor-pointer list-none rounded-full px-5 py-2 text-sm font-bold ${
              light ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <span className="group-open:hidden">후기 더 보기 ▾</span>
            <span className="hidden group-open:inline">접기 ▴</span>
          </summary>
          <div className={`mt-3 ${grid}`}>
            {rest.map((r) => (
              <Img key={r.src} r={r} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

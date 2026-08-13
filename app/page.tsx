import { SubscribeForm } from "./subscribe-form";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-yellow-50 px-6 py-16">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-yellow-700">
            카카오톡으로 매일 도착하는
          </p>
          <h1 className="text-3xl font-bold text-zinc-900">다잉클 데일리</h1>
          <p className="text-base text-zinc-600">
            워킹홀리데이에서 바로 쓰는 영어 표현 1개씩,
            <br />
            매일 아침 9시 카카오톡으로 받아보세요.
          </p>
        </div>
        <SubscribeForm />
        <p className="text-xs text-zinc-400">
          3일 무료체험 후 월 3,900원 자동결제 · 언제든 해지 가능
        </p>
      </main>
    </div>
  );
}

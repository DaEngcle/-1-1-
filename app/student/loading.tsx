// 학생 화면을 여는 동안 보여 주는 뼈대 (서버가 데이터를 다 모을 때까지 하얀 화면으로 멈춰 있지 않게)
export default function Loading() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="불러오는 중">
      <div className="h-7 w-40 animate-pulse rounded-full bg-slate-200/80" />
      <div className="flex h-36 animate-pulse flex-col justify-end gap-2 rounded-3xl bg-white p-5 shadow-sm">
        <div className="h-4 w-2/3 rounded-full bg-slate-100" />
        <div className="h-10 rounded-2xl bg-brand-50" />
      </div>
      <div className="h-24 animate-pulse rounded-3xl bg-white shadow-sm" />
      <div className="h-24 animate-pulse rounded-3xl bg-white shadow-sm" />
      <p className="text-center text-xs font-bold text-zinc-400">🐾 불러오는 중…</p>
    </div>
  );
}

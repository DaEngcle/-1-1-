import { CAT_BREEDS, CAT_BREED_IDS, type CatBreed } from "@/lib/classroom/cat";
import { chooseCat } from "@/app/student/profile/actions";
import { CatSprite } from "./cat";

/** 고양이 6종 중 하나 고르기 (누르면 바로 저장) */
export function CatPicker({ current }: { current: CatBreed | null }) {
  return (
    <form action={chooseCat} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {CAT_BREED_IDS.map((id) => (
        <button
          key={id}
          name="breed"
          value={id}
          className={`flex flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 text-xs font-bold text-zinc-800 transition-transform active:translate-y-0.5 ${
            current === id ? "border-brand-500 ring-2 ring-brand-200" : "border-slate-200 hover:border-brand-300"
          }`}
        >
          <CatSprite breed={id} mood={current === id ? "happy" : "default"} className="h-16 w-20" delay={CAT_BREED_IDS.indexOf(id) * 0.37} />
          {CAT_BREEDS[id].name}
          {current === id && <span className="text-[10px] font-semibold text-brand-600">내 고양이</span>}
        </button>
      ))}
    </form>
  );
}

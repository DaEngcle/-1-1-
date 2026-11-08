import { CatSprite } from "@/app/_ui/cat";
import { CAT_BREED_IDS, CAT_BREEDS, CAT_STAGE_DAYS, CAT_STAGE_NAMES, type CatStage } from "@/lib/classroom/cat";
import { GEAR, type GearId } from "@/lib/classroom/cat-gear";

const STAGES: CatStage[] = [1, 2, 3, 4, 5];

// 선생님 확인용: 고양이 성장 단계 · 직군 소품 미리보기 (메뉴에는 없다. 주소로만 들어온다)
export default function CatPreviewPage() {
  const ids = Object.keys(GEAR) as GearId[];
  return (
    <>
      <h1 className="text-xl font-extrabold text-zinc-900">고양이 미리보기</h1>

      <h2 className="font-bold text-zinc-800">성장 단계 (공부한 날 기준)</h2>
      <section className="overflow-x-auto rounded-2xl bg-white p-3 shadow-sm">
        <table className="text-xs text-zinc-500">
          <thead>
            <tr>
              <th />
              {STAGES.map((s) => (
                <th key={s} className="px-1 pb-1 font-semibold">
                  {s}단계 {CAT_STAGE_NAMES[s]}
                  <br />
                  {CAT_STAGE_DAYS[s]}일+
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAT_BREED_IDS.map((b) => (
              <tr key={b}>
                <td className="pr-2">{CAT_BREEDS[b].name}</td>
                {STAGES.map((s) => (
                  <td key={s}>
                    <CatSprite breed={b} stage={s} className="h-14 w-20" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <h2 className="font-bold text-zinc-800">직군 소품 x 성장 단계 (맨 오른쪽은 48px)</h2>
      <section className="overflow-x-auto rounded-2xl bg-white p-3 shadow-sm">
        <table className="text-xs text-zinc-500">
          <tbody>
            {ids.map((id) => (
              <tr key={id}>
                <td className="pr-2 font-semibold text-zinc-700">{GEAR[id].label}</td>
                {STAGES.map((s) => (
                  <td key={s}>
                    <CatSprite breed="cheese" stage={s} gear={GEAR[id].layers} className="h-14 w-20" />
                  </td>
                ))}
                <td className="pl-2">
                  <CatSprite breed="cheese" gear={GEAR[id].layers} className="h-9 w-12" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

import { inputClass } from "@/app/_ui/styles";
import { PROFILE_TEXT_FIELDS, STAR_FIELDS, type Profile } from "@/lib/classroom/profile";

const small = inputClass.replace("text-base", "text-sm").replace("px-3 py-2", "px-2.5 py-1.5");

/** 상담 프로필 입력칸 묶음 (상담 카드 추가·학생 상세에서 같이 씀). 빈칸은 비워두면 돼요 */
export function ProfileFields({
  profile,
  cohorts,
}: {
  profile?: Partial<Profile>;
  cohorts: { id: string; name: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        🎂 나이
        <input name="age" type="number" min={1} max={99} defaultValue={profile?.age ?? ""} className={small} />
      </label>
      {PROFILE_TEXT_FIELDS.map((f) => (
        <label key={f.key} className="flex flex-col gap-1 text-xs text-zinc-500">
          {f.label}
          <input
            name={f.key}
            defaultValue={(profile?.[f.key] as string | null | undefined) ?? ""}
            placeholder={f.placeholder}
            maxLength={80}
            className={small}
          />
        </label>
      ))}
      {STAR_FIELDS.map((f) => (
        <label key={f.key} className="flex flex-col gap-1 text-xs text-zinc-500">
          {f.label} (0~5)
          <select name={f.key} defaultValue={profile?.[f.key] ?? ""} className={small}>
            <option value="">-</option>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {"★".repeat(n) + "☆".repeat(5 - n)}
              </option>
            ))}
          </select>
        </label>
      ))}
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        🔮 등록 가능성 (%)
        <input
          name="buy_probability"
          type="number"
          min={0}
          max={100}
          step={10}
          defaultValue={profile?.buy_probability ?? ""}
          className={small}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        📅 상담일
        <input name="consulted_on" type="date" defaultValue={profile?.consulted_on ?? ""} className={small} />
      </label>
      <label className="flex flex-col gap-1 text-xs text-zinc-500">
        👥 기수
        <select name="cohort_id" defaultValue={profile?.cohort_id ?? ""} className={small}>
          <option value="">없음</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

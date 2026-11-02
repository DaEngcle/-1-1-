import Link from "next/link";
import { ConfirmButton } from "@/app/_ui/confirm-button";
import { cardClass, inputClass, primaryButtonClass } from "@/app/_ui/styles";
import { SubmitButton } from "@/app/_ui/submit-button";
import { requireTeacher } from "@/lib/classroom/dal";
import { fetchAll } from "@/lib/classroom/progress";
import { kstDate } from "@/lib/classroom/stats";
import { createServerSupabaseClient } from "@/lib/supabase";
import { addPurchase, deletePurchase } from "./actions";

type Row = {
  id: string;
  student_id: string | null;
  buyer_name: string;
  paid_on: string | null;
  amount: number | null;
  source: string | null;
  method: string | null;
  product: string | null;
  kind: string | null;
};

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const small = inputClass.replace("text-base", "text-sm");

/** 비슷한 이름을 묶어서 합계를 낸다 (예: 6기 앵콜 웨비나 → 웨비나) */
function sourceGroup(s: string | null) {
  const v = s?.trim() ?? "";
  if (!v) return "모름";
  if (v.includes("웨비나")) return "웨비나";
  if (v.includes("세미나")) return "세미나";
  if (v.startsWith("기존") || v.includes("잔액")) return "기존 학생";
  return v;
}
function productGroup(p: string | null) {
  const v = p?.trim() ?? "";
  if (!v) return "모름";
  if (v.includes("부트캠프")) return "부트캠프";
  if (v.includes("정규반") || v.includes("LV")) return "정규반·레벨";
  if (v.includes("챌린지")) return "챌린지";
  return v;
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = rows[0]?.[1] ?? 1;
  return (
    <section className={`${cardClass} flex flex-col gap-2`}>
      <h2 className="text-sm font-bold text-zinc-900">{title}</h2>
      {rows.map(([label, amount]) => (
        <div key={label} className="flex flex-col gap-0.5 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-zinc-700">{label}</span>
            <span className="tabular-nums text-zinc-900">{won(amount)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${Math.max(2, (amount / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}

/** 매출: 엑셀 '매출' 시트를 옮긴 것. 달별 합계·유입별·상품별과 결제 목록 */
export default async function SalesPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  await requireTeacher();
  const params = await searchParams;
  const supabase = createServerSupabaseClient();
  const rows = (await fetchAll<Row>((from, to) =>
    supabase
      .from("purchases")
      .select("id, student_id, buyer_name, paid_on, amount, source, method, product, kind")
      .order("paid_on", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to),
  ));
  const dated = rows.filter((r) => r.paid_on);
  const today = kstDate(new Date());
  const months = [...new Set(dated.map((r) => (r.paid_on as string).slice(0, 7)))].sort().reverse();
  const month = params.month && months.includes(params.month) ? params.month : (months[0] ?? today.slice(0, 7));
  const sum = (list: Row[]) => list.reduce((n, r) => n + Number(r.amount ?? 0), 0);
  const inMonth = (m: string) => dated.filter((r) => (r.paid_on as string).startsWith(m));
  const shown = inMonth(month);
  const year = month.slice(0, 4);
  const yearTotal = sum(dated.filter((r) => (r.paid_on as string).startsWith(year)));
  const monthTotal = sum(shown);
  const maxMonth = Math.max(1, ...months.map((m) => sum(inMonth(m))));

  const group = (list: Row[], key: (r: Row) => string): [string, number][] => {
    const totals = new Map<string, number>();
    for (const r of list) totals.set(key(r), (totals.get(key(r)) ?? 0) + Number(r.amount ?? 0));
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  };

  return (
    <>
      <h1 className="text-xl font-bold text-zinc-900">💰 매출</h1>
      <section className="grid grid-cols-2 gap-2">
        <div className={`${cardClass} !p-3 text-center`}>
          <p className="text-xs text-zinc-500">{Number(month.slice(5))}월 매출 · {shown.length}건</p>
          <p className="text-xl font-bold tabular-nums text-zinc-900">{won(monthTotal)}</p>
        </div>
        <div className={`${cardClass} !p-3 text-center`}>
          <p className="text-xs text-zinc-500">{year}년 합계</p>
          <p className="text-xl font-bold tabular-nums text-zinc-900">{won(yearTotal)}</p>
        </div>
      </section>

      <section className={`${cardClass} flex flex-col gap-1.5`}>
        <h2 className="text-sm font-bold text-zinc-900">달별 매출</h2>
        {months.map((m) => {
          const total = sum(inMonth(m));
          return (
            <Link key={m} href={`/teacher/sales?month=${m}`} className={`flex items-center gap-2 rounded-lg px-1 py-0.5 text-sm hover:bg-brand-50 ${m === month ? "bg-brand-50 font-bold" : ""}`}>
              <span className="w-16 shrink-0 tabular-nums text-zinc-600">{m}</span>
              <span className="h-2 min-w-0 flex-1 rounded-full bg-slate-100">
                <span className="block h-2 rounded-full bg-brand-500" style={{ width: `${Math.max(1, (total / maxMonth) * 100)}%` }} />
              </span>
              <span className="shrink-0 tabular-nums text-zinc-900">{won(total)}</span>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <Breakdown title={`${Number(month.slice(5))}월 어디서 왔나`} rows={group(shown, (r) => sourceGroup(r.source))} />
        <Breakdown title={`${Number(month.slice(5))}월 무엇을 샀나`} rows={group(shown, (r) => productGroup(r.product))} />
      </div>

      <form action={addPurchase} className={`${cardClass} flex flex-col gap-2`}>
        <h2 className="text-sm font-bold text-zinc-900">결제 추가</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <input name="buyer_name" required placeholder="구매자" aria-label="구매자" className={small} />
          <input name="paid_on" type="date" required defaultValue={today} aria-label="결제일" className={small} />
          <input name="amount" required inputMode="numeric" placeholder="금액 (원)" aria-label="금액" className={small} />
          <input name="product" placeholder="상품 (부트캠프)" aria-label="상품" className={small} />
          <input name="source" placeholder="유입 (7기 웨비나)" aria-label="유입" className={small} />
          <input name="method" placeholder="결제 (계좌이체 카카오)" aria-label="결제 방법" className={small} />
          <input name="kind" placeholder="구분 (신규·수강연장)" aria-label="구분" className={small} />
          <input name="note" placeholder="메모" aria-label="메모" className={small} />
        </div>
        <SubmitButton className={`${primaryButtonClass} self-start text-sm`}>추가</SubmitButton>
      </form>

      <section className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-semibold">날짜</th>
              <th className="px-2 py-2 font-semibold">구매자</th>
              <th className="px-2 py-2 text-right font-semibold">금액</th>
              <th className="px-2 py-2 font-semibold">상품</th>
              <th className="px-2 py-2 font-semibold">유입</th>
              <th className="px-2 py-2 font-semibold">결제</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="whitespace-nowrap px-3 py-1.5 tabular-nums text-zinc-600">{(r.paid_on as string).slice(5)}</td>
                <td className="whitespace-nowrap px-2 py-1.5 font-medium text-zinc-900">
                  {r.student_id ? (
                    <Link href={`/teacher/students/${r.student_id}`} className="hover:underline">{r.buyer_name}</Link>
                  ) : (
                    r.buyer_name
                  )}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-right tabular-nums text-zinc-900">{won(Number(r.amount ?? 0))}</td>
                <td className="px-2 py-1.5 text-zinc-700">{r.product ?? "-"}{r.kind ? ` · ${r.kind}` : ""}</td>
                <td className="px-2 py-1.5 text-zinc-600">{r.source ?? "-"}</td>
                <td className="whitespace-nowrap px-2 py-1.5 text-zinc-600">{r.method ?? "-"}</td>
                <td className="px-2 py-1.5 text-right">
                  <form action={deletePurchase}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmButton message={`${r.buyer_name} ${won(Number(r.amount ?? 0))} 결제를 지울까요?`} className="text-xs text-red-500 underline">
                      삭제
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="text-xs text-zinc-500">시트의 금액을 그대로 옮긴 입금액이에요. 네이버·토스 수수료는 빠지지 않았어요.</p>
    </>
  );
}

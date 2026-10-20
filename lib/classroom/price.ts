/** 19000 → "1.9만원", 49000 → "4.9만원" */
export function manwon(won: number) {
  return won >= 10000 ? `${(won / 10000).toFixed(won % 10000 ? 1 : 0)}만원` : `${won.toLocaleString("ko-KR")}원`;
}

export function discountRate(list: number | null, price: number | null) {
  return list && price && list > price ? Math.round((1 - price / list) * 100) : 0;
}

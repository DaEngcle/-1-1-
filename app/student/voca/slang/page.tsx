import { redirect } from "next/navigation";

/** 예전 주소 → 표현 단어장 공용 페이지 */
export default function OldSlangPage() {
  redirect("/student/voca/p/slang");
}

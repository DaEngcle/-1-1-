import { redirect } from "next/navigation";

/** 상황극 목록은 상황 연습 화면(일터별 ② 상황극)에 있다 */
export default function RoleplayIndexPage() {
  redirect("/student/practice");
}

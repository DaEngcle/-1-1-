import Link from "next/link";
import { requireStudent } from "@/lib/classroom/dal";
import { PLANS, isPlanId } from "@/lib/classroom/plans";
import { logout } from "@/app/login/actions";
import { CatSprite } from "@/app/_ui/cat";
import { LineIcon } from "@/app/_ui/line-icons";
import { SubmitButton } from "@/app/_ui/submit-button";

type Item = { href: string; icon: string; title: string; sub: string };

const SECTIONS: { title: string; items: Item[] }[] = [
  {
    title: "공부",
    items: [
      { href: "/student/grammar", icon: "book", title: "기초 문법", sub: "다니엘 쌤 강의 + 개념·예문·문제" },
      { href: "/student/news", icon: "news", title: "뉴스로 배우는 영어", sub: "매일 호주 뉴스로 · 핵심 표현 5개 + 퀴즈" },
      { href: "/student/pronunciation", icon: "sound", title: "발음 가이드", sub: "th·r·l·f·v 입모양부터" },
      { href: "/student/level-test", icon: "chart", title: "레벨테스트", sub: "내 영어 레벨 확인·수료 때 다시 보기" },
    ],
  },
  {
    title: "내 기록",
    items: [
      { href: "/student/shadowing", icon: "mic", title: "내 쉐도잉", sub: "다음에 할 문장·제출한 녹음·AI 피드백" },
      { href: "/student/resources", icon: "gift", title: "자료실", sub: "교재·PDF 자료 받기" },
    ],
  },
  {
    title: "계정",
    items: [
      { href: "/student/profile", icon: "user", title: "내 정보", sub: "닉네임·비밀번호 바꾸기" },
      { href: "/student/settings", icon: "settings", title: "설정", sub: "알림·해석·자막·효과음" },
    ],
  },
];

export default async function MorePage() {
  const student = await requireStudent();
  const name = student.nickname ?? student.name;
  const plan = isPlanId(student.plan) ? PLANS[student.plan].name.replace("다잉클 ", "") : "무료회원";

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">더보기</h1>

      <Link
        href="/student/cat-house"
        className="flex items-center gap-4 rounded-[28px] bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 text-white shadow-md"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/90">
          {student.catBreed ? (
            <CatSprite breed={student.catBreed} className="h-10 w-12" />
          ) : (
            <span className="text-2xl font-extrabold text-violet-600">{name.slice(0, 1)}</span>
          )}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-xl font-extrabold">{name}</span>
          <span className="truncate text-xs text-white/80">
            {plan}
            {student.accessUntil ? ` · ${student.accessUntil.replaceAll("-", ".")}까지` : ""}
          </span>
          <span className="mt-1 text-sm font-bold">🏠 {student.catName ?? "고양이"}의 집 꾸미기 · 츄르 🐟로 가구 사기</span>
        </span>
        <LineIcon name="chevron" className="ml-auto h-5 w-5 shrink-0 text-white/70" />
      </Link>

      {SECTIONS.map((sec) => (
        <section key={sec.title} className="rounded-[28px] bg-white px-5 pt-4 pb-1 shadow-sm">
          <p className="mb-1 text-sm font-semibold text-zinc-400">{sec.title}</p>
          <ul className="divide-y divide-zinc-100">
            {sec.items.map((it) => (
              <li key={it.href}>
                <Link href={it.href} className="flex items-center gap-4 py-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-800">
                    <LineIcon name={it.icon} className="h-6 w-6" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-bold text-zinc-900">{it.title}</span>
                    <span className="truncate text-sm text-zinc-500">{it.sub}</span>
                  </span>
                  <LineIcon name="chevron" className="ml-auto h-5 w-5 shrink-0 text-zinc-300" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <form action={logout} className="rounded-[28px] bg-white px-5 shadow-sm">
        <SubmitButton className="flex w-full items-center gap-4 py-3.5 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <LineIcon name="logout" className="h-6 w-6" />
          </span>
          <span className="font-bold text-rose-600">로그아웃</span>
        </SubmitButton>
      </form>
    </>
  );
}

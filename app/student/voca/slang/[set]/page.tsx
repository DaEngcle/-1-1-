import { redirect } from "next/navigation";

export default async function OldSlangSetPage({ params }: { params: Promise<{ set: string }> }) {
  redirect(`/student/voca/p/slang/${(await params).set}`);
}

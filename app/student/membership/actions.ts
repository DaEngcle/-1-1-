"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayingStudent } from "@/lib/classroom/dal";
import { cancelMembership, resumeMembership } from "@/lib/classroom/membership-billing";

export async function cancelAction() {
  const student = await getPayingStudent();
  if (!student) redirect("/login");
  const result = await cancelMembership(student.id);
  if ("error" in result && result.error) redirect(`/student/membership?error=${encodeURIComponent(result.error)}`);
  revalidatePath("/student", "layout");
  redirect("ended" in result ? "/student/membership?ended=1" : "/student/membership?cancelled=1");
}

export async function resumeAction() {
  const student = await getPayingStudent();
  if (!student) redirect("/login");
  const result = await resumeMembership(student.id);
  if ("error" in result && result.error) redirect(`/student/membership?error=${encodeURIComponent(result.error)}`);
  revalidatePath("/student/membership");
  redirect("/student/membership?resumed=1");
}

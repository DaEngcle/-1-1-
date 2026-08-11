import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createServerSupabaseClient, type Content } from "../lib/supabase";

type SeedContent = Omit<Content, "id" | "created_at">;

async function main() {
  const filePath = join(__dirname, "..", "content", "seed-contents.json");
  const seedContents: SeedContent[] = JSON.parse(readFileSync(filePath, "utf-8"));

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("contents")
    .upsert(seedContents, { onConflict: "day_order" })
    .select("id, day_order, expression");

  if (error) {
    console.error("시드 데이터 삽입 실패:", error.message);
    process.exit(1);
  }

  console.log(`콘텐츠 ${data?.length ?? 0}건 upsert 완료:`);
  for (const row of data ?? []) {
    console.log(`  day ${row.day_order}: ${row.expression}`);
  }
}

main();

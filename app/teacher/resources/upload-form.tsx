"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createResourceUpload, registerResource } from "./actions";
import { inputClass, primaryButtonClass } from "@/app/_ui/styles";

/** PDF는 Supabase에 바로 올리고(용량 큰 전자책도 가능), 다 올라가면 자료실에 등록 */
export function ResourceUploadForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const file = fd.get("file") as File | null;
        const title = String(fd.get("title") ?? "");
        if (!file || file.size === 0) return setMessage({ ok: false, text: "PDF 파일을 골라주세요." });
        if (file.size > 50 * 1024 * 1024) return setMessage({ ok: false, text: "50MB 이하 파일만 올릴 수 있어요." });
        setBusy(true);
        setMessage(null);
        try {
          const prep = await createResourceUpload(file.name);
          if ("error" in prep) throw new Error(prep.error);
          const res = await fetch(prep.signedUrl, {
            method: "PUT",
            headers: { "content-type": "application/pdf", "x-upsert": "false" },
            body: file,
          });
          if (!res.ok) throw new Error("파일 업로드에 실패했어요.");
          const done = await registerResource({
            path: prep.path,
            fileName: file.name,
            size: file.size,
            title,
            description: String(fd.get("description") ?? ""),
          });
          if ("error" in done) throw new Error(done.error);
          form.reset();
          setMessage({ ok: true, text: "✅ 자료실에 올렸어요!" });
          router.refresh();
        } catch (err) {
          setMessage({ ok: false, text: err instanceof Error ? err.message : "업로드 중 오류가 발생했어요." });
        } finally {
          setBusy(false);
        }
      }}
    >
      <input name="title" required maxLength={80} placeholder="자료 제목 (예: 워홀 영어 330문장 전자책)" className={inputClass} />
      <input name="description" maxLength={200} placeholder="한 줄 설명 (선택)" className={inputClass} />
      <input name="file" type="file" accept="application/pdf" required className="text-sm" />
      <button type="submit" disabled={busy} className={`${primaryButtonClass} self-start`}>
        {busy ? "올리는 중… (큰 파일은 조금 걸려요)" : "⬆ 자료 올리기"}
      </button>
      {message && <p className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</p>}
    </form>
  );
}

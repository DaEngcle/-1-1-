"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { renderPdfCover } from "./pdf-cover";
import { uploadCover } from "./cover-tools";

/** 표지: PDF 첫 페이지로 자동 만들기 / 직접 만든 표지 이미지 올리기 */
export function CoverButtons({ resourceId }: { resourceId: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const run = async (label: string, job: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await job();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "표지를 만들지 못했어요.");
    } finally {
      setBusy(null);
    }
  };
  return (
    <>
      <button
        type="button"
        disabled={!!busy}
        className="rounded-lg border border-slate-300 px-2.5 py-1"
        onClick={() =>
          run("auto", async () => {
            const pdf = await fetch(`/api/resources/${resourceId}`).then((r) => {
              if (!r.ok) throw new Error("PDF를 불러오지 못했어요.");
              return r.arrayBuffer();
            });
            await uploadCover(resourceId, await renderPdfCover(pdf));
          })
        }
      >
        {busy === "auto" ? "표지 만드는 중…" : "🖼 첫 페이지로 표지"}
      </button>
      <button
        type="button"
        disabled={!!busy}
        className="rounded-lg border border-slate-300 px-2.5 py-1"
        onClick={() => fileRef.current?.click()}
      >
        {busy === "file" ? "올리는 중…" : "표지 이미지 올리기"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) return setError("5MB 이하 이미지만 올릴 수 있어요.");
          run("file", () => uploadCover(resourceId, file));
        }}
      />
      {error && <span className="text-red-600">{error}</span>}
    </>
  );
}

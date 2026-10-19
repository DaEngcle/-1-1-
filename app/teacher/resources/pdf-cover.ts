/** 브라우저에서 PDF 첫 페이지를 그려 표지 JPG로 만든다 (pdf.js) */
export async function renderPdfCover(data: ArrayBuffer, width = 600): Promise<Blob> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  const pdf = await pdfjs.getDocument({ data }).promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: width / base.width });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("표지를 그릴 수 없어요.");
  await page.render({ canvasContext: ctx, viewport }).promise;
  await pdf.destroy();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("표지를 만들 수 없어요."))), "image/jpeg", 0.85),
  );
}

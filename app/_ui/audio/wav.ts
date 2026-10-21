/**
 * 16kHz 모노 16bit WAV 만들기 — Azure 발음 평가 API가 요구하는 형식.
 */

const TARGET_RATE = 16000;

/** 마이크에서 받은 소리(Float32, 원래 샘플레이트) → 16kHz WAV. 구간 평균으로 줄인다 */
export function encodeWav16kMono(input: Float32Array, inputRate: number): Blob {
  const ratio = inputRate / TARGET_RATE;
  const length = Math.floor(input.length / ratio);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const from = Math.floor(i * ratio);
    const to = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = from; j < to; j++) sum += input[j];
    samples[i] = to > from ? sum / (to - from) : input[from] ?? 0;
  }
  return pcmToWav(samples, TARGET_RATE);
}

function pcmToWav(samples: Float32Array, rate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * 녹음 파일 → 16kHz 모노 WAV. 이미 그 형식이면(지금 녹음기가 만든 파일) 그대로 쓴다.
 * 다른 형식(webm/mp4 등)은 브라우저로 풀어서 변환한다.
 */
export async function toWav16kMono(blob: Blob): Promise<Blob> {
  const head = new DataView(await blob.slice(0, 44).arrayBuffer());
  const isWav = head.byteLength >= 44 && head.getUint32(0, false) === 0x52494646; // "RIFF"
  if (isWav && head.getUint16(22, true) === 1 && head.getUint32(24, true) === TARGET_RATE) return blob;

  const arrayBuffer = await blob.arrayBuffer();
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(arrayBuffer);
  await ctx.close();
  const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * TARGET_RATE), TARGET_RATE);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  return pcmToWav(rendered.getChannelData(0), TARGET_RATE);
}

"use client";

import type { Look } from "@/lib/classroom/interview-scenarios";
import { Interviewer } from "./interviewer";

/**
 * 실사 면접관 영상 (public/interviewers/{id}-talk.mp4, {id}-listen.mp4, {id}.jpg).
 * 말할 땐 talk 영상, 들을 땐 listen 영상을 겹쳐 두고 살짝 겹치며(크로스페이드) 바꾼다.
 * listen 영상이 없으면 정지 사진을 보여준다.
 */
const VIDEOS: Record<string, { listen: boolean }> = {
  cafe: { listen: true },
  chef: { listen: false },
  hotel: { listen: true },
  carpenter: { listen: true },
  farm: { listen: true },
  retail: { listen: true },
  sharehouse: { listen: true },
};

export function hasInterviewerVideo(id: string) {
  return id in VIDEOS;
}

export function interviewerPhoto(id: string) {
  return `/interviewers/${id}.jpg`;
}

export function InterviewerVideo({
  id,
  talking = false,
  className = "",
}: {
  id: string;
  talking?: boolean;
  className?: string;
}) {
  const v = VIDEOS[id];
  const base = `/interviewers/${id}`;
  const layer = "absolute inset-0 h-full w-full object-cover transition-opacity duration-300";
  return (
    <div className={`relative overflow-hidden bg-zinc-200 ${className}`}>
      {v?.listen ? (
        <video className={layer} src={`${base}-listen.mp4`} poster={`${base}.jpg`} autoPlay muted loop playsInline preload="auto" aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={layer} src={`${base}.jpg`} alt="" />
      )}
      <video
        className={`${layer} ${talking ? "opacity-100" : "opacity-0"}`}
        src={`${base}-talk.mp4`}
        poster={`${base}.jpg`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
    </div>
  );
}

/** 목록·리포트용 얼굴 사진 (영상이 없는 면접관은 일러스트) */
export function InterviewerFace({ id, look, className = "h-24 w-24" }: { id: string; look: Look; className?: string }) {
  if (!hasInterviewerVideo(id)) return <Interviewer look={look} className={className} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={interviewerPhoto(id)} alt="" className={`${className} rounded-2xl object-cover`} />;
}

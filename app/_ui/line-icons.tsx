/** 선으로 그린 아이콘 (이모지 대신. 아래 탭바·더보기에서 같이 쓴다) */
const PATHS: Record<string, React.ReactNode> = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />,
  play: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="3.5" />
      <path d="m10.5 9.5 4 2.5-4 2.5z" />
    </>
  ),
  talk: (
    <>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 3.5V15A2.5 2.5 0 0 1 5 12.5z" />
      <path d="M9 9.5h.01M12 9.5h.01M15 9.5h.01" />
    </>
  ),
  cards: (
    <>
      <rect x="4" y="7" width="12" height="13" rx="2.5" />
      <path d="M8 4h9.5A2.5 2.5 0 0 1 20 6.5V16M7.5 13.5h5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5.5a2.5 2.5 0 0 0 2.6 3.5M16 6h2.5a2.5 2.5 0 0 1-2.6 3.5" />
      <path d="M12 13v3.5M8.5 20h7M10 16.5h4V20h-4z" />
    </>
  ),
  more: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
    </>
  ),
  book: (
    <>
      <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5z" />
      <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 8h6M9 11h4" />
    </>
  ),
  news: (
    <>
      <rect x="4" y="5" width="13" height="14" rx="2" />
      <path d="M17 9h2.5a.5.5 0 0 1 .5.5V17a2 2 0 0 1-2 2H6M7.5 9h6M7.5 12.5h6M7.5 16h4" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V20.5M9 20.5h6" />
    </>
  ),
  chart: <path d="M5 4v15.5a.5.5 0 0 0 .5.5H20M8.5 15v-3M12.5 15V8M16.5 15v-5" />,
  sound: (
    <>
      <path d="M5 9.5h3L12.5 6v12L8 14.5H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z" />
      <path d="M16 9.5a3.5 3.5 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="2" />
      <path d="M3.5 9h17M12 9v11M12 9S10.5 4.5 8 5s-1 4 4 4c5 0 6.5-3.5 4-4S12 9 12 9" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 16V11a5.5 5.5 0 0 1 11 0v5l1.5 2H5z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="3.5" />
      <path d="m10.5 12.5 8-8M15.5 7.5l2 2M13.5 9.5l1.5 1.5" />
    </>
  ),
  logout: <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10M14 8l4 4-4 4M18 12H9.5" />,
  chevron: <path d="m9.5 6 6 6-6 6" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6" />
    </>
  ),
  house: <path d="M4 11 12 4.5 20 11M6 9.5V19a1 1 0 0 0 1 1h3.5v-5h3v5H17a1 1 0 0 0 1-1V9.5" />,
};

export function LineIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name] ?? PATHS.more}
    </svg>
  );
}

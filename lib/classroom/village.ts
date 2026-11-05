// 고양이 마을 말하기 연습. 문장은 public/village/village.js의 PLACES와 똑같아야 채점된다.
export const VILLAGE_PHRASES = [
  "Where do I pick up my PPE today?",
  "How much for a kilo of apples?",
  "Have you got a table for two?",
  "Can I grab a flat white, please?",
  "Can I get two croissants to take away, please?",
  "Hi, I have a booking for tonight under Daniel.",
  "Can I get this prescription filled, please?",
  "Excuse me, where can I find the milk?",
  "Can I get a bag, please?",
  "Can I get a slice of this cake to go?",
  "Lovely day, isn't it?",
  "Could you take a photo of us?",
  "Excuse me, which way to the beach?",
];

/** 학생 한 명이 하루에 채점받을 수 있는 횟수 (음성 채점 비용 상한) */
export const VILLAGE_DAILY_SPEAK_LIMIT = 30;
/** 한 번에 녹음하는 최대 길이(초) */
export const VILLAGE_MAX_RECORD_SECONDS = 8;

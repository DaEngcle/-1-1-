-- Level 1.0 60일 커리큘럼 + 교재 대화 → 쉐도잉 문장
-- content/level1-dialogues.json 에서 생성. 해석은 AI 초안. 여러 번 실행해도 안전하다 (기존 제출 기록 유지).
begin;
update courses set status = 'open', subtitle = '쉐도잉 문장 먼저 공개 · 강의 영상 순차 업로드' where id = 'level1';
insert into lessons (course_id, sort_order, week_number, week_title, kind, day_number, title, description, is_published) values
  ('level1', 1, 1, '세일즈・리테일 표현', 'day', 1, 'Are you looking for something in particular?', null, true),
  ('level1', 2, 1, '세일즈・리테일 표현', 'day', 2, 'Bang for the buck', null, true),
  ('level1', 3, 1, '세일즈・리테일 표현', 'day', 3, 'How are you finding it so far?', null, true),
  ('level1', 4, 1, '세일즈・리테일 표현', 'day', 4, 'Hi there. Are you looking for anything specific today?', null, true),
  ('level1', 5, 1, '세일즈・리테일 표현', 'day', 5, 'I can walk you through the options', null, true),
  ('level1', 6, 2, '컴플레인 대처법', 'day', 6, 'Feel free to keep that hot one if you''d like!', null, true),
  ('level1', 7, 2, '컴플레인 대처법', 'day', 7, 'We''ve been waiting for over 40 minutes.', null, true),
  ('level1', 8, 2, '컴플레인 대처법', 'day', 8, 'Excuse me, I think there''s something wrong with my sandwich.', null, true),
  ('level1', 9, 2, '컴플레인 대처법', 'day', 9, 'Excuse me, I''d like to talk to someone in charge.', null, true),
  ('level1', 10, 2, '컴플레인 대처법', 'day', 10, 'Isn''t this place a vibe?', null, true),
  ('level1', 11, 3, '동료・상사 영어', 'day', 11, 'Hey, do you have a second?', null, true),
  ('level1', 12, 3, '동료・상사 영어', 'day', 12, 'It depends. If you''re taking me to lunch', null, true),
  ('level1', 13, 3, '동료・상사 영어', 'day', 13, 'Any chance you could help me wrap this up today?', null, true),
  ('level1', 14, 3, '동료・상사 영어', 'day', 14, 'Hey Bethany, would it be okay if I took next Friday off?', null, true),
  ('level1', 15, 3, '동료・상사 영어', 'day', 15, 'If Margot is cool with handling the catering prep, then that''s no problem', null, true),
  ('level1', 16, 4, '건설 현장 영어', 'day', 16, 'First things first!', '*PPE: Personal Protective Equipment / *Hi-vis: High visibility', true),
  ('level1', 17, 4, '건설 현장 영어', 'day', 17, 'Smoko time. Drop everything.', '*Smoko: break time 쉬는 시간 / *Chippie: carpenter 목수', true),
  ('level1', 18, 4, '건설 현장 영어', 'day', 18, 'We''re out of screws', '*gopher: 땅다람쥐, 심부름꾼, 잡일 담당 막내 / *gone walkabout: 어디 사라짐 / *bludger: 게으름뱅이', true),
  ('level1', 19, 4, '건설 현장 영어', 'day', 19, 'You should''ve asked before you started', '*dog''s breakfast: 완전 개판이다', true),
  ('level1', 20, 4, '건설 현장 영어', 'day', 20, 'They don''t know what they''re doing', '*backpackers: 워홀러', true),
  ('level1', 21, 5, '호주 슬랭 101', 'day', 21, 'Grab a snag off the barbie!', '*snag: 소세지 / *barbie: barbecue / *arvo: after noon / *esky: 아이스박스 / *Fair dinkum: 진짜, 완전, 정말로 / *stoked: 흥분된, 신난 / *coldie: cold one = beer', true),
  ('level1', 22, 5, '호주 슬랭 101', 'day', 22, 'Keen on footy?', '*spot on: 이거지~ / *heaps of: a lot of / *Footy: AFL 호주식 미식 축구 / *keen on : ~을 좋아하다 / *Collingwood (Magpies): 호주에서 가장 팬이 많은 footy 팀', true),
  ('level1', 23, 5, '호주 슬랭 101', 'day', 23, 'Grabbed something from Maccas on the way', '*dusty: 피곤한 / 숙취 있는 / *Maccas = McDonald''s / *tinnies = 캔맥주 / *brekkie = breakfast / *ripper = 좋다 / 최고다 / *legend = 고마울 때 "최고야" 느낌', true),
  ('level1', 24, 5, '호주 슬랭 101', 'day', 24, 'Grab us a goon bag if you''re at the bottle shop', '*goon: 대용량 팩 와인 / *local: 현지인 / *Aussie(OZ): 호주사람 / *bottle O = bottle shop / *Crikey: 세상에, 맙소사', true),
  ('level1', 25, 5, '호주 슬랭 101', 'day', 25, 'Hey, excuse me.', null, true),
  ('level1', 26, 6, '근무 중 "확실한"소통 - okay만 반복 X', 'day', 26, 'I''ll let you know if we''re running low on anything', null, true),
  ('level1', 27, 6, '근무 중 "확실한"소통 - okay만 반복 X', 'day', 27, 'The latte was supposed to be iced', null, true),
  ('level1', 28, 6, '근무 중 "확실한"소통 - okay만 반복 X', 'day', 28, 'Jot that down', null, true),
  ('level1', 29, 6, '근무 중 "확실한"소통 - okay만 반복 X', 'day', 29, 'Hey Emma, just now a customer asked for three hundred...', null, true),
  ('level1', 30, 6, '근무 중 "확실한"소통 - okay만 반복 X', 'day', 30, 'Just to confirm,', null, true),
  ('level1', 31, 7, '서운함부터 장난까지', 'day', 31, 'Did you guys go out without me?', null, true),
  ('level1', 32, 7, '서운함부터 장난까지', 'day', 32, 'Did you see the team meeting today? Dave presented the...', null, true),
  ('level1', 33, 7, '서운함부터 장난까지', 'day', 33, 'Tom looks down on me', null, true),
  ('level1', 34, 7, '서운함부터 장난까지', 'day', 34, 'Are you being sarcastic just now?', null, true),
  ('level1', 35, 7, '서운함부터 장난까지', 'day', 35, 'I turned down other plans because of this', null, true),
  ('level1', 36, 8, '자기소개 2.0 - 이유와 계획 말하기', 'day', 36, 'What brought you here?', null, true),
  ('level1', 37, 8, '자기소개 2.0 - 이유와 계획 말하기', 'day', 37, 'Coming here solo takes guts', null, true),
  ('level1', 38, 8, '자기소개 2.0 - 이유와 계획 말하기', 'day', 38, 'I''m on the fence', null, true),
  ('level1', 39, 8, '자기소개 2.0 - 이유와 계획 말하기', 'day', 39, 'What do you do for fun?', null, true),
  ('level1', 40, 8, '자기소개 2.0 - 이유와 계획 말하기', 'day', 40, 'Apparently, Korean food is super spicy', null, true),
  ('level1', 41, 9, '연애 시작 · 미묘한 관계 영어', 'day', 41, 'Maybe we could grab dinner', null, true),
  ('level1', 42, 9, '연애 시작 · 미묘한 관계 영어', 'day', 42, 'That was so awesome. I love spending time with you. You...', null, true),
  ('level1', 43, 9, '연애 시작 · 미묘한 관계 영어', 'day', 43, 'I''ve never spent this much time with someone.', null, true),
  ('level1', 44, 9, '연애 시작 · 미묘한 관계 영어', 'day', 44, 'So after last night... what are we?', null, true),
  ('level1', 45, 9, '연애 시작 · 미묘한 관계 영어', 'day', 45, 'Are you two actually together now?', null, true),
  ('level1', 46, 10, '연애문제 · 배신 · 감정폭발', 'day', 46, 'So, the boy I would like to couple up with is... Reid.', null, true),
  ('level1', 47, 10, '연애문제 · 배신 · 감정폭발', 'day', 47, 'Hey... can I ask you something?', null, true),
  ('level1', 48, 10, '연애문제 · 배신 · 감정폭발', 'day', 48, 'Want some tea', null, true),
  ('level1', 49, 10, '연애문제 · 배신 · 감정폭발', 'day', 49, 'That was so fun.', null, true),
  ('level1', 50, 10, '연애문제 · 배신 · 감정폭발', 'day', 50, 'Hey... what''s eating you? You''ve been off all day.', null, true),
  ('level1', 51, 11, '네트워킹・파티', 'day', 51, 'Hey! I don''t think we''ve met before. I''m Emma.', null, true),
  ('level1', 52, 11, '네트워킹・파티', 'day', 52, 'The vibe here is amazing. I love the music. Right?', null, true),
  ('level1', 53, 11, '네트워킹・파티', 'day', 53, 'Wait wait wait — you don''t wanna eat that. There''s mould...', null, true),
  ('level1', 54, 11, '네트워킹・파티', 'day', 54, 'So I was trying to say... 답답한? Like when you can''t...', null, true),
  ('level1', 55, 11, '네트워킹・파티', 'day', 55, 'Oh my God. Guess what?', null, true),
  ('level1', 56, 12, '운전 필수 영어', 'day', 56, 'Excuse me, sir. Please pull over to the side of the road.', null, true),
  ('level1', 57, 12, '운전 필수 영어', 'day', 57, 'How are you getting to work tomorrow?', null, true),
  ('level1', 58, 12, '운전 필수 영어', 'day', 58, 'Excuse me, can I park here?', null, true),
  ('level1', 59, 12, '운전 필수 영어', 'day', 59, 'Which pump are you on?', null, true),
  ('level1', 60, 12, '운전 필수 영어', 'day', 60, 'So sorry. Always bothering you to teach me.', null, true)
on conflict (course_id, day_number) do update set sort_order = excluded.sort_order, week_number = excluded.week_number,
  week_title = excluded.week_title, title = excluded.title, description = coalesce(lessons.description, excluded.description);
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Are you looking for something in particular?', '특별히 찾으시는 거 있으세요?', 'A 대사'),
  (2, 'Yeah, I''m looking for a jacket.', '네, 재킷 하나 보고 있어요.', 'B 대사'),
  (3, 'This one''s really popular. It comes in different sizes and colours.', '이거 진짜 인기 많아요. 사이즈랑 색상도 여러 가지로 나와요.', 'A 대사'),
  (4, 'Can I try it on?', '입어봐도 돼요?', 'B 대사'),
  (5, 'Of course. The fitting room''s just over there.', '그럼요. 탈의실은 바로 저쪽이에요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 1
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 1) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How much is this?', '이거 얼마예요?', 'A 대사'),
  (2, 'It''s $79, but it''s on sale today.', '79달러인데, 오늘 세일 중이에요.', 'B 대사'),
  (3, 'How much is it now?', '지금은 얼마예요?', 'A 대사'),
  (4, 'It''s $49. Bang for the buck.', '49달러예요. 가성비 완전 좋죠.', 'B 대사'),
  (5, 'I''ll take it.', '이걸로 할게요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 2
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 2) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How are you finding it so far?', '지금까지 어때요?', 'A 대사'),
  (2, 'Yeah... it''s not bad.', '음... 나쁘진 않아요.', 'B 대사'),
  (3, 'Gotcha. Is it more the fit, or just not quite your style?', '그렇구나. 핏이 좀 그런 거예요, 아니면 그냥 스타일이 딱 맞진 않는 거예요?', 'A 대사'),
  (4, 'I think it''s the fit. It feels a bit snug.', '핏인 것 같아요. 좀 꽉 끼는 느낌이에요.', 'B 대사'),
  (5, 'That makes sense. You might feel more comfortable in the next size up. I''ll bring it over', '그럴 수 있죠. 한 사이즈 큰 게 더 편하실 수도 있어요. 제가 가져다 드릴게요.', 'A 대사'),
  (6, 'Yeah, maybe', '네, 그럴까요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 3
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 3) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi there. Are you looking for anything specific today?', '안녕하세요. 오늘 특별히 찾으시는 거 있으세요?', 'A 대사'),
  (2, 'Yeah, I''m looking for a laptop.', '네, 노트북 보고 있어요.', 'B 대사'),
  (3, 'Sure. What will you mainly use it for?', '네. 주로 어떤 용도로 쓰실 거예요?', 'A 대사'),
  (4, 'Mostly work and some light video editing.', '주로 일하고, 가벼운 영상 편집 정도요.', 'B 대사'),
  (5, 'In that case, I''d recommend this Macbook. It''s lightweight, fast, and great for multitasking.', '그럼 이 맥북 추천드려요. 가볍고 빠르고 멀티태스킹에 딱이에요.', 'A 대사'),
  (6, 'How much is it?', '얼마예요?', 'B 대사'),
  (7, 'It''s 1,399. It also comes with a 2-year warranty. Is there anything you''re unsure about?', '1,399달러예요. 2년 보증도 포함돼 있어요. 혹시 고민되는 부분 있으세요?', 'A 대사'),
  (8, 'Well, I''m torn between Macbook Air and Macbook Pro.', '음, 맥북 에어랑 맥북 프로 사이에서 고민 중이에요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 4
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 4) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How much does it cost?', '이거 얼마예요?', 'A 대사'),
  (2, 'Pricing depends on what you need. I can walk you through the options if that helps.', '가격은 필요하신 거에 따라 달라요. 괜찮으시면 옵션들 하나씩 설명해 드릴게요.', 'B 대사'),
  (3, 'Okay, sure.', '네, 좋아요.', 'A 대사'),
  (4, 'To make sure I''m on the same page, how are you planning to use it?', '제가 제대로 이해했는지 확인하려고 그러는데, 어떻게 쓰실 계획이세요?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 5
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 5) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I really don''t wanna bother you, but I ordered an iced latte and this is hot.', '진짜 귀찮게 하고 싶진 않은데, 아이스 라떼 시켰는데 이거 뜨거운 거예요.', 'A 대사'),
  (2, 'Oh no, it''s no trouble at all! I''m really sorry about that. Thanks for letting me know.', '아이고, 전혀 귀찮지 않아요! 정말 죄송해요. 말씀해 주셔서 감사해요.', 'B 대사'),
  (3, 'I''ll remake it as an iced latte right away.', '바로 아이스 라떼로 다시 만들어 드릴게요.', 'B 대사'),
  (4, 'Thanks Sam.', '고마워요, 샘.', 'A 대사'),
  (5, 'Feel free to keep that hot one if you''d like! It''s on the house.', '뜨거운 건 원하시면 그냥 드세요! 서비스예요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 6
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 6) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'We''ve been waiting for over 40 minutes.', '저희 40분 넘게 기다리고 있어요.', 'A 대사'),
  (2, 'I completely understand your frustration. I''m really sorry about the wait.', '답답하신 거 충분히 이해해요. 오래 기다리게 해서 정말 죄송합니다.', 'B 대사'),
  (3, 'No one told us it would take this long.', '이렇게 오래 걸린다고 아무도 말 안 해줬잖아요.', 'A 대사'),
  (4, 'We''re a bit short-staffed today, but that''s no excuse.', '오늘 일손이 좀 부족하긴 한데, 그게 핑계가 될 순 없죠.', 'B 대사'),
  (5, 'So how much longer will it be?', '그래서 얼마나 더 걸려요?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 7
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 7) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, I think there''s something wrong with my sandwich.', '저기요, 제 샌드위치에 뭔가 문제가 있는 것 같아요.', 'A 대사'),
  (2, 'I''m sorry about that. May I ask what the issue is?', '죄송합니다. 어떤 문제인지 여쭤봐도 될까요?', 'B 대사'),
  (3, 'I just noticed there''s some mold on the bread. Is it possible to get a refund?', '방금 봤는데 빵에 곰팡이가 있어요. 환불 받을 수 있을까요?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 8
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 8) and item_order > 3;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, I''d like to talk to someone in charge.', '저기요, 책임자분이랑 얘기하고 싶은데요.', 'A 대사'),
  (2, 'Of course. How can I help you?', '네, 물론이죠. 무엇을 도와드릴까요?', 'B 대사'),
  (3, 'One of the staff members made a comment that made me uncomfortable.', '직원 한 분이 한 말 때문에 좀 불편했어요.', 'A 대사'),
  (4, 'I''m really sorry to hear that. Would you mind telling me what was said?', '그런 일이 있었다니 정말 죄송해요. 어떤 말이었는지 말씀해 주실 수 있을까요?', 'B 대사'),
  (5, 'They made a comment about my background, and it felt inappropriate.', '제 출신에 대해 얘기했는데, 부적절하다고 느꼈어요.', 'A 대사'),
  (6, 'Thank you for telling me. That is unacceptable, and I sincerely apologize.', '말씀해 주셔서 감사해요. 그건 절대 있어선 안 되는 일이고, 진심으로 사과드립니다.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 9
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 9) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Isn''t this place a vibe?', '여기 분위기 진짜 좋지 않아?', 'A 대사'),
  (2, 'Yeah it is we''ve been here so long that was great', '응 맞아, 우리 여기 엄청 오래 있었네, 좋았어.', 'B 대사'),
  (3, 'Thank you guys. Thank you so much. No worries.', '고마워요. 정말 고마워요. 별말씀을요.', 'C 대사'),
  (4, '(They) don''t mind if you just hang around and have a chat They really just don''t mind like how long you stay', '(여기 사람들은) 그냥 앉아서 수다 떨어도 신경 안 써. 얼마나 오래 있든 진짜 상관 안 해.', 'A 대사'),
  (5, 'Are they..? Do you think they..', '그래..? 너는 저 사람들이..', 'B 대사'),
  (6, 'No they don''t mind', '아니, 신경 안 써.', 'A 대사'),
  (7, 'They don''t mind having you stay. You can just hang around', '우리 있어도 괜찮대. 그냥 편하게 있어도 돼.', 'A 대사'),
  (8, 'Do you think they..', '너는 저 사람들이..', 'B 대사'),
  (9, 'Can I get you guys anything else? So, anything else you guys would like to... We''re just close...', '더 필요한 거 있으세요? 그러니까, 더 주문하실 거... 저희 곧 마감이라...', 'C 대사'),
  (10, 'Can we get another coffee?', '커피 한 잔 더 주실 수 있어요?', 'A 대사'),
  (11, 'I was... I was.. that...', '나는... 나는.. 그거...', 'B 대사'),
  (12, 'Hang on sorry. What was it? sorry.', '잠깐만요, 죄송해요. 뭐라고 하셨죠? 죄송해요.', 'C 대사'),
  (13, 'Can I get a Large almond. Oh wait, no I''ll get a large soy... or should I get a small soy', '라지 아몬드로 주세요. 아 잠깐, 아니 라지 소이로 할게요... 아니면 스몰 소이로 할까?', 'A 대사'),
  (14, 'Get a.. get a soy..get a half soy and half skim', '그냥.. 소이로.. 반은 소이, 반은 저지방으로 해.', 'B 대사'),
  (15, 'You know what? we''ll just do takeaway. We''ll probably do that as takeaway sorry.', '그럼 이렇게 해요, 그냥 테이크아웃으로 할게요. 아마 테이크아웃으로 드려야 할 것 같아요, 죄송해요.', 'C 대사'),
  (16, 'Sorry. sorry while you ordering, could I just grab another one of those... um what was... the little pastry..', '죄송한데, 주문하시는 김에 저것도 하나 더 받을 수 있을까요... 음 그게 뭐였더라... 그 작은 페이스트리..', 'B 대사'),
  (17, 'Let just back and grab your order.', '잠깐 들어가서 주문하신 거 가져올게요.', 'C 대사'),
  (18, 'it''s like a little pastry... I think, I don''t know what it''s called? What are your pastries options?', '작은 페이스트리 같은 건데... 이름을 모르겠네요? 페이스트리 뭐 뭐 있어요?', 'B 대사'),
  (19, 'Umm we''ve got the large a Twix donut. So, I can get you one of those.', '음, 큰 트윅스 도넛 있어요. 그거 하나 드릴 수 있어요.', 'C 대사'),
  (20, 'Yes. Did you have the..', '네. 혹시 그거 있었나요..', 'B 대사'),
  (21, 'I think the chef''s just left. Actually it is 10:20', '셰프가 방금 퇴근한 것 같아요. 사실 지금 10시 20분이라서요.', 'C 대사'),
  (22, 'Are you guys closing soon?', '곧 문 닫으세요?', 'B 대사'),
  (23, 'Technically, we closed an hour ago.', '사실 한 시간 전에 마감했어요.', 'C 대사'),
  (24, 'Just get the donut man.', '그냥 도넛으로 줘요.', 'B 대사'),
  (25, 'Let me just grab.. Come on you bastard', '잠깐만 꺼낼게요.. 아 좀 나와라 이 녀석아.', 'C 대사'),
  (26, 'Yeah these guys are great. because I just stay as long as i need.', '응, 여기 사람들 진짜 좋아. 내가 원하는 만큼 그냥 있어도 되거든.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 10
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 10) and item_order > 26;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, do you have a second?', '저기, 잠깐 시간 돼?', 'A 대사'),
  (2, 'Yeah, what''s up?', '응, 왜?', 'B 대사'),
  (3, 'When you have a moment, could you take a look at this?', '시간 날 때 이것 좀 봐줄 수 있어?', 'A 대사'),
  (4, 'Sure, I have a lot on my plate today, but I''ll check that out later.', '그럼, 오늘 할 일이 좀 많긴 한데 이따 확인해 볼게.', 'B 대사'),
  (5, 'No rush at all, whenever you''re free is fine.', '전혀 급한 거 아니야, 편할 때 아무 때나 괜찮아.', 'A 대사'),
  (6, 'Cool just give me one sec.', '오케이, 잠깐만 기다려 줘.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 11
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 11) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, can you cover the meeting for me tomorrow? Just this once.', '야, 내일 회의 나 대신 들어가 줄 수 있어? 이번 한 번만.', 'A 대사'),
  (2, 'Well, it depends. If you''re taking me to lunch.', '음, 상황 봐서. 점심 사주면 생각해 볼게.', 'B 대사'),
  (3, 'Come on, you owe me. I couldn''t even take my day off last time. I was up almost all night because of you.', '에이, 너 나한테 빚 있잖아. 지난번에 나 쉬는 날도 못 쉬었어. 너 때문에 거의 밤샜다고.', 'A 대사'),
  (4, 'I know, I know. Let me check my schedule and get back to you.', '알아, 알아. 스케줄 확인해 보고 다시 말해줄게.', 'B 대사'),
  (5, 'You''re a legend. Lunch is on me!', '역시 최고야. 점심은 내가 쏠게!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 12
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 12) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, any chance you could help me wrap this up today?', '저기, 혹시 오늘 이거 마무리하는 것 좀 도와줄 수 있어?', 'A 대사'),
  (2, 'I''d love to, but I''m a bit swamped right now.', '도와주고 싶은데, 지금 일이 좀 밀려 있어서.', 'B 대사'),
  (3, 'It won''t be long.', '오래 안 걸릴 거야.', 'A 대사'),
  (4, 'I get that, but I don''t want to overpromise and let you down.', '그건 아는데, 괜히 된다고 했다가 실망시키고 싶지 않아서.', 'B 대사'),
  (5, 'Okay, that''s fair.', '그래, 그럴 만하다.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 13
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 13) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey Bethany, would it be okay if I took next Friday off?', '베서니, 다음 주 금요일에 쉬어도 괜찮을까요?', 'A 대사'),
  (2, 'Next Friday? We actually have a big catering order for a party. It''s going to be a bit hectic with all the prep.', '다음 주 금요일? 사실 그날 파티 케이터링 큰 주문이 있어. 준비할 게 많아서 좀 정신없을 거야.', 'B 대사'),
  (3, 'Oh, I see. I wasn''t aware of the catering job.', '아, 그렇군요. 케이터링 일 있는 줄 몰랐어요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 14
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 14) and item_order > 3;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'But I''ve already asked Margot, and she said she can cover my shift.', '근데 마고한테 이미 물어봤는데, 제 시프트 대신 해줄 수 있대요.', 'B 대사'),
  (2, 'If Margot is cool with handling the catering prep, then that''s no problem.', '마고가 케이터링 준비 맡는 거 괜찮다고 하면 문제없어.', 'A 대사'),
  (3, 'Perfect, thanks! I''ll double-check everything with her and update the roster.', '좋아요, 감사해요! 마고랑 다 한 번 더 확인하고 로스터 업데이트할게요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 15
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 15) and item_order > 3;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Oi! You must be the new one. Got your white card?', '어이! 네가 새로 온 친구구나. 화이트 카드 있지?', 'A 대사'),
  (2, 'Uh...yeah. Here you go.', '어... 네. 여기요.', 'B 대사'),
  (3, 'Good. First things first — PPE on at all times. Hard hat, hi-vis, steel caps. Yeah?', '좋아. 제일 중요한 거부터 — 보호장비는 항상 착용해. 안전모, 형광 조끼, 안전화. 알았지?', 'A 대사'),
  (4, 'Got it.', '알겠습니다.', 'B 대사'),
  (5, 'Watch your step around the scaffolding. It''s a bit dodgy over there. Don''t be a hero.', '비계 근처에선 발 조심해. 저쪽 좀 위험해. 괜히 무리하지 마.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 16
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 16) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Smoko time. Drop everything.', '쉬는 시간이다. 다 내려놔.', 'A 대사'),
  (2, 'Finally.', '드디어.', 'B 대사'),
  (3, 'After this we gotta knock out the brickwork by arvo. The chippie reckons it''ll take longer though.', '이거 끝나면 오후까지 벽돌 작업 끝내야 돼. 근데 목수는 더 걸릴 거래.', 'A 대사'),
  (4, 'How strict is Dave about the deadline?', '데이브가 마감 시간에 얼마나 엄격해요?', 'B 대사'),
  (5, 'Deadset strict. If we fall behind, he loses it.', '진짜 엄격해. 일정 밀리면 완전 폭발해.', 'A 대사'),
  (6, 'Right. No mucking around after smoko then.', '알겠어요. 그럼 쉬는 시간 끝나고는 딴짓 금지네요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 17
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 17) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Oi, who''s doing the Bunnings run? We''re out of screws.', '어이, 버닝스 누가 갔다 올래? 나사 다 떨어졌어.', 'A 대사'),
  (2, 'Where''s the gopher?', '심부름 담당 어디 갔어?', 'B 대사'),
  (3, 'Gone walkabout again.', '또 어디 사라졌어.', 'A 대사'),
  (4, 'Deadset bludger. Jisoo — you right to go?', '진짜 게으름뱅이네. 지수 — 네가 갔다 올 수 있어?', 'B 대사'),
  (5, 'Yeah, no worries. What do we need?', '네, 문제없어요. 뭐 필요해요?', 'C 대사'),
  (6, 'Box of 75mm screws. Cheers.', '75mm 나사 한 박스. 고마워.', 'B 대사'),
  (7, 'Noted.', '알겠습니다.', 'C 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 18
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 18) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Jisoo! What happened here? This is a bloody dog''s breakfast.', '지수! 여기 무슨 일이야? 완전 엉망진창이잖아.', 'A 대사'),
  (2, 'My bad. I''ll fix it right away.', '제 잘못이에요. 바로 고칠게요.', 'B 대사'),
  (3, 'You should''ve asked before you started.', '시작하기 전에 물어봤어야지.', 'A 대사'),
  (4, 'You''re right. Won''t happen again.', '맞아요. 다시는 이런 일 없을 거예요.', 'B 대사'),
  (5, 'No dramas. Just ask next time.', '괜찮아. 다음엔 그냥 물어봐.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 19
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 19) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Why do they keep hiring backpackers. They don''t know what they''re doing.', '왜 자꾸 워홀러들을 뽑는 거야. 뭘 하는지도 모르잖아.', 'A 대사'),
  (2, 'I heard that, Tom. I''m still learning, but I work hard. Give me a chance.', '다 들었어요, 톰. 아직 배우는 중이지만 열심히 해요. 기회 좀 주세요.', 'B 대사'),
  (3, 'Fair enough.', '그래, 알았어.', 'A 대사'),
  (4, 'Good on ya for standing up. He''s all bark, no bite.', '할 말 한 거 잘했어. 저 사람 말만 세지 별거 없어.', 'C 대사'),
  (5, 'She''ll be right, yeah?', '괜찮을 거야, 그치?', 'A 대사'),
  (6, 'Ha! now you''re talking.', '하! 이제야 말이 통하네.', 'C 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 20
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 20) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Jisoo, grab a snag off the barbie.', '지수, 바비큐에서 소시지 하나 집어 가.', 'A 대사'),
  (2, 'Already on it.', '이미 먹고 있어요.', 'B 대사'),
  (3, 'Fair dinkum, this weather''s unreal. Stoked it''s not raining. Perfect arvo for it.', '진짜 날씨 끝내준다. 비 안 와서 완전 신나. 이런 거 하기 딱 좋은 오후야.', 'A 대사'),
  (4, 'Your backyard is massive.', '뒷마당 엄청 넓네요.', 'B 대사'),
  (5, 'Cheers! Grab a coldie from the esky.', '고마워! 아이스박스에서 시원한 맥주 하나 꺼내.', 'A 대사'),
  (6, 'Esky?', '에스키요?', 'B 대사'),
  (7, 'The cooler box. It''s full.', '아이스박스. 꽉 차 있어.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 21
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 21) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'This flat white is spot on.', '이 플랫화이트 완전 딱이야.', 'A 대사'),
  (2, 'Yeah, they know what they''re doing.', '응, 여기 진짜 잘해.', 'B 대사'),
  (3, 'Keen on footy?', '풋티 좋아해?', 'A 대사'),
  (4, 'Yeah, heaps. I watch it every weekend.', '응, 엄청. 주말마다 봐.', 'B 대사'),
  (5, 'Nice. Which team do you go for?', '좋다. 어느 팀 응원해?', 'A 대사'),
  (6, 'The Magpies.', '맥파이스.', 'B 대사'),
  (7, 'Fair dinkum? Same here.', '진짜? 나도야.', 'A 대사'),
  (8, 'No way!', '말도 안 돼!', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 22
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 22) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How''s it going, mate?', '잘 지내, 친구?', 'A 대사'),
  (2, 'Yeah good, you?', '응 좋아, 너는?', 'B 대사'),
  (3, 'Bit dusty. Didn''t sleep well.', '좀 피곤해. 잠을 잘 못 잤어.', 'A 대사'),
  (4, 'Skip brekkie again?', '또 아침 걸렀어?', 'B 대사'),
  (5, 'Nah, grabbed something from Maccas on the way.', '아니, 오는 길에 맥도날드에서 뭐 하나 사 먹었어.', 'A 대사'),
  (6, 'Barbie at mine this arvo, yeah? Emma''s coming.', '오늘 오후에 우리 집에서 바비큐 하자, 알았지? 엠마도 와.', 'B 대사'),
  (7, 'Ripper. I''ll bring tinnies.', '최고다. 캔맥주 챙겨 갈게.', 'A 대사'),
  (8, 'Cheers, legend.', '고마워, 최고야.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 23
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 23) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Jason! Grab us a goon bag if you''re at the bottle shop.', '제이슨! 보틀샵 가면 군 백 하나만 사다 줘.', 'A 대사'),
  (2, 'Goon? You sure? That stuff''s rough.', '군? 진짜? 그거 맛 별론데.', 'B 대사'),
  (3, 'Ha! Look at you, already a local.', '하! 너 좀 봐, 벌써 현지인 다 됐네.', 'A 대사'),
  (4, 'I learned the hard way. Week one.', '호되게 배웠지. 첫 주에.', 'B 대사'),
  (5, 'Crikey, first week on goon. You''re basically Aussie now.', '세상에, 첫 주부터 군이라니. 너 이제 거의 호주 사람이다.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 24
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 24) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, excuse me.', '저기요, 실례합니다.', 'A 대사'),
  (2, 'What the fuck, huh? Smoko''s already over? what?', '뭐야 씨, 응? 벌써 쉬는 시간 끝났어? 뭐?', 'B 대사'),
  (3, 'I just want some directions. Can you help me?', '그냥 길 좀 물어보려고요. 도와주실 수 있어요?', 'A 대사'),
  (4, 'Fuckin'' chockers right now, mate. But where do you need to go, love?', '지금 존나 바쁜데. 그래도 어디 가야 되는데, 아가씨?', 'B 대사'),
  (5, 'Do you know where the train station is?', '기차역 어딘지 아세요?', 'A 대사'),
  (6, 'Fuck me mate, haven''t been on the train for 20 years ka. Taking train? Go down... um... There''s a roundabout just down there. Just fuckin'' chuck a left there. There''s a Chook shop just up the road. Just chuck a right on that one and then, uh... There''s a servo on the left. Shortcut through the servo just up there, mate. Yeah, fuckin'' fair dinkum ka.', '와 씨, 나 기차 안 탄 지 20년은 됐는데. 기차 타려고? 쭉 내려가서... 음... 저 아래 로터리 있어. 거기서 그냥 왼쪽으로 꺾어. 길 따라 좀 올라가면 치킨집 있거든. 거기서 오른쪽으로 꺾고, 어... 왼쪽에 주유소 있어. 저 위 주유소 가로질러서 지름길로 가. 응, 진짜라니까.', 'B 대사'),
  (7, 'Uh, okay. How long does that take?', '어, 네. 그거 얼마나 걸려요?', 'A 대사'),
  (8, 'Oh yeah, just be another 48 months or so. But umm..just waiting for that union strike to finish, then, uh... Once they pay up, get more of that shit we deserve, aye. That fuckin'' dosh. It''ll just be another 48 months after that one.', '아 그거, 한 48개월 정도 더 걸릴 거야. 근데 음.. 노조 파업 끝나길 기다리는 중이라, 그러고 나서, 어... 돈 주면, 우리가 받을 만큼 더 받아내고, 그치. 그 망할 돈. 그다음에 또 48개월 걸리겠지.', 'B 대사'),
  (9, 'I mean how long does it take to go to the train station?', '제 말은 기차역까지 가는 데 얼마나 걸리냐고요.', 'A 대사'),
  (10, 'Oh, not too long, love, but um... Got important work to do here. Council needs me to do the job. Roads aren''t gonna fix itself, mate.', '아, 얼마 안 걸려, 아가씨. 근데 음... 나 여기서 중요한 일 해야 돼. 시청에서 이 일 하라고 했거든. 도로가 알아서 고쳐지진 않잖아.', 'B 대사'),
  (11, 'Okay.', '네...', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 25
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 25) and item_order > 11;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, it''s getting busy. Can you clear the patio tables and then check the oat milk stock?', '저기, 점점 바빠지네. 야외 테이블 좀 치우고 오트밀크 재고 확인해 줄래?', 'A 대사'),
  (2, 'I''m on it. I''ll clear the tables first.', '바로 할게요. 테이블부터 치울게요.', 'B 대사'),
  (3, 'Also, we need more sugar sticks at the condiment bar.', '그리고 소스 바에 설탕 스틱 더 채워야 돼.', 'A 대사'),
  (4, 'Understood. I''ll refill those right after I check the milk.', '알겠어요. 우유 확인하고 바로 채워 놓을게요.', 'B 대사'),
  (5, 'Perfect, thanks.', '좋아, 고마워.', 'A 대사'),
  (6, 'I''ll let you know if we''re running low on anything.', '뭐 떨어져 가는 거 있으면 말씀드릴게요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 26
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 26) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'She says the latte was supposed to be iced. Did you take this order?', '손님이 라떼 아이스로 시켰다는데. 네가 이 주문 받았어?', 'A 대사'),
  (2, 'I reckon there''s been a misunderstanding. I didn''t take the order.', '뭔가 오해가 있는 것 같아요. 그 주문 제가 안 받았어요.', 'B 대사'),
  (3, 'Oh, who was on the till then?', '아, 그럼 그때 계산대에 누가 있었어?', 'A 대사'),
  (4, 'I guess Chloe was on the till. I''ve been on the machine the whole time.', '아마 클로이가 계산대에 있었을 거예요. 저는 계속 커피 머신 쪽에 있었어요.', 'B 대사'),
  (5, 'I see. The docket says "hot" though.', '그렇구나. 근데 주문서엔 "핫"이라고 돼 있는데.', 'A 대사'),
  (6, 'You gotta be kidding me... I''m getting told off for this? I didn''t even take the order.', '말도 안 돼... 이걸로 제가 혼나는 거예요? 주문도 제가 안 받았는데.', 'B 대사'),
  (7, 'Looks like there''s a typo on the docket. I''ll remake it as an iced latte.', '주문서에 오타가 있었나 보네. 아이스 라떼로 다시 만들게.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 27
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 27) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Can you help me with the deep cleaning in the back?', '뒤쪽 대청소 좀 도와줄 수 있어?', 'A 대사'),
  (2, 'Sure. What should I do first? Start with the floors or the fridge?', '그럼요. 뭐부터 할까요? 바닥부터 할까요, 냉장고부터 할까요?', 'B 대사'),
  (3, 'Let''s do the fridge first. It takes longer.', '냉장고부터 하자. 그게 더 오래 걸려.', 'A 대사'),
  (4, 'When does this need to be done by?', '언제까지 끝내야 돼요?', 'B 대사'),
  (5, 'It has to be done before 9.', '9시 전에는 끝내야 돼.', 'A 대사'),
  (6, 'One more thing, who should I contact about the cleaning supplies? We''re almost out of sanitizer.', '하나 더요, 청소용품은 누구한테 연락하면 돼요? 소독제가 거의 다 떨어졌어요.', 'B 대사'),
  (7, 'Can you jot that down for me?', '그거 좀 적어 줄래?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 28
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 28) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey Emma, just now a customer asked for three hundred cash out. I didn''t know what it was so I just said we couldn''t do it.', '엠마, 방금 손님이 캐시아웃 300달러 해달라고 했는데. 그게 뭔지 몰라서 그냥 안 된다고 했어요.', 'A 대사'),
  (2, 'Wait, three hundred?', '잠깐, 300달러?', 'B 대사'),
  (3, 'Yeah. He said it was standard.', '네. 원래 다 그렇게 한다던데요.', 'A 대사'),
  (4, 'Good thing you didn''t.', '안 해준 게 다행이다.', 'B 대사'),
  (5, 'Why? Is cash out not a thing?', '왜요? 캐시아웃이 원래 없는 거예요?', 'A 대사'),
  (6, 'Cash out''s a thing mate. But fifty, maybe a hundred max. Three hundred is a massive red flag.', '캐시아웃은 있지. 근데 50달러, 많아야 100달러까지야. 300달러는 완전 수상한 거야.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 29
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 29) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'You''re on painting today. Start with the top floor.', '너 오늘 페인트칠 담당이야. 맨 위층부터 시작해.', 'A 대사'),
  (2, 'Copy that. Just to confirm, interior only, or are we hitting the exterior too?', '알겠습니다. 확인차 여쭤보는데, 실내만 해요, 아니면 외벽도 해요?', 'B 대사'),
  (3, 'Interior only for now.', '일단은 실내만.', 'A 대사'),
  (4, 'Any specific color order, or should I just work my way through?', '색깔 순서 정해진 거 있어요, 아니면 그냥 알아서 차례대로 할까요?', 'B 대사'),
  (5, 'Start with white. Everything else is clearly tagged.', '흰색부터 해. 나머지는 다 표시돼 있어.', 'A 대사'),
  (6, 'That''s what I''m talking about. Now we''re talking.', '바로 그거죠. 이제 좀 말이 통하네요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 30
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 30) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Did you guys go out without me?', '너네 나 빼고 놀러 갔어?', 'A 대사'),
  (2, 'Oh, I didn''t think you''d be interested, so I didn''t ask.', '아, 너는 관심 없을 줄 알고 안 물어봤어.', 'B 대사'),
  (3, 'I mean... that kind of hurts, not gonna lie.', '아니 뭐... 솔직히 좀 서운하긴 하다.', 'A 대사'),
  (4, 'I didn''t mean it like that.', '그런 뜻은 아니었어.', 'B 대사'),
  (5, 'I know you didn''t. But it would''ve been nice to be asked, even if I said no.', '알아. 근데 내가 안 간다고 했더라도 물어봐 줬으면 좋았을 것 같아.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 31
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 31) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Did you see the team meeting today? Dave presented the whole plan the one I put together.', '오늘 팀 미팅 봤어? 데이브가 내가 짠 계획을 통째로 발표하더라.', 'A 대사'),
  (2, 'Yeah, I noticed. Did he mention you?', '응, 봤어. 네 얘기는 했어?', 'B 대사'),
  (3, 'Once. At the end. Kind of in passing.', '한 번. 마지막에. 그냥 지나가듯이.', 'A 대사'),
  (4, 'That''s not great.', '그건 좀 별로다.', 'B 대사'),
  (5, 'I''m not angry. I just feel a bit... overlooked.', '화난 건 아니야. 그냥 좀... 무시당한 기분이야.', 'A 대사'),
  (6, 'That''s fair. You should say something to him.', '그럴 만하지. 걔한테 한마디 해.', 'B 대사'),
  (7, 'I know. I just needed to say it out loud first.', '알아. 그냥 일단 입 밖으로 한번 말해보고 싶었어.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 32
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 32) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'He''s just a backpacker. What would he know.', '걔 그냥 워홀러잖아. 걔가 뭘 알겠어.', 'A 대사'),
  (2, 'I feel like Tom looks down on me.', '톰이 나 무시하는 것 같아.', 'B 대사'),
  (3, 'Yeah. He does that to everyone new. Don''t take it personally.', '응. 걔 새로 온 사람한테 다 그래. 너무 신경 쓰지 마.', 'C 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 33
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 33) and item_order > 3;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Wow. Beautiful work, mate.', '와. 작품이네, 친구.', 'A 대사'),
  (2, 'Oh, thanks! I tried to—', '오, 고마워! 나름 해보려고—', 'B 대사'),
  (3, 'I''m joking. It''s completely crooked.', '농담이야. 완전 삐뚤어졌어.', 'A 대사'),
  (4, '...Wait. Are you being sarcastic just now?', '...잠깐. 방금 그거 비꼰 거야?', 'B 대사'),
  (5, 'Yeah, mate. The whole thing needs to be redone.', '어, 친구. 전부 다시 해야 돼.', 'A 대사'),
  (6, 'Okay. I genuinely could not tell.', '아. 진짜 전혀 몰랐어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 34
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 34) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, you said you''d cover my shift Saturday.', '야, 토요일에 내 시프트 대신 해준다며.', 'A 대사'),
  (2, 'Oh... yeah, I actually can''t anymore.', '아... 맞다, 근데 이제 못 하게 됐어.', 'B 대사'),
  (3, 'Wait — you''re telling me this now? It''s Thursday.', '잠깐, 그걸 지금 말한다고? 오늘 목요일이야.', 'A 대사'),
  (4, 'Something came up, mate. Sorry.', '일이 좀 생겼어. 미안.', 'B 대사'),
  (5, 'You gotta be kidding me. I turned down other plans because of this. You can''t just do that.', '장난하냐. 나 이것 때문에 다른 약속도 거절했어. 이러면 안 되지.', 'A 대사'),
  (6, 'I said I''m sorry—', '미안하다고 했잖아—', 'B 대사'),
  (7, 'Sorry doesn''t fix my Saturday.', '미안하다고 내 토요일이 해결되진 않잖아.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 35
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 35) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So, what did you study back home?', '그래서, 한국에선 뭐 전공했어?', 'A 대사'),
  (2, 'I majored in business administration.', '경영학 전공했어.', 'B 대사'),
  (3, 'Cool! What kind of jobs did you do before coming here?', '오 좋네! 여기 오기 전엔 무슨 일 했어?', 'A 대사'),
  (4, 'I worked at a marketing company for about two years.', '마케팅 회사에서 2년 정도 일했어.', 'B 대사'),
  (5, 'Nice. So what brought you here?', '좋네. 그럼 여긴 어떻게 오게 된 거야?', 'A 대사'),
  (6, 'I wanted a change. I was a bit burnt out, honestly.', '변화가 필요했어. 솔직히 좀 번아웃 왔었거든.', 'B 대사'),
  (7, 'Fair enough. Best decision you made?', '그럴 만하지. 인생 최고의 결정이었어?', 'A 대사'),
  (8, 'Getting on that plane. Hundred percent.', '그 비행기 탄 거. 백 퍼센트.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 36
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 36) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'You seem pretty settled in now. You planning to stay long?', '이제 꽤 자리 잡은 것 같네. 오래 있을 계획이야?', 'A 대사'),
  (2, 'Not sure yet. Maybe a year? I''d love to travel around before I go back.', '아직 모르겠어. 한 1년? 돌아가기 전에 여기저기 여행 다니고 싶어.', 'B 대사'),
  (3, 'What you hoping to get out of it?', '여기서 뭘 얻어가고 싶은데?', 'A 대사'),
  (4, 'Just... proper life experience, I guess. And honestly, confidence. And maybe save some money and improve my English too.', '그냥... 제대로 된 인생 경험? 그리고 솔직히 자신감. 돈도 좀 모으고 영어도 늘리고.', 'B 대사'),
  (5, 'Yeah, coming here solo takes guts.', '그치, 혼자 여기 오는 거 용기 필요하지.', 'A 대사'),
  (6, 'I was nervous at first, but I''m glad I made it here.', '처음엔 긴장했는데, 여기 오길 잘한 것 같아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 37
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 37) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Are you planning to go back to marketing?', '다시 마케팅 쪽으로 돌아갈 생각이야?', 'A 대사'),
  (2, 'I''m on the fence I''m kind of thinking about doing something more hands-on.', '아직 고민 중이야. 좀 더 몸으로 하는 일을 해볼까 생각 중이야.', 'B 대사'),
  (3, 'Like what?', '예를 들면?', 'A 대사'),
  (4, 'I don''t know yet. That''s kind of the whole point of coming here...to figure it out.', '아직 몰라. 그걸 알아내려고 여기 온 거기도 하고.', 'B 대사'),
  (5, 'That makes a lot of sense.', '완전 이해돼.', 'A 대사'),
  (6, 'Yeah. Back home, everyone''s got a plan. Here, it''s okay to not know.', '응. 한국에선 다들 계획이 있잖아. 여기선 몰라도 괜찮아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 38
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 38) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So what do you do for fun?', '그래서 쉴 때 뭐 하고 놀아?', 'A 대사'),
  (2, 'I''m really into hiking. Got into it properly since coming here.', '하이킹에 완전 빠졌어. 여기 와서 제대로 시작했어.', 'B 대사'),
  (3, 'Yeah? Where''ve you been?', '그래? 어디 가봤어?', 'A 대사'),
  (4, 'Blue Mountains last weekend. Honestly blew my mind.', '지난 주말에 블루마운틴. 진짜 대박이었어.', 'B 대사'),
  (5, 'That place is unreal. You should do the Grampians next.', '거기 미쳤지. 다음엔 그램피언스 가봐.', 'A 대사'),
  (6, 'Already on my list.', '이미 리스트에 있어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 39
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 39) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Do you cook much?', '요리 자주 해?', 'A 대사'),
  (2, 'Yeah, I love cooking Korean food. It''s kind of my thing.', '응, 한식 해 먹는 거 좋아해. 약간 내 특기야.', 'B 대사'),
  (3, 'Like what?', '어떤 거?', 'A 대사'),
  (4, 'Mainly stews, fried rice, stuff like that. Simple, but it''s good though. I''ll make you something. It might be spicy.', '주로 찌개, 볶음밥 같은 거. 간단한데 맛있어. 내가 하나 해줄게. 좀 매울 수도 있어.', 'B 대사'),
  (5, 'Apparently, Korean food is super spicy. But bummer — I can''t handle spicy food.', '한국 음식 엄청 맵다며. 근데 아쉽게도 나 매운 거 못 먹어.', 'A 대사'),
  (6, 'Don''t worry about it. I''ll go easy on you.', '걱정 마. 덜 맵게 해줄게.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 40
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 40) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Do you have any plans for this weekend?', '이번 주말에 뭐 해?', 'A 대사'),
  (2, 'Not really. Why?', '딱히. 왜?', 'B 대사'),
  (3, 'I was thinking... maybe we could grab dinner. Just the two of us.', '생각해봤는데... 저녁이나 같이 먹을까 해서. 우리 둘이서만.', 'A 대사'),
  (4, 'Wait... are you asking me out?', '잠깐... 지금 나한테 데이트 신청하는 거야?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 41
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 41) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'That was so awesome. I love spending time with you. You wanna get something to eat?', '진짜 재밌었다. 너랑 있는 거 너무 좋아. 뭐 좀 먹으러 갈래?', 'A 대사'),
  (2, 'Uh, can we actually talk?', '어, 우리 얘기 좀 할 수 있을까?', 'B 대사'),
  (3, 'Oh, y..you wanna talk about...', '아, 어... 무슨 얘기...?', 'A 대사'),
  (4, 'Us.', '우리.', 'B 대사'),
  (5, 'Us?', '우리?', 'A 대사'),
  (6, 'Yeah, I just wanna talk about where we are.', '응, 우리 지금 무슨 사이인지 얘기하고 싶어.', 'B 대사'),
  (7, 'Um, yeah, so what did you wanna talk about?', '음, 그래, 그래서 무슨 얘기 하고 싶은데?', 'A 대사'),
  (8, 'I think I''m catching feelings. Are you seeing other people?', '나 너한테 마음이 생기는 것 같아. 너 다른 사람도 만나?', 'B 대사'),
  (9, 'Am I seeing other people right now?', '내가 지금 다른 사람 만나냐고?', 'A 대사'),
  (10, 'Yeah, ''cause I''m only seeing you.', '응, 난 너만 만나고 있으니까.', 'B 대사'),
  (11, 'I''m seeing you. You''re, like, my favorite.', '나 너 만나고 있잖아. 넌 뭐랄까, 내 최애야.', 'A 대사'),
  (12, 'Your favorite?', '최애?', 'B 대사'),
  (13, 'Yeah, like I told you, you''re special.', '응, 말했잖아, 넌 특별하다고.', 'A 대사'),
  (14, 'I feel like you''re just saying that.', '그냥 하는 말 같은데.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 42
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 42) and item_order > 14;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''ve never spent this much time with someone.', '나 누구랑 이렇게 오래 시간 보낸 적 처음이야.', 'A 대사'),
  (2, 'Yeah, but I, like, really like you.', '응, 근데 나는 너 진짜 좋아해.', 'B 대사'),
  (3, 'You know, I like what we have right now. Don''t you think? Like, I get to spend time with you, we get to do cute things. And, you know, like, I''m just so busy with work and things like that. I just don''t know if I have time for a relationship. And, you know, I just wouldn''t feel right if I couldn''t put all my energy and time into you. That wouldn''t be fair to you. I just love what we have right now. Don''t you think it''s good?', '있잖아, 난 지금 우리 관계가 좋아. 안 그래? 너랑 시간도 보내고, 귀여운 것도 같이 하고. 근데 나 일 같은 거 때문에 너무 바빠서. 연애할 시간이 있을지 모르겠어. 그리고 너한테 내 에너지랑 시간을 다 쏟지 못하면 마음이 편치 않을 것 같아. 그건 너한테 불공평하잖아. 난 그냥 지금 우리가 좋아. 좋지 않아?', 'A 대사'),
  (4, 'I don''t know if I can keep doing this.', '계속 이렇게 할 수 있을지 모르겠어.', 'B 대사'),
  (5, 'Oh, you need some space? I''ll give you some space. So should I see you in two weeks instead of one? Is that good enough?', '아, 좀 거리 두고 싶어? 그럼 시간 줄게. 일주일 말고 2주에 한 번 볼까? 그 정도면 돼?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 43
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 43) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So after last night... what are we?', '그래서 어젯밤 이후로... 우리 무슨 사이야?', 'A 대사'),
  (2, 'What do you want us to be?', '넌 우리가 무슨 사이였으면 좋겠는데?', 'B 대사'),
  (3, 'come on, I asked first.', '에이, 내가 먼저 물어봤잖아.', 'A 대사'),
  (4, 'I want to be with you. Like, officially.', '너랑 사귀고 싶어. 공식적으로.', 'B 대사'),
  (5, 'Then I guess we''re together now.', '그럼 이제 우리 사귀는 거네.', 'A 대사'),
  (6, 'For real?', '진짜?', 'B 대사'),
  (7, 'For real!', '진짜!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 44
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 44) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Are you two actually together now?', '너네 둘 진짜 사귀는 거야?', 'A 대사'),
  (2, 'Yeah... we just made it official last week.', '응... 지난주에 공식적으로 사귀기 시작했어.', 'B 대사'),
  (3, 'I knew it. I totally called it. Jake, owes me twenty bucks.', '그럴 줄 알았어. 내 말이 맞았지. 제이크 나한테 20불 줘야 돼.', 'A 대사'),
  (4, 'Seriously? You guys were betting on us?', '진짜? 너네 우리 갖고 내기했어?', 'B 대사'),
  (5, 'So, how long have you guys been seeing each other now?', '그래서, 너네 만난 지 얼마나 됐어?', 'A 대사'),
  (6, 'It''s been only a couple of months. We were just taking it slow.', '이제 겨우 두어 달? 그냥 천천히 가고 있었어.', 'B 대사'),
  (7, 'Yeah... guess it was about time.', '그래... 이제 그럴 때도 됐지.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 45
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 45) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So, the boy I would like to couple up with is... Reid.', '그래서, 내가 커플이 되고 싶은 남자는... 리드야.', 'A 대사'),
  (2, 'Kirra, how you feeling darling?', '키라, 기분 어때 자기?', 'B 대사'),
  (3, 'It is what it is. I expected.', '어쩔 수 없지 뭐. 예상했어.', 'C 대사'),
  (4, 'Yeah? Did you see it coming?', '그래? 이렇게 될 줄 알았어?', 'A 대사'),
  (5, 'Oh from a mile away.', '어, 진작부터 보였지.', 'C 대사'),
  (6, 'Really?', '진짜?', 'A 대사'),
  (7, '100%. She stole my problem not my man.', '100%. 걔가 가져간 건 내 남자가 아니라 내 골칫거리야.', 'C 대사'),
  (8, 'I need that on T-shirt.', '그 말 티셔츠에 새겨야겠다.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 46
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 46) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey... can I ask you something?', '있잖아... 뭐 하나 물어봐도 돼?', 'A 대사'),
  (2, 'Yeah, what''s up?', '응, 왜?', 'B 대사'),
  (3, 'I feel like something''s been off lately.', '요즘 뭔가 좀 이상한 것 같아.', 'A 대사'),
  (4, 'What do you mean?', '무슨 말이야?', 'B 대사'),
  (5, 'You''ve been distant. Are you seeing someone else?', '너 요즘 좀 멀게 느껴져. 다른 사람 만나?', 'A 대사'),
  (6, 'No, why would you think that?', '아니, 왜 그렇게 생각해?', 'B 대사'),
  (7, 'I don''t know... I just feel it.', '모르겠어... 그냥 그런 느낌이 들어.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 47
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 47) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How long has this been going on?', '이거 언제부터 그랬던 거야?', 'A 대사'),
  (2, 'Does it matter?', '그게 중요해?', 'B 대사'),
  (3, 'It matters to me.', '나한텐 중요해.', 'A 대사'),
  (4, 'Want some tea? I heard that Emily''s boyfriend cheated on her.', '가십 하나 들을래? 에밀리 남친이 바람피웠대.', 'A 대사'),
  (5, 'Seriously? I thought he was a good guy.', '진짜? 괜찮은 애인 줄 알았는데.', 'B 대사'),
  (6, 'Yeah, apparently not.', '응, 아닌가 봐.', 'A 대사'),
  (7, 'Speaking of the devil, here he comes.', '호랑이도 제 말 하면 온다더니, 저기 온다.', 'B 대사'),
  (8, 'Wow... this is awkward.', '와... 이거 어색하다.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 48
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 48) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'That was so fun.', '진짜 재밌었다.', 'A 대사'),
  (2, 'Yeah, it was super fun.', '응, 완전 재밌었어.', 'B 대사'),
  (3, 'We gotta do it again.', '우리 이거 또 해야 돼.', 'A 대사'),
  (4, 'Yeah, I''d love to.', '응, 나도 좋아.', 'B 대사'),
  (5, 'Cool.', '좋아.', 'A 대사'),
  (6, 'Cool.', '좋아.', 'B 대사'),
  (7, 'Um, I''m actually gonna go this way.', '음, 난 사실 이쪽으로 가.', 'A 대사'),
  (8, 'Oh, I gotta go this way.', '아, 난 이쪽으로 가야 돼.', 'B 대사'),
  (9, 'Okay.', '그래.', 'A 대사'),
  (10, 'But I''ll see you later.', '근데 나중에 또 보자.', 'B 대사'),
  (11, 'Yeah.', '응.', 'A 대사'),
  (12, 'All right, get home safe.', '그래, 조심히 들어가.', 'B 대사'),
  (13, 'Cool, you too.', '응, 너도.', 'A 대사'),
  (14, 'Bye.', '안녕.', 'B 대사'),
  (15, 'Bye.', '안녕.', 'A 대사'),
  (16, 'Oh my gosh, Char, it was, like, so good.', '세상에, 샤, 진짜 너무 좋았어.', 'B 대사'),
  (17, 'Like, husband level good?', '뭐, 남편감 수준으로 좋았어?', 'C 대사'),
  (18, 'Yeah. I mean, honestly, he, like, checks all the boxes. He''s got the super comfortable, super confident vibe about him. He''s super successful and put together and...', '응. 솔직히 말하면 걔 조건을 다 갖췄어. 엄청 편안하고 엄청 자신감 있는 분위기가 있어. 완전 성공했고 단정하고 깔끔하고...', 'B 대사'),
  (19, 'Hey, Lily, are you there?', '야, 릴리, 듣고 있어?', 'C 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 49
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 49) and item_order > 19;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey... what''s eating you? You''ve been off all day.', '야... 무슨 고민 있어? 하루 종일 좀 이상하던데.', 'A 대사'),
  (2, 'I don''t know... I think my boyfriend''s acting weird.', '모르겠어... 남자친구가 좀 이상하게 구는 것 같아.', 'B 대사'),
  (3, 'Weird how?', '어떻게 이상한데?', 'A 대사'),
  (4, 'Like... he''s been MIA every night lately.', '그게... 요즘 매일 밤 연락이 안 돼.', 'B 대사'),
  (5, 'Wow, that''s a huge red flag.', '와, 그거 완전 위험 신호인데.', 'A 대사'),
  (6, 'I know... I''m kinda scared. I''m really sus right now.', '그러니까... 좀 무서워. 지금 진짜 의심스러워.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 50
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 50) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey! I don''t think we''ve met before. I''m Emma.', '안녕! 우리 처음 보는 것 같은데. 난 엠마야.', 'A 대사'),
  (2, 'I''m Adrian. I feel like I''m the only one here who doesn''t know anyone.', '난 에이드리언이야. 여기서 아는 사람 없는 게 나밖에 없는 것 같아.', 'B 대사'),
  (3, 'Same, honestly. I''m just here because Liam dragged me.', '솔직히 나도 그래. 리암이 끌고 와서 온 거야.', 'A 대사'),
  (4, 'Honestly? I''m kinda just here for the food.', '솔직히? 난 그냥 음식 먹으러 온 거야.', 'A 대사'),
  (5, 'Same. Is it weird that I already want to leave?', '나도. 벌써 가고 싶은 거 이상한가?', 'B 대사'),
  (6, 'Welcome to the club.', '나도 마찬가지야.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 51
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 51) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'The vibe here is amazing. I love the music. Right?', '여기 분위기 진짜 좋다. 음악 완전 좋아. 그치?', 'A 대사'),
  (2, 'I didn''t expect this many people.', '사람이 이렇게 많을 줄 몰랐어.', 'B 대사'),
  (3, 'How do you know Liam by the way?', '근데 리암이랑은 어떻게 아는 사이야?', 'A 대사'),
  (4, 'We used to work together. Construction site. He''s my senior.', '예전에 같이 일했어. 공사 현장에서. 내 선배야.', 'B 대사'),
  (5, 'Oh nice. How long have you been in Sydney?', '오 좋네. 시드니엔 온 지 얼마나 됐어?', 'B 대사'),
  (6, 'About four months. Still finding my feet.', '한 4개월쯤. 아직 적응 중이야.', 'A 대사'),
  (7, 'Four months is nothing. Give it another two. Take your time. No rush.', '4개월이면 아무것도 아니지. 두 달만 더 있어 봐. 천천히 해. 서두를 거 없어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 52
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 52) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Wait wait wait — you don''t wanna eat that. There''s mould on it. Look at the corner.', '잠깐 잠깐 잠깐 — 그거 먹지 마. 곰팡이 폈어. 모서리 봐봐.', 'A 대사'),
  (2, 'Oh that''s gross.', '으, 역겨워.', 'B 대사'),
  (3, 'Close call.', '큰일 날 뻔했다.', 'A 대사'),
  (4, 'I literally almost ate that.', '나 진짜 그거 먹을 뻔했어.', 'B 대사'),
  (5, 'And now you didn''t. You''re welcome.', '근데 안 먹었잖아. 고마운 줄 알아.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 53
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 53) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So I was trying to say... 답답한? Like when you can''t express yourself and it''s frustrating.', '그러니까 내가 하려던 말이... ''답답한''? 내 생각을 표현 못 해서 속 터질 때 있잖아.', 'A 대사'),
  (2, 'Oh — frustrated? Or like, stuck?', '아 — frustrated? 아니면 stuck 같은 거?', 'B 대사'),
  (3, 'Both, kind of. Like the feeling when the word is right there but you can''t get it out.', '둘 다 좀. 단어가 바로 떠오를 것 같은데 안 나오는 그 느낌 있잖아.', 'A 대사'),
  (4, '"It''s on the tip of my tongue."', '"혀끝에서 맴돈다."', 'B 대사'),
  (5, 'Yes. Exactly that.', '응. 딱 그거야.', 'A 대사'),
  (6, 'That happens to me in Japanese constantly.', '나도 일본어 할 때 맨날 그래.', 'B 대사'),
  (7, 'Good to know it''s not just me.', '나만 그런 게 아니라니 다행이다.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 54
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 54) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Oh my God. Guess what?', '세상에. 있잖아, 맞혀 봐.', 'A 대사'),
  (2, 'What now?', '이번엔 또 뭔데?', 'B 대사'),
  (3, 'I''ve met someone.', '나 누구 만났어.', 'A 대사'),
  (4, 'Another one already? Wow.', '벌써 또? 와.', 'B 대사'),
  (5, 'No, that''s wild. It''s different this time, I swear. He''s a really nice guy.', '아니, 그건 너무하다. 이번엔 진짜 달라, 맹세해. 진짜 착한 남자야.', 'A 대사'),
  (6, 'Well, you''ve said that before.', '글쎄, 전에도 그렇게 말했잖아.', 'B 대사'),
  (7, 'I think he might be the one.', '이 사람이 내 운명일지도 몰라.', 'A 대사'),
  (8, 'Oh my god.', '아이고 맙소사.', 'B 대사'),
  (9, 'Um, so what do you do with yourself, Emily?', '음, 그래서 에밀리는 뭐 하고 지내?', 'C 대사'),
  (10, 'So Daddy just got me a job in the office.', '아빠가 사무실에 일자리 하나 구해 줬어.', 'A 대사'),
  (11, 'Oh, wow.', '오, 와.', 'C 대사'),
  (12, 'Yes, I''m living my corporate baddie era. Do you know what I mean?', '응, 나 요즘 잘나가는 직장녀 시절 보내는 중이야. 무슨 말인지 알지?', 'A 대사'),
  (13, 'Yes. Yeah, I love a girl in uniform.', '응. 그래, 난 유니폼 입은 여자 좋아해.', 'C 대사'),
  (14, 'Do you?', '그래?', 'B 대사'),
  (15, 'Or out of one.', '아니면 벗은 여자도.', 'C 대사'),
  (16, 'Oh my God, stop. You''re so naughty.', '세상에, 그만해. 너 진짜 짓궂다.', 'B 대사'),
  (17, 'One of the two.', '둘 중 하나지.', 'C 대사'),
  (18, 'And he''s just, like, so observant. Yeah, literally obsessed with me.', '그리고 그 사람 진짜 세심해. 응, 완전 나한테 푹 빠졌어.', 'B 대사'),
  (19, 'So what does he do for work?', '그래서 그 사람 무슨 일 해?', 'A 대사'),
  (20, 'You''ll never believe it.', '들으면 절대 못 믿을걸.', 'B 대사'),
  (21, 'So what about yourself, Will? What do you do to earn a crumb?', '그럼 윌 너는? 너는 뭐 해서 밥벌이해?', 'B 대사'),
  (22, 'Earn a crumb? Oh, you mean like work.', '밥벌이? 아, 일 말하는 거구나.', 'C 대사'),
  (23, 'A job, yeah. Sorry.', '응, 직업. 미안.', 'B 대사'),
  (24, 'Yo, that''s hilarious. I''m using that.', '야, 그거 웃기다. 나도 써먹어야지.', 'C 대사'),
  (25, 'I''ll let you use it. How about that?', '쓰게 해 줄게. 어때?', 'B 대사'),
  (26, 'I am, yeah. But nah, work-wise, I''m focusing on my art.', '그래, 쓸 거야. 근데 아니, 일 쪽으로는 내 예술에 집중하고 있어.', 'C 대사'),
  (27, 'Oh, so you''re an artist? Hot.', '오, 그럼 너 예술가야? 섹시하다.', 'B 대사'),
  (28, 'I''m not an artist yet. I need to find what art I wanna do. I just know I do wanna be an artist of some sort.', '아직 예술가는 아니야. 무슨 예술을 할지 찾아야 돼. 그냥 뭐가 됐든 예술가가 되고 싶은 건 확실해.', 'C 대사'),
  (29, 'For sure. Yeah, I love that for you. Love that for you.', '당연하지. 응, 너한테 딱 좋다. 진짜 잘됐다.', 'B 대사'),
  (30, 'But I''m just chilling at the moment, yeah.', '근데 지금은 그냥 쉬고 있어, 응.', 'C 대사'),
  (31, 'And he''s super creative as well. He has so much free time.', '그리고 그 사람 엄청 창의적이기도 해. 자유 시간도 엄청 많고.', 'B 대사'),
  (32, 'Right. So he''s unemployed.', '그렇구나. 그러니까 백수네.', 'C 대사'),
  (33, 'No, babe. Why are you always like this? You gotta start somewhere.', '아니야, 자기야. 넌 왜 맨날 이래? 누구나 시작은 있는 거잖아.', 'B 대사'),
  (34, 'I know. Oh my God. I''m just looking out for you.', '알아. 아휴. 난 그냥 너 걱정돼서 그래.', 'C 대사'),
  (35, 'Oh my God, it''s him.', '어머, 그 사람이야.', 'B 대사'),
  (36, 'Oh, of course it is.', '아, 그럼 그렇지.', 'C 대사'),
  (37, 'Hey, baby. Yeah, I''m telling her now. I know.', '안녕, 자기야. 응, 지금 얘한테 얘기하고 있어. 알아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 55
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 55) and item_order > 37;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, sir. Please pull over to the side of the road.', '실례합니다, 선생님. 길가에 차 세워 주세요.', 'A 대사'),
  (2, 'Sure, officer. Did I do something wrong?', '네, 경찰관님. 제가 뭐 잘못했나요?', 'B 대사'),
  (3, 'You were driving a little over the speed limit.', '제한 속도보다 조금 빠르게 달리셨어요.', 'A 대사'),
  (4, 'I''m sorry. I''m still getting used to driving here.', '죄송합니다. 여기서 운전하는 게 아직 적응 중이라서요.', 'B 대사'),
  (5, 'May I see your license, please?', '면허증 좀 보여 주시겠어요?', 'A 대사'),
  (6, 'Of course. Here it is.', '물론이죠. 여기 있습니다.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 56
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 56) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How are you getting to work tomorrow?', '내일 출근 어떻게 해?', 'A 대사'),
  (2, 'I''m not sure yet. Maybe by train.', '아직 모르겠어. 아마 기차 타고?', 'B 대사'),
  (3, 'Don''t worry. I''ll pick you up and drop you off.', '걱정 마. 내가 데리러 가서 내려다 줄게.', 'A 대사'),
  (4, 'Really? That would help a lot.', '진짜? 그럼 완전 도움 되지.', 'B 대사'),
  (5, 'What time should I come?', '몇 시에 갈까?', 'A 대사'),
  (6, 'Around 7:30 would be perfect.', '7시 30분쯤이면 딱 좋아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 57
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 57) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, can I park here?', '실례지만, 여기 주차해도 돼요?', 'A 대사'),
  (2, 'Yeah, but only for 15 minutes tho. If you leave your car here longer than that, it''ll be towed.', '네, 근데 15분만이에요. 그보다 오래 세워 두면 견인돼요.', 'B 대사'),
  (3, 'Oh, I see. Is there free parking nearby?', '아, 그렇구나. 근처에 무료 주차장 있어요?', 'A 대사'),
  (4, 'Yes, there''s one behind that building.', '네, 저 건물 뒤에 하나 있어요.', 'B 대사'),
  (5, 'Thank you boss!', '고마워요 형님!', 'A 대사'),
  (6, 'I was about to say something, but it totally slipped my mind.', '뭐 말하려고 했는데 완전 까먹었네.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 58
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 58) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Which pump are you on?', '몇 번 주유기 쓰셨어요?', 'A 대사'),
  (2, 'Uh... number four.', '어... 4번이요.', 'B 대사'),
  (3, 'That''ll be $84.75. Unleaded or diesel?', '84달러 75센트입니다. 휘발유요, 경유요?', 'A 대사'),
  (4, 'Unleaded. What''s the difference between 91 and 95?', '휘발유요. 91이랑 95는 뭐가 달라요?', 'B 대사'),
  (5, '95''s better for your engine. Costs a bit more though.', '95가 엔진엔 더 좋아요. 대신 좀 더 비싸요.', 'A 대사'),
  (6, 'I''ll go with 91 the car''s pretty old anyway.', '91로 할게요, 어차피 차가 꽤 오래돼서요.', 'B 대사'),
  (7, 'Yeah, Fair enough.', '네, 그럴 만하죠.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 59
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 59) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So sorry. Always bothering you to teach me.', '진짜 미안해. 맨날 가르쳐 달라고 귀찮게 해서.', 'A 대사'),
  (2, 'Always happy to help.', '언제든 기꺼이 도와줄게.', 'B 대사'),
  (3, 'It''s so stupid. I already have Chinese license!', '진짜 어이없어. 나 이미 중국 면허 있는데!', 'A 대사'),
  (4, 'We have to follow the rules.', '규칙은 따라야지.', 'B 대사'),
  (5, 'So many rules...', '규칙이 너무 많아...', 'A 대사'),
  (6, 'We can''t live without rules.', '규칙 없이는 못 살아.', 'B 대사'),
  (7, 'You''ll feel better once you pass the test.', '시험 붙고 나면 기분 나아질 거야.', 'A 대사'),
  (8, 'You should be a teacher.', '너 선생님 해야겠다.', 'B 대사'),
  (9, 'I''m already yours.', '이미 네 선생님이잖아.', 'A 대사'),
  (10, 'Should we do final checks?', '마지막 점검 해 볼까?', 'B 대사'),
  (11, 'OK.', '좋아.', 'A 대사'),
  (12, 'License?', '면허증?', 'B 대사'),
  (13, 'Check.', '확인.', 'A 대사'),
  (14, 'Log book?', '로그북?', 'B 대사'),
  (15, 'Check. I have the app.', '확인. 앱에 있어.', 'A 대사'),
  (16, 'Show me the records.', '기록 보여 줘.', 'B 대사'),
  (17, 'Damn it! I really need to stop using smoke as my entrance!', '젠장! 연기 피우면서 등장하는 거 진짜 그만해야겠다!', 'A 대사'),
  (18, 'To get your driver''s license in Australia, you must first get your Learner''s license. Or as we say: L''s.', '호주에서 운전면허를 따려면 먼저 연습 면허를 따야 해. 우리는 그걸 L''s라고 불러.', 'A 대사'),
  (19, 'L''s driver''s must practise their driving with a supervisor.', 'L 면허 운전자는 반드시 감독자랑 같이 운전 연습을 해야 해.', 'A 대사'),
  (20, 'Lily is on her L''s and is hoping to get on her P''s. Her provisional license. She must record her driving hours in a log book before taking her P''s exam. She looks ready, doesn''t she? She totally understands all the basic road signs and rules, I hope.', '릴리는 지금 L 면허 단계고 P 면허, 그러니까 임시 면허를 따려고 해. P 시험 보기 전에 로그북에 운전 시간을 기록해야 해. 준비된 것 같아 보이지? 기본 도로 표지판이랑 규칙은 다 완벽하게 알고 있겠지, 아마도.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level1' and l.day_number = 60
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level1' and day_number = 60) and item_order > 20;
commit;

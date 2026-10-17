-- 부트캠프 교재(미리캔버스 PDF) Day 01~60 대화 전체 → 쉐도잉 문장
-- content/bootcamp-dialogues.json 에서 생성. 해석은 AI 초안. 여러 번 실행해도 안전하다.
-- 각 Day의 기존 문장(item_order 1..)은 id를 유지한 채 내용만 바꾸므로 기존 제출 기록은 남는다.
begin;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hmm, you''ve got an accent... where''re you from?', '음, 억양이 있네… 어디서 왔어?', 'A 대사'),
  (2, 'Korea. Just landed a couple of weeks ago.', '한국. 2주 전쯤에 막 도착했어.', 'B 대사'),
  (3, 'Ah, nice! That''s a big move. How''re you liking it so far?', '오, 좋다! 큰 결심했네. 지금까지 지내보니 어때?', 'A 대사'),
  (4, 'Loving it so far. People are super chill here.', '지금까진 너무 좋아. 여기 사람들 엄청 여유로워.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 1
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 1) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So, where''re you living these days?', '그래서, 요즘 어디 살아?', 'A 대사'),
  (2, 'Melbourne, just near the CBD.', '멜버른, 시티(CBD) 바로 근처.', 'B 대사'),
  (3, 'Oh sweet! That area''s pretty walkable, huh?', '오 좋다! 거기 걸어 다니기 좋지?', 'A 대사'),
  (4, 'Yeah, love it. Cafes and shops everywhere.', '응, 완전 좋아. 카페랑 가게가 여기저기 다 있어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 2
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 2) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So, what do you do? Work or study?', '그래서 무슨 일 해? 일해, 아니면 공부해?', 'A 대사'),
  (2, 'A bit of both. I''m a barista by day, uni student by night.', '둘 다 조금씩. 낮에는 바리스타, 밤에는 대학생이야.', 'B 대사'),
  (3, 'Wow hustling hard, I like it.', '와 열심히 사네, 멋지다.', 'A 대사'),
  (4, 'Haha, keeps me busy but I''m loving it.', '하하, 바쁘긴 한데 너무 좋아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 3
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 3) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So, how old are you anyway?', '그나저나 너 몇 살이야?', 'A 대사'),
  (2, 'How old do I look?', '몇 살처럼 보여?', 'B 대사'),
  (3, 'Maybe 22?', '스물두 살쯤?', 'A 대사'),
  (4, 'Haha, thanks! I''m 28 actually.', '하하, 고마워! 사실 스물여덟이야.', 'B 대사'),
  (5, 'No way! Thought you were my little sister''s age.', '말도 안 돼! 내 여동생 나이인 줄 알았어.', 'A 대사'),
  (6, 'Haha, I''ll take that as a compliment.', '하하, 칭찬으로 받을게.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 4
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 4) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey! You must be Daniel, right?', '안녕! 네가 다니엘 맞지?', 'A 대사'),
  (2, 'Yeah, that''s me. How''s it going?', '응, 나야. 잘 지내?', 'B 대사'),
  (3, 'Pretty good! Finally meeting you in person feels kinda weird in a good way.', '잘 지내! 드디어 직접 만나니까 좋은 의미로 좀 신기하다.', 'A 대사'),
  (4, 'Haha, I know what you mean. You look just like your photos!', '하하, 무슨 말인지 알아. 너 사진이랑 똑같다!', 'B 대사'),
  (5, 'Thanks! You too. Glad we finally met.', '고마워! 너도. 드디어 만나서 반가워.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 5
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 5) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'G''day mate! How ya going?', '안녕 친구! 잘 지내?', 'A 대사'),
  (2, 'Yeah, not too bad. You?', '응, 나쁘지 않아. 너는?', 'B 대사'),
  (3, 'Can''t complain. Just finished work. Ready for a cold one.', '괜찮아. 방금 일 끝났어. 시원한 맥주 한잔하고 싶다.', 'A 대사'),
  (4, 'Haha, classic. You heading to the pub?', '하하, 역시. 펍 가는 거야?', 'B 대사'),
  (5, 'Reckon so. Gotta unwind somehow!', '그럴 것 같아. 어떻게든 좀 쉬어야지!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 6
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 6) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I saw your post on Facebook. Is this position still available?', '안녕하세요, 페이스북에서 올리신 글 봤는데요. 이 자리 아직 구하세요?', 'A 대사'),
  (2, 'Hey! Yeah, we''re still looking for someone. Do you have experience?', '안녕하세요! 네, 아직 사람 구하고 있어요. 경력 있으세요?', 'B 대사'),
  (3, 'Yes, I worked in a cafe back in Melbourne.', '네, 전에 멜버른에서 카페 일 했었어요.', 'A 대사'),
  (4, 'Nice one. You can send me your resume or drop it off tomorrow.', '좋네요. 이력서 보내주시거나 내일 직접 갖다주셔도 돼요.', 'B 대사'),
  (5, 'Great, I''ll bring it in person. Thanks a lot!', '좋아요, 제가 직접 가져갈게요. 정말 감사해요!', 'A 대사'),
  (6, 'No worries, see you then!', '천만에요, 그때 봬요!', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 7
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 7) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''m looking for a job. Can I leave my resume?', '일자리 구하고 있는데요. 이력서 두고 가도 될까요?', 'A 대사'),
  (2, 'Sure, no worries. What kind of experience do you have?', '그럼요, 괜찮아요. 어떤 경력 있으세요?', 'B 대사'),
  (3, 'I''ve got some experience in hospitality. I worked in a cafe for a year.', '요식업 쪽 경험이 좀 있어요. 카페에서 1년 일했어요.', 'A 대사'),
  (4, 'Perfect. When is your availability?', '완벽하네요. 언제 일할 수 있어요?', 'B 대사'),
  (5, 'I''m available on Monday to Friday, from 7am to 6pm.', '월요일부터 금요일까지, 오전 7시부터 오후 6시까지 가능해요.', 'A 대사'),
  (6, 'Awesome, we''ll be in touch soon. Thanks for dropping it off!', '좋아요, 곧 연락드릴게요. 갖다주셔서 고마워요!', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 8
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 8) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So, tell me a bit about yourself.', '자, 본인 소개 좀 해줄래요?', 'A 대사'),
  (2, 'Sure! I''ve been in Australia for about six months. I used to work as a barista back home.', '네! 호주에 온 지 한 6개월 됐어요. 한국에서는 바리스타로 일했었어요.', 'B 대사'),
  (3, 'Nice. Do you feel comfortable working in a fast-paced environment?', '좋네요. 바쁘게 돌아가는 환경에서 일하는 거 괜찮아요?', 'A 대사'),
  (4, 'Yeah, absolutely. I''m a quick learner and I don''t mind pressure.', '네, 완전 괜찮아요. 저 빨리 배우는 편이고 압박감도 괜찮아요.', 'B 대사'),
  (5, 'Good to hear. When can you start?', '다행이네요. 언제부터 일할 수 있어요?', 'A 대사'),
  (6, 'I can start right away. I live just five minutes away.', '바로 시작할 수 있어요. 여기서 5분 거리에 살아요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 9
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 9) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Thanks for explaining the job. Can I ask a few questions about the pay?', '일 설명해주셔서 감사해요. 급여에 대해 몇 가지 여쭤봐도 될까요?', 'A 대사'),
  (2, 'Of course, go ahead.', '물론이죠, 물어보세요.', 'B 대사'),
  (3, 'How much is the pay rate?', '시급이 얼마예요?', 'A 대사'),
  (4, 'It''s $28 per hour on weekdays and $32 on weekends.', '평일엔 시간당 28달러, 주말엔 32달러예요.', 'B 대사'),
  (5, 'Nice! Is it cash or bank transfer?', '좋네요! 현금이에요, 아니면 계좌이체예요?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 10
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 10) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Bank transfer, we pay every Thursday.', '계좌이체요. 매주 목요일에 지급해요.', 'A 대사'),
  (2, 'Great. Do you also pay superannuation?', '좋아요. 슈퍼(퇴직연금)도 넣어주세요?', 'B 대사'),
  (3, 'Yep, we do.', '네, 넣어줘요.', 'A 대사'),
  (4, 'Awesome. What''s the roster like?', '좋네요. 근무 스케줄은 어떻게 돼요?', 'B 대사'),
  (5, 'You''ll get around 25 to 30 hours a week.', '일주일에 대략 25~30시간 정도 받을 거예요.', 'A 대사'),
  (6, 'Sounds good to me. Thanks for letting me know!', '저는 좋아요. 알려주셔서 감사해요!', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 11
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 11) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, thanks for having me today.', '안녕하세요, 오늘 불러주셔서 감사해요.', 'A 대사'),
  (2, 'No worries, glad you could make it. Have you brought your RSA?', '별말씀을요, 와줘서 반가워요. RSA(주류 서빙 자격증) 가져왔어요?', 'B 대사'),
  (3, 'Yes, I''ve got it. Should I also bring my apron and uniform?', '네, 가져왔어요. 앞치마랑 유니폼도 가져와야 하나요?', 'A 대사'),
  (4, 'Yeah, that''d be great. What time can you start?', '네, 그러면 좋죠. 몇 시부터 시작할 수 있어요?', 'B 대사'),
  (5, 'I''m free to start anytime. How long will the trial be?', '언제든 시작할 수 있어요. 트라이얼은 얼마나 해요?', 'A 대사'),
  (6, 'Just a few hours this morning.', '오늘 오전에 몇 시간만 할 거예요.', 'B 대사'),
  (7, 'Yep, that''d be perfect. Let''s get started!', '네, 딱 좋아요. 시작해볼까요!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 12
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 12) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Can you please cover my shift on Friday?', '금요일에 내 시프트 좀 대신 해줄 수 있어?', 'A 대사'),
  (2, 'Yeah sure all good.', '응 그래, 괜찮아.', 'B 대사'),
  (3, 'You sure? I owe you one. You''re a legend.', '진짜? 내가 신세 한 번 졌다. 너 최고야.', 'A 대사'),
  (4, 'No worries, seriously. Happens all the time.', '진짜 괜찮아. 늘 있는 일인데 뭐.', 'B 대사'),
  (5, 'By the way what you gonna do on Friday?', '근데 너 금요일에 뭐 할 거야?', 'A 대사'),
  (6, 'I''m having a barbie with my friends', '친구들이랑 바비큐 할 거야', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 13
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 13) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'It''s bloody hot today!', '오늘 진짜 미치게 덥다!', 'A 대사'),
  (2, 'Tell me about it! I reckon it''s like 40 degrees.', '그러니까! 한 40도는 되는 것 같아.', 'B 대사'),
  (3, 'Heaps of people down at the beach, though.', '그래도 해변엔 사람 엄청 많더라.', 'A 대사'),
  (4, 'Yeah, no wonder. It''s way too nice to stay inside.', '응, 그럴 만하지. 안에만 있기엔 날씨가 너무 좋잖아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 14
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 14) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, can I grab a magic, takeaway please?', '안녕하세요, 매직 하나 테이크아웃으로 주시겠어요?', 'A 대사'),
  (2, 'Sure thing. Anything else for you?', '그럼요. 더 필요한 거 있으세요?', 'B 대사'),
  (3, 'Yeah...nah, that''s all. Cheers, mate.', '음... 아니요, 그거면 돼요. 고마워요.', 'A 대사'),
  (4, 'No worries. That''ll be five fifty', '천만에요. 5달러 50센트입니다', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 15
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 15) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I heard you got the job!', '너 취직했다며!', 'A 대사'),
  (2, 'Yeah, I''m pretty stoked, actually!', '응, 사실 완전 신나!', 'B 대사'),
  (3, 'Good on ya! You deserve it.', '잘했다! 넌 그럴 자격 있어.', 'A 대사'),
  (4, 'Thanks! The interview was a bit rough, though.', '고마워! 근데 면접은 좀 힘들었어.', 'B 대사'),
  (5, 'Ah yeah, they can be brutal sometimes.', '아 그치, 면접이 가끔 진짜 빡세긴 하지.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 16
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 16) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, you right, mate? You look knackered.', '야, 괜찮아? 완전 지쳐 보여.', 'A 대사'),
  (2, 'Yeah, just on break. Needed a minute to breathe.', '응, 그냥 쉬는 시간이야. 잠깐 숨 좀 돌려야 해서.', 'B 대사'),
  (3, 'Fair enough. Go get some fresh air, you''ve earned it.', '그럴 만하지. 바람 좀 쐬고 와, 그럴 자격 있어.', 'A 대사'),
  (4, 'Cheers, I''ll be back in five minutes.', '고마워, 5분 뒤에 올게.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 17
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 17) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, can you do me a favor?', '야, 부탁 하나만 들어줄 수 있어?', 'A 대사'),
  (2, 'Sure what''s that?', '그럼, 뭔데?', 'B 대사'),
  (3, 'Can you give me a hand with these plates?', '이 접시들 좀 같이 들어줄래?', 'A 대사'),
  (4, 'Yup, where should I put them?', '응, 어디에 둘까?', 'B 대사'),
  (5, 'Just chuck them in the bin, they''re cracked.', '그냥 쓰레기통에 버려, 금 갔어.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 18
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 18) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, how''s your day been?', '야, 오늘 하루 어땠어?', 'A 대사'),
  (2, 'Mate, I''m flat out. It''s been hectic since morning.', '야, 나 완전 정신없어. 아침부터 계속 바빴어.', 'B 대사'),
  (3, 'Tell me about it. I haven''t even had a coffee yet.', '내 말이. 나 아직 커피도 한 잔 못 마셨어.', 'A 대사'),
  (4, 'Hang in there, almost done.', '조금만 버텨, 거의 끝났어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 19
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 19) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Before I put your order through, any allergies at all?', '주문 넣기 전에, 혹시 알레르기 있으세요?', 'A 대사'),
  (2, 'Yeah, I''m allergic to nuts.', '네, 견과류 알레르기 있어요.', 'B 대사'),
  (3, 'Thanks for letting me know.', '알려주셔서 감사해요.', 'A 대사'),
  (4, 'Sorry for being picky, but I try to avoid nuts completely.', '까다롭게 굴어서 죄송한데, 견과류는 아예 안 먹으려고 해요.', 'B 대사'),
  (5, 'Got it. I''ll mark it clearly on your order.', '알겠습니다. 주문서에 확실하게 표시해 둘게요.', 'A 대사'),
  (6, 'The dish is nut-free, but I''ll double-check with the kitchen.', '그 요리는 견과류가 안 들어가는데, 주방에 한 번 더 확인해 볼게요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 20
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 20) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi! I saw your ad on Flatmates. Is the room still available?', '안녕하세요! Flatmates에서 광고 봤어요. 방 아직 있어요?', 'A 대사'),
  (2, 'Hey! Yep, it''s still available.', '안녕하세요! 네, 아직 있어요.', 'B 대사'),
  (3, 'Great. Can I come for an inspection?', '잘됐네요. 방 보러 가도 될까요?', 'A 대사'),
  (4, 'Sure. When would be a good time for you?', '그럼요. 언제가 편하세요?', 'B 대사'),
  (5, 'I''m free tomorrow evening. Does that work?', '내일 저녁에 시간 돼요. 괜찮으세요?', 'A 대사'),
  (6, 'Yeah, that works for me.', '네, 저도 괜찮아요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 21
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 21) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Nice. By the way, how many people are currently living there?', '좋네요. 그런데 지금 거기 몇 명 살고 있어요?', 'A 대사'),
  (2, 'Just three of us. All full-time workers.', '저희 세 명뿐이에요. 다 풀타임으로 일해요.', 'B 대사'),
  (3, 'Perfect. Is the rent per week or per month?', '완벽하네요. 렌트비는 주 단위예요, 월 단위예요?', 'A 대사'),
  (4, 'It''s $290 per week. Bond is two weeks'' rent.', '주당 290달러예요. 보증금은 2주치 렌트비고요.', 'B 대사'),
  (5, 'Got it. And what are the other housemates like?', '알겠어요. 그리고 다른 하우스메이트들은 어떤 사람들이에요?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 22
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 22) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, welcome! You here for the inspection?', '안녕하세요, 어서 와요! 방 보러 오신 거죠?', 'A 대사'),
  (2, 'Yep! Thanks for having me. I''m looking for a long-term stay.', '네! 불러주셔서 고마워요. 저는 오래 지낼 곳을 찾고 있어요.', 'B 대사'),
  (3, 'Nice. What do you do?', '좋네요. 무슨 일 하세요?', 'A 대사'),
  (4, 'I work full-time. And I''m tidy and pretty easy-going.', '풀타임으로 일해요. 그리고 깔끔하고 꽤 무난한 성격이에요.', 'B 대사'),
  (5, 'Good to know.', '그렇군요, 좋네요.', 'A 대사'),
  (6, 'By the way, is the bathroom shared or private?', '그런데 화장실은 같이 써요, 아니면 혼자 써요?', 'B 대사'),
  (7, 'It''s shared, but only with one other person.', '같이 쓰는데, 딱 한 명이랑만 써요.', 'A 대사'),
  (8, 'Got it. And are bills included in the rent?', '알겠어요. 그리고 공과금은 렌트비에 포함이에요?', 'B 대사'),
  (9, 'Yep, everything''s included. Electricity, water, internet...', '네, 다 포함이에요. 전기, 수도, 인터넷...', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 23
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 23) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'When is the move-in date?', '입주 날짜는 언제예요?', 'A 대사'),
  (2, 'From next Monday. You can move in anytime after that.', '다음 주 월요일부터요. 그 이후엔 언제든 들어와도 돼요.', 'B 대사'),
  (3, 'Great. How long is the minimum stay?', '좋아요. 최소 거주 기간은 얼마예요?', 'A 대사'),
  (4, 'Minimum stay would be three months.', '최소 3개월이에요.', 'B 대사'),
  (5, 'And the notice period?', '그리고 퇴거 통보 기간은요?', 'A 대사'),
  (6, 'It''s two weeks. Just let us know before you move out.', '2주예요. 나가기 전에 미리 말만 해줘요.', 'B 대사'),
  (7, 'Cool. Is the bond refundable?', '좋아요. 보증금은 돌려받을 수 있어요?', 'A 대사'),
  (8, '100%, as long as there''s no damage.', '망가진 것만 없으면 100% 돌려줘요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 24
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 24) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Thanks for showing me around.', '구경시켜 줘서 고마워요.', 'A 대사'),
  (2, 'No wuckas! Feel free to look around.', '별말씀을요! 편하게 둘러보세요.', 'B 대사'),
  (3, 'Do you mind if I check the kitchen?', '주방 좀 봐도 될까요?', 'A 대사'),
  (4, 'Go for it. You can open the drawers if you like.', '그럼요. 서랍도 열어봐도 돼요.', 'B 대사'),
  (5, 'Nice. I really like the place. I''ll let you know soon!', '좋네요. 여기 정말 마음에 들어요. 곧 연락드릴게요!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 25
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 25) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Quick question, are there any house rules I should know about?', '하나만 물어볼게요. 제가 알아야 할 집 규칙 같은 거 있어요?', 'A 대사'),
  (2, 'Nothing strict. Just clean up after yourself and don''t be too loud at night.', '엄격한 건 없어요. 쓴 건 알아서 치우고, 밤에 너무 시끄럽게만 안 하면 돼요.', 'B 대사'),
  (3, 'Got it. Where can I put my food in the fridge and cupboard?', '알겠어요. 냉장고랑 찬장에 제 음식은 어디에 두면 돼요?', 'A 대사'),
  (4, 'The middle shelf is free.', '가운데 칸이 비어 있어요.', 'B 대사'),
  (5, 'Cool. Also, do we share the cleaning or do we take turns?', '좋아요. 그리고 청소는 같이 해요, 아니면 돌아가면서 해요?', 'A 대사'),
  (6, 'We usually take turns.', '보통 돌아가면서 해요.', 'B 대사'),
  (7, 'Perfect. And one more thing, how do we sort the rubbish here?', '완벽하네요. 그리고 하나 더, 여기 쓰레기 분리수거는 어떻게 해요?', 'A 대사'),
  (8, 'General waste goes in the red bin, recycling in the yellow.', '일반 쓰레기는 빨간 통에, 재활용은 노란 통에 넣어요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 26
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 26) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Do you mind if I keep my stuff here on this shelf?', '내 물건 이 선반에 둬도 괜찮아?', 'A 대사'),
  (2, 'Well, technically, the shelf is my space.', '음, 사실 그 선반은 내 자리야.', 'B 대사'),
  (3, 'But I don''t have much stuff so you can use it.', '근데 난 짐이 별로 없으니까 너가 써도 돼.', 'A 대사'),
  (4, 'Cheers. By the way, I noticed the sink was full this morning.', '고마워. 그런데 오늘 아침에 보니까 싱크대가 꽉 차 있더라.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 27
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 27) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, whose turn is it to take out the rubbish? The bin''s full.', '야, 쓰레기 버릴 차례 누구야? 쓰레기통 꽉 찼어.', 'A 대사'),
  (2, 'I think it''s mine, sorry. I''ll do it now.', '내 차례인 것 같아, 미안. 지금 할게.', 'B 대사'),
  (3, 'All good man. Hey, do we have a cleaning roster?', '괜찮아. 근데 우리 청소 당번표 있어?', 'A 대사'),
  (4, 'Not really, we''ve just been doing it randomly.', '딱히 없어, 그냥 되는 대로 해왔어.', 'B 대사'),
  (5, 'Hmm, maybe we could make a cleaning schedule?', '흠, 청소 스케줄 하나 만들어 보는 게 어때?', 'A 대사'),
  (6, 'Nah, I can''t be bothered', '아니, 귀찮아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 28
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 28) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Last night the music was a bit loud. Do you mind keeping the noise down a bit after 11?', '어젯밤에 음악이 좀 시끄러웠어. 11시 이후엔 소리 좀 줄여줄 수 있어?', 'A 대사'),
  (2, 'Oh, my bad. I''ll keep it down.', '아, 내 잘못이야. 조용히 할게.', 'B 대사'),
  (3, 'Thanks! And the bathroom, can we try to keep it tidy?', '고마워! 그리고 화장실 말인데, 좀 깨끗하게 쓰도록 하자?', 'A 대사'),
  (4, 'Yep, I''ll make sure of it.', '응, 꼭 그렇게 할게.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 29
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 29) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''m asking because I think someone had all of my cookies yesterday.', '물어보는 이유가, 어제 누가 내 쿠키를 다 먹은 것 같아서.', 'A 대사'),
  (2, 'You gotta be kidding me.', '말도 안 돼.', 'B 대사'),
  (3, 'Yeah, my whole box of cookies was gone. So just a reminder, please don''t take my food without asking.', '응, 쿠키 한 상자가 통째로 없어졌어. 그러니까 한 번 더 말하는데, 내 음식은 물어보고 먹어줘.', 'A 대사'),
  (4, 'Yeah, fair enough.', '응, 그럴 만하지.', 'B 대사'),
  (5, 'Also, I''ll be away this weekend, just letting you know in case any mail arrives.', '그리고 나 이번 주말에 없어, 혹시 우편물 오면 알고 있으라고 말하는 거야.', 'A 대사'),
  (6, 'No worries. Is it okay if I have a friend over tonight? Just for dinner.', '알겠어. 오늘 밤에 친구 불러도 돼? 저녁만 먹고 갈 거야.', 'B 대사'),
  (7, 'Yeah, that''s fine.', '응, 괜찮아.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 30
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 30) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I''d like to open a bank account.', '안녕하세요, 은행 계좌를 하나 만들고 싶어요.', 'A 대사'),
  (2, 'Sure. Are you new to Australia?', '네. 호주에 오신 지 얼마 안 되셨어요?', 'B 대사'),
  (3, 'Yes, I''ve just arrived. I''m on a working holiday visa.', '네, 막 도착했어요. 워킹홀리데이 비자로 왔어요.', 'A 대사'),
  (4, 'No worries. Do you have your passport with you?', '알겠어요. 여권 지금 가지고 계세요?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 31
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 31) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I''d like to check my balance.', '안녕하세요, 잔액 좀 확인하고 싶어요.', 'A 대사'),
  (2, 'Sure. Please enter your PIN number.', '네. 비밀번호(PIN) 입력해 주세요.', 'B 대사'),
  (3, 'I''d like to deposit this cash.', '이 현금도 입금하고 싶어요.', 'A 대사'),
  (4, 'No problem.', '네, 그럼요.', 'B 대사'),
  (5, 'And can I transfer money using PayID?', '그리고 PayID로 송금할 수 있어요?', 'A 대사'),
  (6, 'Yes, you can do that on the app.', '네, 앱에서 하시면 돼요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 32
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 32) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, my card got swallowed by an ATM.', '안녕하세요, ATM이 제 카드를 먹어버렸어요.', 'A 대사'),
  (2, 'Oh no. Which ATM was it?', '어머, 어느 ATM이었어요?', 'B 대사'),
  (3, 'The one on Bourke Street.', '버크 스트리트에 있는 거요.', 'A 대사'),
  (4, 'Did it happen just now?', '방금 그런 거예요?', 'B 대사'),
  (5, 'Yes. I left the card in too long and it didn''t return it. I was trying to withdraw cash.', '네. 카드를 너무 오래 넣어뒀더니 안 돌려주더라고요. 현금 뽑으려던 중이었어요.', 'A 대사'),
  (6, 'No worries. I''ll block the card and order a new one for you.', '걱정 마세요. 카드 정지하고 새 카드 신청해 드릴게요.', 'B 대사'),
  (7, 'Okay. How long will it take to get a new card?', '네. 새 카드 받으려면 얼마나 걸려요?', 'A 대사'),
  (8, 'About five to seven business days.', '영업일 기준으로 5~7일 정도요.', 'B 대사'),
  (9, 'Got it. Thank goodness', '알겠어요. 다행이다', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 33
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 33) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''d like to get a SIM card.', '유심 하나 사고 싶어요.', 'A 대사'),
  (2, 'Sure. How much data are you looking for?', '네. 데이터는 얼마나 필요하세요?', 'B 대사'),
  (3, 'Not sure. How much data does this plan include?', '잘 모르겠어요. 이 요금제는 데이터가 얼마나 돼요?', 'A 대사'),
  (4, 'This one comes with 200GB for $50 a month.', '이건 한 달에 50달러에 200GB예요.', 'B 대사'),
  (5, 'Is there any contract?', '약정이 있어요?', 'A 대사'),
  (6, 'No, there''s no contract.', '아니요, 약정 없어요.', 'B 대사'),
  (7, 'Okay. Is there a cheaper option?', '그렇군요. 더 싼 것도 있어요?', 'A 대사'),
  (8, 'Yes, we have a 50GB plan for $40.', '네, 40달러에 50GB짜리 요금제가 있어요.', 'B 대사'),
  (9, 'I''ll go with this one.', '이걸로 할게요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 34
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 34) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, my data is running out already.', '안녕하세요, 벌써 데이터가 다 떨어져 가요.', 'A 대사'),
  (2, 'Let me check your usage.', '사용량 한번 확인해 볼게요.', 'B 대사'),
  (3, 'I''m using data faster than expected.', '생각보다 데이터를 빨리 쓰고 있어요.', 'A 대사'),
  (4, 'You''re close to your limit.', '한도에 거의 다 됐네요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 35
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 35) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Will I be charged extra if I run out of data?', '데이터 다 쓰면 추가 요금 나와요?', 'A 대사'),
  (2, 'No, your speed will just be reduced.', '아니요, 속도만 느려져요.', 'B 대사'),
  (3, 'Okay. Can I upgrade my plan?', '그렇군요. 요금제 업그레이드할 수 있어요?', 'A 대사'),
  (4, 'Yes, we can do that for you.', '네, 해 드릴게요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 36
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 36) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I''d like to cancel my plan.', '안녕하세요, 요금제 해지하고 싶어요.', 'A 대사'),
  (2, 'No problem. Are you switching to another provider?', '네. 다른 통신사로 옮기시는 거예요?', 'B 대사'),
  (3, 'Yes, but I want to keep my number.', '네, 근데 번호는 그대로 쓰고 싶어요.', 'A 대사'),
  (4, 'Sure. We can transfer your number for you.', '그럼요. 번호 이동해 드릴 수 있어요.', 'B 대사'),
  (5, 'Great. When will the cancellation take effect?', '좋아요. 해지는 언제부터 적용돼요?', 'A 대사'),
  (6, 'It''ll be effective from today.', '오늘부터 적용돼요.', 'B 대사'),
  (7, 'Will I be charged after today?', '오늘 이후에도 요금이 나가요?', 'A 대사'),
  (8, 'No, you won''t be charged anymore.', '아니요, 이제 요금 안 나가요.', 'B 대사'),
  (9, 'Perfect, thanks.', '완벽해요, 고마워요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 37
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 37) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I''d like to join the gym. How much is the membership?', '안녕하세요, 헬스장 등록하고 싶은데요. 회원권 얼마예요?', 'A 대사'),
  (2, 'Sure. It''s $45 fortnightly.', '네. 2주에 45달러예요.', 'B 대사'),
  (3, 'So it''s $22.50 per week, right?', '그럼 일주일에 22.50달러인 거죠?', 'A 대사'),
  (4, 'Exactly!', '맞아요!', 'B 대사'),
  (5, 'Do you also offer a free trial?', '무료 체험도 있어요?', 'A 대사'),
  (6, 'Yes, we do. We offer a 4-day free trial.', '네, 있어요. 4일 무료 체험 가능해요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 38
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 38) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Is there any promo going on at the moment?', '지금 진행 중인 프로모션 있어요?', 'A 대사'),
  (2, 'Yes, there is. It''s usually $45 per week, but for the first 12 weeks, it''s $22.50 per week.', '네, 있어요. 원래 주당 45달러인데, 처음 12주 동안은 주당 22.50달러예요.', 'B 대사'),
  (3, 'Got it. Just to double-check, that would be $90 per month for the first three months, right?', '알겠어요. 한 번만 더 확인할게요, 그럼 처음 세 달은 한 달에 90달러인 거 맞죠?', 'A 대사'),
  (4, 'Yep, exactly.', '네, 맞아요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 39
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 39) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Also, one of my friends wants to join the gym too.', '그리고 제 친구 한 명도 헬스장 등록하고 싶어 해요.', 'A 대사'),
  (2, 'Oh, cool. In that case, you can actually get more benefits. If you refer someone, you''ll get 50% off for one month.', '오, 좋네요. 그럼 혜택을 더 받을 수 있어요. 누군가를 추천하면 한 달 동안 50% 할인받아요.', 'B 대사'),
  (3, 'Even better! Do we need to come in person to sign up?', '더 좋네요! 가입하려면 직접 와야 해요?', 'A 대사'),
  (4, 'Nah, you can just send her your referral link.', '아니요, 그냥 친구한테 추천 링크만 보내주면 돼요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 40
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 40) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Bella''s Italian, good evening.', '벨라스 이탈리안입니다, 안녕하세요.', 'A 대사'),
  (2, 'Hi, I''d like to make a reservation for four at 7:30.', '안녕하세요, 7시 30분에 4명 예약하고 싶어요.', 'B 대사'),
  (3, 'Indoor or outdoor seating?', '실내석이요, 야외석이요?', 'A 대사'),
  (4, 'Indoors, please. Would it be possible to get a window seat?', '실내로 해주세요. 창가 자리도 가능할까요?', 'B 대사'),
  (5, 'Should be alright. Can I get a name and contact number?', '괜찮을 거예요. 성함이랑 연락처 알려주시겠어요?', 'A 대사'),
  (6, 'Sure. It''s Nathan. 0452 461 660.', '네. 네이선이에요. 0452 461 660이요.', 'B 대사'),
  (7, 'Lovely, I''ll see you at 7:30.', '좋아요, 7시 30분에 뵐게요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 41
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 41) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi! What can I get for you?', '안녕하세요! 뭐 드릴까요?', 'A 대사'),
  (2, 'Hi, I''ll just grab one of those banana breads.', '안녕하세요, 저 바나나 브레드 하나 주세요.', 'B 대사'),
  (3, 'Sure. Anything else?', '네. 다른 건요?', 'A 대사'),
  (4, 'And I''ll do a strong cap. I was just wondering if you have any sweetener.', '그리고 카푸치노 진하게 하나요. 혹시 감미료 있어요?', 'B 대사'),
  (5, 'Yes, we do. We''ve got Equal and Stevia.', '네, 있어요. 이퀄이랑 스테비아 있어요.', 'A 대사'),
  (6, 'Great, I''ll have Equal in my coffee. And the banana bread plain, toasted, with extra butter, please.', '좋아요, 커피에 이퀄 넣어 주세요. 그리고 바나나 브레드는 아무것도 안 올리고 토스트해서 버터 추가로 주세요.', 'B 대사'),
  (7, 'No worries. That''ll be $10.80. When you''re ready.', '알겠어요. 10.80달러예요. 준비되시면 결제해 주세요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 42
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 42) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Here you go. One tiramisu.', '여기 있어요. 티라미수 하나요.', 'A 대사'),
  (2, 'Oh, sorry, I don''t think we ordered this.', '어, 죄송한데 저희 이거 안 시킨 것 같아요.', 'B 대사'),
  (3, 'That''s right. This one''s on the house.', '맞아요. 이건 서비스예요.', 'A 대사'),
  (4, 'Oh, really?', '오, 진짜요?', 'B 대사'),
  (5, 'Yeah, sorry about the wait earlier. We wanted to make it up to you.', '네, 아까 오래 기다리게 해서 죄송해요. 보답하고 싶었어요.', 'A 대사'),
  (6, 'Oh wow, thanks. We appreciate it.', '와, 고마워요. 정말 감사해요.', 'B 대사'),
  (7, 'No worries. Enjoy!', '별말씀을요. 맛있게 드세요!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 43
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 43) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'How does it feel?', '신어 보니 어때요?', 'A 대사'),
  (2, 'It fits like a glove, but a little snug around the toes.', '딱 맞는데, 발가락 쪽이 좀 꽉 껴요.', 'B 대사'),
  (3, 'You might want to go half a size up, because Salomon runs small, you know?', '반 사이즈 올리시는 게 나을 수도 있어요, 살로몬이 좀 작게 나오거든요.', 'A 대사'),
  (4, 'Yeah, could I try an eight and a half?', '네, 8.5 사이즈 신어 볼 수 있을까요?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 44
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 44) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Big summer blowout! How can I help?', '여름 대박 세일 중이에요! 뭐 도와드릴까요?', 'A 대사'),
  (2, 'I''m just browsing. I''ll let you know if I need any help.', '그냥 구경 중이에요. 도움 필요하면 말씀드릴게요.', 'B 대사'),
  (3, 'Oh, those are on special. Buy one, get one free.', '아, 그거 세일 중이에요. 하나 사면 하나 공짜예요.', 'A 대사'),
  (4, 'Do you have this in a larger size?', '이거 더 큰 사이즈 있어요?', 'B 대사'),
  (5, 'Yes. Would you like to try it on?', '네. 입어 보시겠어요?', 'A 대사'),
  (6, 'Is there a fitting room?', '탈의실 있어요?', 'B 대사'),
  (7, 'How do you like it?', '어떠세요?', 'A 대사'),
  (8, 'It''s a bit tight around the shoulders. I''ll come back later.', '어깨 쪽이 좀 껴요. 나중에 다시 올게요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 45
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 45) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, does this tram go to Melbourne Central?', '실례지만, 이 트램 멜번 센트럴 가요?', 'A 대사'),
  (2, 'Yep, it does. You need to get off at Little Lonsdale Street.', '네, 가요. 리틀 론스데일 스트리트에서 내리면 돼요.', 'B 대사'),
  (3, 'Is that in the free tram zone?', '거기 무료 트램 구역 안이에요?', 'A 대사'),
  (4, 'Yeah, you don''t need to tap on.', '네, 카드 안 찍어도 돼요.', 'B 대사'),
  (5, 'Sweet!', '오 좋다!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 46
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 46) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'My Myki is not working.', '제 마이키 카드가 안 돼요.', 'A 대사'),
  (2, 'Yeah, your Myki might be low on balance.', '아, 마이키 잔액이 부족한 것 같아요.', 'B 대사'),
  (3, 'I just topped it up, but it didn''t go through.', '방금 충전했는데 충전이 안 됐어요.', 'A 대사'),
  (4, 'Maybe we''ve got an issue with the machine.', '기계에 문제가 있나 봐요.', 'B 대사'),
  (5, 'Can you do that manually?', '직접 충전해 주실 수 있어요?', 'A 대사'),
  (6, 'Sure, how much would you like to top up?', '그럼요, 얼마 충전하시겠어요?', 'B 대사'),
  (7, 'I''ll top up $30.', '30달러 충전할게요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 47
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 47) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I''m trying to get to Richmond.', '안녕하세요, 리치먼드에 가려고 하는데요.', 'A 대사'),
  (2, 'You need to take the Pakenham line from Southern Cross Station.', '서던 크로스 역에서 패컨엄 라인 타시면 돼요.', 'B 대사'),
  (3, 'Which platform is it?', '몇 번 플랫폼이에요?', 'A 대사'),
  (4, 'Platform 12. But it''s not express, though. Platform 4 is faster.', '12번 플랫폼이요. 근데 급행은 아니에요. 4번 플랫폼이 더 빨라요.', 'B 대사'),
  (5, 'Even better! Thank you for your help.', '그럼 더 좋죠! 도와주셔서 고마워요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 48
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 48) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, how do I get to this cafe?', '실례지만, 이 카페 어떻게 가요?', 'A 대사'),
  (2, 'Oh, it''s just down the road.', '아, 이 길 따라 조금만 가면 있어요.', 'B 대사'),
  (3, 'Is it far from here?', '여기서 멀어요?', 'A 대사'),
  (4, 'Not at all. About a 5-minute walk.', '전혀요. 걸어서 5분 정도예요.', 'B 대사'),
  (5, 'Should I turn left or right?', '왼쪽으로 꺾어요, 오른쪽으로 꺾어요?', 'A 대사'),
  (6, 'There''s a roundabout down the road. You can chuck a right at the chook shop.', '길 따라가면 로터리가 있어요. 치킨집에서 오른쪽으로 꺾으면 돼요.', 'B 대사'),
  (7, 'Got it. Thanks so much! Do you happen to know any good places to eat around here?', '알겠어요. 정말 고마워요! 혹시 이 근처에 괜찮은 식당 아세요?', 'A 대사'),
  (8, 'Yeah, there''s a pretty decent Thai place just next to the cafe.', '네, 그 카페 바로 옆에 꽤 괜찮은 태국 음식점 있어요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 49
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 49) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Sorry, I think I missed my stop.', '죄송한데, 내릴 정류장을 지나친 것 같아요.', 'A 대사'),
  (2, 'No worries. Get off at the next one and cross over.', '괜찮아요. 다음 정류장에서 내려서 길 건너세요.', 'B 대사'),
  (3, 'So I need to catch the bus back?', '그럼 버스 타고 다시 돌아가야 해요?', 'A 대사'),
  (4, 'Yeah, just from the other side.', '네, 반대편에서 타시면 돼요.', 'B 대사'),
  (5, 'Got it. Thanks heaps!', '알겠어요. 정말 고마워요!', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 50
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 50) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hello, I''d like to make an appointment, please.', '안녕하세요, 진료 예약하고 싶어요.', 'A 대사'),
  (2, 'Sure. What seems to be the problem?', '네. 어디가 불편하세요?', 'B 대사'),
  (3, 'I have a fever and a sore throat.', '열이 나고 목이 아파요.', 'A 대사'),
  (4, 'When would you like to come in?', '언제 오고 싶으세요?', 'B 대사'),
  (5, 'What''s the earliest available appointment?', '제일 빠른 예약이 언제예요?', 'A 대사'),
  (6, 'We have an opening at 2 PM today.', '오늘 오후 2시에 자리가 있어요.', 'B 대사'),
  (7, 'That works for me. This is my first visit.', '그때 좋아요. 이번이 처음 방문이에요.', 'A 대사'),
  (8, 'No problem. Please bring your ID and insurance card.', '괜찮아요. 신분증이랑 보험 카드 가져오세요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 51
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 51) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'What brings you in today?', '오늘 어떻게 오셨어요?', 'A 대사'),
  (2, 'I''ve been feeling sick for 3 days. I have a fever and my throat hurts.', '3일째 아파요. 열이 나고 목이 아파요.', 'B 대사'),
  (3, 'Any other symptoms?', '다른 증상은요?', 'A 대사'),
  (4, 'Yes, I feel dizzy, I have a headache, and I feel a little nauseous.', '네, 어지럽고 머리도 아프고 속이 좀 메스꺼워요.', 'B 대사'),
  (5, 'Are you allergic to any medication?', '약 알레르기 있으세요?', 'A 대사'),
  (6, 'I''m allergic to penicillin.', '페니실린 알레르기 있어요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 52
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 52) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'What seems to be the problem?', '어디가 불편하세요?', 'A 대사'),
  (2, 'I''ve been coughing a lot, especially when I talk. It''s been like this for about two weeks.', '기침을 많이 해요, 특히 말할 때요. 이런 지 2주 정도 됐어요.', 'B 대사'),
  (3, 'Do you have a sore throat or any pain?', '목이 아프거나 다른 통증은 있어요?', 'A 대사'),
  (4, 'Not really a sore throat, but my throat feels irritated.', '목이 아픈 건 아닌데, 목이 좀 따끔거리고 칼칼해요.', 'B 대사'),
  (5, 'On a scale of 1 to 10, how bad is it?', '1부터 10까지 중에 얼마나 심해요?', 'A 대사'),
  (6, 'About a 7.', '7 정도요.', 'B 대사'),
  (7, 'Are you taking any medication?', '지금 드시는 약 있어요?', 'A 대사'),
  (8, 'No, nothing regularly. Just some cold medicine.', '아뇨, 꾸준히 먹는 건 없어요. 감기약 좀 먹은 거 말고는요.', 'B 대사'),
  (9, 'Alright. I''ll prescribe you some medication.', '알겠어요. 약 처방해 드릴게요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 53
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 53) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Are you feeling off or not yourself?', '몸이 좀 안 좋거나 평소 같지 않으세요?', 'A 대사'),
  (2, 'Yeah, I''ve been feeling a bit crook for a few days.', '네, 며칠째 몸이 좀 안 좋아요.', 'B 대사'),
  (3, 'Have you had any vomiting?', '토하신 적 있어요?', 'A 대사'),
  (4, 'Just a little.', '조금이요.', 'B 대사'),
  (5, 'Have you had a fever?', '열은 났어요?', 'A 대사'),
  (6, 'Not that I know of.', '제가 알기로는 없어요.', 'B 대사'),
  (7, 'You''ve got a throat infection. I''ll prescribe some antibiotics.', '목에 염증이 생겼네요. 항생제 처방해 드릴게요.', 'A 대사'),
  (8, 'I feel pretty worn out. Do I need an injection or an IV?', '너무 기운이 없어요. 주사나 링거 맞아야 할까요?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 54
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 54) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Here you go. Take two tablets twice a day.', '여기 있어요. 하루 두 번, 두 알씩 드세요.', 'A 대사'),
  (2, 'When should I take this? Before or after meals?', '언제 먹어야 해요? 식전이에요, 식후예요?', 'B 대사'),
  (3, 'After meals.', '식후요.', 'A 대사'),
  (4, 'How long do I need to take it?', '얼마 동안 먹어야 해요?', 'B 대사'),
  (5, 'For five days.', '5일 동안이요.', 'A 대사'),
  (6, 'Do I need to finish all of these?', '이거 다 먹어야 해요?', 'B 대사'),
  (7, 'Yes, finish the full course, even if you feel better.', '네, 나아진 것 같아도 끝까지 다 드세요.', 'A 대사'),
  (8, 'Are there any side effects?', '부작용 있어요?', 'B 대사'),
  (9, 'You might feel a bit sleepy.', '좀 졸릴 수 있어요.', 'A 대사'),
  (10, 'Can I drink alcohol with this medication?', '이 약 먹으면서 술 마셔도 돼요?', 'B 대사'),
  (11, 'No, avoid alcohol while taking this.', '아뇨, 이 약 드시는 동안은 술 피하세요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 55
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 55) and item_order > 11;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, are you okay? You don''t look well.', '저기, 괜찮아요? 안색이 안 좋아 보여요.', 'A 대사'),
  (2, 'I''m not feeling well. I think I''m going to pass out.', '몸이 안 좋아요. 쓰러질 것 같아요.', 'B 대사'),
  (3, 'Sit down. Do you want me to call triple zero?', '앉아요. 000(응급번호)에 전화해 줄까요?', 'A 대사'),
  (4, 'Please. My head is spinning.', '네, 부탁해요. 머리가 빙빙 돌아요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 56
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 56) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Oh my god. What happened?!', '세상에. 무슨 일이야?!', 'A 대사'),
  (2, 'I just cut my finger. It won''t stop bleeding.', '방금 손가락을 베었어. 피가 안 멈춰.', 'B 대사'),
  (3, 'Okay, sit down. Let me get the first aid kit.', '알았어, 앉아 있어. 구급상자 가져올게.', 'A 대사'),
  (4, 'Thanks. Can you press on it for me? I feel a bit lightheaded.', '고마워. 여기 좀 눌러줄래? 좀 어지러워.', 'B 대사'),
  (5, 'Do you want me to call an ambulance?', '구급차 불러줄까?', 'A 대사'),
  (6, 'Yes, please. Do we have a Band-Aid?', '응, 부탁해. 밴드 있어?', 'B 대사'),
  (7, 'Yeah, but it looks pretty deep. I don''t think a Band-Aid''s gonna work.', '응, 근데 꽤 깊어 보여. 밴드로는 안 될 것 같아.', 'A 대사'),
  (8, 'Do you think I need stitches?', '꿰매야 할 것 같아?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 57
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 57) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Man, you alright? You''re scratching a lot.', '야, 괜찮아? 엄청 긁고 있네.', 'A 대사'),
  (2, 'Think I''m having an allergic reaction. My whole body is itchy and my lips are swelling.', '알레르기 반응 온 것 같아. 온몸이 가렵고 입술이 붓고 있어.', 'B 대사'),
  (3, 'That''s serious. Do you have an EpiPen?', '그거 심각한데. 에피펜 있어?', 'A 대사'),
  (4, 'No. I feel like I''m choking. I can''t breathe properly.', '아니. 숨 막힐 것 같아. 숨을 제대로 못 쉬겠어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 58
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 58) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Is everything okay?', '괜찮아요?', 'A 대사'),
  (2, 'Actually... I think that guy''s been following me.', '사실... 저 남자가 저를 계속 따라오는 것 같아요.', 'B 대사'),
  (3, 'Alright, come stand next to me.', '알겠어요, 제 옆에 와서 서 있어요.', 'A 대사'),
  (4, 'Can you pretend you know me? Just act like I''m with you.', '저랑 아는 사이인 척해 줄 수 있어요? 그냥 일행인 것처럼요.', 'B 대사'),
  (5, 'Yeah, of course. Do you know him?', '네, 물론이죠. 저 사람 아는 사람이에요?', 'A 대사'),
  (6, 'No, I don''t even know who he is.', '아뇨, 누군지도 몰라요.', 'B 대사'),
  (7, 'I think he''s leaving now. What do you do by the way?', '이제 가는 것 같네요. 근데 무슨 일 하세요?', 'A 대사'),
  (8, 'Are you hitting on me now?', '지금 저 꼬시는 거예요?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 59
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 59) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'G''day. What can I do for you today?', '안녕하세요. 오늘 무슨 일로 오셨어요?', 'A 대사'),
  (2, 'Hi, my phone got stolen on the tram. I need to report it.', '안녕하세요, 트램에서 휴대폰을 도둑맞았어요. 신고하려고요.', 'B 대사'),
  (3, 'Alright. When did it happen?', '알겠어요. 언제 그랬어요?', 'A 대사'),
  (4, 'About 20 minutes ago, near Flinders Street Station.', '20분 전쯤에 플린더스 스트리트 역 근처에서요.', 'B 대사'),
  (5, 'Do you know which tram number it was?', '몇 번 트램이었는지 아세요?', 'A 대사'),
  (6, 'Yeah, it was the tram 86.', '네, 86번 트램이었어요.', 'B 대사'),
  (7, 'Okay. Was it taken from your pocket or your bag?', '네. 주머니에서 가져갔어요, 가방에서 가져갔어요?', 'A 대사'),
  (8, 'From my jacket pocket. I didn''t notice until I got off.', '재킷 주머니에서요. 내릴 때까지 몰랐어요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'bootcamp' and l.day_number = 60
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'bootcamp' and day_number = 60) and item_order > 8;
commit;

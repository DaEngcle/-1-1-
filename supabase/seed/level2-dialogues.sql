-- Level 2.0: 교재(캔바 '📗 Level 2.0 교재') 대화 → 쉐도잉 문장, Day 56 영상, Day 56까지 공개.
-- Day 49는 노래 가사라 문장에 넣지 않음. 해석은 AI 초안. 여러 번 실행해도 안전하다.
begin;
update lessons set title = 'Don''t try to show me up.', title_ko = '나한테 잘난 척하지 마', video_url = 'https://youtu.be/fvZEu_nuZHg', description = null where course_id = 'level2' and day_number = 56;
update lessons set video_live = false where course_id = 'level2';
update lessons set description = '노래(Niki - Lowkey)로 배우는 날이라 쉐도잉 문장은 따로 없어요. 강의 영상으로 함께해요!' where course_id = 'level2' and day_number = 49;
update lessons set is_published = (kind = 'day' and day_number <= 56) or (kind = 'drill' and week_number <= 11) where course_id = 'level2';
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So I''ve been seeing this Japanese restaurant pop up all over my feed and because I love Japanese food and I tend to get FOMO,', '요즘 피드에 이 일식집이 계속 뜨더라고요. 제가 일식을 엄청 좋아하기도 하고 남들 다 가는 데 나만 못 가면 못 참는 성격이라,', null),
  (2, 'I had to try it out for myself.', '직접 가봐야겠다 싶었어요.', null),
  (3, 'It''s called Kappo Tora, it''s located in the CBD.', '이름은 갓포 토라고요, 시티(CBD)에 있어요.', null),
  (4, 'We got a beef and a katsu set, oysters, chirashi bowl, sashimi and sushi.', '소고기 세트랑 카츠 세트, 굴, 지라시 덮밥, 사시미랑 스시 시켰어요.', null),
  (5, 'Everything was so yum.', '전부 다 너무 맛있었어요.', null),
  (6, 'If you''re planning to visit, definitely go early because it filled up really quickly.', '가실 생각이면 무조건 일찍 가세요. 자리가 진짜 금방 차더라고요.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 1
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 1) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey Emma, you know this area better than me. Where do you eat around here?', '엠마, 너 이 동네 나보다 잘 알잖아. 이 근처에선 어디서 밥 먹어?', 'A 대사'),
  (2, 'Depends. What are you in the mood for?', '그때그때 달라. 뭐 땡기는데?', 'B 대사'),
  (3, 'I can eat anything. I''m so sick of instant noodles.', '아무거나 다 잘 먹어. 라면은 이제 진짜 질렸어.', 'A 대사'),
  (4, 'Then you''ve gotta try this cafe on Little Coventry Street. It''s a bit of a hidden gem.', '그럼 리틀 코번트리 스트리트에 있는 카페 꼭 가봐. 좀 숨은 맛집이야.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 2
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 2) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'What do they serve?', '거기 뭐 팔아?', 'A 대사'),
  (2, 'Modern Aussie brunch. Their eggs benny is to die for, and the coffee never disappoints.', '모던 호주식 브런치. 에그 베네딕트가 진짜 미쳤고, 커피도 실패한 적이 없어.', 'B 대사'),
  (3, 'Nice. Is it expensive?', '좋다. 비싸?', 'A 대사'),
  (4, 'Not really. It''s pretty good value for money.', '별로. 가성비 꽤 좋아.', 'B 대사'),
  (5, 'What''s your go-to order?', '너는 주로 뭐 시켜?', 'A 대사'),
  (6, 'The souvlaki wrap with feta. It''s super fresh and really filling.', '페타 치즈 들어간 수블라키 랩. 엄청 신선하고 진짜 든든해.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 3
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 3) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''ve been meaning to try that place for months.', '나 거기 몇 달째 가봐야지 하고 있었는데.', 'A 대사'),
  (2, 'Which one?', '어디?', 'B 대사'),
  (3, 'That Thai place near the station. The one with the line out the door every lunch.', '역 근처 태국 음식점. 점심마다 밖까지 줄 서 있는 데.', 'A 대사'),
  (4, 'Oh I walk past that every day.', '아, 거기 나 매일 지나가는데.', 'B 대사'),
  (5, 'We should just go. Like, this week.', '그냥 가자. 막 이번 주에.', 'A 대사'),
  (6, 'I''m in! When works for you?', '콜! 언제 괜찮아?', 'B 대사'),
  (7, 'Thursday? I finish at twelve.', '목요일? 나 12시에 끝나.', 'A 대사'),
  (8, 'Thursday works. I''ll meet you there.', '목요일 좋아. 거기서 보자.', 'B 대사'),
  (9, 'Finally. I''ve been waiting for an excuse to go.', '드디어. 갈 핑계만 기다리고 있었다니까.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 4
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 4) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Only eating iconic Australian food for a full day.', '하루 종일 호주 대표 음식만 먹어보기.', null),
  (2, 'First up, I had to get a Bunnings sausage sizzle for $3.50.', '첫 번째는 당연히 버닝스 소시지 시즐, 3달러 50센트.', null),
  (3, 'If you''re not from Australia, a sausage sizzle is basically a sausage on white bread with onions.', '호주 사람 아니면 모를 수도 있는데, 소시지 시즐은 그냥 식빵에 소시지랑 양파 올린 거예요.', null),
  (4, 'It''s so simple, but slaps every single time.', '진짜 단순한데 먹을 때마다 개맛있어요.', null),
  (5, 'Next, I got a sausage roll from Bourke Street Bakery for $7.50.', '다음은 버크 스트리트 베이커리 소시지 롤, 7달러 50센트.', null),
  (6, 'Look at that golden, flaky pastry.', '이 노릇노릇 바삭한 페이스트리 좀 보세요.', null),
  (7, 'Gotta squeeze on some tomato sauce.', '토마토 소스 짜줘야죠.', null),
  (8, 'I really like the pork and fennel filling.', '돼지고기랑 펜넬 속 진짜 맛있어요.', null),
  (9, 'It''s super tasty, definitely better than the ones at the servo.', '완전 맛있어요. 주유소에서 파는 거보다 확실히 나아요.', null),
  (10, 'By the way, did anyone else grow up drinking Milo?', '근데 혹시 다른 분들도 어릴 때 마일로 마시면서 컸어요?', null),
  (11, 'Did you like it hot or cold?', '따뜻한 거 좋아했어요, 차가운 거 좋아했어요?', null),
  (12, 'I''m usually a cold Milo fan.', '저는 보통 차가운 마일로파예요.', null),
  (13, 'I love eating it with a spoon, but I made it hot today because we''re gonna do a Tim Tam slam.', '숟가락으로 퍼먹는 거 좋아하는데, 오늘은 팀탐 슬램 할 거라서 따뜻하게 탔어요.', null),
  (14, 'Now, if you haven''t done it before, you get a Tim Tam and bite the corners off at a diagonal like this,', '안 해본 분들을 위해 설명하자면, 팀탐 하나 들고 이렇게 대각선으로 모서리를 깨물어서 떼요,', null),
  (15, 'and you use it like a straw to sip up your hot drink, and it makes it all melty and gooey,', '그다음 빨대처럼 써서 따뜻한 음료를 빨아올리면 막 녹아서 끈적해지거든요,', null),
  (16, 'so you''ve gotta slam it in your mouth really quickly.', '그러니까 진짜 빨리 입에 확 넣어야 돼요.', null),
  (17, 'It''s a little messy, but it''s so good.', '좀 지저분하긴 한데 진짜 맛있어요.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 5
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 5) and item_order > 17;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I literally piss myself when trying to talk to an attractive girl because I''m so nervous.', '예쁜 여자한테 말 걸려고 하면 너무 긴장돼서 진짜 오줌 지릴 것 같아요.', null),
  (2, 'Do you have any advice?', '조언 좀 해주실 수 있나요?', null),
  (3, 'Well, brother I can''t give you advice on that.', '음, 형제여, 그건 내가 조언해줄 수가 없네.', null),
  (4, 'Literal sense of that, but I think I can in the figurative sense of that.', '말 그대로의 의미로는 말이야. 근데 비유적인 의미로는 해줄 수 있을 것 같아.', null),
  (5, 'If you''re anything like me, during my early years of high school, I would not speak to a girl unless I was spoken to by a girl.', '너도 나랑 비슷하다면, 나 고등학교 초반엔 여자애가 먼저 말 걸지 않으면 절대 말 안 걸었거든.', null),
  (6, 'And then I fuck up the conversation in any way, because my face would blow up red like a tomato, and it would be instant turnoff.', '그러고는 어떻게든 대화를 개망쳤지. 얼굴이 토마토처럼 시뻘게져서 바로 정떨어지게 만들었거든.', null),
  (7, 'And that was because I was never taught how to properly talk to a girl.', '그건 여자랑 제대로 대화하는 법을 한 번도 배워본 적이 없어서였어.', null),
  (8, 'Think about them.', '생각해 봐.', null),
  (9, 'Women are women.', '여자도 그냥 사람이야.', null),
  (10, 'Nothing crazy.', '별거 없어.', null),
  (11, 'And I say that with pure respect.', '이건 순수하게 존중하는 마음으로 하는 말이야.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 6
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 6) and item_order > 11;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey. You alright?', '야. 괜찮아?', 'A 대사'),
  (2, 'Yeah. I''m fine.', '응. 괜찮아.', 'B 대사'),
  (3, 'You sure? You''ve barely said a word all morning.', '진짜? 아침 내내 거의 말 한마디도 안 했잖아.', 'A 대사'),
  (4, 'I''ve just got a lot on my mind.', '그냥 생각이 좀 많아서.', 'B 대사'),
  (5, 'Wanna talk about it, or would you rather I just shut up?', '얘기하고 싶어, 아니면 나 그냥 조용히 있을까?', 'A 대사'),
  (6, 'I''d rather have five minutes first. Then I''ll talk.', '일단 5분만 줘. 그다음에 얘기할게.', 'B 대사'),
  (7, 'Take your time. I''m not going anywhere.', '천천히 해. 나 어디 안 가.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 7
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 7) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I need a jacket I can wear to work and on weekends.', '출근할 때도, 주말에도 입을 수 있는 재킷이 필요해.', 'A 대사'),
  (2, 'Get a black one. It''s really versatile.', '검은색으로 사. 진짜 아무 데나 잘 어울려.', 'B 대사'),
  (3, 'What does that mean?', '그게 무슨 뜻이야?', 'A 대사'),
  (4, 'You can dress it up for work or dress it down for a casual look.', '출근할 땐 단정하게 입고, 평소엔 캐주얼하게 편하게 입을 수 있다는 거지.', 'B 대사'),
  (5, 'Oh, so it''s kind of a go-to jacket?', '아, 그러니까 손이 제일 자주 가는 재킷 같은 거?', 'A 대사'),
  (6, 'Exactly. You''ll get a lot of wear out of it.', '바로 그거. 엄청 자주 입게 될 거야.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 8
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 8) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'What would you do? If you were me?', '너라면 어떻게 할 거야? 네가 나라면?', 'A 대사'),
  (2, 'Hold on. He''s having an affair?', '잠깐만. 그 사람 바람피우는 거야?', 'B 대사'),
  (3, 'Apparently.', '그런가 봐.', 'A 대사'),
  (4, 'I did not see that coming. That totally caught me off guard. Have you talked to him about it?', '와, 전혀 예상 못 했어. 완전 허를 찔렸네. 그 사람이랑 얘기는 해봤어?', 'B 대사'),
  (5, 'I honestly don''t know what to do.', '솔직히 어떻게 해야 할지 모르겠어.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 9
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 9) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'They''re humans just like you and I, with human thoughts, emotions and feelings.', '여자들도 너나 나처럼 똑같은 사람이야. 사람으로서 생각도 하고 감정도 느끼고.', null),
  (2, 'But the sad thing today is that society is overly sexualized.', '근데 요즘 슬픈 건 사회가 너무 성적으로 치우쳐 있다는 거야.', null),
  (3, 'So women are pedestalized for men because our pleasure comes from them, which is a problem.', '그래서 남자들은 여자를 떠받들게 돼. 우리 쾌락이 여자한테서 오니까. 그게 문제야.', null),
  (4, 'But, don''t scroll away yet.', '근데 아직 넘기지 마.', null),
  (5, 'I have two approaches that you can start doing today.', '오늘 당장 시작할 수 있는 방법 두 가지가 있어.', null),
  (6, 'Very very simple, very minimal anxiety involved.', '진짜 진짜 간단하고, 긴장될 일도 거의 없어.', null),
  (7, 'Because not a lot of pressure is on you.', '너한테 부담이 별로 없거든.', null),
  (8, 'The pressure is actually on her to perform.', '오히려 부담은 상대방이 잘 해내야 하는 쪽에 있어.', null),
  (9, 'So, you can start humanizing the girls bro.', '그러니까 여자들을 그냥 사람으로 보기 시작하면 돼, 브로.', null),
  (10, 'The first thing is walking to a store which you have semi interest in,', '첫 번째는 좀 관심 있는 가게에 들어가서,', null),
  (11, 'and start chatting up a conversation with the sales lady or the girl at the desk.', '판매 직원이나 카운터에 있는 여자 직원이랑 대화를 시작하는 거야.', null),
  (12, 'The pressure is on her to sell you on the products in the store, because she probably makes a commission based on them.', '그 사람은 너한테 가게 물건을 팔아야 하는 부담이 있어. 아마 판매 수수료를 받을 테니까.', null),
  (13, 'This is not hitting on her.', '이건 작업 거는 게 아니야.', null),
  (14, 'This is humanizing her.', '그 사람을 그냥 사람으로 대하는 거지.', null),
  (15, 'Okay.', '알겠지.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 10
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 10) and item_order > 15;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'You''re kidding me.', '말도 안 돼.', 'A 대사'),
  (2, 'Closed on Mondays. I completely forgot to check.', '월요일 휴무래. 확인하는 걸 완전 까먹었어.', 'B 대사'),
  (3, 'No biggie. There''s literally a whole street here.', '별거 아냐. 여기 가게 깔린 게 한 블록이잖아.', 'A 대사'),
  (4, 'I''m so sorry, I had this whole plan—', '진짜 미안해, 나 계획 다 짜놨었는데—', 'B 대사'),
  (5, 'It''s okay.', '괜찮아.', 'A 대사'),
  (6, 'You''re not annoyed?', '짜증 안 나?', 'B 대사'),
  (7, 'We''re in a new suburb we''ve never been to. It''s not the end of the world.', '한 번도 안 와본 동네에 와 있잖아. 세상 끝난 것도 아닌데 뭐.', 'A 대사'),
  (8, 'Okay. Let''s just walk and see what looks good.', '그래. 그냥 걸으면서 괜찮아 보이는 데 찾아보자.', 'B 대사'),
  (9, 'Sounds like a plan.', '좋아, 그렇게 하자.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 11
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 11) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, '...And there it goes.', '...아, 가버렸다.', 'A 대사'),
  (2, 'When''s the next one?', '다음 거 언제야?', 'B 대사'),
  (3, 'Forty minutes from now.', '40분 뒤.', 'A 대사'),
  (4, 'That''s long as fuck.', '존나 기네.', 'B 대사'),
  (5, 'Yep. Forty whole minutes.', '그러게. 무려 40분.', 'A 대사'),
  (6, 'There''s a bench. We may as well sit down.', '저기 벤치 있다. 그냥 앉아 있자.', 'B 대사'),
  (7, 'There''s literally nothing around here.', '이 근처에 진짜 아무것도 없네.', 'A 대사'),
  (8, 'Could''ve been worse.', '더 나빴을 수도 있지.', 'B 대사'),
  (9, 'How?', '어떻게?', 'A 대사'),
  (10, 'Could be raining.', '비 올 수도 있잖아.', 'B 대사'),
  (11, 'Don''t jinx it.', '말이 씨가 된다, 하지 마.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 12
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 12) and item_order > 11;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I have a booking under the name Daniel Shin for tonight.', '안녕하세요, 오늘 저녁에 대니얼 신 이름으로 예약했는데요.', 'A 대사'),
  (2, 'Sorry, I''m not seeing anything coming up under that name. What date was the booking for?', '죄송한데 그 이름으로는 아무것도 안 뜨네요. 며칠로 예약하셨어요?', 'B 대사'),
  (3, 'Tonight, the sixteenth. That''s strange... it should be there.', '오늘 저녁, 16일이요. 이상하네요... 있어야 하는데.', 'A 대사'),
  (4, 'Unfortunately, we''re fully booked this evening.', '안타깝게도 오늘 저녁은 예약이 꽉 찼어요.', 'B 대사'),
  (5, 'Ah, okay. Any chance you''ve had a cancellation, or could you squeeze us in somehow?', '아, 네. 혹시 취소된 자리 있거나, 어떻게든 끼워주실 수 있을까요?', 'A 대사'),
  (6, 'I can''t promise anything, but I can put your name down on the waitlist.', '장담은 못 드리지만, 대기 명단에 이름 올려드릴 수는 있어요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 13
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 13) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Excuse me, sorry to bother you. Do you know this area well?', '실례합니다, 귀찮게 해서 죄송해요. 이 동네 잘 아세요?', 'A 대사'),
  (2, 'Pretty well, yeah. You lost?', '네, 꽤 잘 알죠. 길 잃으셨어요?', 'B 대사'),
  (3, 'Not exactly lost. Just looking for somewhere good to eat.', '길을 잃은 건 아니고요. 그냥 밥 먹을 괜찮은 데 찾고 있어서요.', 'A 대사'),
  (4, 'What are you after?', '뭐 찾으시는데요?', 'B 대사'),
  (5, 'Just somewhere local. Not a touristy place, that kind of thing.', '그냥 현지인들 가는 데요. 관광객용 말고, 그런 느낌이요.', 'A 대사'),
  (6, 'In that case, I''d steer clear of the main strip. There''s a Vietnamese place down that alley that''s pretty popular with locals.', '그럼 메인 거리는 피하시는 게 좋아요. 저 골목 안쪽에 현지인들한테 꽤 인기 있는 베트남 식당 있어요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 14
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 14) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'All righty, I think that''s everything.', '좋아요, 이걸로 다 된 것 같네요.', null),
  (2, 'Awesome.', '좋아요.', null),
  (3, 'Thank you.', '고마워요.', null),
  (4, 'Ask her.', '물어봐.', null),
  (5, 'I will.', '물어볼게.', null),
  (6, 'Mmm, sparkling.', '음~ 탄산이네.', null),
  (7, 'Yummy.', '맛있다.', null),
  (8, 'Um, Emily?', '저기, 에밀리?', null),
  (9, 'Yeah, darling?', '응, 자기야?', null),
  (10, 'Is there any chance that I could leave a bit earlier today?', '혹시 오늘 조금 일찍 퇴근해도 될까요?', null),
  (11, 'Totally fine if I can''t.', '안 되면 진짜 괜찮아요.', null),
  (12, 'I just thought I''d ask.', '그냥 한번 여쭤봤어요.', null),
  (13, 'Of course.', '당연하지.', null),
  (14, 'Take the afternoon.', '오후는 쉬어.', null),
  (15, 'Thank you.', '감사합니다.', null),
  (16, 'Um, Emily, could I have next week off, please?', '저기, 에밀리, 다음 주 휴가 써도 될까요?', null),
  (17, 'I''ve got a really busy week coming up.', '다음 주에 일이 엄청 많아서요.', null),
  (18, 'Absolutely.', '물론이지.', null),
  (19, 'Approved.', '승인.', null),
  (20, 'Oh my god, thank you.', '헐, 감사해요.', null),
  (21, 'Actually, can I get an extension on that report until Monday?', '그리고 혹시 그 보고서 월요일까지 미뤄도 될까요?', null),
  (22, 'Okay.', '그래.', null),
  (23, 'Make it Tuesday.', '화요일까지 해.', null),
  (24, 'No point stressing yourself out.', '괜히 스트레스 받을 필요 없잖아.', null),
  (25, 'Oh my god.', '대박.', null),
  (26, 'Lipton sparkling.', '립톤 스파클링.', null),
  (27, 'All right, see you guys.', '그럼 다들 내일 봐요.', null),
  (28, 'See you.', '잘 가요.', null),
  (29, 'Bye.', '안녕.', null),
  (30, 'Go buy a whole case and put it in her fridge now.', '지금 당장 한 박스 사서 그 사람 냉장고에 넣어놔.', null),
  (31, 'Let''s go.', '가자.', null),
  (32, 'Move, move, move.', '빨리빨리빨리.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 15
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 15) and item_order > 32;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi. I''m Daniel. I''m here about the casual position?', '안녕하세요. 대니얼이에요. 캐주얼 자리 때문에 왔는데요?', 'A 대사'),
  (2, 'Yeah, Daniel. Welcome. So today is your trial shift.', '아, 대니얼. 어서 와요. 오늘은 트라이얼 시프트예요.', 'B 대사'),
  (3, 'Great. Sorry, can I just check, what''s the hourly rate?', '좋아요. 죄송한데 하나만 확인할게요, 시급이 얼마예요?', 'A 대사'),
  (4, 'It''s the award rate plus casual loading, so about thirty-three an hour at the moment.', '어워드 기준 시급에 캐주얼 로딩 붙어서, 지금은 시간당 33달러 정도예요.', 'B 대사'),
  (5, 'And casual loading, that''s the 25% on top, right?', '캐주얼 로딩이면 25% 더 붙는 거 맞죠?', 'A 대사'),
  (6, 'That''s right. You don''t get paid leave as a casual, so the loading covers that.', '맞아요. 캐주얼은 유급휴가가 없으니까 그걸 로딩으로 보전해주는 거예요.', 'B 대사'),
  (7, 'Got it. That makes sense.', '알겠어요. 이해됐어요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 16
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 16) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, quick question. When do I get paid?', '저기, 하나만 물어볼게요. 급여는 언제 들어와요?', 'A 대사'),
  (2, 'We pay weekly. Your pay usually lands in your account on Friday.', '주급이에요. 보통 금요일에 계좌로 들어와요.', 'B 대사'),
  (3, 'Got it. Does that cover all the hours I''ve worked this week?', '알겠어요. 그럼 이번 주에 일한 시간 전부 들어가는 거예요?', 'A 대사'),
  (4, 'Almost. Anything you work after Thursday goes into next week''s pay.', '거의요. 목요일 이후에 일한 건 다음 주 급여로 넘어가요.', 'B 대사'),
  (5, 'Gotcha. And I''ll get a payslip by email, right?', '알겠어요. 페이슬립은 이메일로 오는 거 맞죠?', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 17
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 17) and item_order > 5;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, I was checking my payslip and noticed something seems off with the tax.', '저기, 페이슬립 보다가 세금 쪽이 좀 이상한 것 같아서요.', 'A 대사'),
  (2, 'Oh yeah? What''s the issue?', '아 그래요? 뭐가 문제예요?', 'B 대사'),
  (3, 'I thought I was supposed to be paying around 15% tax, but this payslip shows about 25%.', '제가 알기론 세금이 15% 정도여야 하는데, 페이슬립엔 25% 정도로 나와 있어요.', 'A 대사'),
  (4, 'Let me have a look. It could be an issue with the tax declaration details we have on file.', '한번 볼게요. 저희가 갖고 있는 택스 신고서(TFN 신고) 정보에 문제가 있을 수도 있어요.', 'B 대사'),
  (5, 'Do you know why that happened?', '왜 그렇게 된 건지 아세요?', 'A 대사'),
  (6, 'It looks like the system is taking too much tax from your pay. Let me check your details.', '시스템에서 급여에서 세금을 너무 많이 떼고 있는 것 같네요. 정보 한번 확인해 볼게요.', 'B 대사'),
  (7, 'Is there any way to fix it?', '고칠 방법이 있을까요?', 'A 대사'),
  (8, 'Absolutely. We''ll work out what''s causing it and update your details if needed.', '그럼요. 원인 찾아보고 필요하면 정보 업데이트해 드릴게요.', 'B 대사'),
  (9, 'Okay thanks. I appreciate it.', '네, 고마워요. 정말 감사해요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 18
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 18) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'What''s this line — PAYG?', '이 항목은 뭐예요? PAYG?', 'A 대사'),
  (2, 'Pay As You Go. That''s your income tax being deducted each pay.', 'Pay As You Go(원천징수)요. 급여 받을 때마다 소득세가 떼이는 거예요.', 'B 대사'),
  (3, 'And this one — SGC?', '그럼 이건요? SGC?', 'A 대사'),
  (4, 'Superannuation Guarantee Contribution. Your super. 11.5% of your gross.', 'Superannuation Guarantee Contribution, 그러니까 슈퍼(퇴직연금)예요. 세전 급여의 11.5%요.', 'B 대사'),
  (5, 'That goes into my super account?', '그게 제 슈퍼 계좌로 들어가는 거예요?', 'A 대사'),
  (6, 'Yeah. You can access it when you leave Australia — there''s a process for it.', '네. 호주 떠날 때 찾을 수 있어요. 따로 신청 절차가 있어요.', 'B 대사'),
  (7, 'How do I know my super is actually going in?', '슈퍼가 진짜 들어가고 있는지 어떻게 알아요?', 'A 대사'),
  (8, 'Your employer should be paying it quarterly.', '고용주가 분기마다 넣어줘야 하는 거예요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 19
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 19) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'My manager keeps saying he''ll fix it. It''s been three weeks.', '매니저가 계속 고쳐주겠다고만 해. 벌써 3주째야.', 'A 대사'),
  (2, 'Mate. That''s not okay. Have you contacted Fair Work?', '야, 그건 아니지. Fair Work(공정근로옴부즈맨)에 연락해 봤어?', 'B 대사'),
  (3, 'Not yet. Is that a big deal?', '아직. 그게 큰일이야?', 'A 대사'),
  (4, 'It''s not a big deal to contact them. They have a free advice line.', '연락하는 건 별일 아니야. 무료 상담 전화도 있어.', 'B 대사'),
  (5, 'Will it affect my job?', '그러면 내 일자리에 영향 있을까?', 'A 대사'),
  (6, 'Legally they can''t fire you for reporting a wage issue.', '법적으로는 임금 문제 신고했다고 자를 수 없어.', 'B 대사'),
  (7, 'Legally. But in practice?', '법적으로는. 근데 현실은?', 'A 대사'),
  (8, 'Keep records of everything. Every conversation, every email. Just in case.', '전부 다 기록해 둬. 대화 하나하나, 이메일 하나하나. 혹시 모르니까.', 'B 대사'),
  (9, 'I''ve been doing that.', '그건 계속 하고 있어.', 'A 대사'),
  (10, 'Then you''re in a good position. Call them. It''s anonymous if you want.', '그럼 유리한 상황이네. 전화해 봐. 원하면 익명으로도 돼.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 20
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 20) and item_order > 10;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, just a heads-up. Is there any chance I could get next Saturday off?', '저기, 미리 말씀드리는 건데요. 혹시 다음 주 토요일에 쉴 수 있을까요?', 'A 대사'),
  (2, 'Next Saturday? We''re already pretty short-staffed. What''s up?', '다음 주 토요일? 안 그래도 사람이 꽤 모자란데. 무슨 일 있어?', 'B 대사'),
  (3, 'A mate''s coming over from Sydney for the weekend. I was hoping to catch up with him.', '친구가 주말에 시드니에서 놀러 와서요. 만나서 얼굴 좀 보고 싶어서요.', 'A 대사'),
  (4, 'Yeah, that''s going to be a tough one.', '음, 그건 좀 어렵겠는데.', 'B 대사'),
  (5, 'What if I cover an extra shift next week?', '제가 다음 주에 시프트 하나 더 뛰면 어때요?', 'A 대사'),
  (6, 'Hmm... tempting.', '흠... 솔깃하네.', 'B 대사'),
  (7, 'And I''ll take the Sunday close if you need someone.', '그리고 사람 필요하시면 일요일 마감도 제가 할게요.', 'A 대사'),
  (8, 'Alright. Let me see what I can do.', '알았어. 어떻게 해볼 수 있을지 볼게.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 21
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 21) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, sorry for the late notice, but is there any chance I could leave a bit early?', '저기, 갑자기 말씀드려서 죄송한데요, 혹시 조금 일찍 가봐도 될까요?', 'A 대사'),
  (2, 'Today? Everything alright?', '오늘? 괜찮은 거야?', 'B 대사'),
  (3, 'Not really.', '별로요.', 'A 대사'),
  (4, 'I''ve got a splitting headache and I''ve been up since about 3 this morning.', '머리가 깨질 것 같고, 새벽 3시쯤부터 깨어 있었어요.', 'A 대사'),
  (5, 'I barely got any sleep, so I don''t think I''d be much use for the rest of my shift.', '잠을 거의 못 자서 남은 시프트 동안 별 도움이 안 될 것 같아요.', 'A 대사'),
  (6, 'Fair enough. Have you had a chance to see if anyone can cover your shift?', '그럴 만하네. 혹시 네 시프트 대신해 줄 사람 있는지 알아봤어?', 'B 대사'),
  (7, 'Yeah, I messaged Emma earlier and she said she can come.', '네, 아까 엠마한테 메시지 보냈는데 올 수 있대요.', 'A 대사'),
  (8, 'Okay, as soon as she confirms with me, you can head off.', '좋아, 엠마가 나한테 확인해 주면 바로 가도 돼.', 'B 대사'),
  (9, 'No worries. I''ll get her to shoot you a message.', '네, 알겠어요. 엠마한테 메시지 하나 보내 달라고 할게요.', 'A 대사'),
  (10, 'Sounds good. Get some rest and keep me posted if you''re still unwell tomorrow.', '좋아. 푹 쉬고, 내일도 안 좋으면 연락 줘.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 22
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 22) and item_order > 10;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Did you finish all your work?', '일 다 끝냈어?', 'A 대사'),
  (2, 'Yeah, I figured I''d knock it out so I can chill for the rest of the day.', '네, 빨리 해치우고 남은 시간엔 좀 쉬려고요.', 'B 대사'),
  (3, 'I think you''re the fastest, most efficient employee here.', '너 여기서 제일 빠르고 일 제일 잘하는 직원인 것 같아.', 'A 대사'),
  (4, 'Thanks. Does that mean I get a reward?', '감사합니다. 그럼 보상 같은 거 있는 거예요?', 'B 대사'),
  (5, 'Yes.', '응.', 'A 대사'),
  (6, 'Finally. You don''t know how long I''ve been waiting for that pay raise. So how much we talking, a couple of George Washingtons?', '드디어. 제가 그 월급 인상을 얼마나 기다렸는지 모르실 거예요. 그래서 얼마예요? 1달러짜리 몇 장?', 'B 대사'),
  (7, 'It''s not a raise.', '인상은 아니야.', 'A 대사'),
  (8, 'Oh. Oh, you''re gonna let me leave early. Well, I wasn''t finished watching my show, but all right. I''ll see you tomorrow then.', '아. 아, 일찍 퇴근시켜 주시는 거구나. 뭐, 보던 드라마 아직 다 못 봤는데, 알겠어요. 그럼 내일 봬요.', 'B 대사'),
  (9, 'No, it''s not that either.', '아니, 그것도 아니야.', 'A 대사'),
  (10, 'So you''re gonna give me a promotion?', '그럼 승진시켜 주시는 거예요?', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 23
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 23) and item_order > 10;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Okay, yeah, ''cause that doesn''t sound like something you would do. So what''s my reward?', '그렇죠, 그건 사장님이 할 만한 일이 아니죠. 그래서 제 보상이 뭔데요?', 'A 대사'),
  (2, 'I have another task for you.', '너한테 줄 일이 하나 더 있어.', 'B 대사'),
  (3, 'That sounds more like you. So my reward for being good at my job is actually a punishment to do more work?', '그게 더 사장님답네요. 그러니까 일 잘한 보상이 일 더 하라는 벌이라고요?', 'A 대사'),
  (4, 'No, I''m giving you another opportunity to demonstrate your skills.', '아니, 네 실력을 보여줄 기회를 한 번 더 주는 거지.', 'B 대사'),
  (5, 'Well, you can miss me with that opportunity, especially if a pay raise doesn''t come with it.', '그런 기회는 사양할게요. 특히 월급 인상이 안 따라온다면요.', 'A 대사'),
  (6, 'But you''re finished with all your work.', '근데 너 일 다 끝냈잖아.', 'B 대사'),
  (7, 'Now that I think about it, I got a couple things I gotta do.', '생각해 보니까 해야 할 게 몇 개 있었네요.', 'A 대사'),
  (8, 'But on the bright side, you get to keep the reward and do this task.', '그래도 좋게 생각해. 보상도 챙기고 이 일도 할 수 있잖아.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 24
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 24) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey, boss, do you mind if we have a chat for a minute?', '사장님, 잠깐 얘기 좀 할 수 있을까요?', 'A 대사'),
  (2, 'If it''s not gonna cost me money, go for it.', '나한테 돈 드는 얘기만 아니면 해 봐.', 'B 대사'),
  (3, 'Well, sir, I''ve been working here five years now.', '저기, 사장님, 제가 여기서 일한 지 벌써 5년이에요.', 'A 대사'),
  (4, 'Company doesn''t make money like it used to.', '회사가 예전만큼 돈을 못 벌어.', 'B 대사'),
  (5, 'Oh, no, it doesn''t. Okay, sir, I think given that I do the work of three people, it''s time we look at increasing my salary.', '아, 네, 그렇죠. 그래도 사장님, 제가 세 사람 몫을 하고 있으니까 이제 월급 인상을 좀 생각해 볼 때인 것 같아요.', 'A 대사'),
  (6, 'You want me to hire someone to take some of your work?', '네 일 좀 덜어줄 사람을 뽑아달라는 거야?', 'B 대사'),
  (7, 'That is absolutely ab- absolutely not what I''m saying right now.', '그건 절대, 절- 절대로 제가 지금 하는 말이 아니에요.', 'A 대사'),
  (8, 'You''re saying you can''t handle the workload.', '업무량을 감당 못 하겠다는 거네.', 'B 대사'),
  (9, 'I''m handling it okay. I''m just saying it''s far outside my job description, and I think I deserve to be paid more.', '감당은 잘하고 있어요. 그냥 제 업무 범위를 한참 벗어난 일이니까 돈을 더 받아야 한다는 거예요.', 'A 대사'),
  (10, 'You''re saying we should be paying more for the work that you get done.', '네가 해낸 일에 대해 돈을 더 줘야 한다는 말이구나.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 25
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 25) and item_order > 10;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'This one military brother came up to me, who was just like, "hey man, I want to buy you a drink." I''m like, "no, no, thank you.', '어떤 군인 형님이 다가오더니 “야, 내가 술 한잔 살게” 이러는 거야. 그래서 난 “아뇨, 아뇨, 괜찮아요.', null),
  (2, 'I can buy my own drink.', '제 술은 제가 사 먹을 수 있어요.', null),
  (3, 'Thank you." He''s like, "no, I want to buy you a drink." So at this point,', '감사합니다” 했지. 그랬더니 “아니, 내가 사주고 싶다니까” 이러는 거야. 그래서 이쯤 되니까,', null),
  (4, 'I thought either he wanted to take a selfie or he wanted to fuck me.', '이 사람이 셀카를 찍고 싶은 건지, 아니면 나랑 자고 싶은 건지 둘 중 하나라고 생각했어.', null),
  (5, 'So I''m like, "no, sir, I think I can buy my own drink." And then he started telling me his whole life story.', '그래서 “아뇨, 선생님, 제 술은 제가 살게요” 했더니 자기 인생 얘기를 처음부터 다 하기 시작하는 거야.', null),
  (6, 'He''s like, "you don''t understand.', '“네가 몰라서 그래.', null),
  (7, 'I want to buy you a drink because I was stationed in Okinawa for four years and you guys have been nothing but nice to me."', '내가 오키나와에서 4년 동안 주둔했는데 너네가 나한테 정말 잘해줬거든. 그래서 술 한잔 사고 싶은 거야.”', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 26
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 26) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''m aware that my voice sounds like the type of person to start a hate crime against my face.', '내 목소리가 딱 내 얼굴 같은 사람한테 혐오 범죄 저지를 것 같은 타입이라는 거 나도 알아.', null),
  (2, 'And for that reason, I kind of want to start the podcast for One Nation.', '그래서 원 네이션(호주 극우 정당) 팟캐스트를 한번 해볼까 싶어.', null),
  (3, 'Just so I can be like, "fuck immigration, I hate Asians, turn back the boats." And when I check the thumbnail, it''s just me doing this ^—^.', '그냥 “이민 X까, 아시안 싫어, 난민선 돌려보내” 이렇게 떠들고, 썸네일 보면 그냥 내가 이러고 있는 거지 ^—^.', null),
  (4, 'And the caption''s like, "I really care about One Nation, China."', '그리고 캡션엔 “저는 원 네이션을 진심으로 아낍니다, 중국.” 이렇게 써 있고.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 27
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 27) and item_order > 4;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I''ve got this comment the other day and it said.', '며칠 전에 이런 댓글이 달렸어.', null),
  (2, '"Just because you''re a citizen doesn''t mean you''re Australian." And I just replied "cunt" how''s that for Australian?', '“시민권 있다고 호주 사람인 건 아니야.” 그래서 난 그냥 “cunt(씨발놈아)”라고 답했지. 어때, 이 정도면 호주 사람 맞지?', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 28
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 28) and item_order > 2;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Black dude, What do you do?', '거기 흑인 형, 무슨 일 해요?', null),
  (2, 'I''m a financial analyst.', '금융 분석가요.', null),
  (3, 'A financial analyst.', '금융 분석가라.', null),
  (4, 'You sure you''re black?', '형 진짜 흑인 맞아요?', null),
  (5, 'That''s a very white job.', '완전 백인스러운 직업인데.', null),
  (6, 'That doesn''t sound fun at all.', '하나도 재미없게 들리네요.', null),
  (7, 'You must be terrible at basketball.', '농구 엄청 못하나 보다.', null),
  (8, 'To end up a financial analyst.', '결국 금융 분석가가 된 걸 보면.', null),
  (9, 'You got a gun?', '총 있어요?', null),
  (10, 'No gun?', '총 없어요?', null),
  (11, 'You sure you''re black?', '형 진짜 흑인 맞아요?', null),
  (12, 'It''s the second time.', '이걸로 두 번째네.', null),
  (13, 'Okay, that warrants the question then.', '좋아, 그럼 이 질문을 안 할 수가 없네.', null),
  (14, 'Somebody breaks into your house.', '누가 집에 쳐들어왔어요.', null),
  (15, 'What''s your first line of defense?', '1차 방어 수단이 뭐예요?', null),
  (16, 'What would you do to defend yourself?', '자기 몸 지키려고 뭘 할 거예요?', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 29
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 29) and item_order > 16;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'You gonna fight them?', '맨손으로 싸운다고요?', null),
  (2, 'Okay, Kimbo Slice.', '오케이, 킴보 슬라이스(유명 격투가) 납셨네.', null),
  (3, 'What do you mean you''re gonna fight them?', '싸운다는 게 무슨 말이에요?', null),
  (4, 'You have a background in martial arts?', '무술 배운 적 있어요?', null),
  (5, 'He said, "I''m a black man, as soon as I stand up." Yeah, but chances are, they''re also black.', '이 형이 “내가 흑인인데, 일어서기만 하면 끝이지” 이러네. 근데 그 도둑도 흑인일 확률이 높잖아요.', null),
  (6, 'Maybe.', '아마도.', null),
  (7, 'We don''t know.', '모르는 거죠.', null),
  (8, 'We don''t know.', '모르는 거죠.', null),
  (9, 'We don''t know.', '모르는 거죠.', null),
  (10, 'That was fugged.', '방금 그건 좀 막 나갔다.', null),
  (11, 'There is another black dude here.', '여기 흑인 형 한 명 더 있네.', null),
  (12, 'Hey Terry, no fucking way.', '야 테리, 말도 안 돼, 씨.', null),
  (13, 'What''s up, man?', '형, 안녕?', null),
  (14, 'Nice to meet you.', '만나서 반가워요.', null),
  (15, 'What''s your name?', '이름이 뭐예요?', null),
  (16, 'Marquise.', '마퀴스.', null),
  (17, 'That''s a name, Terry.', '테리, 저게 이름이지.', null),
  (18, 'That''s a name.', '저게 진짜 이름이지.', null),
  (19, 'Marquise is a good ass name, man.', '마퀴스, 존나 좋은 이름이다, 형.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 30
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 30) and item_order > 19;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I knew I was adopted.', '난 내가 입양된 걸 알고 있었어.', null),
  (2, 'My family told us, "you guys are adopted," and I was like, "cool, okay, great — like,', '가족들이 “너희는 입양됐어”라고 말해줬는데, 난 “오 그래, 알겠어, 좋아. 근데,', null),
  (3, 'I don''t know what that means." And then they had asked us if we wanted to call them mom and dad, and from my knowledge I was like,', '그게 무슨 뜻인지는 모르겠어” 이랬지. 그러고 나서 엄마, 아빠라고 부르고 싶냐고 물어봤는데, 내가 아는 선에선', null),
  (4, '"perfect — like, why wouldn''t I?" And so it was just super strange to me,', '“완전 좋지, 안 부를 이유가 없잖아?” 이랬어. 그래서 나한텐 진짜 이상했던 게,', null),
  (5, 'because I remember this day at gym we were talking about our families, and they had said something and I was like, "oh, well,', '체육 시간에 다 같이 가족 얘기를 하던 날이 기억나는데, 누가 무슨 말을 해서 내가 “아, 근데', null),
  (6, 'I''m adopted." And it felt like everything in the room, in the gym, stopped.', '나 입양됐어” 했거든. 그랬더니 체육관 안의 모든 게 딱 멈춘 것 같았어.', null),
  (7, 'And they were like, "WHAT?', '그러고 애들이 “뭐?!', null),
  (8, 'You''re adopted?!" — because that was not to their knowledge.', '너 입양됐어?!” 이러는 거야. 걔네는 그걸 몰랐으니까.', null),
  (9, 'And I was like, "why is everyone freaking out?', '그래서 난 “다들 왜 이렇게 난리야?', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 31
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 31) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Do you like British food?', '영국 음식 좋아해요?', 'A 대사'),
  (2, 'What is British food?', '영국 음식이 뭔데요?', 'B 대사'),
  (3, 'Good question. That''s a really good question. Sausage and mash?', '좋은 질문이네요. 진짜 좋은 질문이에요. 소시지랑 으깬 감자?', 'A 대사'),
  (4, 'Sausage and mash... Potato?', '소시지랑 매시... 감자요?', 'B 대사'),
  (5, 'Toad in the hole?', '토드 인 더 홀?', 'A 대사'),
  (6, 'Ooh, what''s that one?', '오, 그건 뭐예요?', 'B 대사'),
  (7, 'I actually don''t know. I think it has something to do with sausage again.', '사실 저도 몰라요. 그것도 소시지랑 관련 있는 것 같아요.', 'A 대사'),
  (8, 'I think a lot of British food has something to do with sausages.', '영국 음식은 소시지랑 관련된 게 많은 것 같네요.', 'B 대사'),
  (9, 'Yes, it''s true actually. I do love a sausage.', '네, 사실 맞아요. 저 소시지 진짜 좋아해요.', 'A 대사'),
  (10, 'Do you?', '그래요?', 'B 대사'),
  (11, 'Just a medium sized one.', '그냥 중간 사이즈로요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 32
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 32) and item_order > 11;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Are you a flirt?', '너 원래 끼 부리는 스타일이야?', 'A 대사'),
  (2, 'Do you think I am?', '그런 것 같아?', 'B 대사'),
  (3, 'yeah. why?', '응. 왜?', 'A 대사'),
  (4, 'You just literally did the most flirty thing ever.', '너 방금 진짜 세상에서 제일 끼 부리는 짓 했잖아.', 'A 대사'),
  (5, 'me? what?', '내가? 뭘?', 'B 대사'),
  (6, 'I''m going on a date after this. Sorry.', '나 이거 끝나고 데이트 있어. 미안.', 'A 대사'),
  (7, 'What the hell?', '뭐야, 대체?', 'B 대사'),
  (8, 'I that.. I said that in my head. I didn''t mean to say it out loud.', '아 그거.. 속으로 한 말이었는데. 소리 내서 말하려던 건 아니었어.', 'A 대사'),
  (9, 'You sure said it out loud.', '아주 확실하게 소리 내서 말했거든.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 33
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 33) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I got lunch with my brother.', '형이랑 점심을 먹었어.', null),
  (2, 'We got Chipotle.', '치폴레 먹었지.', null),
  (3, 'I hadn''t seen him for a long time.', '형을 오랫동안 못 봤었거든.', null),
  (4, 'It was the first time that I realized my brother, he''s very embarrassing at Chipotle.', '그때 처음 알았어. 우리 형이 치폴레에서 완전 창피한 사람이라는 걸.', null),
  (5, 'He''s embarrassing there because he''s one of these people.', '왜 창피하냐면, 형이 딱 그런 부류거든.', null),
  (6, 'He''s got all these weird Chipotle hacks to get more Chipotle.', '치폴레 더 많이 받아내는 이상한 꿀팁들을 잔뜩 알고 있어.', null),
  (7, 'You ever meet someone like this?', '이런 사람 만나본 적 있어?', null),
  (8, 'He''s got all these hacks.', '꿀팁이 한가득이야.', null),
  (9, 'He''s like, "Dude, you gotta get a bowl.', '“야, 무조건 볼로 시켜야 돼.', null),
  (10, 'You gotta get a bowl to get more food with a bowl." I''m like, "This is Chipotle.', '볼로 시켜야 양을 더 받아.” 이러길래 내가 “여기 치폴레야.', null),
  (11, 'How much more food do you need?" He''s got all these hacks.', '얼마나 더 먹어야 되는데?” 했지. 아무튼 꿀팁이 한가득이야.', null),
  (12, 'He''ll always get half black beans and half brown beans.', '형은 항상 블랙빈 반, 브라운빈 반으로 시켜.', null),
  (13, 'And he''s convinced you can get more beans that way.', '그렇게 하면 콩을 더 받을 수 있다고 굳게 믿고 있어.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 34
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 34) and item_order > 13;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'He goes, "They don''t know how to portion it.', '형이 그러는 거야. “걔네 양 조절할 줄 몰라.', null),
  (2, 'They''re not trained for that." And I go, "What?', '그런 훈련을 안 받았거든.” 그래서 내가 “뭐?', null),
  (3, 'They''re not tr— they''re not Navy SEALs.', '훈련을 안— 걔네가 무슨 네이비씰이야?', null),
  (4, 'They just fucking... they just work at Chipotle." He goes, "Look it up." I go, "Look up what?', '그냥 씨... 그냥 치폴레에서 일하는 사람들이라고.” 그랬더니 형이 “찾아봐” 이래. 내가 “뭘 찾아봐?', null),
  (5, 'What am I looking up?" I started getting mad.', '뭘 찾아보라는 건데?” 하면서 슬슬 열받기 시작했어.', null),
  (6, 'And we''re at Chipotle and he''s got this technique.', '그리고 치폴레에 갔는데 형한테 그 기술이 있는 거야.', null),
  (7, 'He''s like, "Watch this." And what he''ll do is he''ll ask for the black beans,', '“잘 봐” 이러더니, 먼저 블랙빈을 달라고 해.', null),
  (8, 'and then he will not ask for the brown beans until after they scoop the black beans.', '그리고 직원이 블랙빈을 다 퍼 담을 때까지 브라운빈 얘기를 안 해.', null),
  (9, 'You do that, you fucking sicko.She patted him on his back "That''s you, babe, that''s you." You fucking pervert, what the hell?', '너 그렇게 하는구나, 이 미친놈아. (여자가 남자 등을 토닥이며) “자기 얘기네, 자기 얘기야.” 이 변태 새끼야, 뭐 하는 거야?', null),
  (10, 'You psycho.', '이 사이코야.', null),
  (11, 'He''ll wait for the guy to do a full scoop.', '직원이 한 국자 가득 퍼 줄 때까지 기다려.', null),
  (12, 'And then he''ll go "Oh...', '그러고 나서 “아...', null),
  (13, 'Actually can I do half and half?"', '혹시 반반으로 해도 될까요?” 이러는 거지.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 35
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 35) and item_order > 13;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'If I play, do I get one of those cool t-shirts?', '나도 하면 그 멋진 티셔츠 하나 받아?', null),
  (2, 'Oh, yes!', '어머, 그럼!', null),
  (3, 'Everyone gets a t-shirt!', '다들 티셔츠 받아!', null),
  (4, 'We make them ourselves.', '우리가 직접 만들어.', null),
  (5, 'And, if you...', '그리고 만약에...', null),
  (6, 'You''re being sarcastic.', '너 비꼬는 거지.', null),
  (7, 'You''re being sarcastic.', '비꼬는 거잖아.', null),
  (8, 'She''s being sarcastic.', '얘 지금 비꼬는 거야.', null),
  (9, 'How did the proposal go?', '프러포즈는 어떻게 됐어?', null),
  (10, 'Would I be standing here with a ring if it went well?', '잘됐으면 내가 반지 들고 여기 서 있겠냐?', null),
  (11, 'That was a rhetorical question.', '그건 대답 바라고 한 질문 아니었어.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 36
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 36) and item_order > 11;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'These are the top 3 insults that you should never use on an Australian if you wanna live.', '살고 싶으면 호주 사람한테 절대 쓰면 안 되는 욕 TOP 3야.', null),
  (2, 'Look, mate, this is a warning for this video.', '자, 친구, 이 영상은 경고야.', null),
  (3, 'Only use these words under extreme circumstances, all right?', '이 단어들은 진짜 극단적인 상황에서만 써, 알았지?', null),
  (4, 'Number one is "champion." If you call someone a champion or say, "oh yeah, good one, champion," you''re gonna get your head kicked in, mate.', '1위는 “champion(챔피언)”. 누구한테 챔피언이라고 하거나 “오 그래, 잘했다, 챔피언” 이러면 머리 깨지는 수가 있어, 친구.', null),
  (5, 'Number two is "buddy." Now look, this might sound like something you call your friend, but if you call someone this,', '2위는 “buddy(버디)”. 자, 친구 부를 때 쓰는 말처럼 들리겠지만, 누구한테 이렇게 부르면', null),
  (6, 'they won''t be your friend.', '그 사람은 네 친구 안 해 줄 거야.', null),
  (7, 'Last but not least, mate, warning — only use this when you have to.', '마지막으로, 친구, 경고하는데, 이건 꼭 필요할 때만 써.', null),
  (8, 'It''s "chief." If you say to someone, "yeah, good one, chief," you''re gonna die.', '바로 “chief(치프)”야. 누구한테 “그래, 잘했다, 치프” 이러면 넌 죽은 목숨이야.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 37
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 37) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Then we went and visited Honolulu City Hall.', '그다음에 호놀룰루 시청에 갔다 왔어.', null),
  (2, 'Shut up.', '헐, 말도 안 돼.', null),
  (3, 'You know.', '그치?', null),
  (4, 'Oh my god, what was it like?', '대박, 어땠어?', null),
  (5, 'It was amazing.', '완전 좋았어.', null),
  (6, 'Well, it looked amazing, but it was closed.', '아니 뭐, 겉보기엔 멋있었는데 문 닫혀 있었어.', null),
  (7, 'Oh my god, bummer.', '헐, 아깝다.', null),
  (8, 'My name''s April, and I just wanted to say that your dress is so cute, it''s bonks.', '저 에이프릴인데요, 원피스 너무 예뻐서 말씀드리고 싶었어요. 완전 미쳤어요.', null),
  (9, 'I saw my spinning instructor wearing it, and I was like, "Shut up, where do I get that?" Oh my god, who''s your spinning instructor?', '제 스피닝 강사님이 그거 입은 거 보고 "헐, 그거 어디서 사요?" 했잖아요. 어머, 스피닝 강사님 누구세요?', null),
  (10, 'I go to Yanis.', '저는 야니스한테 다녀요.', null),
  (11, 'Who are Gregory and Winona?', '그레고리랑 위노나는 누구예요?', null),
  (12, 'I''ve never heard of them before.', '처음 들어보는데요.', null),
  (13, 'Are they better?', '그 사람들이 더 잘해요?', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 38
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 38) and item_order > 13;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Like, we obviously speak English in Ireland, but it''s a very different type of English.', '아일랜드에서도 당연히 영어를 쓰긴 하는데, 완전 다른 종류의 영어거든.', null),
  (2, 'Do you know what I mean?', '무슨 말인지 알지?', null),
  (3, 'It''s like Irish English, you know, like if an Irish person says to you, "Nice shirt," you''re not wearing a nice shirt.', '아일랜드식 영어라고 할까. 아일랜드 사람이 "셔츠 예쁘다" 그러면, 너 지금 예쁜 셔츠 입은 거 아니야.', null),
  (4, 'Or if an Irish person goes, "Have you lost weight?" — you haven''t.', '아일랜드 사람이 "살 빠졌어?" 그러면, 안 빠진 거야.', null),
  (5, 'Or if you say to an Irish person, "Can you move that car?" and they go, "I will, yeah" they''re not moving the car.', '아일랜드 사람한테 "차 좀 빼줄 수 있어요?" 했는데 "네, 그럴게요" 하면, 절대 안 빼는 거야.', null),
  (6, '"I will, yeah" means "I am never."', '"네, 그럴게요"는 "절대 안 해"라는 뜻이야.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 39
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 39) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I know white people are the worst.', '백인들이 최악인 거 알아요.', null),
  (2, 'I know that.', '알죠, 알아.', null),
  (3, 'That''s why no one likes a fucking white middle-aged man anymore.', '그래서 요즘 아무도 빌어먹을 백인 중년 남자를 안 좋아하잖아요.', null),
  (4, 'Until we need a boiler fixing.', '보일러 고장 나기 전까지는요.', null),
  (5, 'Get the bald bloke around now.', '그때는 "그 대머리 아저씨 당장 불러!" 하죠.', null),
  (6, 'Critical race theory.', '비판적 인종 이론.', null),
  (7, 'Have you heard of that?', '들어본 적 있어요?', null),
  (8, 'Being taught in schools now, particularly in trendy areas like LA, right?', '요즘 학교에서 가르친대요, 특히 LA 같은 힙한 동네에서요, 그쵸?', null),
  (9, 'If you haven''t heard it, in a nutshell, critical race theory says that all white people are racist,', '못 들어봤으면 간단히 말해서, 비판적 인종 이론은 모든 백인이 인종차별주의자라고 해요.', null),
  (10, 'says that we''re born racist and we continue to be racist because we''re affording the privilege of a racist society set up by our forefathers,', '우리는 태어날 때부터 인종차별주의자고, 조상들이 만든 인종차별적인 사회의 특권을 누리고 있으니까 계속 인종차별주의자라는 거죠.', null),
  (11, 'okay?', '알겠죠?', null),
  (12, 'So basically, all white people are racist and there''s nothing we can do about it, which is a relief.', '그러니까 결국 백인은 다 인종차별주의자고 우리가 할 수 있는 건 아무것도 없다는 거예요. 아, 다행이다.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 40
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 40) and item_order > 12;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'We can offer you $27 an hour to start with.', '처음엔 시급 27달러로 드릴 수 있어요.', 'A 대사'),
  (2, 'Thanks. I really appreciate the offer. I was actually hoping for something closer to $30.', '감사합니다. 제안해 주셔서 정말 감사해요. 사실 30달러 가까이 생각하고 있었거든요.', 'B 대사'),
  (3, '$30 is a little higher than what we normally offer.', '30달러는 저희가 보통 드리는 것보다 조금 높네요.', 'A 대사'),
  (4, 'I understand. Is there any room for negotiation?', '이해해요. 혹시 조정할 여지가 있을까요?', 'B 대사'),
  (5, 'What did you have in mind?', '생각하신 금액이 있으세요?', 'A 대사'),
  (6, 'Considering my previous experience, I was hoping we could meet somewhere around $29.', '제 이전 경력을 고려해서 29달러 정도에서 맞출 수 있으면 좋겠어요.', 'B 대사'),
  (7, 'I could do $28.50.', '28.50달러까지는 가능해요.', 'A 대사'),
  (8, 'Yeah, that sounds fair. I''d be happy to go with that.', '네, 괜찮은 것 같아요. 그걸로 할게요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 41
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 41) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hey mate! Saw your listing for the bike. Is it still available?', '안녕하세요! 자전거 올리신 거 봤어요. 아직 있어요?', 'A 대사'),
  (2, 'Yep, still got it. 280, as listed.', '네, 아직 있어요. 올린 대로 280이에요.', 'B 대사'),
  (3, 'Nice. Is it in good nick? Any issues with it?', '좋네요. 상태 괜찮아요? 문제 있는 데는요?', 'A 대사'),
  (4, 'Nah, it''s in great condition. Just had it serviced last month.', '아뇨, 상태 아주 좋아요. 지난달에 정비도 받았어요.', 'B 대사'),
  (5, 'Sweet. I''m keen, but would you take 230? I can do cash today.', '오 좋네요. 사고 싶은데, 230에 안 될까요? 오늘 현금으로 드릴 수 있어요.', 'A 대사'),
  (6, 'Sorry, that''s a bit low. I was hoping for at least 260.', '죄송한데 그건 좀 낮아요. 최소 260은 받고 싶었거든요.', 'B 대사'),
  (7, 'Fair enough. How about we meet in the middle? 245, cash in hand?', '그럴 수 있죠. 그럼 중간에서 맞출까요? 245, 현금으로요?', 'A 대사'),
  (8, 'Just flick me the address and I''ll see you then.', '주소만 보내주세요, 그때 봬요.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 42
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 42) and item_order > 8;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So here are the two best times to buy a car in Australia.', '호주에서 차 사기 제일 좋은 시기 두 가지 알려드릴게요.', null),
  (2, 'The first is the end of financial year.', '첫 번째는 회계연도 말이에요.', null),
  (3, 'So in the past, monthly car sale volumes have increased significantly during this period.', '예전부터 이 시기에 월별 자동차 판매량이 크게 늘었어요.', null),
  (4, 'Now, this is because dealers are looking to hit their targets and increase their financial year sales figures.', '딜러들이 목표를 채우고 회계연도 판매 실적을 올리려고 하기 때문이에요.', null),
  (5, 'This time of year often also works well for business owners,', '이 시기는 사업자들한테도 좋은 경우가 많은데,', null),
  (6, 'as they''re able to claim tax benefits soon after for the end of the financial year.', '회계연도가 끝나고 바로 세금 혜택을 받을 수 있거든요.', null),
  (7, 'The second is the end of any month.', '두 번째는 매달 말이에요.', null),
  (8, 'So dealers sometimes try to push to hit certain quotas or volumes for the month.', '딜러들이 그달 할당량이나 판매량을 채우려고 밀어붙일 때가 있거든요.', null),
  (9, 'So this might be a good time to snag a bargain.', '그래서 이때가 싸게 건지기 좋은 타이밍일 수 있어요.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 43
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 43) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I really liked the place. Before I put in my application, is there any flexibility on the rent?', '집 정말 마음에 들었어요. 신청서 내기 전에, 혹시 렌트비 조정 가능할까요?', 'A 대사'),
  (2, 'The landlord''s asking $430 a week. He''s pretty stubborn...', '집주인이 주 430달러 원하세요. 꽤 고집이 센 분이라서...', 'B 대사'),
  (3, 'I get that.', '이해해요.', 'A 대사'),
  (4, 'For what it''s worth, I''ve got a solid rental history and good references, no pets, I don''t smoke,', '참고로 말씀드리면, 저 임대 이력 깔끔하고 추천서도 좋고, 반려동물도 없고 담배도 안 펴요.', 'A 대사'),
  (5, 'and I''m happy to sign a 12-month lease straight away.', '그리고 12개월 계약 바로 할 수 있어요.', 'A 대사'),
  (6, 'I''ll pass that on to the landlord. No guarantees, but it''s worth asking.', '집주인한테 전달해 볼게요. 장담은 못 하지만 물어볼 만은 해요.', 'B 대사'),
  (7, 'I''d really appreciate that. I''m ready to move quickly if it works out.', '그래 주시면 정말 감사하죠. 잘 되면 바로 진행할 준비 돼 있어요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 44
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 44) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Hi, I''m raising rent 20% this month.', '안녕하세요, 이번 달부터 렌트비 20% 올릴게요.', 'A 대사'),
  (2, 'Has your landlord recently tried to raise the rent?', '최근에 집주인이 렌트비 올리려고 한 적 있나요?', 'B 대사'),
  (3, 'Here''s some things you can say.', '이렇게 말해 보세요.', 'B 대사'),
  (4, 'I''d love to sit down sometime and discuss this.', '언제 한번 만나서 이 얘기 좀 나눴으면 해요.', 'B 대사'),
  (5, 'I take really good care of the property and my rent is always on time.', '저 집 정말 깨끗하게 쓰고 렌트비도 항상 제때 내잖아요.', 'B 대사'),
  (6, 'It does look nice, but I don''t think so.', '깔끔하긴 한데, 그건 좀 아닌 것 같네요.', 'A 대사'),
  (7, 'You can try making some comparisons.', '비교를 해 보는 것도 방법이에요.', 'B 대사'),
  (8, 'I studied the lease, and while it allows for a rent increase, I''m not sure local laws allow this much of an increase.', '계약서를 살펴봤는데, 렌트비 인상이 가능하긴 해도 이 정도 인상을 지역 법에서 허용하는지는 모르겠어요.', 'B 대사'),
  (9, 'And all the buildings around us are charging less rent.', '그리고 주변 건물들은 다 렌트비가 더 싸요.', 'B 대사'),
  (10, 'Maybe we can knock it down a bit.', '좀 깎아 드릴 수는 있겠네요.', 'A 대사'),
  (11, 'If that''s still too high, consider finding strength in numbers.', '그래도 너무 비싸면, 여럿이 힘을 모아 보세요.', 'B 대사'),
  (12, 'I''ve spoken with some other tenants in the local tenant union, and we would like you to reconsider.', '지역 세입자 조합의 다른 세입자들이랑 얘기해 봤는데, 다시 생각해 주셨으면 해요.', 'B 대사'),
  (13, 'Meh', '글쎄요', 'A 대사'),
  (14, 'You can try a public record search of your landlord''s name or their LLC.', '집주인 이름이나 회사 이름으로 공공기록을 검색해 보는 방법도 있어요.', 'B 대사'),
  (15, 'If they don''t have an active license, you suddenly have significant leverage.', '유효한 면허가 없으면 갑자기 엄청 유리한 입장이 되는 거죠.', 'B 대사'),
  (16, 'Hey, so I noticed your landlord license is not up to date.', '저기, 임대인 면허가 갱신이 안 돼 있던데요.', 'B 대사'),
  (17, 'Just kidding, rent will stay the same. Have a good one.', '농담이에요, 렌트비 그대로 갈게요. 좋은 하루 보내세요.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 45
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 45) and item_order > 17;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'I just got offered a full-time job. Like, they called me this morning.', '나 방금 정규직 제안받았어. 오늘 아침에 전화 왔다니까.', 'A 대사'),
  (2, 'That''s insane. You ate that interview. No cap.', '미쳤다. 너 면접 찢었네. 진심 리얼로.', 'B 대사'),
  (3, 'Honestly I thought I bombed it.', '솔직히 완전 망친 줄 알았어.', 'A 대사'),
  (4, 'See, delulu is the solulu. You manifested it.', '봐, 망상이 곧 해답이라니까. 네가 끌어당긴 거야.', 'B 대사'),
  (5, 'I genuinely did not see that coming.', '진짜 전혀 예상 못 했어.', 'A 대사'),
  (6, 'Pop off! We''re going out tonight, no discussion.', '가보자고! 오늘 밤 나가 노는 거야, 토 달지 마.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 46
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 46) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Okay so lowkey — I''ve been aura farming all week and I think it''s working.', '근데 은근히, 나 일주일 내내 분위기 관리 중인데 먹히는 것 같아.', 'A 대사'),
  (2, 'Wait, what do you mean?', '잠깐, 그게 무슨 말이야?', 'B 대사'),
  (3, 'Like, I started reading at cafés, journaling, going on walks. Just giving main character energy.', '카페에서 책 읽고, 일기 쓰고, 산책하고. 그냥 주인공 느낌 내는 거지.', 'A 대사'),
  (4, 'Love that for you, honestly. No shame in that.', '솔직히 너무 좋다. 부끄러울 거 하나도 없어.', 'B 대사'),
  (5, 'I''m broke, but I''m romanticizing my life.', '돈은 없지만 내 인생 낭만있게 사는 중이야.', 'A 대사'),
  (6, 'That''s literally the vibe. You don''t need money to be that girl.', '그게 완전 바이브지. 갓생 여자 되는 데 돈 필요 없어.', 'B 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 47
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 47) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'What about this jacket?', '이 재킷은 어때?', 'A 대사'),
  (2, 'Hmm... just mid... it''s giving dad on a camping trip.', '음... 그냥 그래... 캠핑 간 아빠 느낌이야.', 'B 대사'),
  (3, 'Rude. Okay, this one?', '너무하네. 그럼 이건?', 'A 대사'),
  (4, 'Oh, that''s better. It''s giving old money', '오, 그게 낫다. 올드머니 느낌 난다.', 'B 대사'),
  (5, 'That''s exactly what I''m going for. What about these boots?', '딱 그 느낌 원했어. 이 부츠는?', 'A 대사'),
  (6, 'Wait, try them on.', '잠깐, 신어 봐.', 'B 대사'),
  (7, 'How do I look?', '나 어때?', 'A 대사'),
  (8, 'Stunning!', '완전 멋져!', 'B 대사'),
  (9, 'Oh shoot... I''m cooked. I think I left my wallet at the cafe.', '아 이런... 나 망했다. 지갑 카페에 두고 온 것 같아.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 48
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 48) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'This guy I was talking to ghosted me.', '썸 타던 남자가 갑자기 잠수 탔어.', null),
  (2, 'Me and my friend were really upset, so we went on a low-key smear campaign towards him online,', '나랑 친구가 너무 열받아서 온라인에서 은근슬쩍 그 남자 저격을 시작했거든,', null),
  (3, 'posting private stories and texting his mutuals just to have one of his friends DM us, telling us that he actually just went into a coma.', '비공개 스토리 올리고 겹지인들한테 문자 돌리고 그랬는데, 그 남자 친구 하나가 DM으로 걔 사실 혼수상태에 빠졌다고 하더라.', null),
  (4, 'What the fuck could we possibly do to get out of this?', '이걸 대체 무슨 수로 수습하냐고, 젠장?', null),
  (5, 'I don''t know.', '모르겠어.', null),
  (6, 'That''s really funny.', '진짜 웃기다.', null),
  (7, 'This is when, I''m like, "we''ve gone too far."', '이때 딱 "우리 선 넘었다" 싶었지.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 50
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 50) and item_order > 7;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'It''s so nice to finally meet you.', '드디어 뵙게 돼서 정말 반가워요.', null),
  (2, 'I have so many questions for you, but first off, can you just tell me a little bit about yourself?', '여쭤보고 싶은 게 많은데, 우선 자기소개 좀 간단히 해 주시겠어요?', null),
  (3, 'This is most likely the very first question a recruiter or hiring manager is gonna ask you in an interview.', '이게 면접에서 리크루터나 채용 담당자가 제일 먼저 물어볼 가능성이 높은 질문이에요.', null),
  (4, 'I can''t remember the last time I went through an interview process where this question didn''t come up first.', '제가 본 면접 중에 이 질문이 먼저 안 나온 적이 기억이 안 날 정도예요.', null),
  (5, 'And the last thing you wanna do is to not be prepared for this question and go into a full in-depth explanation of your whole life story,', '제일 피해야 할 건 이 질문에 준비 안 된 상태로 인생 이야기를 처음부터 끝까지 늘어놓는 거예요,', null),
  (6, 'which I have done as well.', '저도 그런 적 있어요.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 51
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 51) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So here is what you''re gonna do instead.', '그러니까 대신 이렇게 하세요.', null),
  (2, 'To best prepare for this question, what I want you to do is to think in the shoes of the employer or the person that''s interviewing you.', '이 질문을 제대로 준비하려면, 고용주나 면접관 입장에서 생각해 보세요.', null),
  (3, 'And then you can build your story around this by highlighting the key skills and work experience that you have that''ll make you directly successful in the role that you''re applying for.', '그다음에 지원하는 직무에서 바로 성과를 낼 수 있게 해 줄 핵심 역량과 경력을 강조하면서 이야기를 짜면 돼요.', null),
  (4, 'And if you''re having trouble coming up with a short elevator pitch, here''s a template.', '짧은 자기소개 멘트 만들기가 어렵다면, 여기 템플릿이 있어요.', null),
  (5, 'You can either save this or screenshot this.', '저장하거나 캡처해 두세요.', null),
  (6, 'I hope this helps and good luck in your next interview.', '도움이 됐으면 좋겠고, 다음 면접 잘 보세요.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 52
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 52) and item_order > 6;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'We''ll love you forever.', '우린 너를 영원히 사랑할 거야.', null),
  (2, 'Aw, thanks.', '아, 고마워.', null),
  (3, 'By the way, I just turned 18.', '그나저나 나 이제 18살 됐어.', null),
  (4, 'Oh, you''re 18?', '어, 18살이라고?', null),
  (5, 'Get out of the house, you leech!', '집에서 나가, 이 기생충아!', null),
  (6, 'I am ashamed to call you my child.', '네가 내 자식이라는 게 부끄럽다.', null),
  (7, 'Well, I just turned 18, so you''re finally gonna get rid of me.', '나 이제 18살 됐으니까, 드디어 나 내보낼 수 있겠네.', null),
  (8, 'What?', '뭐?', null),
  (9, 'You don''t want to live with me anymore?', '이제 나랑 같이 살기 싫다고?', null),
  (10, 'Stay, stay, stay!', '있어, 있어, 있어!', null),
  (11, 'Stay, stay, stay!', '가지 마, 가지 마, 가지 마!', null),
  (12, 'I can make you food.', '밥도 해 줄게.', null),
  (13, 'What?', '뭐?', null),
  (14, 'No, I want to move.', '아니, 나 이사 가고 싶어.', null),
  (15, 'I want independence.', '독립하고 싶다고.', null),
  (16, 'Okay, you can move.', '알았어, 이사 가도 돼.', null),
  (17, 'Only if you find a home close to me.', '우리 집 근처에서 구하면.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 53
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 53) and item_order > 17;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'The difference between Asian cultures versus Western cultures is often not about race,', '아시아 문화와 서양 문화의 차이는 대개 인종 문제가 아니라,', null),
  (2, 'but about the difference between collectivist versus individualist cultures.', '집단주의 문화와 개인주의 문화의 차이예요.', null),
  (3, 'Collectivist usually means that we are putting the group''s needs, it could be your family or your community, in front of your own.', '집단주의는 보통 가족이나 공동체 같은 집단의 필요를 내 필요보다 앞에 두는 걸 말해요.', null),
  (4, 'Whereas individualist is about prioritizing yourself, individuals.', '반면 개인주의는 자기 자신, 개인을 우선하는 거죠.', null),
  (5, 'An example of this might be, for example, in Asian cultures,', '예를 들면, 아시아 문화에서는', null),
  (6, 'it''s very common for families to stay together even after a child becomes an adult.', '자녀가 성인이 된 후에도 가족이 함께 사는 경우가 아주 흔해요.', null),
  (7, 'And there''s an expectation that you would take care of your parents when they get old.', '그리고 부모님이 나이 드시면 자식이 돌봐 드려야 한다는 기대가 있죠.', null),
  (8, 'Whereas in Western cultures, there''s more of an expectation that when you get to adult, you move out.', '반면 서양 문화에서는 성인이 되면 독립해서 나가는 게 당연하다는 인식이 더 강해요.', null),
  (9, 'And then, you know, when you get older, it depends on the family.', '그리고 부모님이 나이 드시면, 그건 집집마다 달라요.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 54
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 54) and item_order > 9;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'So this, however, taught me a very important difference.', '그런데 이 경험이 저한테 아주 중요한 차이를 알려줬어요.', null),
  (2, 'There''s a difference between healthy collectivism and toxic conformity.', '건강한 집단주의와 해로운 순응은 다르다는 거예요.', null),
  (3, 'Collectivism is about fostering connection and belonging,', '집단주의는 유대감과 소속감을 키우는 거고,', null),
  (4, 'whereas toxic conformity is about hiding or even losing your individuality just to fit in.', '해로운 순응은 그냥 어울리려고 자기 개성을 숨기거나 아예 잃어버리는 거예요.', null),
  (5, 'And this is where the difference is.', '바로 여기서 차이가 나요.', null),
  (6, 'Healthy collectivism is there to strengthen bonds, because it celebrates both the group and the individual.', '건강한 집단주의는 집단과 개인 모두를 존중하기 때문에 유대를 더 단단하게 해 줘요.', null),
  (7, 'And when I end up choosing a career that I really want to do, which is to teach,', '그리고 제가 정말 하고 싶던 일, 가르치는 일을 직업으로 선택했을 때,', null),
  (8, 'my passions actually end up honoring my family''s values greater in the long term.', '제 열정이 오히려 장기적으로 가족의 가치를 더 크게 빛내게 됐어요.', null),
  (9, 'And it wasn''t about conforming.', '그건 순응하는 게 아니었어요.', null),
  (10, 'It was about contributing authentically.', '진정성 있게 기여하는 거였죠.', null)
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 55
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 55) and item_order > 10;
insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  (1, 'Chin manio — what''s "chin manio" mean?', '"친 마니오" — "친 마니오"가 무슨 뜻이야?', 'A 대사'),
  (2, 'Yeah, don''t try to show me up the way you say it.', '야, 발음 잘한다고 나 망신 주지 마.', 'A 대사'),
  (3, 'She said it the right way.', '쟤는 제대로 발음했네.', 'A 대사'),
  (4, 'Oh, "chin manio." I''m like the dumb American.', '아, "친 마니오." 나 완전 멍청한 미국인 같잖아.', 'A 대사'),
  (5, 'Oh, "chin manio." Oh, you mean "chin manio." You know what I''m saying.', '아, "친 마니오." 아, "친 마니오" 말하는 거구나. 무슨 말인지 알잖아.', 'A 대사'),
  (6, 'What''s it mean?', '그게 무슨 뜻인데?', 'A 대사'),
  (7, 'You didn''t say it right.', '발음 틀렸어.', 'B 대사'),
  (8, 'But you knew what I was trying to say.', '근데 내가 뭐 말하려는지 알았잖아.', 'A 대사'),
  (9, 'Are you my mom?', '너 우리 엄마야?', 'A 대사'),
  (10, 'I swear — my mom.', '진짜 — 우리 엄마랑 똑같아.', 'A 대사'),
  (11, 'But that''s all Korean women.', '근데 한국 여자들은 다 그래.', 'A 대사'),
  (12, 'They the same, man.', '다 똑같다니까.', 'A 대사'),
  (13, 'They don''t give you no credit.', '칭찬을 하나도 안 해 줘.', 'A 대사'),
  (14, 'Like, a white parent would have been like, "Oh, good try.', '백인 부모였으면 "오, 잘했어.', 'A 대사'),
  (15, 'Let''s do it again.', '다시 해 보자.', 'A 대사'),
  (16, 'Let''s do it again."', '다시 해 보자." 이랬을걸.', 'A 대사')
) as v(item_order, sentence, translation, note)
where l.course_id = 'level2' and l.day_number = 56
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where course_id = 'level2' and day_number = 56) and item_order > 16;
commit;

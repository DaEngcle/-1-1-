-- 뉴스 레슨 대표 사진 (ABC RSS/기사 대표 이미지 주소, 출처 표기해서 보여준다). 여러 번 실행해도 안전하다.
alter table news_lessons add column if not exists image_url text;

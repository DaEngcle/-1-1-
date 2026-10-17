"""교재 대화 JSON → lesson_items SQL. 사용법: python build_sql.py out.sql days_*.json"""
import json
import sys


def q(s):
    return "null" if s is None or s == "" else "'" + s.replace("'", "''") + "'"


out, *files = sys.argv[1:]
days = {}
for f in files:
    for d in json.load(open(f, encoding="utf-8")):
        if d["day"] in days:
            raise SystemExit(f"Day {d['day']} appears twice")
        days[d["day"]] = d["lines"]

missing = [n for n in range(1, 61) if n not in days]
empty = [n for n, lines in days.items() if not lines]
print("days:", len(days), "missing:", missing, "empty:", empty)
print("total sentences:", sum(len(v) for v in days.values()))

sql = ["begin;"]
for n in sorted(days):
    lines = days[n]
    if not lines:
        continue
    values = ",\n  ".join(
        f"({i}, {q(l['en'].strip())}, {q(l.get('ko', '').strip())}, {q((l.get('speaker') or '').strip() and l['speaker'].strip() + ' 대사')})"
        for i, l in enumerate(lines, 1)
    )
    # 기존 문장(item_order 1..)은 id를 유지한 채 내용만 바꾸고, 나머지는 새로 추가
    sql.append(
        f"""insert into lesson_items (lesson_id, item_order, sentence, translation, note)
select l.id, v.item_order, v.sentence, v.translation, v.note
from lessons l, (values
  {values}
) as v(item_order, sentence, translation, note)
where l.day_number = {n}
on conflict (lesson_id, item_order) do update set
  sentence = excluded.sentence, translation = excluded.translation, note = excluded.note;
delete from lesson_items where lesson_id = (select id from lessons where day_number = {n}) and item_order > {len(lines)};"""
    )
sql.append("commit;")
open(out, "w", encoding="utf-8").write("\n".join(sql) + "\n")
print("wrote", out)

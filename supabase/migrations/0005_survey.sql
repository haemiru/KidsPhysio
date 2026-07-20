-- ════════════════════════════════════════════════════════════════
-- Brain Scent Project 종료 설문 — 응답 저장 테이블
--  · 익명 설문. 개별 응답 1건 = 1 row
--  · 세분화·분석 편의를 위해 자주 쓰는 값은 컬럼으로 정규화,
--    전체 응답은 answers(jsonb)에 원본 그대로 보관
--  · RLS 활성화 + 공개 정책 없음 → 오직 서비스 롤(서버 /api)만 접근.
--    클라이언트(anon)에서는 직접 읽기/쓰기가 모두 차단됨.
-- ════════════════════════════════════════════════════════════════

create table if not exists rf_survey_responses (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  survey_key        text not null default 'brain_scent_end',
  -- 세분화·분석용 정규화 컬럼 (Supabase Table Editor에서 바로 필터/정렬)
  child_age         text,        -- 1-1 아이 연령
  diagnosis         text,        -- 1-2 진단 여부
  nps               int,         -- 8. 추천 의향 (0~10)
  app_intent        text,        -- 6. 앱 사용 의향
  marketing_consent boolean,     -- 10. 마케팅 활용 동의 (예=true)
  -- 전체 응답 원본
  answers           jsonb not null default '{}'::jsonb,
  user_agent        text
);

alter table rf_survey_responses enable row level security;

-- 정책을 만들지 않는다 = anon/authenticated 접근 전면 차단.
-- 삽입/조회는 서버(/api, service_role)에서만 수행한다.

create index if not exists idx_survey_created_at on rf_survey_responses (created_at desc);
create index if not exists idx_survey_key        on rf_survey_responses (survey_key);

-- ════════════════════════════════════════════════════════════════
-- 브레인센트 4주 몸읽기 프로젝트 — 신청서 저장 테이블
--  · 신청 1건 = 1 row. 접수 후 사장님께 문자(LMS) 알림 발송(서버에서)
--  · 자주 쓰는 값은 컬럼으로 정규화, 전체 응답은 answers(jsonb)에 원본 보관
--  · RLS 활성화 + 공개 정책 없음 → 서비스 롤(서버 /api)만 접근.
--    클라이언트(anon)에서는 직접 읽기/쓰기 모두 차단됨.
--  · 회차가 늘어나면 project_key 로 구분한다 (기본값 body_reading_4w).
-- ════════════════════════════════════════════════════════════════

create table if not exists rf_project_applications (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  project_key       text not null default 'body_reading_4w',
  -- 2. 보호자 정보
  guardian_name     text not null,       -- 보호자 성함
  guardian_phone    text not null,       -- 연락처(010-XXXX-XXXX)
  kakao_nickname    text not null,       -- 카카오톡 닉네임(단톡방 초대 확인용)
  -- 3. 아이 정보
  child_name        text not null,       -- 아이 이름
  child_age         text not null,       -- 아이 나이(구간)
  -- 세분화·분석용 정규화 컬럼 (Supabase Table Editor에서 바로 필터/정렬)
  expected_changes  text[],              -- 4. 현재 가장 기대하는 변화
  helpful_7days     text,                -- 5. 7일 프로젝트에서 도움이 된 것
  expectation_4w    text,                -- 6. 4주 동안 기대하는 것
  question          text,                -- 7. 궁금한 내용
  future_programs   text[],              -- 8. 이후 함께하고 싶은 프로그램(기획 우선순위 데이터)
  -- 진행 상태 (참가비 입금 확인 등 수기 관리)
  status            text not null default 'new',    -- new | paid | done | canceled
  privacy_consent   boolean not null default false, -- 필수 동의
  -- 전체 응답 원본
  answers           jsonb not null default '{}'::jsonb,
  user_agent        text
);

alter table rf_project_applications enable row level security;
-- 공개 정책을 만들지 않는다 = anon/authenticated 직접 접근 차단.
-- 삽입/조회는 서버(/api, service_role)에서만 수행한다.

create index if not exists idx_project_apps_created_at on rf_project_applications (created_at desc);
create index if not exists idx_project_apps_status     on rf_project_applications (status);
create index if not exists idx_project_apps_key        on rf_project_applications (project_key);

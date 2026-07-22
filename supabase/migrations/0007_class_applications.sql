-- ════════════════════════════════════════════════════════════════
-- 브레인센트 후각키트 만들기 클래스 — 신청서 저장 테이블
--  · 신청 1건 = 1 row. 접수 후 사장님께 문자(LMS) 알림 발송(서버에서)
--  · 자주 쓰는 값은 컬럼으로 정규화, 전체 응답은 answers(jsonb)에 원본 보관
--  · RLS 활성화 + 공개 정책 없음 → 서비스 롤(서버 /api)만 접근.
--    클라이언트(anon)에서는 직접 읽기/쓰기 모두 차단됨.
-- ════════════════════════════════════════════════════════════════

create table if not exists rf_class_applications (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  class_key            text not null default 'brain_scent_kit',
  -- 1. 기본 정보
  applicant_name       text not null,       -- 성함
  applicant_phone      text not null,       -- 연락처(010-XXXX-XXXX)
  email                text not null,       -- 이메일
  region               text,                -- 거주지역
  -- 세분화·분석용 정규화 컬럼 (Supabase Table Editor에서 바로 필터/정렬)
  occupations          text[],              -- 2. 현재 하고 있는 일
  olfactory_experience text,                -- 4. 후각 중재 경험
  apply_reason         text,                -- 5. 신청 이유
  motivation           text,                -- 교육을 듣고 싶은 이유(마케팅 문항)
  -- 진행 상태 (입금 확인 등 수기 관리)
  status               text not null default 'new',   -- new | paid | done | canceled
  privacy_consent      boolean not null default false, -- 필수 동의
  marketing_consent    boolean not null default false, -- 선택 동의
  -- 전체 응답 원본
  answers              jsonb not null default '{}'::jsonb,
  user_agent           text
);

alter table rf_class_applications enable row level security;
-- 공개 정책을 만들지 않는다 = anon/authenticated 직접 접근 차단.
-- 삽입/조회는 서버(/api, service_role)에서만 수행한다.

create index if not exists idx_class_apps_created_at on rf_class_applications (created_at desc);
create index if not exists idx_class_apps_status     on rf_class_applications (status);
create index if not exists idx_class_apps_key        on rf_class_applications (class_key);

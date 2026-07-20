-- ════════════════════════════════════════════════════════════════
-- 무료 상담 신청 저장 (홈 Contact 폼)
--  · 신청 1건 = 1 row. 접수 후 사장님께 문자(LMS) 알림 발송(서버에서)
--  · RLS 활성화 + 공개 정책 없음 → 서비스 롤(서버 /api)만 접근.
--    클라이언트(anon)에서는 직접 읽기/쓰기 모두 차단됨.
-- ════════════════════════════════════════════════════════════════

create table if not exists rf_consultations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  guardian_name   text not null,       -- 보호자 성함
  guardian_phone  text not null,       -- 연락처(010-XXXX-XXXX)
  child_age       text,                -- 아이 나이(개월/세)
  message         text,                -- 상담 내용
  status          text not null default 'new',   -- new | contacted | done
  privacy_consent boolean not null default false,
  user_agent      text
);

alter table rf_consultations enable row level security;
-- 공개 정책을 만들지 않는다 = anon/authenticated 직접 접근 차단.
-- 삽입/조회는 서버(/api, service_role)에서만 수행한다.

create index if not exists idx_consultations_created_at on rf_consultations (created_at desc);
create index if not exists idx_consultations_status     on rf_consultations (status);

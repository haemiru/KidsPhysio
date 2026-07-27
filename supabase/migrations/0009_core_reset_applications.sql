-- ════════════════════════════════════════════════════════════════
-- 브레인센트 코어 리셋 시스템™ — 코칭 신청서 저장 테이블
--  · 신청 1건 = 1 row. 접수 후 사장님께 문자(LMS) 알림 발송(서버에서)
--  · 자주 쓰는 값은 컬럼으로 정규화, 전체 응답은 answers(jsonb)에 원본 보관
--  · ⚠️ 아동의 진단·치료 이력 등 건강 관련 정보(민감정보)가 포함된다.
--    신청서에서 별도 동의를 받으며(privacy_consent), RLS 활성화 + 공개 정책
--    없음 → 서비스 롤(서버 /api)만 접근. 클라이언트(anon) 직접 접근 차단.
-- ════════════════════════════════════════════════════════════════

create table if not exists rf_core_reset_applications (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  program_key       text not null default 'core_reset',
  -- 2. 보호자 정보
  guardian_name     text not null,       -- 보호자 성함
  guardian_phone    text not null,       -- 연락처(010-XXXX-XXXX)
  kakao_id          text,                -- 카카오톡 아이디(선택)
  region            text not null,       -- 거주지역
  -- 3. 아동 정보
  child_name        text not null,       -- 아이 이름
  child_birth       text not null,       -- 생년월일(YYYY-MM-DD)
  gender            text,                -- 남 | 여
  birth_weeks       text,                -- 만삭 | 37주 미만 | 잘 모르겠음
  birth_type        text,                -- 자연분만 | 제왕절개
  nicu              text,                -- 있음 | 없음
  diagnosis         text,                -- 현재 진단 또는 상담받은 내용 (민감정보)
  therapies         text[],              -- 현재 받고 있는 치료 (민감정보)
  -- 4. 현재 아이의 모습 체크
  posture_core      text[],              -- 자세 / 코어
  breathing         text[],              -- 호흡
  sensory_emotion   text[],              -- 감각 / 정서
  movement_balance  text[],              -- 움직임 / 균형
  -- 5. 후각 · 수면
  scent_reaction    text,                -- 향기에 대한 반응
  preferred_scent   text,                -- 선호하는 향
  sleep             text[],              -- 수면 상태
  -- 6. 부모 목표 및 고민
  biggest_concern   text,
  expected_change   text,
  -- 8~9. 프로그램 · 일정
  program           text not null,       -- 선택한 프로그램
  schedule          text[] not null,     -- 상담 가능 일정 (최소 2개)
  schedule_other    text,                -- 위 일정 외 희망 시간
  -- 진행 상태 (입금 확인 등 수기 관리)
  status            text not null default 'new',    -- new | paid | scheduled | done | canceled
  -- 동의 (전부 필수 — 서버에서 4개 모두 true 인지 확인 후 저장)
  program_consent   boolean not null default false, -- 프로그램 안내(의료행위 아님) 동의
  refund_consent    boolean not null default false, -- 예약 및 환불 안내 동의
  fee_consent       boolean not null default false, -- 비용·입금 안내 확인
  privacy_consent   boolean not null default false, -- 개인정보(민감정보 포함) 수집·이용 동의
  -- 전체 응답 원본
  answers           jsonb not null default '{}'::jsonb,
  user_agent        text
);

alter table rf_core_reset_applications enable row level security;
-- 공개 정책을 만들지 않는다 = anon/authenticated 직접 접근 차단.
-- 삽입/조회는 서버(/api, service_role)에서만 수행한다.

create index if not exists idx_core_reset_created_at on rf_core_reset_applications (created_at desc);
create index if not exists idx_core_reset_status     on rf_core_reset_applications (status);
create index if not exists idx_core_reset_key        on rf_core_reset_applications (program_key);

-- ════════════════════════════════════════════════════════════════
-- 브레인센트 코어 리셋 코칭 예약 시스템 — 초기 스키마
-- prefix: rf_ (Regist-Form)
-- ⚠️ '짱샘의 책방' Supabase 프로젝트를 공유함.
--    - 모든 객체에 rf_ prefix (테이블/함수/정책 충돌 방지)
--    - 공유 auth.users 사용 → 관리자 권한은 rf_admins 화이트리스트로만 부여
--    - SECURITY DEFINER 함수는 search_path 고정(검색경로 하이재킹 방지)
-- ════════════════════════════════════════════════════════════════
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────
-- 0. 관리자 화이트리스트 (공유 프로젝트 보안 핵심)
-- ─────────────────────────────────────────────
create table if not exists rf_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- 현재 로그인 사용자가 rf 관리자인지 (RLS 정책에서 사용)
create or replace function rf_is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from rf_admins where user_id = auth.uid()); $$;

-- ─────────────────────────────────────────────
-- 1. 프로그램 (베이직/프리미엄)
-- ─────────────────────────────────────────────
create table if not exists rf_programs (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,          -- 'basic' | 'premium'
  name          text not null,
  price         integer not null,              -- KRW
  session_count integer not null default 1,    -- 총 회차 수
  description   text,
  sort_order    integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 2. 신청서 항목 (관리자 편집 가능 — 요구사항 #2)
-- ─────────────────────────────────────────────
create table if not exists rf_form_fields (
  id            uuid primary key default gen_random_uuid(),
  section       text not null,
  section_order integer not null default 0,
  field_order   integer not null default 0,
  field_key     text unique not null,
  label         text not null,
  field_type    text not null,                 -- short|long|tel|date|radio|checkbox|select
  options       jsonb not null default '[]'::jsonb,
  placeholder   text,
  help_text     text,
  required      boolean not null default false,
  min_select    integer,                       -- checkbox 최소 선택 수
  is_consent    boolean not null default false,
  consent_kind  text,                          -- 'privacy' | 'sensitive'
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 3. 신청서 제출
-- ─────────────────────────────────────────────
create table if not exists rf_applications (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  status          text not null default 'draft',
    -- draft|submitted|pending_payment|confirmed|in_progress|completed|cancelled
  program_id      uuid references rf_programs(id),
  guardian_name   text,
  guardian_phone  text,
  guardian_kakao  text,
  region          text,
  child_name      text,
  child_birth     date,
  answers         jsonb not null default '{}'::jsonb,
  -- 동의 (민감정보 별도)
  consent_privacy   boolean not null default false,
  consent_sensitive boolean not null default false,
  consent_at        timestamptz,
  -- 결제
  payment_method  text,                        -- 'bank' | 'toss'
  payment_status  text not null default 'unpaid',  -- unpaid|pending|paid|refunded
  amount          integer,
  paid_at         timestamptz,
  toss_payment_key text,
  toss_order_id   text,
  -- 본인 예약 조회용 토큰 (gen_random_uuid: core, 확장 의존성 없음)
  access_token    text not null default replace(gen_random_uuid()::text, '-', ''),
  notes           text
);
create index if not exists rf_applications_phone_idx  on rf_applications (guardian_phone);
create index if not exists rf_applications_status_idx on rf_applications (status);

-- ─────────────────────────────────────────────
-- 4. 가용 슬롯 (호스트 설정 — 요구사항 #3, 1:1 전용)
-- ─────────────────────────────────────────────
create table if not exists rf_slots (
  id              uuid primary key default gen_random_uuid(),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  session_kind    text not null default 'consult',  -- consult(초기상담) | checkin(주간체크인)
  status          text not null default 'open',     -- open|held|booked|blocked
  held_by         uuid,
  hold_expires_at timestamptz,
  booking_id      uuid,
  created_at      timestamptz not null default now(),
  constraint rf_slots_time_chk check (ends_at > starts_at)
);
create index if not exists rf_slots_starts_idx on rf_slots (starts_at);
create index if not exists rf_slots_status_idx on rf_slots (status);

-- ─────────────────────────────────────────────
-- 5. 예약 (회차별)
-- ─────────────────────────────────────────────
create table if not exists rf_bookings (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references rf_applications(id) on delete cascade,
  slot_id         uuid not null references rf_slots(id),
  session_no      integer not null default 1,
  session_kind    text not null,
  status          text not null default 'held',  -- held|confirmed|completed|cancelled|no_show
  hold_expires_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create unique index if not exists rf_bookings_active_slot_idx
  on rf_bookings (slot_id)
  where status in ('held', 'confirmed', 'completed');
create index if not exists rf_bookings_app_idx on rf_bookings (application_id);

-- ─────────────────────────────────────────────
-- 6. 휴무/차단
-- ─────────────────────────────────────────────
create table if not exists rf_blackouts (
  id         uuid primary key default gen_random_uuid(),
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 7. 알림 발송 이력 (솔라피)
-- ─────────────────────────────────────────────
create table if not exists rf_notifications (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid references rf_applications(id) on delete set null,
  booking_id     uuid references rf_bookings(id) on delete set null,
  kind           text not null,   -- booking_confirmed|new_application|reminder|payment_request
  channel        text not null default 'alimtalk',
  recipient      text,
  status         text not null default 'pending',  -- pending|sent|failed
  payload        jsonb,
  provider_msg_id text,
  error          text,
  created_at     timestamptz not null default now(),
  sent_at        timestamptz
);

-- ════════════════════════════════════════════════════════════════
-- 선점 로직 (호텔식): 행 잠금(FOR UPDATE) + 15분 Hold
-- 모든 함수 search_path 고정
-- ════════════════════════════════════════════════════════════════

-- 슬롯 임시 점유
create or replace function rf_hold_slot(
  p_slot_id        uuid,
  p_application_id  uuid,
  p_session_no     integer,
  p_hold_minutes   integer default 15
) returns rf_bookings
language plpgsql security definer
set search_path = public
as $$
declare
  v_slot    rf_slots;
  v_booking rf_bookings;
  v_now     timestamptz := now();
begin
  select * into v_slot from rf_slots where id = p_slot_id for update;
  if not found then raise exception 'SLOT_NOT_FOUND'; end if;
  if v_slot.status = 'blocked' then raise exception 'SLOT_BLOCKED'; end if;

  if v_slot.status = 'held'
     and v_slot.hold_expires_at is not null
     and v_slot.hold_expires_at < v_now then
    update rf_bookings set status = 'cancelled', updated_at = v_now
      where slot_id = p_slot_id and status = 'held';
    v_slot.status := 'open';
  end if;

  if v_slot.status <> 'open' then raise exception 'SLOT_TAKEN'; end if;

  insert into rf_bookings (application_id, slot_id, session_no, session_kind, status, hold_expires_at)
  values (p_application_id, p_slot_id, p_session_no, v_slot.session_kind, 'held',
          v_now + make_interval(mins => p_hold_minutes))
  returning * into v_booking;

  update rf_slots
    set status = 'held', held_by = p_application_id,
        hold_expires_at = v_booking.hold_expires_at, booking_id = v_booking.id
    where id = p_slot_id;

  return v_booking;
end;
$$;

-- 예약 확정 (결제/입금 확인 후)
create or replace function rf_confirm_booking(p_booking_id uuid)
returns void language plpgsql security definer
set search_path = public
as $$
begin
  update rf_bookings set status = 'confirmed', hold_expires_at = null, updated_at = now()
    where id = p_booking_id and status = 'held';
  update rf_slots set status = 'booked', hold_expires_at = null
    where booking_id = p_booking_id;
end;
$$;

-- 예약 취소 (슬롯 반환)
create or replace function rf_cancel_booking(p_booking_id uuid)
returns void language plpgsql security definer
set search_path = public
as $$
begin
  update rf_bookings set status = 'cancelled', updated_at = now()
    where id = p_booking_id;
  update rf_slots set status = 'open', held_by = null, hold_expires_at = null, booking_id = null
    where booking_id = p_booking_id;
end;
$$;

-- 만료된 hold 일괄 해제 (Vercel Cron → /api/cron/release-holds)
create or replace function rf_release_expired_holds()
returns integer language plpgsql security definer
set search_path = public
as $$
declare v_count integer;
begin
  with expired as (
    update rf_bookings set status = 'cancelled', updated_at = now()
    where status = 'held' and hold_expires_at < now()
    returning slot_id
  )
  update rf_slots s
    set status = 'open', held_by = null, hold_expires_at = null, booking_id = null
    from expired e where s.id = e.slot_id;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ════════════════════════════════════════════════════════════════
-- RLS — 공유 프로젝트 안전 모델
--  · anon: 비민감 데이터(프로그램/항목/슬롯/휴무) 읽기만
--  · 관리자: rf_is_admin() 통과한 화이트리스트 사용자만 전체 접근
--  · 쓰기/PII: SECURITY DEFINER RPC 또는 service_role(서버)만
-- ════════════════════════════════════════════════════════════════
alter table rf_admins        enable row level security;
alter table rf_programs      enable row level security;
alter table rf_form_fields   enable row level security;
alter table rf_slots         enable row level security;
alter table rf_blackouts     enable row level security;
alter table rf_applications  enable row level security;
alter table rf_bookings      enable row level security;
alter table rf_notifications enable row level security;

-- 관리자 목록: 본인 행만 확인 가능(목록 노출 방지)
create policy rf_admins_self on rf_admins for select to authenticated using (user_id = auth.uid());

-- 공개(anon/authenticated): 비민감 데이터 읽기만
create policy rf_programs_read  on rf_programs    for select to anon, authenticated using (active);
create policy rf_form_read      on rf_form_fields for select to anon, authenticated using (active);
create policy rf_slots_read     on rf_slots       for select to anon, authenticated using (true);
create policy rf_blackouts_read on rf_blackouts   for select to anon, authenticated using (true);

-- 관리자: 화이트리스트(rf_is_admin)만 전체 접근
create policy rf_admin_programs  on rf_programs     for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_form      on rf_form_fields  for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_slots     on rf_slots        for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_blackouts on rf_blackouts    for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_apps      on rf_applications  for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_bookings  on rf_bookings      for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_notif     on rf_notifications for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
create policy rf_admin_admins    on rf_admins        for all to authenticated using (rf_is_admin()) with check (rf_is_admin());
-- ※ rf_applications/bookings/notifications 에는 anon 정책 없음 → 서버(service_role)/RPC 경유만

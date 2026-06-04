-- ════════════════════════════════════════════════════════════════
-- Phase 2: 슬롯 예약(선점) — RPC 개선 + 테스트용 슬롯 시드
--  · 슬롯은 "가용 시간"일 뿐, 회차 종류(상담/체크인)는 예약 시점에 결정
--  · rf_hold_slot 에 p_session_kind 추가 (기존 4-인자 버전은 제거)
-- ════════════════════════════════════════════════════════════════

-- 기존 4-인자 버전 제거 후 5-인자 버전으로 재정의
drop function if exists rf_hold_slot(uuid, uuid, integer, integer);

create or replace function rf_hold_slot(
  p_slot_id        uuid,
  p_application_id  uuid,
  p_session_no     integer,
  p_session_kind   text,
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
  -- 동시 클릭 방지: 슬롯 행 잠금
  select * into v_slot from rf_slots where id = p_slot_id for update;
  if not found then raise exception 'SLOT_NOT_FOUND'; end if;
  if v_slot.status = 'blocked' then raise exception 'SLOT_BLOCKED'; end if;

  -- 만료된 hold 자동 해제 후 재사용
  if v_slot.status = 'held'
     and v_slot.hold_expires_at is not null
     and v_slot.hold_expires_at < v_now then
    update rf_bookings set status = 'cancelled', updated_at = v_now
      where slot_id = p_slot_id and status = 'held';
    v_slot.status := 'open';
  end if;

  if v_slot.status <> 'open' then raise exception 'SLOT_TAKEN'; end if;

  -- 한 신청건이 같은 회차를 중복 점유하지 않도록 정리(재선택 대비)
  update rf_bookings b set status = 'cancelled', updated_at = v_now
    where b.application_id = p_application_id and b.session_no = p_session_no
      and b.status = 'held';
  update rf_slots s set status = 'open', held_by = null, hold_expires_at = null, booking_id = null
    where s.held_by = p_application_id and s.status = 'held'
      and s.booking_id in (
        select id from rf_bookings
        where application_id = p_application_id and session_no = p_session_no
      )
      and s.id <> p_slot_id;

  insert into rf_bookings (application_id, slot_id, session_no, session_kind, status, hold_expires_at)
  values (p_application_id, p_slot_id, p_session_no, p_session_kind, 'held',
          v_now + make_interval(mins => p_hold_minutes))
  returning * into v_booking;

  update rf_slots
    set status = 'held', held_by = p_application_id,
        hold_expires_at = v_booking.hold_expires_at, booking_id = v_booking.id
    where id = p_slot_id;

  return v_booking;
end;
$$;

grant execute on function rf_hold_slot(uuid, uuid, integer, text, integer)
  to anon, authenticated, service_role;

-- ─────────────────────────────────────────────
-- 테스트용 샘플 슬롯 (관리자 슬롯 설정은 Phase 5)
--  · 향후 3주, 평일, 10:00 / 14:00 / 16:00 (KST), 각 50분
--  · 미래 open 슬롯이 하나도 없을 때만 시드 (재실행 안전)
-- ─────────────────────────────────────────────
insert into rf_slots (starts_at, ends_at, session_kind, status)
select
  ((d::date + t) at time zone 'Asia/Seoul'),
  ((d::date + t) at time zone 'Asia/Seoul') + interval '50 minutes',
  'open',
  'open'
from generate_series(current_date + 2, current_date + 22, interval '1 day') d
cross join (values (time '10:00'), (time '14:00'), (time '16:00')) as times(t)
where extract(dow from d) between 1 and 5            -- 월~금
  and not exists (select 1 from rf_slots where starts_at > now());

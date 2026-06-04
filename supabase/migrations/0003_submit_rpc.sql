-- ════════════════════════════════════════════════════════════════
-- Phase 1: 신청서 제출 RPC + 함수 실행 권한 정리 (rf_ prefix)
-- ════════════════════════════════════════════════════════════════

-- 신청서 제출 (anon 호출 허용, 동의 필수 검증, RLS 우회 안전 삽입)
create or replace function rf_submit_application(p_payload jsonb)
returns table(id uuid, access_token text)
language plpgsql security definer
set search_path = public
as $$
declare v_app rf_applications;
begin
  -- 동의 필수
  if coalesce((p_payload->>'consent_privacy')::boolean, false) is not true
     or coalesce((p_payload->>'consent_sensitive')::boolean, false) is not true then
    raise exception 'CONSENT_REQUIRED';
  end if;
  -- 최소 필수값
  if coalesce(p_payload->>'guardian_name', '') = ''
     or coalesce(p_payload->>'guardian_phone', '') = '' then
    raise exception 'REQUIRED_FIELD_MISSING';
  end if;

  insert into rf_applications (
    status, guardian_name, guardian_phone, guardian_kakao, region,
    child_name, child_birth, answers,
    consent_privacy, consent_sensitive, consent_at
  ) values (
    'submitted',
    p_payload->>'guardian_name',
    p_payload->>'guardian_phone',
    nullif(p_payload->>'guardian_kakao', ''),
    nullif(p_payload->>'region', ''),
    nullif(p_payload->>'child_name', ''),
    nullif(p_payload->>'child_birth', '')::date,
    coalesce(p_payload->'answers', '{}'::jsonb),
    true, true, now()
  ) returning * into v_app;

  return query select v_app.id, v_app.access_token;
end;
$$;

-- ── 함수 실행 권한 정리 ──
-- 민감/운영 함수: 공개 호출 차단, 서버(service_role) 전용
revoke execute on function rf_confirm_booking(uuid)   from public;
revoke execute on function rf_cancel_booking(uuid)    from public;
revoke execute on function rf_release_expired_holds() from public;
grant  execute on function rf_confirm_booking(uuid)   to service_role;
grant  execute on function rf_cancel_booking(uuid)    to service_role;
grant  execute on function rf_release_expired_holds() to service_role;

-- 신청 흐름 함수: anon 허용
grant execute on function rf_hold_slot(uuid, uuid, integer, integer) to anon, authenticated, service_role;
grant execute on function rf_submit_application(jsonb)               to anon, authenticated, service_role;
grant execute on function rf_is_admin()                              to anon, authenticated, service_role;

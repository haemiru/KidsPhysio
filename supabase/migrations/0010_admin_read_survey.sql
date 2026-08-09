-- ════════════════════════════════════════════════════════════════
-- 관리자 설문 응답 조회 권한
--  · rf_survey_responses 는 0005 에서 RLS 만 켜고 정책을 하나도 만들지 않았다
--    (= anon/authenticated 전면 차단, 서버 service_role 만 접근).
--    그래서 /admin 에서 응답을 볼 수 없었다.
--  · 예약 시스템 테이블들과 동일하게 rf_is_admin() 화이트리스트에게만 개방한다.
--    (0001_init.sql 의 rf_admin_* 정책과 같은 방식)
--  · ⚠️ select 만 허용한다. 설문 응답은 열람 전용이며 관리자도 수정·삭제할 수 없다.
--    (수정이 필요하면 Supabase Table Editor 에서 service_role 로 한다)
-- ════════════════════════════════════════════════════════════════

drop policy if exists rf_admin_survey_read on rf_survey_responses;

create policy rf_admin_survey_read
  on rf_survey_responses
  for select
  to authenticated
  using (rf_is_admin());

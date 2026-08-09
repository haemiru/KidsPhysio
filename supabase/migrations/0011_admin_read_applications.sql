-- ════════════════════════════════════════════════════════════════
-- 관리자 신청 내역 조회 권한 (상담 · 클래스 · 몸읽기 · 코어리셋)
--  · 0006~0009 는 RLS 만 켜고 정책을 만들지 않았다
--    (= anon/authenticated 전면 차단, 서버 service_role 전용).
--    그래서 /admin 에서 신청 내역을 볼 수 없었다.
--  · 0010(설문)과 동일하게 rf_is_admin() 화이트리스트에게만 개방한다.
--  · ⚠️ select 만 허용한다. 신청 내역은 열람 전용이며 관리자도 수정·삭제할 수 없다.
--    입금 확인(status 변경) 등은 Supabase Table Editor 에서 service_role 로 한다.
--  · ⚠️ rf_core_reset_applications 에는 진단·치료 이력 등 건강 관련 정보(민감정보)가
--    들어 있다. 관리자 화이트리스트(rf_admins) 를 최소 인원으로 유지할 것.
-- ════════════════════════════════════════════════════════════════

drop policy if exists rf_admin_consultations_read on rf_consultations;
create policy rf_admin_consultations_read
  on rf_consultations for select to authenticated using (rf_is_admin());

drop policy if exists rf_admin_class_apps_read on rf_class_applications;
create policy rf_admin_class_apps_read
  on rf_class_applications for select to authenticated using (rf_is_admin());

drop policy if exists rf_admin_project_apps_read on rf_project_applications;
create policy rf_admin_project_apps_read
  on rf_project_applications for select to authenticated using (rf_is_admin());

drop policy if exists rf_admin_core_reset_read on rf_core_reset_applications;
create policy rf_admin_core_reset_read
  on rf_core_reset_applications for select to authenticated using (rf_is_admin());

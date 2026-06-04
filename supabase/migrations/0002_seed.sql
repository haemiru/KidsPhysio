-- ════════════════════════════════════════════════════════════════
-- 시드 데이터 — 기존 Google Form 기반
-- (idempotent: code/field_key 충돌 시 갱신)
-- ════════════════════════════════════════════════════════════════

-- ── 프로그램 ──
insert into rf_programs (code, name, price, session_count, description, sort_order) values
  ('basic',   '베이직',   150000, 5, '초기상담 1회 + 주간 체크인 4주', 1),
  ('premium', '프리미엄', 390000, 5, '초기상담 1회 + 주간 체크인 4주 (심화)', 2)
on conflict (code) do update
  set name = excluded.name, price = excluded.price,
      session_count = excluded.session_count, description = excluded.description;

-- ── 신청서 항목 ──
-- field_type: short|long|tel|date|radio|checkbox|select
insert into rf_form_fields
  (section, section_order, field_order, field_key, label, field_type, options, required, min_select, is_consent, consent_kind, help_text)
values
  -- 1. 보호자 정보
  ('보호자 정보', 1, 1, 'guardian_name',  '보호자 성함',     'short', '[]', true,  null, false, null, null),
  ('보호자 정보', 1, 2, 'guardian_phone', '연락처',          'tel',   '[]', true,  null, false, null, '예) 010-1234-5678'),
  ('보호자 정보', 1, 3, 'guardian_kakao', '카카오톡 아이디', 'short', '[]', false, null, false, null, null),
  ('보호자 정보', 1, 4, 'region',         '거주지역',        'short', '[]', true,  null, false, null, '방문 코칭 지역 확인용'),

  -- 2. 아동 정보
  ('아동 정보', 2, 1, 'child_name',   '아이 이름',   'short', '[]', true, null, false, null, null),
  ('아동 정보', 2, 2, 'child_birth',  '생년월일',    'date',  '[]', true, null, false, null, null),
  ('아동 정보', 2, 3, 'child_gender', '성별',        'radio', '["남","여"]', true, null, false, null, null),
  ('아동 정보', 2, 4, 'birth_weeks',  '출생주수',    'radio', '["만삭","37주 미만","잘 모르겠음"]', false, null, false, null, null),
  ('아동 정보', 2, 5, 'birth_method', '출산 방식',   'radio', '["자연분만","제왕절개"]', false, null, false, null, null),
  ('아동 정보', 2, 6, 'nicu',         'NICU 입원 경험', 'radio', '["있음","없음"]', false, null, false, null, null),
  ('아동 정보', 2, 7, 'diagnosis',    '현재 진단 또는 상담받은 내용', 'long', '[]', false, null, false, null, null),

  -- 3. 현재 치료 및 아동 상태 (※ 세부 옵션은 관리자 편집에서 확정)
  ('현재 치료 및 상태', 3, 1, 'current_therapy', '현재 받고 있는 치료', 'checkbox',
     '["감각통합","언어","ABA","물리","작업","인지","놀이","행동","수중","심리","없음","기타"]', false, null, false, null, null),
  ('현재 치료 및 상태', 3, 2, 'posture_core',    '자세/코어',     'checkbox', '[]', false, null, false, null, '옵션은 관리자 편집에서 확정하세요.'),
  ('현재 치료 및 상태', 3, 3, 'breathing',       '호흡',          'checkbox', '[]', false, null, false, null, '옵션은 관리자 편집에서 확정하세요.'),
  ('현재 치료 및 상태', 3, 4, 'sensory_emotion', '감각/정서',     'checkbox', '[]', false, null, false, null, '옵션은 관리자 편집에서 확정하세요.'),
  ('현재 치료 및 상태', 3, 5, 'movement_balance','움직임/균형',   'checkbox', '[]', false, null, false, null, '옵션은 관리자 편집에서 확정하세요.'),

  -- 4. 후각·수면 체크
  ('후각·수면 체크', 4, 1, 'scent_reaction',  '향기에 대한 반응', 'radio',
     '["매우 민감","민감","보통","둔감","매우 둔감"]', false, null, false, null, null),
  ('후각·수면 체크', 4, 2, 'preferred_scent', '선호하는 향', 'radio',
     '["오렌지","라벤더","우디","생활향","잘 모르겠음"]', false, null, false, null, null),
  ('후각·수면 체크', 4, 3, 'sleep_state',     '수면 상태',   'checkbox', '[]', false, null, false, null, '옵션은 관리자 편집에서 확정하세요.'),

  -- 5. 부모 목표
  ('부모 목표', 5, 1, 'concern',     '현재 가장 걱정되는 부분', 'long', '[]', true, null, false, null, null),
  ('부모 목표', 5, 2, 'expectation', '4주 동안 기대하는 변화',  'long', '[]', true, null, false, null, null),

  -- 6. 동의 (개인정보 + 민감정보 별도)
  ('동의', 6, 1, 'consent_privacy',   '개인정보 수집·이용 동의 (필수)', 'checkbox',
     '["동의합니다"]', true, 1, true, 'privacy',
     '보호자·아동의 인적사항을 코칭 신청·예약·안내 목적으로 수집·이용합니다.'),
  ('동의', 6, 2, 'consent_sensitive', '민감정보(건강) 처리 동의 (필수)', 'checkbox',
     '["동의합니다"]', true, 1, true, 'sensitive',
     '아동의 진단·치료·발달 상태 등 건강에 관한 민감정보를 코칭 제공 목적으로 처리합니다.')
on conflict (field_key) do update set
  section = excluded.section, section_order = excluded.section_order,
  field_order = excluded.field_order, label = excluded.label,
  field_type = excluded.field_type, options = excluded.options,
  required = excluded.required, min_select = excluded.min_select,
  is_consent = excluded.is_consent, consent_kind = excluded.consent_kind,
  help_text = excluded.help_text, updated_at = now();

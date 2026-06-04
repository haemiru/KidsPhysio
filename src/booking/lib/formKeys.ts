import type { FormSection, FormValues, FormErrors, SubmitPayload } from '../types'

// rf_applications 에 정규화 컬럼으로 들어가는 field_key (나머지는 answers jsonb)
export const NORMALIZED_KEYS = [
  'guardian_name',
  'guardian_phone',
  'guardian_kakao',
  'region',
  'child_name',
  'child_birth',
]

// 신청 payload 빌드: values(field_key→value) → RPC payload
export function buildSubmitPayload(values: FormValues, sections: FormSection[]): SubmitPayload {
  const answers: Record<string, unknown> = {}
  const payload: SubmitPayload = {
    consent_privacy: false,
    consent_sensitive: false,
    answers,
  }

  for (const sec of sections) {
    for (const f of sec.fields) {
      const v = values[f.field_key]
      if (f.is_consent) {
        const agreed = Array.isArray(v) ? v.length > 0 : Boolean(v)
        if (f.consent_kind === 'privacy') payload.consent_privacy = agreed
        if (f.consent_kind === 'sensitive') payload.consent_sensitive = agreed
        continue
      }
      if (NORMALIZED_KEYS.includes(f.field_key)) {
        payload[f.field_key] = v ?? ''
      } else if (v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)) {
        answers[f.field_key] = v
      }
    }
  }
  return payload
}

// 필수/최소선택 검증 → {ok, errors:{field_key:msg}}
export function validateForm(values: FormValues, sections: FormSection[]): { ok: boolean; errors: FormErrors } {
  const errors: FormErrors = {}
  for (const sec of sections) {
    for (const f of sec.fields) {
      const v = values[f.field_key]
      const isEmpty = v === undefined || v === '' || (Array.isArray(v) && v.length === 0)
      if (f.required && isEmpty) {
        errors[f.field_key] = f.is_consent ? '동의가 필요합니다.' : '필수 항목입니다.'
        continue
      }
      if (f.field_type === 'checkbox' && f.min_select && Array.isArray(v) && v.length < f.min_select) {
        errors[f.field_key] = `최소 ${f.min_select}개 선택해 주세요.`
      }
    }
  }
  return { ok: Object.keys(errors).length === 0, errors }
}

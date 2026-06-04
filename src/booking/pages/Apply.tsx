import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import FormField from '../components/form/FormField'
import { useFormFields } from '../hooks/useFormFields'
import { supabase } from '../lib/supabase'
import { buildSubmitPayload, validateForm } from '../lib/formKeys'
import { saveApplication } from '../lib/applicationStore'
import type { FormValues, FormErrors, FieldValue } from '../types'

export default function Apply() {
  const { sections, loading, error } = useFormFields()
  const [values, setValues] = useState<FormValues>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onChange = (key: string, val: FieldValue) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)
    const { ok, errors: errs } = validateForm(values, sections)
    if (!ok) {
      setErrors(errs)
      // 첫 오류로 스크롤
      const firstKey = Object.keys(errs)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    try {
      const payload = buildSubmitPayload(values, sections)
      const { data, error } = await supabase.rpc('rf_submit_application', { p_payload: payload })
      if (error) throw error
      const row = Array.isArray(data) ? data[0] : data
      saveApplication({ id: row.id, accessToken: row.access_token })
      navigate('/booking')
    } catch (err) {
      const message = (err as Error)?.message ?? ''
      const msg =
        message.includes('CONSENT_REQUIRED')
          ? '필수 동의 항목에 동의해 주세요.'
          : message.includes('REQUIRED_FIELD_MISSING')
            ? '보호자 성함과 연락처는 필수입니다.'
            : '제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <p className="py-16 text-center text-muted">신청서를 불러오는 중…</p>
      </PublicLayout>
    )
  }
  if (error) {
    return (
      <PublicLayout>
        <p className="py-16 text-center text-accent">신청서를 불러오지 못했습니다. 새로고침 해 주세요.</p>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <h1 className="text-2xl font-bold">코칭 신청서</h1>
      <p className="mt-2 text-sm text-muted">아이에게 맞는 코칭을 위해 정확히 작성해 주세요.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-8">
        {sections.map((sec) => (
          <section key={sec.section} className="card">
            <h2 className="mb-4 font-bold text-primary-dark">{sec.section}</h2>
            <div className="space-y-5">
              {sec.fields.map((f) => (
                <div key={f.field_key} id={`field-${f.field_key}`}>
                  <FormField field={f} value={values[f.field_key]} error={errors[f.field_key]} onChange={onChange} />
                </div>
              ))}
            </div>
          </section>
        ))}

        {submitError && (
          <p className="rounded-xl bg-accent/10 px-4 py-3 text-center text-sm text-accent">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="block w-full rounded-2xl bg-primary py-4 text-center font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? '제출 중…' : '다음: 상담 시간 선택'}
        </button>
      </form>
    </PublicLayout>
  )
}

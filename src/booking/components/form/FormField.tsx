import { Link } from 'react-router-dom'
import type { FormFieldDef, FieldValue } from '../../types'

const inputBase =
  'mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function FormField({
  field,
  value,
  error,
  onChange,
}: {
  field: FormFieldDef
  value: FieldValue
  error?: string
  onChange: (key: string, value: FieldValue) => void
}) {
  const { field_key, label, field_type, options, placeholder, help_text, required, is_consent } = field

  const setVal = (v: FieldValue) => onChange(field_key, v)

  const toggleCheckbox = (opt: string) => {
    const arr = Array.isArray(value) ? value : []
    setVal(arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt])
  }

  // 동의 항목: 단일 체크박스 + 처리방침 링크
  if (is_consent) {
    const checked = Array.isArray(value) ? value.length > 0 : Boolean(value)
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/10 bg-white p-4">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 accent-[var(--color-primary)]"
          checked={checked}
          onChange={(e) => setVal(e.target.checked ? [options?.[0] ?? '동의'] : [])}
        />
        <span className="text-sm">
          <span className="font-semibold">{label}</span>
          {help_text && <span className="mt-1 block text-xs text-muted">{help_text}</span>}
          <Link to="/privacy" target="_blank" className="mt-1 block text-xs text-primary-dark underline">
            개인정보 처리방침 보기
          </Link>
          {error && <span className="mt-1 block text-xs text-accent">{error}</span>}
        </span>
      </label>
    )
  }

  const strVal = typeof value === 'string' ? value : ''

  return (
    <div>
      <label className="block text-sm font-semibold">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {help_text && <p className="mt-1 text-xs text-muted">{help_text}</p>}

      {field_type === 'short' && (
        <input className={inputBase} value={strVal} placeholder={placeholder ?? ''} onChange={(e) => setVal(e.target.value)} />
      )}
      {field_type === 'tel' && (
        <input type="tel" inputMode="tel" className={inputBase} value={strVal} placeholder={placeholder ?? ''} onChange={(e) => setVal(e.target.value)} />
      )}
      {field_type === 'date' && (
        <input type="date" className={inputBase} value={strVal} onChange={(e) => setVal(e.target.value)} />
      )}
      {field_type === 'long' && (
        <textarea rows={4} className={inputBase} value={strVal} placeholder={placeholder ?? ''} onChange={(e) => setVal(e.target.value)} />
      )}
      {field_type === 'select' && (
        <select className={inputBase} value={strVal} onChange={(e) => setVal(e.target.value)}>
          <option value="">선택해 주세요</option>
          {(options ?? []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}
      {field_type === 'radio' && (
        <div className="mt-2 flex flex-wrap gap-2">
          {(options ?? []).map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => setVal(o)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                value === o ? 'border-primary bg-primary text-white' : 'border-black/10 bg-white hover:border-primary'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
      {field_type === 'checkbox' && (
        <div className="mt-2 flex flex-wrap gap-2">
          {(options ?? []).length === 0 && (
            <p className="text-xs text-muted">선택 항목이 없습니다. (관리자 설정 필요)</p>
          )}
          {(options ?? []).map((o) => {
            const on = Array.isArray(value) && value.includes(o)
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggleCheckbox(o)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  on ? 'border-primary bg-primary text-white' : 'border-black/10 bg-white hover:border-primary'
                }`}
              >
                {o}
              </button>
            )
          })}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  )
}

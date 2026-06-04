import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TYPES = ['short', 'long', 'tel', 'date', 'radio', 'checkbox', 'select']
const hasOptions = (t: string) => ['radio', 'checkbox', 'select'].includes(t)

interface EditableField {
  id: string
  section: string
  label: string
  field_type: string
  options: string[] | null
  required: boolean
  active: boolean
  min_select: number | string | null
  help_text: string | null
  _optionsText: string
  [key: string]: unknown
}

export default function FormEditor() {
  const [fields, setFields] = useState<EditableField[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('rf_form_fields')
      .select('*')
      .order('section_order')
      .order('field_order')
    const rows = (data ?? []) as any[]
    setFields(rows.map((f) => ({ ...f, _optionsText: (f.options ?? []).join(', ') })))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const update = (id: string, patch: Partial<EditableField>) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))

  const save = async (f: EditableField) => {
    setMsg(null)
    const options = hasOptions(f.field_type)
      ? f._optionsText.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    const { error } = await supabase
      .from('rf_form_fields')
      .update({
        label: f.label,
        field_type: f.field_type,
        options,
        required: f.required,
        min_select: f.min_select ? Number(f.min_select) : null,
        help_text: f.help_text || null,
        active: f.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', f.id)
    setMsg(error ? '저장 실패: ' + error.message : `'${f.label}' 저장됨`)
    if (!error) await load()
  }

  if (loading) return <p className="py-12 text-center text-muted">불러오는 중…</p>

  // 섹션별 그룹
  const sections = [...new Set(fields.map((f) => f.section))]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">신청서 항목</h1>
        <span className="text-xs text-muted">변경은 신청서에 즉시 반영됩니다.</span>
      </div>
      {msg && <p className="mb-3 rounded-lg bg-secondary/30 px-4 py-2 text-sm">{msg}</p>}

      <div className="space-y-6">
        {sections.map((sec) => (
          <section key={sec}>
            <h2 className="mb-2 font-bold text-primary-dark">{sec}</h2>
            <div className="space-y-3">
              {fields.filter((f) => f.section === sec).map((f) => (
                <div key={f.id} className={`rounded-xl border p-4 ${f.active ? 'border-black/10 bg-white' : 'border-dashed border-black/15 bg-black/[0.02]'}`}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                    <label className="text-sm">질문
                      <input value={f.label} onChange={(e) => update(f.id, { label: e.target.value })} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
                    </label>
                    <label className="text-sm">유형
                      <select value={f.field_type} onChange={(e) => update(f.id, { field_type: e.target.value })} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2">
                        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </label>
                  </div>

                  {hasOptions(f.field_type) && (
                    <label className="mt-3 block text-sm">선택지 (콤마로 구분)
                      <input value={f._optionsText} onChange={(e) => update(f.id, { _optionsText: e.target.value })} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
                    </label>
                  )}

                  <label className="mt-3 block text-sm">안내문구(선택)
                    <input value={f.help_text ?? ''} onChange={(e) => update(f.id, { help_text: e.target.value })} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
                  </label>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={f.required} onChange={(e) => update(f.id, { required: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />필수
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={f.active} onChange={(e) => update(f.id, { active: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />노출
                    </label>
                    {f.field_type === 'checkbox' && (
                      <label className="flex items-center gap-2">최소 선택
                        <input type="number" value={f.min_select ?? ''} onChange={(e) => update(f.id, { min_select: e.target.value })} className="w-16 rounded-lg border border-black/10 px-2 py-1" />
                      </label>
                    )}
                    <button onClick={() => save(f)} className="ml-auto rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-dark">저장</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

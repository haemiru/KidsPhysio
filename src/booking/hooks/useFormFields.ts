import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { FormFieldDef, FormSection } from '../types'

// 활성 신청서 항목을 섹션별로 묶어서 반환
export function useFormFields() {
  const [sections, setSections] = useState<FormSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('rf_form_fields')
        .select('*')
        .eq('active', true)
        .order('section_order', { ascending: true })
        .order('field_order', { ascending: true })

      if (!alive) return
      if (error) {
        setError(error)
        setLoading(false)
        return
      }

      // 섹션별 그룹화 (section_order 유지)
      const map = new Map<string, FormSection>()
      for (const f of (data ?? []) as FormFieldDef[]) {
        if (!map.has(f.section))
          map.set(f.section, { section: f.section, order: f.section_order, fields: [] })
        map.get(f.section)!.fields.push(f)
      }
      const grouped = [...map.values()].sort((a, b) => a.order - b.order)
      setSections(grouped)
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  return { sections, loading, error }
}

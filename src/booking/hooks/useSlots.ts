import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Slot } from '../types'

// 예약 가능한(open) 미래 슬롯을 불러온다. refetch로 최신화.
export function useSlots() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  const fetchSlots = useCallback(async () => {
    const { data, error } = await supabase
      .from('rf_slots')
      .select('id, starts_at, ends_at, status')
      .eq('status', 'open')
      .gt('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })

    if (error) {
      setError(error)
    } else {
      setSlots((data ?? []) as Slot[])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSlots()
  }, [fetchSlots])

  return { slots, loading, error, refetch: fetchSlots }
}

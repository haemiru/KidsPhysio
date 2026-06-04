import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { dateKey, dateLabel, timeLabel } from '../../lib/datetime'
import { sessionByNo } from '../../lib/sessionPlan'

const STATUS: Record<string, string> = { held: '점유중', confirmed: '확정', completed: '완료', no_show: '노쇼' }

interface BookingRow {
  id: string
  session_no: number
  session_kind: string
  status: string
  rf_slots?: { starts_at: string } | null
  rf_applications?: { guardian_name: string; child_name: string; guardian_phone: string } | null
}

export default function Bookings() {
  const [rows, setRows] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const { data } = await supabase
        .from('rf_bookings')
        .select('id, session_no, session_kind, status, rf_slots!inner(starts_at), rf_applications(guardian_name, child_name, guardian_phone)')
        .in('status', ['held', 'confirmed', 'completed'])
        .gte('rf_slots.starts_at', new Date().toISOString())
        .order('starts_at', { foreignTable: 'rf_slots', ascending: true })
      setRows((data ?? []) as unknown as BookingRow[])
      setLoading(false)
    })()
  }, [])

  const byDate = useMemo(() => {
    const groups = new Map<string, BookingRow[]>()
    for (const b of rows) {
      const iso = b.rf_slots?.starts_at
      if (!iso) continue
      const k = dateKey(iso)
      if (!groups.has(k)) groups.set(k, [])
      groups.get(k)!.push(b)
    }
    return [...groups.entries()]
  }, [rows])

  if (loading) return <p className="py-12 text-center text-muted">불러오는 중…</p>

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">예약 현황 <span className="text-sm font-normal text-muted">(다가오는 일정)</span></h1>
      {byDate.length === 0 ? (
        <p className="py-12 text-center text-muted">예정된 예약이 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {byDate.map(([k, list]) => (
            <div key={k}>
              <h2 className="mb-2 font-semibold text-primary-dark">{dateLabel(list[0].rf_slots!.starts_at)}</h2>
              <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
                {list.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border-b border-black/5 px-4 py-3 text-sm last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-20 font-medium">{timeLabel(b.rf_slots!.starts_at)}</span>
                      <span>
                        <span className="font-medium">{b.rf_applications?.guardian_name}</span>
                        <span className="text-muted"> · {b.rf_applications?.child_name}</span>
                        <span className="block text-xs text-muted">
                          {sessionByNo(b.session_no)?.label} · {b.rf_applications?.guardian_phone}
                        </span>
                      </span>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${b.status === 'confirmed' ? 'bg-secondary/40' : 'bg-black/5'}`}>
                      {STATUS[b.status] ?? b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

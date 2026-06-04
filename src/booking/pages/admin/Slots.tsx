import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { dateKey, dateLabel, timeLabel } from '../../lib/datetime'

const SLOT_STATUS: Record<string, string> = { open: '열림', held: '점유중', booked: '예약됨', blocked: '차단' }

interface SlotRow {
  id: string
  starts_at: string
  status: string
}
interface BlackoutRow {
  id: string
  starts_at: string
  ends_at: string
  reason: string | null
}

// 'YYYY-MM-DD' + 'HH:mm' (KST) → UTC ISO
const kstIso = (date: string, time: string) => new Date(`${date}T${time}:00+09:00`).toISOString()
const addMin = (iso: string, m: number) => new Date(new Date(iso).getTime() + m * 60000).toISOString()
const eachDate = (from: string, to: string) => {
  const out: Date[] = []
  const d = new Date(`${from}T00:00:00+09:00`)
  const end = new Date(`${to}T00:00:00+09:00`)
  while (d <= end) {
    out.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return out
}

export default function Slots() {
  const [slots, setSlots] = useState<SlotRow[]>([])
  const [blackouts, setBlackouts] = useState<BlackoutRow[]>([])
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // 시간 추가 폼
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [times, setTimes] = useState('10:00, 14:00, 16:00')
  const [duration, setDuration] = useState<number | string>(50)
  const [weekdaysOnly, setWeekdaysOnly] = useState(true)

  // 휴무 폼
  const [boDate, setBoDate] = useState('')
  const [boReason, setBoReason] = useState('')

  const load = async () => {
    const nowIso = new Date().toISOString()
    const [s, b] = await Promise.all([
      supabase.from('rf_slots').select('id, starts_at, status').gte('starts_at', nowIso).order('starts_at').limit(500),
      supabase.from('rf_blackouts').select('id, starts_at, ends_at, reason').gte('ends_at', nowIso).order('starts_at'),
    ])
    setSlots((s.data ?? []) as SlotRow[])
    setBlackouts((b.data ?? []) as BlackoutRow[])
  }
  useEffect(() => { load() }, [])

  const addSlots = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!from || !to) return
    setBusy(true)
    setMsg(null)
    const timeList = times.split(',').map((t) => t.trim()).filter(Boolean)
    const rows: { starts_at: string; ends_at: string; session_kind: string; status: string }[] = []
    for (const d of eachDate(from, to)) {
      const dow = d.getDay()
      if (weekdaysOnly && (dow === 0 || dow === 6)) continue
      const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(d) // YYYY-MM-DD
      for (const t of timeList) {
        const starts = kstIso(dateStr, t)
        rows.push({ starts_at: starts, ends_at: addMin(starts, Number(duration)), session_kind: 'open', status: 'open' })
      }
    }
    if (rows.length === 0) { setBusy(false); setMsg('생성할 시간이 없습니다.'); return }
    const { error } = await supabase.from('rf_slots').insert(rows)
    setMsg(error ? '추가 실패: ' + error.message : `${rows.length}개 시간을 추가했습니다.`)
    setBusy(false)
    await load()
  }

  const deleteSlot = async (id: string) => {
    const { error } = await supabase.from('rf_slots').delete().eq('id', id).eq('status', 'open')
    if (error) setMsg('삭제 실패: ' + error.message)
    await load()
  }

  const addBlackout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!boDate) return
    const starts = kstIso(boDate, '00:00')
    const ends = kstIso(boDate, '23:59')
    const { error } = await supabase.from('rf_blackouts').insert({ starts_at: starts, ends_at: ends, reason: boReason || null })
    setMsg(error ? '휴무 추가 실패: ' + error.message : '휴무일을 추가했습니다.')
    setBoDate(''); setBoReason('')
    await load()
  }
  const deleteBlackout = async (id: string) => {
    await supabase.from('rf_blackouts').delete().eq('id', id)
    await load()
  }

  const slotsByDate = (() => {
    const g = new Map<string, SlotRow[]>()
    for (const s of slots) {
      const k = dateKey(s.starts_at)
      if (!g.has(k)) g.set(k, [])
      g.get(k)!.push(s)
    }
    return [...g.entries()]
  })()

  return (
    <div className="space-y-8">
      {msg && <p className="rounded-lg bg-secondary/30 px-4 py-2 text-sm">{msg}</p>}

      {/* 시간 일괄 추가 */}
      <section className="card">
        <h2 className="mb-3 font-bold text-primary-dark">가용 시간 추가</h2>
        <form onSubmit={addSlots} className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">시작일
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
          </label>
          <label className="text-sm">종료일
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
          </label>
          <label className="text-sm">시간 (콤마로 구분)
            <input value={times} onChange={(e) => setTimes(e.target.value)} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
          </label>
          <label className="text-sm">상담 길이(분)
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={weekdaysOnly} onChange={(e) => setWeekdaysOnly(e.target.checked)} className="h-4 w-4 accent-[var(--color-primary)]" />
            평일만 (주말 제외)
          </label>
          <div className="sm:col-span-2">
            <button disabled={busy} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60">
              {busy ? '추가 중…' : '시간 추가'}
            </button>
          </div>
        </form>
      </section>

      {/* 휴무 */}
      <section className="card">
        <h2 className="mb-3 font-bold text-primary-dark">휴무일</h2>
        <form onSubmit={addBlackout} className="flex flex-wrap items-end gap-3">
          <label className="text-sm">날짜
            <input type="date" value={boDate} onChange={(e) => setBoDate(e.target.value)} className="mt-1 block rounded-lg border border-black/10 px-3 py-2" />
          </label>
          <label className="flex-1 text-sm">사유(선택)
            <input value={boReason} onChange={(e) => setBoReason(e.target.value)} className="mt-1 block w-full rounded-lg border border-black/10 px-3 py-2" />
          </label>
          <button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white">휴무 추가</button>
        </form>
        {blackouts.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm">
            {blackouts.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <span>{dateLabel(b.starts_at)} {b.reason && <span className="text-muted">— {b.reason}</span>}</span>
                <button onClick={() => deleteBlackout(b.id)} className="text-xs text-accent hover:underline">삭제</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 등록된 시간 */}
      <section>
        <h2 className="mb-3 font-bold">등록된 시간 <span className="text-sm font-normal text-muted">(다가오는 일정)</span></h2>
        {slotsByDate.length === 0 ? (
          <p className="py-8 text-center text-muted">등록된 시간이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {slotsByDate.map(([k, list]) => (
              <div key={k}>
                <h3 className="mb-2 text-sm font-semibold text-ink">{dateLabel(list[0].starts_at)}</h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((s) => (
                    <span key={s.id} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm ${s.status === 'open' ? 'border-black/10 bg-white' : 'border-transparent bg-black/5'}`}>
                      {timeLabel(s.starts_at)}
                      <span className="text-xs text-muted">{SLOT_STATUS[s.status]}</span>
                      {s.status === 'open' && (
                        <button onClick={() => deleteSlot(s.id)} className="text-xs text-accent hover:underline">×</button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

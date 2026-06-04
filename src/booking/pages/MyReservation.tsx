import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { sessionByNo } from '../lib/sessionPlan'
import { dateTimeLabel } from '../lib/datetime'

const STATUS: Record<string, string> = { held: '선택됨', confirmed: '확정', completed: '완료' }
const APP_STATUS: Record<string, string> = {
  submitted: '신청완료', pending_payment: '입금대기', confirmed: '예약확정',
  in_progress: '진행중', completed: '완료', cancelled: '취소',
}

interface BookingRow {
  id: string
  session_no: number
  status: string
  rf_slots?: { starts_at: string } | null
}
interface ReservationData {
  application: {
    guardian_name: string
    child_name: string
    status: string
  }
  bookings: BookingRow[]
}

export default function MyReservation() {
  const [params] = useSearchParams()
  const token = params.get('t')

  // 토큰 없음 → 연락처 조회 폼
  if (!token) return <LookupForm />

  return <ReservationView token={token} />
}

function LookupForm() {
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    await fetch('/api/my-lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    }).catch(() => {})
    setBusy(false)
    setSent(true)
  }

  return (
    <PublicLayout>
      <h1 className="text-2xl font-bold">내 예약 조회</h1>
      {sent ? (
        <div className="card mt-6 text-center">
          <p className="text-sm">
            입력하신 번호로 신청 내역이 있으면,
            <br />
            카카오톡으로 조회 링크를 보내드렸습니다.
          </p>
          <p className="mt-2 text-xs text-muted">알림톡이 오지 않으면 번호를 다시 확인해 주세요.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="card mt-6">
          <p className="mb-3 text-sm text-muted">신청 시 입력한 연락처를 넣어주세요. 조회 링크를 카톡으로 보내드립니다.</p>
          <input
            type="tel"
            required
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button disabled={busy} className="mt-3 w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary-dark disabled:opacity-60">
            {busy ? '전송 중…' : '조회 링크 받기'}
          </button>
        </form>
      )}
    </PublicLayout>
  )
}

function ReservationView({ token }: { token: string }) {
  const [data, setData] = useState<ReservationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/my-get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!r.ok) throw new Error()
      setData(await r.json())
    } catch {
      setErr(true)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [token])

  const cancel = async (bookingId: string) => {
    if (!confirm('이 회차 예약을 취소할까요?')) return
    setBusyId(bookingId)
    setMsg(null)
    try {
      const r = await fetch('/api/my-cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, bookingId }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error)
      setMsg('예약이 취소되었습니다.')
      await load()
    } catch (e) {
      setMsg(
        (e as Error).message === 'TOO_LATE'
          ? '상담 24시간 이내에는 온라인 취소가 어렵습니다. 연락처로 문의해 주세요.'
          : '취소에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      )
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <PublicLayout><p className="py-16 text-center text-muted">불러오는 중…</p></PublicLayout>
  if (err || !data) {
    return (
      <PublicLayout>
        <div className="py-16 text-center">
          <p className="text-accent">조회할 수 없는 링크입니다.</p>
          <p className="mt-1 text-sm text-muted">링크가 만료되었거나 잘못되었습니다.</p>
        </div>
      </PublicLayout>
    )
  }

  const { application: app, bookings } = data

  return (
    <PublicLayout>
      <h1 className="text-2xl font-bold">내 예약</h1>
      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{app.guardian_name}님</p>
            <p className="text-xs text-muted">아이: {app.child_name}</p>
          </div>
          <span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-semibold">
            {APP_STATUS[app.status] ?? app.status}
          </span>
        </div>
      </div>

      {msg && <p className="mt-4 rounded-xl bg-black/5 px-4 py-3 text-sm">{msg}</p>}

      <div className="card mt-4">
        <h2 className="mb-3 font-bold text-primary-dark">예약 일정</h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted">예약된 일정이 없습니다.</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {bookings.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{sessionByNo(b.session_no)?.label}</div>
                  <div className="text-xs text-muted">
                    {b.rf_slots?.starts_at ? dateTimeLabel(b.rf_slots.starts_at) : '—'} · {STATUS[b.status] ?? b.status}
                  </div>
                </div>
                <button
                  onClick={() => cancel(b.id)}
                  disabled={busyId === b.id}
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-xs text-accent hover:bg-accent/5 disabled:opacity-50"
                >
                  {busyId === b.id ? '취소 중…' : '취소'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PublicLayout>
  )
}

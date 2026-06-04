import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { adminPost } from '../../lib/adminApi'

const STATUS_LABEL: Record<string, string> = {
  draft: '작성중',
  submitted: '신청완료',
  pending_payment: '입금대기',
  confirmed: '확정',
  in_progress: '진행중',
  completed: '완료',
  cancelled: '취소',
}
const PAY_LABEL: Record<string, string> = { unpaid: '미결제', pending: '입금대기', paid: '결제완료', refunded: '환불' }

const won = (n: number | null | undefined) => (n == null ? '—' : Number(n).toLocaleString('ko-KR') + '원')
const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

interface AppRow {
  id: string
  created_at: string
  status: string
  payment_method: string | null
  payment_status: string | null
  amount: number | null
  guardian_name: string
  guardian_phone: string
  child_name: string
  rf_programs?: { name: string } | null
}

export default function Dashboard() {
  const [rows, setRows] = useState<AppRow[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    let q = supabase
      .from('rf_applications')
      .select('id, created_at, status, payment_method, payment_status, amount, guardian_name, guardian_phone, child_name, rf_programs(name)')
      .order('created_at', { ascending: false })
      .limit(200)
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setRows((data ?? []) as unknown as AppRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [filter])

  const confirmPayment = async (id: string) => {
    if (!confirm('입금을 확인하고 예약을 확정할까요? 신청자에게 확정 알림톡이 발송됩니다.')) return
    setBusyId(id)
    setMsg(null)
    try {
      await adminPost('/api/admin/confirm-payment', { applicationId: id })
      setMsg('입금 확인 완료 — 예약이 확정되었습니다.')
      await load()
    } catch (e) {
      setMsg('처리 실패: ' + (e as Error).message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold">신청 현황</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
        >
          <option value="all">전체</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {msg && <p className="mb-3 rounded-lg bg-secondary/30 px-4 py-2 text-sm">{msg}</p>}

      {loading ? (
        <p className="py-12 text-center text-muted">불러오는 중…</p>
      ) : rows.length === 0 ? (
        <p className="py-12 text-center text-muted">신청 내역이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-black/[0.03] text-left text-xs text-muted">
              <tr>
                <th className="px-4 py-3">신청일</th>
                <th className="px-4 py-3">보호자 / 아이</th>
                <th className="px-4 py-3">연락처</th>
                <th className="px-4 py-3">프로그램</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">결제</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-black/5">
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{fmt(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.guardian_name}</div>
                    <div className="text-xs text-muted">{r.child_name}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{r.guardian_phone}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {r.rf_programs?.name ?? '—'}
                    <div className="text-xs text-muted">{won(r.amount)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-semibold">
                      {STATUS_LABEL[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs">
                      {r.payment_method === 'bank' ? '무통장' : r.payment_method === 'toss' ? '카드' : '—'}
                      {' · '}
                      {PAY_LABEL[r.payment_status ?? ''] ?? r.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.payment_method === 'bank' && r.payment_status === 'pending' && (
                      <button
                        onClick={() => confirmPayment(r.id)}
                        disabled={busyId === r.id}
                        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                      >
                        {busyId === r.id ? '처리중…' : '입금 확인'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { supabase } from '../lib/supabase'
import { getApplication } from '../lib/applicationStore'
import { getHeldBookings } from '../lib/bookingStore'
import { saveProgramCode } from '../lib/paymentStore'
import { loadTossPayments, makeOrderId } from '../lib/loadToss'
import { sessionByNo } from '../lib/sessionPlan'
import { dateTimeLabel } from '../lib/datetime'
import type { Program } from '../types'

const won = (n: number) => n.toLocaleString('ko-KR') + '원'

export default function Payment() {
  const navigate = useNavigate()
  const application = getApplication()
  const held = getHeldBookings()

  const [programs, setPrograms] = useState<Program[]>([])
  const [programCode, setProgramCode] = useState<string | null>(null)
  const [method, setMethod] = useState<'bank' | 'toss'>('bank')
  const [working, setWorking] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('rf_programs')
      .select('code, name, price, description')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => {
        const list = (data ?? []) as Program[]
        setPrograms(list)
        if (list.length) setProgramCode((c) => c ?? list[0].code)
      })
  }, [])

  if (!application) {
    return (
      <PublicLayout>
        <div className="py-16 text-center">
          <p className="text-muted">신청 정보가 없습니다. 신청서부터 작성해 주세요.</p>
          <button onClick={() => navigate('/apply')} className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white">
            신청서로 이동
          </button>
        </div>
      </PublicLayout>
    )
  }

  const program = programs.find((p) => p.code === programCode)

  const payBank = async () => {
    setWorking(true)
    setErr(null)
    try {
      const r = await fetch('/api/payment-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: application.id, accessToken: application.accessToken, programCode }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'BANK_FAILED')
      navigate('/complete', {
        state: { method: 'bank', program: data.program, amount: data.amount, bankInfo: data.bankInfo },
      })
    } catch {
      setErr('처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      setWorking(false)
    }
  }

  const payToss = async () => {
    setWorking(true)
    setErr(null)
    try {
      const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY
      if (!clientKey) throw new Error('NO_CLIENT_KEY')
      saveProgramCode(programCode!)
      const toss = await loadTossPayments(clientKey)
      await toss.requestPayment('카드', {
        amount: program!.price,
        orderId: makeOrderId(),
        orderName: `${program!.name} 코칭`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
      // 성공 시 successUrl로 리다이렉트되므로 여기 이후 코드는 실행되지 않음
    } catch (e) {
      if ((e as { code?: string })?.code !== 'USER_CANCEL') {
        setErr('결제를 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.')
      }
      setWorking(false)
    }
  }

  return (
    <PublicLayout>
      <h1 className="text-2xl font-bold">결제</h1>
      <p className="mt-2 text-sm text-muted">프로그램과 결제 방법을 선택해 주세요.</p>

      {/* 예약 요약 */}
      {held.length > 0 && (
        <div className="card mt-6">
          <h2 className="mb-3 font-bold text-primary-dark">예약한 시간</h2>
          <ul className="space-y-2 text-sm">
            {held.map((h) => (
              <li key={h.sessionNo} className="flex justify-between">
                <span className="text-muted">{sessionByNo(h.sessionNo)?.label}</span>
                <span className="font-medium">{dateTimeLabel(h.startsAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 프로그램 선택 */}
      <div className="mt-6 space-y-3">
        <h2 className="font-bold">프로그램</h2>
        {programs.map((p) => (
          <label
            key={p.code}
            className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${
              programCode === p.code ? 'border-primary bg-primary/5' : 'border-black/10'
            }`}
          >
            <span className="flex items-center gap-3">
              <input
                type="radio"
                name="program"
                className="h-4 w-4 accent-[var(--color-primary)]"
                checked={programCode === p.code}
                onChange={() => setProgramCode(p.code)}
              />
              <span>
                <span className="font-semibold">{p.name}</span>
                {p.description && <span className="block text-xs text-muted">{p.description}</span>}
              </span>
            </span>
            <span className="font-bold">{won(p.price)}</span>
          </label>
        ))}
      </div>

      {/* 결제 방법 */}
      <div className="mt-6 space-y-3">
        <h2 className="font-bold">결제 방법</h2>
        {([
          { key: 'bank', label: '무통장 입금', desc: '계좌 안내 후 입금 확인' },
          { key: 'toss', label: '카드 결제', desc: '토스페이먼츠 즉시 결제' },
        ] as const).map((m) => (
          <label
            key={m.key}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
              method === m.key ? 'border-primary bg-primary/5' : 'border-black/10'
            }`}
          >
            <input
              type="radio"
              name="method"
              className="h-4 w-4 accent-[var(--color-primary)]"
              checked={method === m.key}
              onChange={() => setMethod(m.key)}
            />
            <span>
              <span className="font-semibold">{m.label}</span>
              <span className="block text-xs text-muted">{m.desc}</span>
            </span>
          </label>
        ))}
      </div>

      {/* 합계 */}
      <div className="mt-6 flex items-center justify-between rounded-xl bg-black/5 px-5 py-4">
        <span className="font-bold">결제 금액</span>
        <span className="text-lg font-bold text-primary-dark">{program ? won(program.price) : '—'}</span>
      </div>

      {err && <p className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">{err}</p>}

      <button
        onClick={method === 'bank' ? payBank : payToss}
        disabled={working || !program}
        className="mt-6 block w-full rounded-2xl bg-primary py-4 text-center font-bold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {working ? '처리 중…' : method === 'bank' ? '무통장 입금으로 신청' : '카드로 결제하기'}
      </button>
    </PublicLayout>
  )
}

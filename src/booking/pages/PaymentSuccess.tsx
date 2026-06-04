import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { getApplication } from '../lib/applicationStore'
import { getProgramCode, clearProgramCode } from '../lib/paymentStore'

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'confirming' | 'error'>('confirming')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return // StrictMode 이중 실행 방지 (결제 승인은 1회만)
    ran.current = true

    const application = getApplication()
    const programCode = getProgramCode()
    const paymentKey = params.get('paymentKey')
    const orderId = params.get('orderId')
    const amount = params.get('amount')

    if (!application || !programCode || !paymentKey || !orderId || !amount) {
      setStatus('error')
      return
    }

    fetch('/api/payment-toss-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: application.id,
        accessToken: application.accessToken,
        programCode,
        paymentKey,
        orderId,
        amount,
      }),
    })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'CONFIRM_FAILED')
        clearProgramCode()
        navigate('/complete', {
          replace: true,
          state: { method: 'toss', program: data.program, amount: data.amount },
        })
      })
      .catch(() => setStatus('error'))
  }, [navigate, params])

  return (
    <PublicLayout>
      <div className="py-20 text-center">
        {status === 'confirming' ? (
          <p className="text-muted">결제를 확인하고 있습니다…</p>
        ) : (
          <>
            <h1 className="text-xl font-bold text-accent">결제 확인에 실패했습니다</h1>
            <p className="mt-2 text-sm text-muted">
              결제가 이미 처리되었을 수 있습니다. 중복 결제 방지를 위해 다시 시도하지 마시고,
              연락처로 문의해 주세요.
            </p>
            <button onClick={() => navigate('/')} className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white">
              홈으로
            </button>
          </>
        )}
      </div>
    </PublicLayout>
  )
}

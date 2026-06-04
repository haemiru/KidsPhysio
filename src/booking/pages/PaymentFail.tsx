import { useNavigate, useSearchParams } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'

export default function PaymentFail() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const message = params.get('message')

  return (
    <PublicLayout>
      <div className="py-20 text-center">
        <h1 className="text-xl font-bold text-accent">결제가 취소되었습니다</h1>
        <p className="mt-2 text-sm text-muted">{message || '결제가 완료되지 않았습니다. 다시 시도해 주세요.'}</p>
        <p className="mt-1 text-xs text-muted">예약하신 시간은 잠시 동안 유지됩니다.</p>
        <button onClick={() => navigate('/payment')} className="mt-6 rounded-xl bg-primary px-6 py-3 font-bold text-white">
          다시 결제하기
        </button>
      </div>
    </PublicLayout>
  )
}

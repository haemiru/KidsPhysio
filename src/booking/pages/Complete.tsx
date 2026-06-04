import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { getHeldBookings, clearHeldBookings } from '../lib/bookingStore'
import { getApplication, clearApplication } from '../lib/applicationStore'
import { sessionByNo } from '../lib/sessionPlan'
import { dateTimeLabel } from '../lib/datetime'

const won = (n: number | string) => Number(n).toLocaleString('ko-KR') + '원'

export default function Complete() {
  const { state } = useLocation() as {
    state: { method?: string; program?: string; amount?: number | string; bankInfo?: string } | null
  }
  const held = getHeldBookings()
  const app = getApplication() // 정리 effect 전에 토큰 확보
  const myLink = app?.accessToken ? `/my?t=${app.accessToken}` : '/my'
  const isBank = state?.method === 'bank'

  // 흐름 종료 — 임시 저장값 정리 (예약 요약은 위에서 이미 읽음)
  useEffect(() => {
    clearHeldBookings()
    clearApplication()
  }, [])

  return (
    <PublicLayout>
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/40 text-3xl">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold">
          {isBank ? '신청이 접수되었습니다' : '신청이 완료되었습니다'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {isBank
            ? '아래 계좌로 입금해 주시면, 확인 후 카카오톡으로 안내드립니다.'
            : '결제가 완료되었습니다. 예약 확정 안내를 카카오톡으로 보내드립니다.'}
        </p>
      </div>

      {/* 무통장 계좌 안내 */}
      {isBank && state?.bankInfo && (
        <div className="card mt-6 text-center">
          <p className="text-xs font-semibold text-muted">입금 계좌</p>
          <p className="mt-1 text-lg font-bold text-ink">{state.bankInfo}</p>
          {state.amount && (
            <p className="mt-2 text-sm">
              입금 금액 <span className="font-bold text-primary-dark">{won(state.amount)}</span>
            </p>
          )}
        </div>
      )}

      {!isBank && state?.amount && (
        <div className="card mt-6 flex items-center justify-between">
          <span className="text-sm text-muted">{state?.program}</span>
          <span className="font-bold text-primary-dark">{won(state.amount)} 결제완료</span>
        </div>
      )}

      {/* 예약 요약 */}
      {held.length > 0 && (
        <div className="card mt-4">
          <h2 className="mb-3 font-bold text-primary-dark">예약 일정</h2>
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

      <Link
        to={myLink}
        className="mt-8 block rounded-2xl border border-primary py-4 text-center font-bold text-primary-dark"
      >
        내 예약 조회하기
      </Link>
    </PublicLayout>
  )
}

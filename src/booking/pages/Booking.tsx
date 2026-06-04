import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import HoldCountdown from '../components/HoldCountdown'
import { useSlots } from '../hooks/useSlots'
import { supabase } from '../lib/supabase'
import { getApplication } from '../lib/applicationStore'
import { getHeldBookings, saveHeldBookings } from '../lib/bookingStore'
import { SESSION_PLAN, sessionByNo } from '../lib/sessionPlan'
import { dateKey, dateLabel, timeLabel, dateTimeLabel } from '../lib/datetime'
import type { Slot, HeldBooking } from '../types'

export default function Booking() {
  const navigate = useNavigate()
  const application = getApplication()
  const { slots, loading, error, refetch } = useSlots()
  const [held, setHeld] = useState<HeldBooking[]>(() => getHeldBookings())
  const [picking, setPicking] = useState(false)
  const [pickError, setPickError] = useState<string | null>(null)

  const currentIndex = held.length // 0-based: 다음에 잡을 회차
  const currentSession = SESSION_PLAN[currentIndex]
  const allDone = currentIndex >= SESSION_PLAN.length
  const earliestExpiry = held.reduce<string | null>(
    (min, h) => (!min || h.holdExpiresAt < min ? h.holdExpiresAt : min),
    null,
  )

  // 이미 선점한 슬롯 id는 후보에서 제외
  const heldSlotIds = useMemo(() => new Set(held.map((h) => h.slotId)), [held])
  const byDate = useMemo(() => {
    const groups = new Map<string, Slot[]>()
    for (const s of slots) {
      if (heldSlotIds.has(s.id)) continue
      const k = dateKey(s.starts_at)
      if (!groups.has(k)) groups.set(k, [])
      groups.get(k)!.push(s)
    }
    return [...groups.entries()]
  }, [slots, heldSlotIds])

  const onPick = async (slot: Slot) => {
    if (picking || !currentSession) return
    setPicking(true)
    setPickError(null)
    try {
      const { data, error } = await supabase.rpc('rf_hold_slot', {
        p_slot_id: slot.id,
        p_application_id: application!.id,
        p_session_no: currentSession.no,
        p_session_kind: currentSession.kind,
      })
      if (error) throw error
      const booking = Array.isArray(data) ? data[0] : data
      const next: HeldBooking[] = [
        ...held,
        {
          sessionNo: currentSession.no,
          kind: currentSession.kind,
          bookingId: booking.id,
          slotId: slot.id,
          startsAt: slot.starts_at,
          endsAt: slot.ends_at,
          holdExpiresAt: booking.hold_expires_at,
        },
      ]
      setHeld(next)
      saveHeldBookings(next)
      await refetch()
    } catch (err) {
      const message = (err as Error)?.message ?? ''
      const taken = message.includes('SLOT_TAKEN') || message.includes('SLOT_BLOCKED')
      setPickError(
        taken
          ? '방금 다른 분이 먼저 선택한 시간입니다. 다른 시간을 골라 주세요.'
          : '시간 선택 중 오류가 발생했습니다. 다시 시도해 주세요.',
      )
      await refetch()
    } finally {
      setPicking(false)
    }
  }

  // 신청 정보가 없으면 신청서부터 (모든 훅 호출 이후에 분기)
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

  return (
    <PublicLayout maxWidth="max-w-3xl">
      <h1 className="text-2xl font-bold">상담 시간 선택</h1>
      <p className="mt-2 text-sm text-muted">
        {application.id && '신청이 접수되었습니다. '}원하는 시간을 선택하면 15분간 자리가 임시로 확보됩니다.
      </p>

      {/* 진행 단계 */}
      <ol className="mt-6 flex flex-wrap gap-2">
        {SESSION_PLAN.map((s, i) => {
          const done = i < currentIndex
          const active = i === currentIndex
          return (
            <li
              key={s.no}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                done
                  ? 'bg-secondary/40 text-ink'
                  : active
                    ? 'bg-primary text-white'
                    : 'bg-black/5 text-muted'
              }`}
            >
              {done ? '✓ ' : ''}
              {s.label}
            </li>
          )
        })}
      </ol>

      {/* 선점한 회차 요약 */}
      {held.length > 0 && (
        <div className="card mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-primary-dark">선택한 시간</h2>
            <span className="text-xs font-semibold">
              <HoldCountdown expiresAt={earliestExpiry} />
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {held.map((h) => (
              <li key={h.sessionNo} className="flex justify-between">
                <span className="text-muted">{sessionByNo(h.sessionNo)?.label}</span>
                <span className="font-medium">{dateTimeLabel(h.startsAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 모든 회차 선택 완료 */}
      {allDone ? (
        <div className="mt-8">
          <div className="rounded-2xl bg-secondary/30 px-5 py-4 text-center text-sm">
            모든 회차의 시간을 선택했습니다. 15분 내에 결제를 완료해 주세요.
          </div>
          <button
            onClick={() => navigate('/payment')}
            className="mt-4 block w-full rounded-2xl bg-primary py-4 text-center font-bold text-white hover:bg-primary-dark"
          >
            다음: 결제
          </button>
        </div>
      ) : (
        <>
          {/* 현재 선택할 회차 */}
          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary-dark">
                {currentIndex + 1} / {SESSION_PLAN.length}
              </span>
              <h2 className="text-lg font-bold">{currentSession.label}</h2>
            </div>
            <p className="mt-1 text-sm text-muted">{currentSession.desc}</p>
          </div>

          {pickError && (
            <p className="mt-4 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">{pickError}</p>
          )}

          {/* 슬롯 목록 */}
          {loading ? (
            <p className="py-12 text-center text-muted">예약 가능한 시간을 불러오는 중…</p>
          ) : error ? (
            <p className="py-12 text-center text-accent">시간을 불러오지 못했습니다. 새로고침 해 주세요.</p>
          ) : byDate.length === 0 ? (
            <p className="py-12 text-center text-muted">현재 예약 가능한 시간이 없습니다. 잠시 후 다시 확인해 주세요.</p>
          ) : (
            <div className="mt-6 space-y-6">
              {byDate.map(([key, daySlots]) => (
                <div key={key}>
                  <h3 className="mb-3 font-semibold text-ink">{dateLabel(daySlots[0].starts_at)}</h3>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={picking}
                        onClick={() => onPick(slot)}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-primary hover:bg-primary/5 disabled:opacity-50"
                      >
                        {timeLabel(slot.starts_at)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </PublicLayout>
  )
}

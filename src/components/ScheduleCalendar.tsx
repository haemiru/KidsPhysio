import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react'
import { scheduleInfo } from '../data/coreReset'
import {
  WEEKDAY,
  dateKey,
  isHoliday,
  slotKey,
  slotLabel,
  splitSlot,
  timeLabel,
} from '../lib/schedule'

/** 상담 가능 일정 선택 달력 (코어 리셋 신청서 9번 문항) */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

type Props = {
  /** 선택된 슬롯 값 (시간순 정렬 상태로 유지된다) */
  selected: string[]
  onChange: (next: string[]) => void
  error?: string
}

export default function ScheduleCalendar({ selected, onChange, error }: Props) {
  const { today, minDate, maxDate } = useMemo(() => {
    const today = startOfDay(new Date())
    const minDate = new Date(today)
    minDate.setDate(minDate.getDate() + scheduleInfo.leadDays)
    // 마지막으로 열어 둘 달의 말일
    const maxDate = new Date(today.getFullYear(), today.getMonth() + scheduleInfo.monthsAhead + 1, 0)
    return { today, minDate, maxDate }
  }, [])

  const [cursor, setCursor] = useState(
    () => new Date(minDate.getFullYear(), minDate.getMonth(), 1),
  )
  const [activeDate, setActiveDate] = useState<string | null>(null)

  const minKey = dateKey(minDate)
  const maxKey = dateKey(maxDate)
  const atMax = selected.length >= scheduleInfo.maxSelect

  /* 달력 칸 — 1일 앞의 빈칸(null)을 채워 요일을 맞춘다 */
  const cells = useMemo(() => {
    const y = cursor.getFullYear()
    const m = cursor.getMonth()
    const lastDate = new Date(y, m + 1, 0).getDate()
    const out: (Date | null)[] = Array(new Date(y, m, 1).getDay()).fill(null)
    for (let i = 1; i <= lastDate; i++) out.push(new Date(y, m, i))
    return out
  }, [cursor])

  /* 날짜별로 몇 개 골랐는지 — 달력 칸에 점으로 표시한다 */
  const countByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of selected) {
      const { date } = splitSlot(s)
      map.set(date, (map.get(date) ?? 0) + 1)
    }
    return map
  }, [selected])

  const canPrev = dateKey(new Date(cursor.getFullYear(), cursor.getMonth(), 0)) >= minKey
  const canNext = dateKey(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)) <= maxKey

  const moveMonth = (delta: number) => {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
    setActiveDate(null)
  }

  const toggleSlot = (slot: string) => {
    if (selected.includes(slot)) onChange(selected.filter((s) => s !== slot))
    else if (!atMax) onChange([...selected, slot].sort())
  }

  return (
    <div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {/* ── 달력 ── */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <ArrowButton label="이전 달" disabled={!canPrev} onClick={() => moveMonth(-1)}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </ArrowButton>
            <p aria-live="polite" className="text-[15px] font-extrabold text-ink">
              {cursor.getFullYear()}년 {cursor.getMonth() + 1}월
            </p>
            <ArrowButton label="다음 달" disabled={!canNext} onClick={() => moveMonth(1)}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </ArrowButton>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-[12px] font-bold text-muted">
            {WEEKDAY.map((w, i) => (
              <span key={w} className={i === 0 ? 'text-red-400' : undefined}>
                {w}
              </span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <span key={`pad-${i}`} />
              const key = dateKey(d)
              const disabled = key < minKey || key > maxKey
              const count = countByDate.get(key) ?? 0
              const active = key === activeDate
              const holiday = isHoliday(key)
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  aria-pressed={active}
                  aria-label={`${d.getMonth() + 1}월 ${d.getDate()}일${count ? ` — ${count}개 선택됨` : ''}`}
                  onClick={() => setActiveDate(active ? null : key)}
                  className={`relative aspect-square rounded-xl text-[14px] font-semibold transition ${
                    disabled
                      ? 'cursor-not-allowed text-ink/20'
                      : active
                        ? 'bg-brand-500 text-white shadow-soft'
                        : count
                          ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-300'
                          : holiday
                            ? 'text-red-400 hover:bg-brand-50'
                            : 'text-ink/80 hover:bg-brand-50'
                  } ${!disabled && key === dateKey(today) ? 'ring-1 ring-brand-200' : ''}`}
                >
                  {d.getDate()}
                  {count > 0 && (
                    <span
                      className={`absolute inset-x-0 bottom-1.5 mx-auto h-1.5 w-1.5 rounded-full ${
                        active ? 'bg-white' : 'bg-brand-500'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-[13px] leading-relaxed text-muted">
            <span className="inline-block h-2 w-2 rounded-full bg-red-400" aria-hidden="true" />
            일요일·공휴일은 {scheduleInfo.holidayFee} 추가 비용이 붙습니다.
          </p>
        </div>

        {/* ── 시간 선택 ── */}
        <div className="rounded-2xl border border-brand-100 bg-white p-4">
          {activeDate ? (
            <>
              <p className="flex items-center gap-2 text-[15px] font-extrabold text-ink">
                <Clock className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {(() => {
                  const [y, m, d] = activeDate.split('-').map(Number)
                  return `${m}월 ${d}일(${WEEKDAY[new Date(y, m - 1, d).getDay()]})`
                })()}{' '}
                시간 선택
              </p>

              {isHoliday(activeDate) && (
                <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-500">
                  일요일·공휴일이라 어떤 시간을 고르셔도 {scheduleInfo.holidayFee}이 추가됩니다.
                </p>
              )}

              <TimeGroup
                title="기본 시간"
                times={scheduleInfo.baseTimes}
                date={activeDate}
                selected={selected}
                atMax={atMax}
                onToggle={toggleSlot}
              />
              <TimeGroup
                title={`그 외 시간 (+${scheduleInfo.extraTimeFee})`}
                times={scheduleInfo.extraTimes}
                date={activeDate}
                selected={selected}
                atMax={atMax}
                onToggle={toggleSlot}
              />

              {atMax && (
                <p className="mt-4 text-[13px] font-semibold text-muted">
                  최대 {scheduleInfo.maxSelect}개까지 고를 수 있습니다. 바꾸시려면 아래에서 하나를
                  빼 주세요.
                </p>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 text-center">
              <CalendarDays className="h-7 w-7 text-brand-300" aria-hidden="true" />
              <p className="text-[15px] font-semibold text-muted">
                달력에서 날짜를 먼저 골라 주세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── 선택한 일정 ── */}
      <div className="mt-5 rounded-2xl bg-sand/60 p-5">
        <p className="text-[15px] font-bold text-ink">
          선택한 일정{' '}
          <span className="font-extrabold text-brand-600">
            {selected.length}개 · 최소 {scheduleInfo.minSelect}개
          </span>
        </p>
        {selected.length === 0 ? (
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            아직 고른 일정이 없습니다. 가능하신 일정을 {scheduleInfo.minSelect}개 이상 담아 주세요.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {selected.map((slot) => (
              <li key={slot}>
                <button
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  aria-label={`${slotLabel(slot)} 선택 해제`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-white px-3.5 py-2 text-[14px] font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
                >
                  {slotLabel(slot)}
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
    </div>
  )
}

function TimeGroup({
  title,
  times,
  date,
  selected,
  atMax,
  onToggle,
}: {
  title: string
  times: string[]
  date: string
  selected: string[]
  atMax: boolean
  onToggle: (slot: string) => void
}) {
  if (!times.length) return null
  return (
    <div className="mt-4">
      <p className="text-[13px] font-bold text-brand-700">{title}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {times.map((t) => {
          const slot = slotKey(date, t)
          const active = selected.includes(slot)
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              disabled={!active && atMax}
              onClick={() => onToggle(slot)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[15px] font-semibold transition ${
                active
                  ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                  : !active && atMax
                    ? 'cursor-not-allowed border-brand-50 bg-white text-ink/30'
                    : 'border-brand-100 bg-white text-ink/80 hover:border-brand-300 hover:bg-brand-50'
              }`}
            >
              {active && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
              {timeLabel(t)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ArrowButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-full border transition ${
        disabled
          ? 'cursor-not-allowed border-brand-50 text-ink/25'
          : 'border-brand-100 text-brand-700 hover:border-brand-300 hover:bg-brand-50'
      }`}
    >
      {children}
    </button>
  )
}

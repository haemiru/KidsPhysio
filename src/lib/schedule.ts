/**
 * 상담 가능 일정(코어 리셋 신청서 9번 문항) 슬롯 계산 헬퍼.
 *
 * 슬롯 값은 'YYYY-MM-DDTHH:mm' 문자열이다 — 문자열 정렬이 곧 시간순 정렬이 되도록
 * 맞춘 형식이라 정렬·중복 제거를 그대로 문자열 연산으로 처리한다.
 * 신청서는 이 값(answers.schedule_slots)과 사람이 읽는 라벨(answers.schedule)을
 * 두 벌로 저장한다 — 알림 문자·관리자 화면은 라벨만 보면 되기 때문이다.
 */
import { scheduleInfo } from '../data/coreReset'

export const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']

/** Date → 'YYYY-MM-DD'. toISOString 은 UTC 로 밀리므로 쓰지 않는다 */
export function dateKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export const slotKey = (date: string, time: string) => `${date}T${time}`

export const splitSlot = (slot: string) => {
  const [date, time = ''] = slot.split('T')
  return { date, time }
}

/** 일요일이거나 공휴일 목록에 있는 날 */
export function isHoliday(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d).getDay() === 0 || scheduleInfo.holidays.includes(date)
}

/** 이 슬롯에 붙는 추가 비용 안내 (없으면 빈 배열) */
export function slotFees(slot: string) {
  const { date, time } = splitSlot(slot)
  const fees: string[] = []
  if (!scheduleInfo.baseTimes.includes(time)) fees.push(`시간외 +${scheduleInfo.extraTimeFee}`)
  if (isHoliday(date)) fees.push(`휴일 +${scheduleInfo.holidayFee}`)
  return fees
}

/** '10:00' → '오전 10시' / '14:30' → '오후 2:30' */
export function timeLabel(time: string) {
  const [hh, mm] = time.split(':').map(Number)
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${hh < 12 ? '오전' : '오후'} ${mm ? `${h12}:${String(mm).padStart(2, '0')}` : `${h12}시`}`
}

/** '2026-09-03T14:00' → '9월 3일(목) 오후 2시 (시간외 +30,000원)' */
export function slotLabel(slot: string) {
  const { date, time } = splitSlot(slot)
  const [y, m, d] = date.split('-').map(Number)
  const w = WEEKDAY[new Date(y, m - 1, d).getDay()]
  // 해가 넘어가는 일정만 연도를 붙여 준다 (같은 해면 군더더기라 생략)
  const year = y === new Date().getFullYear() ? '' : `${y}년 `
  const base = `${year}${m}월 ${d}일(${w}) ${timeLabel(time)}`
  const fees = slotFees(slot)
  return fees.length ? `${base} (${fees.join(' · ')})` : base
}

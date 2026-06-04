// 모든 표시는 한국 시간(KST) 기준
const TZ = 'Asia/Seoul'

type DateParts = Record<string, string>

const parts = (iso: string): DateParts => {
  const f = new Intl.DateTimeFormat('ko-KR', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const map: DateParts = {}
  for (const p of f.formatToParts(new Date(iso))) map[p.type] = p.value
  return map
}

// 그룹핑용 키 (YYYY-MM-DD, KST)
export const dateKey = (iso: string): string => {
  const p = parts(iso)
  return `${p.year}-${p.month}-${p.day}`
}

// "5월 30일 (금)"
export const dateLabel = (iso: string): string => {
  const p = parts(iso)
  return `${Number(p.month)}월 ${Number(p.day)}일 (${p.weekday})`
}

// "오후 2:00"
export const timeLabel = (iso: string): string => {
  const p = parts(iso)
  return `${p.dayPeriod ?? ''} ${p.hour}:${p.minute}`.trim()
}

// "5월 30일 (금) 오후 2:00"
export const dateTimeLabel = (iso: string): string => `${dateLabel(iso)} ${timeLabel(iso)}`

// 남은 시간(ms) → "12:34"
export const mmss = (ms: number): string => {
  if (ms <= 0) return '00:00'
  const total = Math.floor(ms / 1000)
  const m = String(Math.floor(total / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${m}:${s}`
}

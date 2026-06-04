import type { HeldBooking } from '../types'

// 예약 흐름 동안 선점(Hold)한 회차 예약들을 임시 보관
const KEY = 'rf_held_bookings'

// 각 항목: { sessionNo, kind, bookingId, slotId, startsAt, endsAt, holdExpiresAt }
export function getHeldBookings(): HeldBooking[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as HeldBooking[]) : []
  } catch {
    return []
  }
}

export function saveHeldBookings(list: HeldBooking[]): void {
  sessionStorage.setItem(KEY, JSON.stringify(list))
}

export function clearHeldBookings(): void {
  sessionStorage.removeItem(KEY)
}

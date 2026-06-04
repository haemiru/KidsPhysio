import type { StoredApplication } from '../types'

// 신청 흐름(Apply → Booking → Payment) 동안 application 식별자를 유지
const KEY = 'rf_application'

export function saveApplication({ id, accessToken }: StoredApplication): void {
  sessionStorage.setItem(KEY, JSON.stringify({ id, accessToken }))
}

export function getApplication(): StoredApplication | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredApplication) : null
  } catch {
    return null
  }
}

export function clearApplication(): void {
  sessionStorage.removeItem(KEY)
}

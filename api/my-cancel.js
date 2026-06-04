import { admin, getApplicationByToken } from './_supabase.js'

// 토큰 소유자가 본인 예약(회차)을 취소 → 슬롯 반환
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })

  const { token, bookingId } = req.body || {}
  const app = await getApplicationByToken(token)
  if (!app) return res.status(403).json({ error: 'FORBIDDEN' })

  const { data: b } = await admin
    .from('rf_bookings')
    .select('id, application_id, status, rf_slots(starts_at)')
    .eq('id', bookingId)
    .single()
  if (!b || b.application_id !== app.id) return res.status(403).json({ error: 'FORBIDDEN' })
  if (!['held', 'confirmed'].includes(b.status)) return res.status(409).json({ error: 'NOT_CANCELLABLE' })

  // 임박한 예약(24시간 이내)은 취소 불가
  const startsAt = b.rf_slots?.starts_at
  if (startsAt && new Date(startsAt).getTime() - Date.now() < 24 * 3600 * 1000) {
    return res.status(409).json({ error: 'TOO_LATE' })
  }

  await admin.rpc('rf_cancel_booking', { p_booking_id: bookingId })
  return res.status(200).json({ ok: true })
}

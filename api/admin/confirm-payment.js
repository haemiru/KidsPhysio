import { admin, requireAdmin, confirmHeldBookings } from '../_supabase.js'
import { notifyBookingConfirmed } from '../_notify.js'

// 무통장 입금 확인 → 결제완료 + 예약확정 + 신청자 확정 알림톡
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })

  const user = await requireAdmin(req)
  if (!user) return res.status(403).json({ error: 'FORBIDDEN' })

  const { applicationId } = req.body || {}
  const { data: app } = await admin
    .from('rf_applications')
    .select('id, guardian_name, guardian_phone, payment_status')
    .eq('id', applicationId)
    .single()
  if (!app) return res.status(404).json({ error: 'NOT_FOUND' })
  if (app.payment_status === 'paid') return res.status(409).json({ error: 'ALREADY_PAID' })

  await admin
    .from('rf_applications')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  await confirmHeldBookings(applicationId) // 혹시 남은 held 예약도 확정
  await notifyBookingConfirmed(app)

  return res.status(200).json({ ok: true })
}

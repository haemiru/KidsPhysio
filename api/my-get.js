import { admin, getApplicationByToken } from './_supabase.js'

// 토큰으로 본인 예약 조회
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })

  const app = await getApplicationByToken(req.body?.token)
  if (!app) return res.status(404).json({ error: 'NOT_FOUND' })

  const { data: bookings } = await admin
    .from('rf_bookings')
    .select('id, session_no, session_kind, status, rf_slots(starts_at)')
    .eq('application_id', app.id)
    .neq('status', 'cancelled')
    .order('session_no')

  return res.status(200).json({
    application: {
      guardian_name: app.guardian_name,
      child_name: app.child_name,
      status: app.status,
      payment_method: app.payment_method,
      payment_status: app.payment_status,
    },
    bookings: bookings ?? [],
  })
}

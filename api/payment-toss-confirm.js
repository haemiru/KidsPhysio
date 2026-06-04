import { admin, verifyApplication, confirmHeldBookings } from './_supabase.js'
import { notifyBookingConfirmed, notifyHostNewApplication } from './_notify.js'

// 토스페이먼츠 결제 승인: 금액 검증 → 토스 confirm API → 결제 완료 + 예약 확정
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })

  const { applicationId, accessToken, programCode, paymentKey, orderId, amount } = req.body || {}

  const app = await verifyApplication(applicationId, accessToken)
  if (!app) return res.status(403).json({ error: 'FORBIDDEN' })
  if (app.payment_status === 'paid') return res.status(409).json({ error: 'ALREADY_PAID' })

  // 프로그램 금액 검증 (클라이언트가 보낸 amount 신뢰 금지)
  const { data: program } = await admin
    .from('rf_programs')
    .select('id, name, price')
    .eq('code', programCode)
    .eq('active', true)
    .single()
  if (!program) return res.status(400).json({ error: 'INVALID_PROGRAM' })
  if (Number(amount) !== Number(program.price)) {
    return res.status(400).json({ error: 'AMOUNT_MISMATCH' })
  }

  // 토스 결제 승인
  const secret = process.env.TOSS_SECRET_KEY
  const basic = Buffer.from(`${secret}:`).toString('base64')
  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
  })
  const toss = await tossRes.json()
  if (!tossRes.ok) {
    return res.status(400).json({ error: 'TOSS_CONFIRM_FAILED', detail: toss?.message })
  }

  await admin
    .from('rf_applications')
    .update({
      program_id: program.id,
      amount: program.price,
      payment_method: 'toss',
      payment_status: 'paid',
      status: 'confirmed',
      paid_at: new Date().toISOString(),
      toss_payment_key: paymentKey,
      toss_order_id: orderId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  await confirmHeldBookings(applicationId)

  // 결제 완료 → 신청자 예약 확정 알림 + 호스트 신규 알림 (실패해도 결제 결과는 성공)
  await notifyBookingConfirmed(app)
  await notifyHostNewApplication(app)

  return res.status(200).json({ ok: true, program: program.name, amount: program.price })
}

import { admin, verifyApplication, confirmHeldBookings } from './_supabase.js'
import { notifyHostNewApplication } from './_notify.js'

// 무통장 입금 선택: 프로그램·금액 확정, 슬롯 예약 확정(입금대기), 계좌 안내 반환
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })

  const { applicationId, accessToken, programCode } = req.body || {}

  const app = await verifyApplication(applicationId, accessToken)
  if (!app) return res.status(403).json({ error: 'FORBIDDEN' })
  if (app.payment_status === 'paid') return res.status(409).json({ error: 'ALREADY_PAID' })

  const { data: program } = await admin
    .from('rf_programs')
    .select('id, name, price')
    .eq('code', programCode)
    .eq('active', true)
    .single()
  if (!program) return res.status(400).json({ error: 'INVALID_PROGRAM' })

  await admin
    .from('rf_applications')
    .update({
      program_id: program.id,
      amount: program.price,
      payment_method: 'bank',
      payment_status: 'pending',
      status: 'pending_payment',
      updated_at: new Date().toISOString(),
    })
    .eq('id', applicationId)

  // 입금 전이라도 슬롯은 확보(예약 확정). 미입금 시 관리자가 취소(Phase 5).
  await confirmHeldBookings(applicationId)

  // 호스트에게 신규 신청 알림 (실패해도 결제 흐름은 진행)
  await notifyHostNewApplication(app)

  return res.status(200).json({
    ok: true,
    program: program.name,
    amount: program.price,
    bankInfo: process.env.BANK_INFO || process.env.VITE_BANK_INFO || '',
  })
}

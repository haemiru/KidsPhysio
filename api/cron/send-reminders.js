import { admin } from '../_supabase.js'
import { sendAlimtalk } from '../_solapi.js'
import { fmtKST } from '../_notify.js'

const sessionLabel = (b) =>
  b.session_kind === 'consult' ? '초기 1:1 상담' : `${b.session_no - 1}주차 체크인`

// 다가오는(약 12~36시간 내) 확정 예약에 대해 리마인더 알림톡 발송 (중복 방지)
// Vercel Cron: 0 0 * * * (UTC) = 매일 09:00 KST
export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }

  const now = Date.now()
  const from = new Date(now + 12 * 3600 * 1000).toISOString()
  const to = new Date(now + 36 * 3600 * 1000).toISOString()

  const { data: bookings, error } = await admin
    .from('rf_bookings')
    .select('id, session_no, session_kind, rf_slots!inner(starts_at), rf_applications!inner(guardian_name, guardian_phone)')
    .eq('status', 'confirmed')
    .gte('rf_slots.starts_at', from)
    .lte('rf_slots.starts_at', to)

  if (error) return res.status(500).json({ error: error.message })

  let sent = 0
  for (const b of bookings ?? []) {
    // 이미 리마인더를 보냈으면 건너뜀
    const { data: existing } = await admin
      .from('rf_notifications')
      .select('id')
      .eq('booking_id', b.id)
      .eq('kind', 'reminder')
      .eq('status', 'sent')
      .limit(1)
    if (existing && existing.length) continue

    const app = b.rf_applications
    const startsAt = b.rf_slots?.starts_at
    const r = await sendAlimtalk({
      to: app?.guardian_phone,
      templateId: process.env.SOLAPI_TPL_REMINDER,
      kind: 'reminder',
      bookingId: b.id,
      variables: {
        '#{이름}': app?.guardian_name ?? '',
        '#{일시}': startsAt ? fmtKST(startsAt) : '',
        '#{회차}': sessionLabel(b),
      },
    })
    if (r.ok) sent += 1
  }

  return res.status(200).json({ ok: true, candidates: bookings?.length ?? 0, sent })
}

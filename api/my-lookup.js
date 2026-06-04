import { admin } from './_supabase.js'
import { notifyLookupLink } from './_notify.js'

const digitsOnly = (s) => String(s ?? '').replace(/[^0-9]/g, '')

// 연락처로 본인 예약 조회 링크(매직 링크)를 카톡으로 발송
// 존재 여부를 노출하지 않기 위해 항상 동일한 성공 응답을 반환
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })

  const digits = digitsOnly(req.body?.phone)
  if (digits.length < 9) return res.status(400).json({ error: 'INVALID_PHONE' })

  const last4 = digits.slice(-4)
  const { data } = await admin
    .from('rf_applications')
    .select('id, access_token, guardian_name, guardian_phone, created_at')
    .ilike('guardian_phone', `%${last4}%`)
    .order('created_at', { ascending: false })

  const match = (data ?? []).find((a) => digitsOnly(a.guardian_phone) === digits)
  if (match) {
    const origin = process.env.APP_ORIGIN || `https://${req.headers.host}`
    const link = `${origin}/my?t=${match.access_token}`
    await notifyLookupLink(match, link)
  }

  return res.status(200).json({ ok: true })
}

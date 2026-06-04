import { admin } from '../_supabase.js'

// 만료된 15분 Hold 일괄 해제 (Vercel Cron: */5 * * * *)
export default async function handler(req, res) {
  // Vercel Cron 보호 (CRON_SECRET 설정 시)
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }

  const { data, error } = await admin.rpc('rf_release_expired_holds')
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true, released: data ?? 0 })
}

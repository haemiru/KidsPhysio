import { createClient } from '@supabase/supabase-js'

// 서버 전용 Supabase 클라이언트 (service_role — RLS 우회). 절대 클라이언트로 노출 금지.
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// 신청 + 토큰 검증. 통과 시 application row, 실패 시 null
export async function verifyApplication(applicationId, accessToken) {
  if (!applicationId || !accessToken) return null
  const { data, error } = await admin
    .from('rf_applications')
    .select('id, access_token, status, payment_status, guardian_name, guardian_phone, child_name')
    .eq('id', applicationId)
    .single()
  if (error || !data) return null
  if (data.access_token !== accessToken) return null
  return data
}

// 액세스 토큰으로 신청 1건 조회 (본인 예약 조회/취소용). 실패 시 null
export async function getApplicationByToken(token) {
  if (!token || token.length < 8) return null
  const { data } = await admin
    .from('rf_applications')
    .select('id, access_token, status, payment_method, payment_status, guardian_name, child_name')
    .eq('access_token', token)
    .maybeSingle()
  return data ?? null
}

// 요청자가 rf_admins 화이트리스트의 관리자인지 검증 (Authorization: Bearer <supabase JWT>)
export async function requireAdmin(req) {
  const authz = req.headers.authorization || ''
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null
  if (!token) return null
  const { data, error } = await admin.auth.getUser(token)
  if (error || !data?.user) return null
  const { data: row } = await admin
    .from('rf_admins')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()
  return row ? data.user : null
}

// 해당 신청의 held 예약을 모두 확정(held → confirmed, 슬롯 booked)
export async function confirmHeldBookings(applicationId) {
  const { data: held } = await admin
    .from('rf_bookings')
    .select('id')
    .eq('application_id', applicationId)
    .eq('status', 'held')
  for (const b of held ?? []) {
    await admin.rpc('rf_confirm_booking', { p_booking_id: b.id })
  }
  return (held ?? []).length
}

import { supabase } from './supabase'

// 관리자 세션 JWT를 실어 서버 /api 호출
export async function adminPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const r = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(json.error || 'REQUEST_FAILED')
  return json as T
}

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminLogin({
  loggedInButNotAdmin,
  onSignOut,
}: {
  loggedInButNotAdmin: boolean
  onSignOut: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr('이메일 또는 비밀번호가 올바르지 않습니다.')
    setBusy(false)
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#faf9fc] px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-xl font-bold text-primary-dark">관리자 로그인</h1>
        <p className="mt-1 text-center text-sm text-muted">브레인센트 코어 리셋 운영</p>

        {loggedInButNotAdmin ? (
          <div className="card mt-6 text-center">
            <p className="text-sm text-accent">이 계정은 관리자 권한이 없습니다.</p>
            <p className="mt-1 text-xs text-muted">rf_admins에 등록된 계정으로 로그인해 주세요.</p>
            <button onClick={onSignOut} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">
              로그아웃
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="card mt-6 space-y-3">
            <input
              type="email"
              required
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-primary"
            />
            {err && <p className="text-xs text-accent">{err}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary py-3 font-bold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {busy ? '로그인 중…' : '로그인'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

/** 구글 브랜드 마크 (lucide 에는 브랜드 아이콘이 없어 직접 그린다) */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

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

  /**
   * 구글 로그인.
   * 소셜(google/kakao)로만 만들어져 비밀번호가 없는 관리자 계정을 위한 경로다.
   * 로그인 후에도 rf_admins 화이트리스트는 그대로 적용된다(권한 없으면 아래 안내 화면).
   */
  const signInWithGoogle = async () => {
    setBusy(true)
    setErr(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    })
    if (error) {
      setErr('구글 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.')
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#faf9fc] px-5">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-xl font-bold text-primary-dark">관리자 로그인</h1>
        <p className="mt-1 text-center text-sm text-muted">짱샘 키즈피지오 코칭 운영</p>

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

            <div className="flex items-center gap-3 pt-1">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-xs text-muted">또는</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white py-3 text-sm font-bold text-ink transition hover:bg-black/5 disabled:opacity-60"
            >
              <GoogleMark className="h-[18px] w-[18px]" />
              구글 계정으로 로그인
            </button>
            <p className="text-center text-xs leading-relaxed text-muted">
              비밀번호 없이 가입된 계정은 구글 로그인을 이용해 주세요.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

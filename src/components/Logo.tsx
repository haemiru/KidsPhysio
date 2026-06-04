import { Link } from 'react-router-dom'
import { site } from '../data/site'

/** 키즈피지오 워드마크 + 심볼. */
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-2.5"
      aria-label={`${site.fullName} 홈으로`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-500 shadow-soft transition-transform duration-200 group-hover:-translate-y-0.5">
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path
            d="M32 47c-1 0-2-.4-2.7-1.1l-9.5-9.3C16.4 33.1 16 30.4 17.7 27.8c1.9-2.9 6-3.4 8.6-1.1l1.9 1.7 1.9-1.7c2.6-2.3 6.7-1.8 8.6 1.1 1.7 2.6 1.3 5.3-2.1 8.8l-9.5 9.3c-.7.7-1.6 1.1-2.6 1.1z"
            fill="#fff"
          />
          <circle cx="32" cy="18" r="4" fill="#FFD25E" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-ink'
          }`}
        >
          짱샘 키즈피지오
        </span>
        <span
          className={`text-[11px] font-semibold tracking-tight ${
            light ? 'text-white/70' : 'text-muted'
          }`}
        >
          아동발달센터 · 피지오 후각 연구소
        </span>
      </span>
    </Link>
  )
}

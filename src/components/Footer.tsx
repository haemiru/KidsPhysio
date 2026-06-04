import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import Logo from './Logo'
import { nav, site } from '../data/site'

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            25년 임상의 소아재활 전문가 짱샘과 함께. 발달치료부터 책방, 아로마
            테라피까지 — 근육보다 먼저 아이의 숨과 마음을 살핍니다.
          </p>
          <a
            href={site.bookshop}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-500"
          >
            📚 짱샘의 책방 바로가기
          </a>
          <div className="mt-5 flex gap-3">
            <a
              href={site.instagram}
              aria-label="인스타그램"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 transition hover:bg-brand-500"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={site.kakao}
              aria-label="카카오톡 상담"
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sm font-extrabold transition hover:bg-brand-500"
            >
              Ka
            </a>
          </div>
        </div>

        <nav aria-label="바로가기">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/50">
            바로가기
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="transition hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/50">
            연락처
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-brand-300" aria-hidden="true" />
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-brand-300" aria-hidden="true" />
              <a href={site.emailHref} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.fullName}. All rights reserved.</p>
          <p className="flex gap-4">
            <a href="#" className="hover:text-white/80">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-white/80">
              이용약관
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

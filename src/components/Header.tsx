import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import Logo from './Logo'
import { nav, site } from '../data/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 모바일 메뉴 열림 시 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/85 shadow-[0_8px_30px_-18px_rgba(35,48,56,0.4)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-[4.5rem] items-center justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-[15px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink/80 hover:bg-brand-50 hover:text-brand-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-700"
          >
            <Phone className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            {site.phone}
          </a>
          <Link to="/contact" className="btn btn-primary text-[15px]">
            무료 상담 예약
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 bg-white text-ink lg:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-brand-100/70 bg-cream lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="모바일 메뉴">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink/90 hover:bg-brand-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2"
            >
              무료 상담 예약
            </Link>
            <a
              href={site.phoneHref}
              className="mt-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-bold text-brand-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

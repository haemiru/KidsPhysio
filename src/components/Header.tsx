import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import { nav, site, type NavLink as NavLinkItem } from '../data/site'

const itemCls = (isActive: boolean) =>
  `whitespace-nowrap rounded-full px-2 py-2 text-[15px] font-semibold transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink/80 hover:bg-brand-50 hover:text-brand-700'
  }`

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

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
      {/* 헤더는 본문(76rem)보다 살짝 넓은 컨테이너를 써서 메뉴가 늘어나도 로고·전화번호가 접히지 않게 한다 */}
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[86rem] items-center justify-between px-5">
        <Logo />

        {/* Desktop nav */}
        {/* 메뉴가 11개라 xl(1280px)에서 여유가 빠듯하다 — 항목 간격·좌우 패딩을 최소로 유지할 것 */}
        <nav className="hidden items-center xl:flex" aria-label="주요 메뉴">
          {nav.map((item) =>
            'to' in item ? (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => itemCls(isActive)}>
                {item.label}
              </NavLink>
            ) : (
              <NavDropdown
                key={item.label}
                label={item.label}
                items={item.children}
                pathname={pathname}
              />
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 xl:flex">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-brand-700"
          >
            <Phone className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            {site.phone}
          </a>
          <Link to="/coaching" className="btn btn-ghost whitespace-nowrap px-4 py-2.5 text-[15px]">
            4주 코칭
          </Link>
          <Link to="/contact" className="btn btn-primary whitespace-nowrap px-4 py-2.5 text-[15px]">
            브레인 코칭
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 bg-white text-ink xl:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-brand-100/70 bg-cream xl:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="모바일 메뉴">
            {nav.map((item) =>
              'to' in item ? (
                <MobileLink key={item.to} item={item} onNavigate={() => setOpen(false)} />
              ) : (
                /* 하위 메뉴는 그룹 제목 아래 들여쓰기로 펼쳐 둔다 (모바일에선 접지 않음) */
                <div key={item.label} className="mt-1">
                  <p className="px-4 pb-1 pt-2 text-sm font-bold text-muted">{item.label}</p>
                  <div className="flex flex-col gap-1 border-l-2 border-brand-100 pl-3">
                    {item.children.map((child) => (
                      <MobileLink
                        key={child.to}
                        item={child}
                        onNavigate={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
            <Link
              to="/coaching"
              onClick={() => setOpen(false)}
              className="btn btn-ghost mt-2"
            >
              4주 코칭 신청
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-1"
            >
              브레인 코칭
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

/**
 * 데스크톱 드롭다운 메뉴.
 * 마우스는 hover, 키보드는 버튼 클릭(Enter/Space)으로 연다.
 * 닫히는 조건: 항목 클릭 · 라우트 이동 · 마우스 이탈 · 포커스 이탈 · 바깥 클릭 · Esc.
 * (CSS focus-within 만 쓰면 항목을 클릭해도 그 링크에 포커스가 남아 열린 채로 있다)
 */
function NavDropdown({
  label,
  items,
  pathname,
}: {
  label: string
  items: NavLinkItem[]
  pathname: string
}) {
  const [open, setOpen] = useState(false)
  const [seenPath, setSeenPath] = useState(pathname)
  const wrapRef = useRef<HTMLDivElement>(null)
  const active = items.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))

  // 라우트가 바뀌면 닫는다 — 뒤로가기 등 링크 클릭 외의 이동까지 커버.
  // (렌더 중 비교하는 React 권장 패턴. effect 로 하면 한 프레임 열린 채로 깜빡인다)
  if (seenPath !== pathname) {
    setSeenPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // 탭으로 메뉴 밖으로 나가면 닫는다
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`${itemCls(active)} inline-flex items-center gap-0.5`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* pt-2 는 버튼과 패널 사이 마우스 이동 시 hover 가 끊기지 않게 하는 여백 */}
      <div
        className={`absolute left-1/2 top-full z-10 -translate-x-1/2 pt-2 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="min-w-[11rem] rounded-2xl border border-brand-100 bg-white p-1.5 shadow-card">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                // 같은 페이지를 다시 눌러 pathname 이 안 바뀌는 경우까지 닫는다
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[15px] font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink/80 hover:bg-brand-50 hover:text-brand-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MobileLink({ item, onNavigate }: { item: NavLinkItem; onNavigate: () => void }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `rounded-xl px-4 py-3 text-base font-semibold ${
          isActive ? 'bg-brand-50 text-brand-700' : 'text-ink/90 hover:bg-brand-50'
        }`
      }
    >
      {item.label}
    </NavLink>
  )
}

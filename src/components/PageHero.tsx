import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

type Crumb = { label: string; to?: string }

type Props = {
  eyebrow?: string
  title: React.ReactNode
  desc?: string
  crumbs?: Crumb[]
}

/** 서브페이지 공통 상단 — 빵부스러기 + 제목. */
export default function PageHero({ eyebrow, title, desc, crumbs = [] }: Props) {
  return (
    <section className="relative overflow-hidden bg-sand/70 pt-[4.5rem]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-16 -top-6 h-64 w-64 animate-blob bg-brand-100/70" />
        <div className="absolute -left-10 bottom-0 h-48 w-48 animate-blob bg-sun-300/40 [animation-delay:-7s]" />
      </div>
      <div className="container-page py-14 lg:py-20">
        <nav aria-label="현재 위치" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-muted">
            <li>
              <Link to="/" className="hover:text-brand-700">
                홈
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-4 w-4 text-muted/60" aria-hidden="true" />
                {c.to ? (
                  <Link to={c.to} className="hover:text-brand-700">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && (
          <span className="inline-flex rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700 shadow-soft">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{desc}</p>}
      </div>
    </section>
  )
}

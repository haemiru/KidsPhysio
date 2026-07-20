import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import { founder, site } from '../data/site'

/** 짱샘(장지예) 소개 — 홈 섹션. */
export default function Founder() {
  return (
    <section id="founder" className="py-20 lg:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Profile card */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 translate-x-5 translate-y-5 rounded-[2rem] bg-brand-100/70" />
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-card">
            {founder.photo ? (
              <img
                src={founder.photo}
                alt={`${founder.name} ${founder.nick}`}
                className="mx-auto h-28 w-28 rounded-full object-cover object-top shadow-sm ring-4 ring-brand-50"
              />
            ) : (
              <span className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-brand-50 text-6xl">
                {founder.avatar}
              </span>
            )}
            <h3 className="mt-5 text-2xl font-extrabold text-ink">
              {founder.name}
              <span className="ml-2 text-brand-600">{founder.nick}</span>
            </h3>
            <p className="mt-2 text-sm font-semibold text-muted">{founder.role}</p>
            <p className="text-sm font-semibold text-brand-600">{founder.lab}</p>
            <ul className="mt-6 space-y-2 border-t border-sand pt-6 text-left">
              {founder.credentials.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-ink/85">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-xs text-brand-700">
                    ✓
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-bold text-brand-700">
            짱샘은 누구인가요
          </span>
          <figure className="mt-5">
            <Quote className="h-9 w-9 text-brand-200" aria-hidden="true" />
            <blockquote className="mt-2 text-2xl font-extrabold leading-snug text-ink sm:text-3xl">
              {founder.lead}
            </blockquote>
          </figure>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-muted">
            {founder.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/about" className="btn btn-primary text-base">
              짱샘 더 알아보기
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href={site.bookshop}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-base"
            >
              짱샘의 책방 보기
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

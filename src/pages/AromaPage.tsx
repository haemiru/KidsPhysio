import { ShieldCheck } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Icon from '../components/Icon'
import { aromaIntro, aromaServices, aromaProducts, aromaSafety } from '../data/site'

export default function AromaPage() {
  return (
    <>
      <PageHero
        eyebrow="아로마 테라피"
        title={
          <>
            아이의 숨을 돌보는 <span className="text-brand-600">향기</span>
          </>
        }
        desc={aromaIntro.lead}
        crumbs={[{ label: '아로마 테라피' }]}
      />

      {/* Intro */}
      <section className="py-16 lg:py-20">
        <div className="container-page max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-muted">{aromaIntro.body}</p>
        </div>
      </section>

      {/* Services */}
      <section className="pb-4">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {aromaServices.map((s) => (
            <article key={s.title} className="flex flex-col rounded-3xl bg-white p-7 shadow-card">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-coral-100 text-coral-600">
                <Icon name={s.icon} className="h-7 w-7" strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-ink">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.desc}</p>
              <ul className="mt-5 space-y-2.5 border-t border-sand pt-5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[15px] text-ink/85">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-400" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-coral-50 px-3.5 py-1.5 text-sm font-bold text-coral-600">
              향기 라인업
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              용도별로 준비한 아로마 케어
            </h2>
            <p className="mt-4 text-muted">
              아이에게 안전한 농도로 큐레이션한 에센셜 오일·하이드로졸과 후각 키트입니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aromaProducts.map((p) => (
              <div key={p.name} className="flex gap-4 rounded-3xl bg-white p-6 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coral-50 text-2xl">
                  {p.emoji}
                </span>
                <div>
                  <span className="inline-flex rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-bold text-coral-600">
                    {p.tag}
                  </span>
                  <h3 className="mt-2 text-[15px] font-extrabold text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-sand/60 py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="rounded-[2rem] bg-white p-8 shadow-card sm:p-10">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-2xl font-extrabold text-ink">안전하게 사용하는 법</h2>
            </div>
            <ul className="mt-6 space-y-4">
              {aromaSafety.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/85">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-sm text-brand-700">
                    ✓
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        title="우리 아이에게 맞는 향기가 궁금하다면"
        desc="아이의 호흡·수면 상태에 맞춰 향기와 루틴을 안내해 드립니다. 편하게 문의해 주세요."
      />
    </>
  )
}

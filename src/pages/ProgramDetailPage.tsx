import { useParams, Link, Navigate } from 'react-router-dom'
import { Check, ArrowRight, ArrowLeft } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Icon from '../components/Icon'
import { programs, programDetails } from '../data/site'

export default function ProgramDetailPage() {
  const { id } = useParams<{ id: string }>()
  const program = programs.find((p) => p.id === id)
  const detail = id ? programDetails[id] : undefined

  if (!program || !detail) return <Navigate to="/programs" replace />

  const others = programs.filter((p) => p.id !== program.id).slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow="발달 프로그램"
        title={program.title}
        desc={program.summary}
        crumbs={[{ label: '발달 프로그램', to: '/programs' }, { label: program.title }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Main */}
          <div>
            <div className="overflow-hidden rounded-3xl shadow-card">
              <img
                src={detail.image}
                alt={`${program.title} 치료 모습`}
                className="aspect-[16/10] w-full object-cover"
                loading="lazy"
              />
            </div>

            <h2 className="mt-10 text-2xl font-extrabold text-ink">프로그램 소개</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{detail.intro}</p>

            <h2 className="mt-12 text-2xl font-extrabold text-ink">진행 방법</h2>
            <ol className="mt-6 space-y-4">
              {detail.how.map((h, i) => (
                <li key={h.title} className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft">
                  <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500 font-extrabold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{h.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{h.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-brand-600 p-7 text-white shadow-card">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
                <Icon name={program.icon} className="h-7 w-7" strokeWidth={2.2} />
              </span>
              <h3 className="mt-5 text-lg font-extrabold">이런 아이에게 권해요</h3>
              <ul className="mt-4 space-y-3">
                {detail.forWhom.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-[15px] text-white/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sun-400" strokeWidth={3} aria-hidden="true" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-card">
              <h3 className="text-lg font-extrabold text-ink">기대 효과</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {detail.outcomes.map((o) => (
                  <li
                    key={o}
                    className="rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-semibold text-brand-700"
                  >
                    {o}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn btn-primary mt-7 w-full">
                이 프로그램 상담받기
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            {program.id === 'breath' && (
              <div className="rounded-3xl border-2 border-brand-100 bg-brand-50 p-7">
                <span className="inline-flex rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                  4주 코칭 프로그램
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">
                  집에서 이어가는 호흡·후각 4주 코칭
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  후각·호흡·원시반사를 기반으로 한 4주 신경계 코어 회복 프로그램입니다.
                  초기 1:1 상담과 주간 체크인으로 가정에서 루틴을 만들어 갑니다.
                </p>
                <Link to="/coaching" className="btn btn-primary mt-6 w-full">
                  4주 코칭 신청하기
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Other programs */}
      <section className="bg-sand/60 py-16 lg:py-20">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-ink">다른 프로그램</h2>
            <Link to="/programs" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
              전체 보기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                to={`/programs/${o.id}`}
                className="group rounded-3xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <Icon name={o.icon} className="h-8 w-8 text-brand-500" strokeWidth={2.2} />
                <h3 className="mt-4 text-lg font-extrabold text-ink">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{o.summary}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/programs" className="inline-flex items-center gap-2 font-bold text-brand-700">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              프로그램 목록으로
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

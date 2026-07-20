import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Icon from '../components/Icon'
import { programs, type Program } from '../data/site'

const iconBg: Record<Program['color'], string> = {
  brand: 'bg-brand-500',
  coral: 'bg-coral-500',
  sun: 'bg-sun-500',
  sky: 'bg-sky-soft-500',
}

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="발달 프로그램"
        title={
          <>
            아이에게 꼭 맞는 <span className="text-brand-600">3가지 전문 영역</span>
          </>
        }
        desc="발달재활 전문가가 발달 영역을 두루 살펴 아이에게 필요한 프로그램을 제안합니다. 궁금한 영역을 눌러 자세히 살펴보세요."
        crumbs={[{ label: '발달 프로그램' }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p.id}
              to={`/programs/${p.id}`}
              className="group flex flex-col rounded-3xl bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-1.5"
            >
              <span
                className={`grid h-14 w-14 place-items-center rounded-2xl ${iconBg[p.color]} text-white shadow-soft`}
              >
                <Icon name={p.icon} className="h-7 w-7" strokeWidth={2.2} />
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-ink">{p.title}</h2>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{p.summary}</p>
              <ul className="mt-5 space-y-2 border-t border-sand pt-5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-ink/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" strokeWidth={3} aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                자세히 보기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        title="어떤 프로그램이 맞을지 모르겠다면"
        desc="발달 평가를 통해 아이에게 필요한 영역을 정확히 찾아 드립니다."
      />
    </>
  )
}

import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { programs, type Program } from '../data/site'

const colorMap: Record<
  Program['color'],
  { chip: string; icon: string; ring: string }
> = {
  brand: { chip: 'bg-brand-50', icon: 'bg-brand-500', ring: 'hover:border-brand-300' },
  coral: { chip: 'bg-coral-50', icon: 'bg-coral-500', ring: 'hover:border-coral-300' },
  sun: { chip: 'bg-sun-300/40', icon: 'bg-sun-500', ring: 'hover:border-sun-400' },
  sky: { chip: 'bg-sky-soft-300/40', icon: 'bg-sky-soft-500', ring: 'hover:border-sky-soft-400' },
}

export default function Programs() {
  return (
    <section id="programs" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="발달 프로그램"
          title={
            <>
              아이의 성장을 돕는 <span className="text-brand-600">6가지 전문 영역</span>
            </>
          }
          desc="발달 영역별 전문 치료진이 협력하여 아이에게 꼭 필요한 프로그램을 제안합니다."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => {
            const c = colorMap[p.color]
            return (
              <Link
                to={`/programs/${p.id}`}
                key={p.id}
                className={`group flex flex-col rounded-3xl border-2 border-transparent bg-white p-7 shadow-card transition-all duration-200 hover:-translate-y-1.5 ${c.ring}`}
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${c.icon} text-white shadow-soft`}
                >
                  <Icon name={p.icon} className="h-7 w-7" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-ink">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
                <ul className="mt-5 space-y-2.5 border-t border-sand pt-5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-[15px] text-ink/85">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                  자세히 보기
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

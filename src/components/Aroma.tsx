import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Icon from './Icon'
import { aromaIntro, aromaServices } from '../data/site'

/** 아로마 테라피 — 홈 섹션 (소개 + 3가지 제공 형태). */
export default function Aroma() {
  return (
    <section id="aroma" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="아로마 테라피"
          title={
            <>
              향기는 <span className="text-brand-600">가장 빠른 길</span>로 뇌에 닿습니다
            </>
          }
          desc={aromaIntro.body}
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {aromaServices.map((s) => (
            <article
              key={s.title}
              className="flex flex-col rounded-3xl bg-white p-7 shadow-card"
            >
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

        <div className="mt-12 text-center">
          <Link to="/aroma" className="btn btn-primary text-base">
            아로마 테라피 자세히 보기
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

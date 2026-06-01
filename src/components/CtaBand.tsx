import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'
import { site } from '../data/site'

type Props = {
  title?: React.ReactNode
  desc?: string
}

/** 서브페이지 하단 공통 상담 유도 배너. */
export default function CtaBand({
  title = '아이의 발달, 혼자 고민하지 마세요',
  desc = '전문 치료진이 친절하게 안내해 드립니다. 무료 상담을 신청해 보세요.',
}: Props) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-600 px-7 py-12 text-center text-white shadow-card sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 animate-blob bg-white/10"
          />
          <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">{desc}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/contact" className="btn btn-primary w-full text-base sm:w-auto">
              무료 상담 예약
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a
              href={site.phoneHref}
              className="btn w-full bg-white/15 text-base text-white hover:bg-white/25 sm:w-auto"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

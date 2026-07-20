import { ArrowRight, Phone, Star } from 'lucide-react'
import { site } from '../data/site'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-[4.5rem]">
      {/* Decorative background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-10 h-72 w-72 animate-blob bg-brand-100/70" />
        <div className="absolute right-[-6rem] top-32 h-80 w-80 animate-blob bg-sun-300/40 [animation-delay:-6s]" />
        <div className="absolute bottom-[-4rem] left-1/3 h-64 w-64 animate-blob bg-coral-300/30 [animation-delay:-12s]" />
      </div>

      <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-bold text-brand-700 shadow-soft">
            <Star className="h-4 w-4 fill-sun-400 text-sun-400" aria-hidden="true" />
            소아재활 25년 임상 · 짱샘 장지예
          </span>

          <h1 className="mt-6 text-balance text-4xl font-extrabold text-ink sm:text-5xl lg:text-[3.4rem]">
            아이의 가능성을
            <br />
            <span className="relative inline-block text-brand-600">
              마음껏 키우는 곳
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-sun-400"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9C40 3 160 3 198 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted lg:mx-0">
            25년 임상의 소아재활 전문가 <strong className="text-ink">짱샘</strong>이 1:1 맞춤
            발달치료부터 발달 전자책 50여 권, 아이를 위한 후각발달훈련까지 —
            <strong className="text-ink"> 근육보다 먼저 아이의 숨과 마음</strong>을 살핍니다.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
            <a href="#contact" className="btn btn-primary w-full text-base sm:w-auto">
              무료 발달 상담 예약
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <a href={site.phoneHref} className="btn btn-ghost w-full text-base sm:w-auto">
              <Phone className="h-5 w-5" aria-hidden="true" />
              {site.phone}
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm lg:justify-start">
            {[
              '1:1 맞춤 발달치료',
              '짱샘의 책방',
              '후각발달훈련',
              '신경계 육아 코칭',
              '브레인센트 코칭',
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-700">
                  ✓
                </span>
                <dt className="font-semibold text-ink/80">{t}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative animate-float">
            <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-brand-200/50" />
            <img
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80"
              alt="치료사와 함께 즐겁게 발달 놀이를 하는 아이"
              className="aspect-[4/5] w-full rounded-3xl object-cover shadow-card"
              loading="eager"
            />
          </div>

          {/* Floating cards */}
          <div className="absolute -left-4 top-8 hidden rounded-2xl bg-white px-4 py-3 shadow-card sm:block">
            <p className="text-xs font-semibold text-muted">오늘의 변화</p>
            <p className="text-sm font-extrabold text-brand-700">“혼자서 신발 신었어요!”</p>
          </div>
          <div className="absolute -bottom-5 right-2 hidden items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card sm:flex">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-coral-100 text-lg">
              📚
            </span>
            <div>
              <p className="text-xs font-semibold text-muted">짱샘의 책방</p>
              <p className="text-sm font-extrabold text-ink">발달 전자책 50여 권</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { Quote, Star } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { testimonials } from '../data/site'

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="부모 후기"
          title={
            <>
              아이의 변화가 <span className="text-brand-600">가장 큰 보람</span>입니다
            </>
          }
          desc="키즈피지오와 함께한 부모님들이 전해주신 진심 어린 이야기입니다."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-3xl bg-white p-7 shadow-card"
            >
              <Quote className="h-9 w-9 text-brand-200" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/85">
                {t.quote}
              </blockquote>
              <div className="mt-6 flex items-center justify-between border-t border-sand pt-5">
                <figcaption>
                  <p className="text-sm font-extrabold text-ink">{t.parent}</p>
                  <p className="text-xs font-medium text-muted">{t.child}</p>
                </figcaption>
                <div className="flex gap-0.5" aria-label="별점 5점">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-sun-400 text-sun-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

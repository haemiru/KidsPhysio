import Icon from './Icon'
import { why } from '../data/site'

export default function About() {
  return (
    <section id="about" className="bg-sand/60 py-20 lg:py-28">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        {/* Visual */}
        <div className="relative order-last lg:order-first">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img
              src="https://images.unsplash.com/photo-1526634332515-d56c5fd16991?auto=format&fit=crop&w=900&q=80"
              alt="밝고 안전한 키즈피지오 치료실 환경"
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-3 max-w-[14rem] rounded-2xl bg-brand-600 p-5 text-white shadow-card sm:-right-6">
            <p className="font-display text-3xl font-extrabold">12년+</p>
            <p className="mt-1 text-sm text-white/85">
              한 자리에서 쌓아온 아동발달 전문 노하우
            </p>
          </div>
        </div>

        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700 shadow-soft">
            왜 키즈피지오일까요
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            아이를 가장 잘 아는 건
            <br />
            <span className="text-brand-600">꾸준히 곁에 있는 전문가</span>입니다
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            키즈피지오는 평가부터 치료, 가정 연계까지 아이의 성장 여정을 끝까지
            함께합니다. 변화는 작은 신뢰에서 시작됩니다.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {why.map((w) => (
              <div key={w.title} className="rounded-2xl bg-white p-5 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name={w.icon} className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">{w.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

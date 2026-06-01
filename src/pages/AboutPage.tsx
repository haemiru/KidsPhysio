import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import Icon from '../components/Icon'
import { aboutStory, values, history, stats } from '../data/site'

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="센터소개"
        title={
          <>
            아이의 가능성을 믿는 <span className="text-brand-600">12년의 발걸음</span>
          </>
        }
        desc="키즈피지오는 평가부터 치료, 가정 연계까지 아이의 성장 여정을 끝까지 함께합니다."
        crumbs={[{ label: '센터소개' }]}
      />

      {/* Story */}
      <section className="py-20 lg:py-24">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-card">
            <img
              src={aboutStory.image}
              alt="키즈피지오 치료 공간"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-bold text-brand-700">
              우리의 이야기
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink">
              작은 치료실에서 시작된 믿음
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{aboutStory.intro}</p>
            <div className="mt-6 rounded-2xl border-l-4 border-brand-400 bg-brand-50/60 p-5">
              <p className="leading-relaxed text-ink/90">{aboutStory.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-4">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-4 rounded-3xl bg-brand-600 p-8 text-white shadow-card lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-extrabold sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-bold text-brand-700">
              우리가 지키는 가치
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              모든 순간, 아이를 먼저 생각합니다
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl bg-white p-7 text-center shadow-card">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon name={v.icon} className="h-7 w-7" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="bg-sand/60 py-20 lg:py-24">
        <div className="container-page max-w-3xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700 shadow-soft">
              연혁
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              함께 걸어온 시간
            </h2>
          </div>
          <ol className="mt-12 space-y-6">
            {history.map((h) => (
              <li key={h.year} className="flex gap-5">
                <span className="font-display w-16 shrink-0 text-right text-xl font-extrabold text-brand-600">
                  {h.year}
                </span>
                <span className="relative flex-1 border-l-2 border-brand-200 pb-2 pl-6">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-brand-500" />
                  <span className="text-ink/90">{h.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

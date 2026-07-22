import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { team } from '../data/site'

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="소개"
        title={
          <>
            <span className="block">아이를 진심으로 대하는</span>
            <span className="block text-brand-600">발달재활 전문가</span>
          </>
        }
        desc="25년 임상의 발달재활 전문가 짱샘 장지예가 아이의 성장을 이끕니다."
        crumbs={[{ label: '치료진' }]}
      />

      <section className="py-20 lg:py-24">
        <div className="container-page flex flex-wrap justify-center gap-8">
          {team.map((t) => (
            <article
              key={t.name}
              className="group flex w-full gap-5 rounded-3xl bg-white p-5 shadow-card sm:w-[32rem] sm:p-6"
            >
              <div className="h-32 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-40 sm:w-36">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={`${t.name} ${t.role}`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-50">
                    <span className="text-5xl" aria-hidden>
                      {t.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-xl font-extrabold text-ink">{t.name}</h2>
                <p className="mt-1 text-sm font-semibold text-brand-600">{t.role}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="우리 아이는 어떤 선생님과 만날까요"
        desc="상담을 통해 아이에게 가장 잘 맞는 치료사를 배정해 드립니다."
      />
    </>
  )
}

import SectionHeading from './SectionHeading'
import { team } from '../data/site'

export default function Team() {
  return (
    <section id="team" className="bg-sand/60 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="치료진 소개"
          title={
            <>
              아이를 진심으로 대하는 <span className="text-brand-600">전문 치료진</span>
            </>
          }
          desc="국가자격을 갖춘 분야별 전문가가 한 팀이 되어 아이의 성장을 이끕니다."
        />

        <div className="mt-14 flex flex-wrap justify-center gap-6">
          {team.map((t) => (
            <article
              key={t.name}
              className="group w-full overflow-hidden rounded-3xl bg-white shadow-card sm:w-72"
            >
              <div className="aspect-[4/5] overflow-hidden">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={`${t.name} ${t.role}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-50">
                    <span className="text-6xl" aria-hidden>
                      {t.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-ink">{t.name}</h3>
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
      </div>
    </section>
  )
}

import SectionHeading from './SectionHeading'
import { process } from '../data/site'

export default function Process() {
  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="치료 과정"
          title={
            <>
              상담부터 성장까지, <span className="text-brand-600">5단계 케어</span>
            </>
          }
          desc="첫 상담부터 주기적인 피드백까지 투명하게 안내해 드립니다."
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-5">
          {process.map((p, i) => (
            <li key={p.step} className="relative">
              {/* connector */}
              {i < process.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+2rem)] top-7 hidden h-[2px] w-[calc(100%-2.5rem)] bg-gradient-to-r from-brand-200 to-transparent md:block"
                />
              )}
              <div className="flex h-full flex-col items-center rounded-3xl bg-white p-6 text-center shadow-soft transition-shadow hover:shadow-card md:items-start md:text-left">
                <span className="font-display grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-xl font-extrabold text-white shadow-soft">
                  {p.step}
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

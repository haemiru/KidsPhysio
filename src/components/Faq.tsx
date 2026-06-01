import { Plus } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { faqs } from '../data/site'

export default function Faq() {
  return (
    <section id="faq" className="bg-sand/60 py-20 lg:py-28">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="자주 묻는 질문" title="궁금한 점을 모았어요" />

        <div className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white px-6 py-1 shadow-soft [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-bold text-ink">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-200 group-open:rotate-45">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                </span>
              </summary>
              <p className="pb-6 pr-12 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

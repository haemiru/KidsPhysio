import { stats } from '../data/site'

export default function Stats() {
  return (
    <section className="container-page -mt-2 pb-4">
      <div className="grid grid-cols-3 gap-3 rounded-3xl bg-brand-600 p-6 text-white shadow-card sm:gap-6 sm:p-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-extrabold sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-white/80">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

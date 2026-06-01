import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { posts } from '../data/site'
import { formatDate } from '../lib/format'

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <>
      <PageHero
        eyebrow="발달 칼럼"
        title={
          <>
            아이의 성장을 돕는 <span className="text-brand-600">전문가의 이야기</span>
          </>
        }
        desc="발달, 양육, 부모의 마음까지. 치료실에서 길어 올린 따뜻한 글을 나눕니다."
        crumbs={[{ label: '칼럼' }]}
      />

      <section className="py-16 lg:py-20">
        <div className="container-page">
          {/* Featured */}
          <Link
            to={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl bg-white shadow-card lg:grid-cols-2"
          >
            <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
              <img
                src={featured.cover}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className="inline-flex w-fit rounded-full bg-coral-50 px-3 py-1 text-xs font-bold text-coral-600">
                {featured.category}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-ink sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-muted">
                <span>{formatDate(featured.date)}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" /> {featured.readingTime}
                </span>
              </div>
            </div>
          </Link>

          {/* Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-transform hover:-translate-y-1.5"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="inline-flex w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                    {p.category}
                  </span>
                  <h3 className="mt-3 text-lg font-extrabold leading-snug text-ink">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                    <span>{formatDate(p.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.readingTime}</span>
                    <ArrowRight
                      className="ml-auto h-4 w-4 text-brand-600 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}

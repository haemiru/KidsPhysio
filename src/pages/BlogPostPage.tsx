import { useParams, Link, Navigate } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import { posts } from '../data/site'
import { formatDate } from '../lib/format'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = posts.find((p) => p.slug === slug)

  if (!post) return <Navigate to="/blog" replace />

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        crumbs={[{ label: '칼럼', to: '/blog' }, { label: post.category }]}
      />

      <article className="py-16 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>{formatDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" /> {post.readingTime}
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl shadow-card">
            <img
              src={post.cover}
              alt=""
              className="aspect-[16/9] w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="mt-10 space-y-6">
            {post.body.map((para, i) => (
              <p key={i} className="text-lg leading-[1.9] text-ink/85">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-sand pt-8">
            <Link to="/blog" className="inline-flex items-center gap-2 font-bold text-brand-700">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              칼럼 목록으로
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-sand/60 py-16 lg:py-20">
        <div className="container-page max-w-4xl">
          <h2 className="text-2xl font-extrabold text-ink">함께 읽으면 좋은 글</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="group flex gap-4 rounded-3xl bg-white p-4 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                  <img src={p.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-bold text-brand-700">{p.category}</span>
                  <h3 className="mt-1 text-base font-extrabold leading-snug text-ink">
                    {p.title}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-700">
                    읽어보기
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
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

import { ArrowUpRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import CtaBand from '../components/CtaBand'
import BookCard from '../components/BookCard'
import { books, bookCategories, site } from '../data/site'

export default function BookshopPage() {
  return (
    <>
      <PageHero
        eyebrow="짱샘의 책방"
        title={
          <>
            가정으로 가는 <span className="text-brand-600">25년의 임상</span>
          </>
        }
        desc="발달·호흡·후각·수면·치유 5개 분야의 전자책 50여 권. 아래는 대표작이며, 전체 도서는 짱샘의 책방에서 만나실 수 있습니다."
        crumbs={[{ label: '짱샘의 책방' }]}
      />

      {/* Categories */}
      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {bookCategories.map((c) => (
              <div
                key={c.key}
                className="rounded-3xl bg-white p-6 text-center shadow-soft"
              >
                <span className="text-3xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-ink">{c.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured books */}
      <section className="bg-sand/60 py-16 lg:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700 shadow-soft">
              대표작
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              지금 가장 사랑받는 책들
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {books.map((b) => (
              <BookCard key={b.slug} book={b} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href={site.bookshop}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary text-base"
            >
              짱샘의 책방에서 전체 보기
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <CtaBand
        title="어떤 책이 우리 아이에게 맞을까요"
        desc="아이의 발달 상황을 알려주시면, 가장 도움이 될 책과 프로그램을 추천해 드립니다."
      />
    </>
  )
}

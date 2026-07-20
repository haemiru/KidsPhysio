import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SectionHeading from './SectionHeading'
import BookCard from './BookCard'
import { books, bookCategories, site } from '../data/site'

/** 짱샘의 책방 — 홈 섹션 (대표작 미리보기 + 책방 링크). */
export default function Bookshop() {
  const featured = books.slice(0, 4)

  return (
    <section id="bookshop" className="bg-sand/60 py-20 lg:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="짱샘의 책방"
          title={
            <>
              치료실 밖에서도, <span className="text-brand-600">책으로 함께</span>
            </>
          }
          desc="25년 임상이 담긴 발달·호흡·후각·수면·치유 전자책 50여 권. 치료실에 오지 못하는 부모님도 가정에서 아이를 도울 수 있습니다."
        />

        {/* Category chips */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {bookCategories.map((c) => (
            <span
              key={c.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-soft"
            >
              <span aria-hidden="true">{c.emoji}</span>
              {c.label}
            </span>
          ))}
        </div>

        {/* Featured books */}
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((b) => (
            <BookCard key={b.slug} book={b} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/bookshop" className="btn btn-primary text-base">
            대표작 모두 보기
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <a
            href={site.bookshop}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost text-base"
          >
            jjangsaem.com 책방 가기
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

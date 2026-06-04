import { ArrowUpRight } from 'lucide-react'
import { site, type Book } from '../data/site'

/** 책방 전자책 카드 — jjangsaem.com 책방으로 연결. */
export default function BookCard({ book }: { book: Book }) {
  return (
    <a
      href={`${site.bookshop}/ebook/${book.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-transform duration-200 hover:-translate-y-1.5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <img
          src={book.cover}
          alt={`${book.title} 표지`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700 shadow-soft backdrop-blur">
          {book.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-extrabold leading-snug text-ink">{book.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{book.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700">
          책방에서 보기
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </a>
  )
}

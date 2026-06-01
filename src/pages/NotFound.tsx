import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 pt-[4.5rem]">
      <div className="text-center">
        <p className="font-display text-7xl font-extrabold text-brand-500 sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-ink sm:text-3xl">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 홈으로 돌아가 다시
          찾아보세요.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary">
            <Home className="h-5 w-5" aria-hidden="true" />
            홈으로 가기
          </Link>
          <Link to="/programs" className="btn btn-ghost">
            발달 프로그램 보기
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

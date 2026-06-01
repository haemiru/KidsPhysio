import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** 라우트 변경 시 페이지 상단으로 스크롤 (해시 앵커는 예외). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}

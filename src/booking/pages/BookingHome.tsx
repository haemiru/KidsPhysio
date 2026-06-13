import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'

export default function BookingHome() {
  return (
    <PublicLayout>
      <section className="text-center">
        <p className="text-sm font-semibold text-accent">짱샘 키즈피지오</p>
        <h1 className="mt-2 text-3xl font-bold leading-snug text-ink">
          호흡·후각 4주 코칭
          <br />
          신청
        </h1>
        <p className="mt-4 text-muted">
          후각·호흡·원시반사 기반
          <br />4주 신경계 코어 회복 프로그램
        </p>
      </section>

      <div className="card mt-8">
        <h2 className="font-bold text-primary-dark">프로그램 진행 방식</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>· 초기 1:1 상담 1회 + 주간 체크인 (4주)</li>
          <li>· 방문/대면으로 진행되는 부모 참여형 홈케어 코칭</li>
          <li>· 아이의 신경계 상태를 이해하고 가정에서 반복 경험</li>
        </ul>
      </div>

      <Link
        to="/apply"
        className="mt-8 block rounded-2xl bg-primary py-4 text-center font-bold text-white transition hover:bg-primary-dark"
      >
        코칭 신청하기
      </Link>

      <p className="mt-4 text-center text-xs text-muted">
        신청 시 개인정보 수집·이용 및 민감정보 처리에 동의하게 됩니다.
      </p>
    </PublicLayout>
  )
}

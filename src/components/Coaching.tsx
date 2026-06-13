import { Link } from 'react-router-dom'
import { ArrowRight, Wind, CalendarCheck, Home } from 'lucide-react'

const points = [
  {
    icon: Wind,
    title: '후각·호흡·원시반사 통합',
    desc: '근육보다 먼저 아이의 숨과 신경계를 안정시키는 짱샘의 통합 접근입니다.',
  },
  {
    icon: CalendarCheck,
    title: '4주 · 주간 체크인',
    desc: '초기 1:1 상담 1회와 주간 체크인으로 4주간 변화를 함께 점검합니다.',
  },
  {
    icon: Home,
    title: '부모 참여형 홈케어',
    desc: '아이의 신경계 상태를 이해하고 가정에서 반복 경험으로 이어갑니다.',
  },
]

/** 호흡·후각 4주 코칭 — 홈 섹션 (유료 코칭 프로그램 진입점). */
export default function Coaching() {
  return (
    <section id="coaching" className="py-20 lg:py-28">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-600 px-7 py-14 text-white shadow-card sm:px-12 lg:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 animate-blob bg-white/10"
          />

          <div className="relative">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
              4주 코칭 프로그램
            </span>
            <h2 className="mt-5 text-balance text-3xl font-extrabold sm:text-4xl">
              집에서 이어가는 <span className="text-sun-300">호흡·후각 4주 코칭</span>
            </h2>
            <p className="mt-4 max-w-2xl text-white/85">
              후각·호흡·원시반사를 기반으로 한 4주 신경계 코어 회복 프로그램입니다.
              치료실 밖 가정에서도 아이의 숨과 신경계를 단단하게 다집니다.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {points.map((p) => (
                <div key={p.title} className="rounded-3xl bg-white/10 p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
                    <p.icon className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/80">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/coaching" className="btn btn-primary text-base">
                4주 코칭 신청하기
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

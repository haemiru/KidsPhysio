// 4주 다회차 예약 구성: 초기상담 1회 + 주간 체크인 4회
export interface SessionStep {
  no: number
  kind: string
  label: string
  desc: string
}

export const SESSION_PLAN: SessionStep[] = [
  { no: 1, kind: 'consult', label: '초기 1:1 상담', desc: '코칭의 시작 — 아이의 상태를 함께 파악합니다.' },
  { no: 2, kind: 'checkin', label: '1주차 체크인', desc: '첫 주 진행을 점검합니다.' },
  { no: 3, kind: 'checkin', label: '2주차 체크인', desc: '둘째 주 진행을 점검합니다.' },
  { no: 4, kind: 'checkin', label: '3주차 체크인', desc: '셋째 주 진행을 점검합니다.' },
  { no: 5, kind: 'checkin', label: '4주차 체크인', desc: '마지막 주를 마무리합니다.' },
]

export const sessionByNo = (no: number): SessionStep | undefined =>
  SESSION_PLAN.find((s) => s.no === no)

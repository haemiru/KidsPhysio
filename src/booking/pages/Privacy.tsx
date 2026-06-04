import PublicLayout from '../components/PublicLayout'

export default function Privacy() {
  return (
    <PublicLayout>
      <h1 className="text-2xl font-bold">개인정보 처리방침</h1>
      <p className="mt-2 text-sm text-muted">
        ※ 초안입니다. 사업자 정보·보유기간 등 실제 운영 내용으로 확정이 필요합니다.
      </p>

      <div className="card mt-6 space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-primary-dark">1. 수집하는 개인정보 항목</h2>
          <p className="mt-1 text-muted">
            - 보호자: 성함, 연락처, 카카오톡 아이디, 거주지역
            <br />- 아동: 이름, 생년월일, 성별, 출생 정보
          </p>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">2. 민감정보 처리</h2>
          <p className="mt-1 text-muted">
            아동의 진단·치료·발달 상태 등 건강에 관한 정보는 민감정보로서, 정보주체(법정대리인)의
            별도 동의를 받아 코칭 프로그램 제공 목적으로만 처리합니다.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">3. 이용 목적</h2>
          <p className="mt-1 text-muted">
            코칭 신청 접수, 상담 일정 예약·안내, 프로그램 제공, 결제 확인 및 알림 발송.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">4. 보유 및 이용 기간</h2>
          <p className="mt-1 text-muted">
            수집·이용 동의일로부터 프로그램 종료 후 [○년] 까지 보유하며, 기간 경과 시 지체 없이 파기합니다.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">5. 제3자 제공·처리위탁</h2>
          <p className="mt-1 text-muted">
            알림 발송(솔라피), 결제(토스페이먼츠), 데이터 저장(Supabase) 목적의 처리위탁 외에는
            제3자에게 제공하지 않습니다.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">6. 정보주체의 권리</h2>
          <p className="mt-1 text-muted">
            동의 철회, 열람·정정·삭제를 요청할 수 있으며, 요청 시 지체 없이 조치합니다.
          </p>
        </section>
      </div>
    </PublicLayout>
  )
}

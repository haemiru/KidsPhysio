import PublicLayout from '../components/PublicLayout'
import { business } from '../../data/site'

export default function Privacy() {
  return (
    <PublicLayout>
      <h1 className="text-2xl font-bold">개인정보 처리방침</h1>
      <p className="mt-2 text-sm text-muted">
        {business.companyName}(이하 ‘회사’)은(는) 「개인정보 보호법」 등 관련 법령을 준수하며,
        정보주체의 개인정보를 안전하게 보호하기 위해 다음과 같이 개인정보 처리방침을 둡니다.
      </p>

      <div className="card mt-6 space-y-5 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-primary-dark">1. 수집하는 개인정보 항목</h2>
          <p className="mt-1 text-muted">
            - 보호자: 성함, 연락처, 카카오톡 아이디, 거주지역
            <br />- 아동: 이름, 생년월일, 성별, 출생 정보
            <br />- 결제 시: 결제수단 정보(결제대행사를 통해 처리)
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
            수집·이용 동의일로부터 <strong>프로그램 종료 후 1년</strong>까지 보유하며, 기간 경과 또는
            동의 철회 시 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>· 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
            <li>· 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
            <li>· 소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">5. 제3자 제공·처리위탁</h2>
          <p className="mt-1 text-muted">
            회사는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁하며, 위탁 목적 외의 용도로는
            제3자에게 제공하지 않습니다.
          </p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>· (주)토스페이먼츠 — 결제 처리</li>
            <li>· 솔라피(SOLAPI) — 알림(카카오 알림톡/문자) 발송</li>
            <li>· Supabase — 데이터 저장·관리</li>
          </ul>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">6. 정보주체의 권리</h2>
          <p className="mt-1 text-muted">
            정보주체는 언제든지 동의 철회, 개인정보 열람·정정·삭제·처리정지를 요청할 수 있으며,
            요청 시 지체 없이 조치합니다.
          </p>
        </section>
        <section>
          <h2 className="font-bold text-primary-dark">7. 개인정보 처리자 및 문의처</h2>
          <p className="mt-1 text-muted">
            - 상호: {business.companyName}
            <br />- 대표자: {business.ceo}
            <br />- 사업자등록번호: {business.bizRegNo}
            <br />- 주소: {business.address}
            <br />- 연락처: {business.phone}
            <br />- 이메일: {business.email}
          </p>
          <p className="mt-2 text-muted">
            개인정보 처리에 관한 문의·불만·피해구제는 위 연락처로 접수해 주시면 지체 없이 답변·처리해 드립니다.
          </p>
        </section>
      </div>
    </PublicLayout>
  )
}

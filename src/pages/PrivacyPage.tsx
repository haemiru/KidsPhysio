import PageHero from '../components/PageHero'
import { business } from '../data/site'

/**
 * 개인정보처리방침 — 사이트 전체(신청 폼 5종 + 코칭 예약 시스템)를 포괄하는 정식 문서.
 * 예약 시스템(booking)의 동의 링크도 이 페이지를 가리킨다.
 *
 * ⚠️ 수집 항목·위탁업체·보유기간을 바꿀 때는 각 신청서의 동의 문구
 *   (src/data/{classApply,bodyProject,coreReset}.ts 의 privacyConsent)도 함께 맞출 것.
 */

/** 시행일 — 내용을 고치면 이 날짜도 갱신한다 */
const EFFECTIVE_DATE = '2026년 8월 10일'

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="개인정보처리방침"
        title="개인정보처리방침"
        desc={`${business.companyName}는 「개인정보 보호법」 등 관련 법령을 준수하며, 정보주체의 개인정보를 안전하게 보호하기 위해 다음과 같이 개인정보처리방침을 둡니다.`}
        crumbs={[{ label: '개인정보처리방침' }]}
      />

      <section className="py-14 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-9">
            <Section n="1" title="수집하는 개인정보 항목">
              <P>회사는 서비스 제공에 필요한 최소한의 개인정보를 아래와 같이 수집합니다.</P>
              <Table
                head={['구분', '수집 항목']}
                rows={[
                  ['브레인 코칭 문의', '보호자 성함, 연락처, 아이 나이, 문의 내용'],
                  ['클래스 신청', '성함, 연락처, 이메일, 거주지역, 신청서 응답 내용'],
                  ['몸읽기 프로젝트 신청', '보호자 성함, 연락처, 카카오톡 닉네임, 아이 이름·나이, 신청서 응답 내용'],
                  [
                    '코어 리셋 코칭 신청',
                    '보호자 성함, 연락처, 카카오톡 아이디, 거주지역, 아이 이름·생년월일·성별, 출생 정보, 진단·치료 이력, 신청서 응답 내용',
                  ],
                  ['4주 코칭 예약', '보호자 성함, 연락처, 아이 정보, 예약 일정, 결제 정보'],
                  ['종료 설문', '익명으로 수집하며 개인을 식별할 수 있는 정보를 받지 않습니다.'],
                ]}
              />
              <P className="mt-3">
                서비스 이용 과정에서 접속 브라우저 정보(User-Agent)가 자동으로 수집될 수 있습니다.
                결제 수단 정보는 회사가 직접 보관하지 않으며 결제대행사를 통해 처리됩니다.
              </P>
            </Section>

            <Section n="2" title="민감정보의 처리">
              <P>
                코어 리셋 코칭 신청서에는 아동의 <Strong>진단·치료 이력 등 건강에 관한 정보</Strong>
                (민감정보)가 포함됩니다. 회사는 해당 정보를 신청서에서{' '}
                <Strong>별도의 동의</Strong>를 받아 수집하며, 맞춤 코칭 설계와 프로그램 제공 목적으로만
                처리합니다. 동의를 거부하실 수 있으나 이 경우 해당 프로그램의 신청 접수가 어렵습니다.
              </P>
            </Section>

            <Section n="3" title="개인정보의 이용 목적">
              <List
                items={[
                  '신청·문의 접수 및 본인 확인, 상담 일정 조율과 안내',
                  '아이 상태에 맞춘 코칭·홈케어 프로그램의 설계와 제공',
                  '참가비·이용료 입금 확인 및 결제 처리',
                  '공지·안내 사항 전달(문자·카카오 알림톡)',
                  '서비스 개선을 위한 통계 분석(설문의 경우 익명 처리된 형태)',
                ]}
              />
            </Section>

            <Section n="4" title="보유 및 이용 기간">
              <P>
                수집·이용 동의일로부터 <Strong>프로그램 종료 후 1년</Strong>까지 보유하며, 기간이
                지나거나 정보주체가 동의를 철회하면 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이
                필요한 경우 아래 기간 동안 보관합니다.
              </P>
              <List
                items={[
                  '계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)',
                  '대금결제 및 재화 등의 공급에 관한 기록: 5년 (동법)',
                  '소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (동법)',
                  '표시·광고에 관한 기록: 6개월 (동법)',
                ]}
              />
            </Section>

            <Section n="5" title="개인정보의 파기">
              <P>
                보유 기간이 끝나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일
                형태의 정보는 복구할 수 없는 기술적 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.
              </P>
            </Section>

            <Section n="6" title="개인정보의 제3자 제공 및 처리위탁">
              <P>
                회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 원활한 서비스
                제공을 위해 아래와 같이 처리를 위탁하고 있으며, 위탁 목적 외의 용도로는 이용하지 않습니다.
              </P>
              <Table
                head={['수탁업체', '위탁 업무']}
                rows={[
                  ['솔라피(SOLAPI)', '문자·카카오 알림톡 발송'],
                  ['Supabase Inc.', '데이터 저장 및 관리'],
                  ['(주)토스페이먼츠', '결제 처리'],
                  ['Vercel Inc.', '웹사이트 호스팅'],
                ]}
              />
            </Section>

            <Section n="7" title="정보주체와 법정대리인의 권리">
              <P>
                정보주체는 언제든지 개인정보의 <Strong>열람·정정·삭제·처리정지</Strong>를 요청하거나
                수집·이용 동의를 철회할 수 있습니다. 만 14세 미만 아동의 개인정보는 법정대리인의 동의를
                받아 수집하며, 법정대리인은 아동의 개인정보에 대해 위 권리를 행사할 수 있습니다.
              </P>
              <P className="mt-2">
                권리 행사는 아래 문의처로 서면·전화·이메일을 통해 요청하실 수 있으며, 회사는 지체 없이
                조치합니다.
              </P>
            </Section>

            <Section n="8" title="개인정보의 안전성 확보 조치">
              <List
                items={[
                  '개인정보 취급자를 최소한으로 지정하고 접근 권한을 관리합니다.',
                  '개인정보가 저장된 데이터베이스는 외부에서 직접 접근할 수 없도록 차단하고, 인가된 관리자만 열람할 수 있도록 제한합니다.',
                  '개인정보의 송수신 구간은 암호화(HTTPS)하여 보호합니다.',
                ]}
              />
            </Section>

            <Section n="9" title="개인정보 보호책임자 및 문의처">
              <Table
                head={['구분', '내용']}
                rows={[
                  ['상호', business.companyName],
                  ['대표자', business.ceo],
                  ['개인정보 보호책임자', business.privacyOfficer],
                  ['사업자등록번호', business.bizRegNo],
                  ['주소', business.address],
                  ['연락처', business.phone],
                  ['이메일', business.email],
                ]}
              />
              <P className="mt-3">
                개인정보 처리에 관한 문의·불만·피해구제는 위 연락처로 접수해 주시면 지체 없이 답변·처리해
                드립니다.
              </P>
            </Section>

            <Section n="10" title="권익침해 구제 방법">
              <P>
                개인정보 침해로 인한 상담·피해 구제가 필요한 경우 아래 기관에 문의하실 수 있습니다.
              </P>
              <List
                items={[
                  '개인정보 침해신고센터 — (국번없이) 118 · privacy.kisa.or.kr',
                  '개인정보 분쟁조정위원회 — 1833-6972 · kopico.go.kr',
                  '대검찰청 사이버수사과 — (국번없이) 1301 · spo.go.kr',
                  '경찰청 사이버수사국 — (국번없이) 182 · ecrm.police.go.kr',
                ]}
              />
            </Section>

            <Section n="11" title="처리방침의 변경">
              <P>
                이 개인정보처리방침의 내용에 추가·삭제·수정이 있을 경우 시행 7일 전부터 웹사이트를 통해
                공지합니다. 다만 정보주체의 권리에 중대한 영향을 미치는 변경은 시행 30일 전에 공지합니다.
              </P>
            </Section>

            <p className="mt-8 border-t border-brand-100 pt-5 text-[15px] font-semibold text-muted">
              시행일: {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

/* ─────────────────────────── 문서 조각 ─────────────────────────── */

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8 last:mb-0">
      <h2 className="text-[17px] font-extrabold text-ink">
        제{n}조 · {title}
      </h2>
      <div className="mt-2.5">{children}</div>
    </section>
  )
}

function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[15px] leading-relaxed text-muted ${className}`}>{children}</p>
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-ink">{children}</strong>
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((it) => (
        <li key={it} className="flex gap-2 text-[15px] leading-relaxed text-muted">
          <span aria-hidden="true">·</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-brand-100">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-sand/60 text-[13px] font-bold text-ink">
          <tr>
            {head.map((h, i) => (
              <th key={h} className={`px-4 py-2.5 ${i === 0 ? 'w-[9rem] sm:w-[13rem]' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-brand-100 align-top">
              {r.map((c, i) => (
                <td
                  key={c}
                  className={`px-4 py-2.5 leading-relaxed ${i === 0 ? 'font-semibold text-ink' : 'text-muted'}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

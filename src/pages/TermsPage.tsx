import PageHero from '../components/PageHero'
import { business } from '../data/site'

/**
 * 이용약관.
 * ⚠️ 제8조(취소·환불)는 각 프로그램에 실제로 고지 중인 규정과 반드시 일치시킬 것.
 *   - 코어 리셋: src/data/coreReset.ts 의 refundPolicy
 *   - 4주 코칭 예약: 상담 24시간 이내 온라인 취소 불가 (booking/pages/MyReservation.tsx)
 */

/** 시행일 — 내용을 고치면 이 날짜도 갱신한다 */
const EFFECTIVE_DATE = '2026년 8월 10일'

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="이용약관"
        title="이용약관"
        desc={`${business.companyName}가 운영하는 짱샘 키즈피지오 웹사이트와 프로그램의 이용 조건을 정합니다.`}
        crumbs={[{ label: '이용약관' }]}
      />

      <section className="py-14 lg:py-20">
        <div className="container-page max-w-3xl">
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-9">
            <Section n="1" title="목적">
              <P>
                이 약관은 {business.companyName}(이하 “회사”)가 운영하는 짱샘 키즈피지오 웹사이트(이하
                “사이트”)에서 제공하는 발달치료·코칭·클래스 등 서비스(이하 “서비스”)의 이용과 관련하여
                회사와 이용자의 권리·의무 및 책임사항을 정하는 것을 목적으로 합니다.
              </P>
            </Section>

            <Section n="2" title="용어의 정의">
              <List
                items={[
                  '“이용자”란 사이트에 접속하여 서비스를 이용하는 자를 말하며, 통상 아동의 보호자(법정대리인)를 의미합니다.',
                  '“프로그램”이란 회사가 제공하는 코칭·클래스·프로젝트 등 유료 또는 무료의 개별 서비스를 말합니다.',
                  '“신청”이란 이용자가 사이트의 신청서를 작성·제출하여 프로그램 이용을 요청하는 행위를 말합니다.',
                ]}
              />
            </Section>

            <Section n="3" title="약관의 효력과 변경">
              <P>
                이 약관은 사이트에 게시함으로써 효력이 발생합니다. 회사는 관련 법령을 위반하지 않는
                범위에서 약관을 변경할 수 있으며, 변경 시 시행일과 변경 내용을 시행 7일 전부터 사이트에
                공지합니다. 이용자에게 불리한 변경의 경우 시행 30일 전에 공지합니다.
              </P>
            </Section>

            <Section n="4" title="서비스의 내용">
              <List
                items={[
                  '아동 발달 관련 정보 제공 및 상담 문의 접수',
                  '코칭·클래스·프로젝트 등 프로그램의 안내와 신청 접수',
                  '프로그램 일정 예약 및 안내 알림 발송',
                  '전자책 등 콘텐츠 안내',
                ]}
              />
              <P className="mt-3">
                각 프로그램의 구성·기간·가격 등 구체적인 내용은 해당 프로그램의 안내 페이지와 신청서에
                고지된 바에 따릅니다.
              </P>
            </Section>

            <Section n="5" title="신청과 계약의 성립">
              <P>
                이용자가 신청서를 제출하고 회사가 이를 확인한 후, 유료 프로그램의 경우{' '}
                <Strong>참가비 입금 또는 결제가 확인된 시점</Strong>에 이용계약이 성립합니다. 회사는 다음
                각 호에 해당하는 경우 신청을 승낙하지 않거나 사후에 취소할 수 있습니다.
              </P>
              <List
                items={[
                  '신청 내용에 허위 사실을 기재한 경우',
                  '정원이 초과되었거나 프로그램 운영이 어려운 사정이 있는 경우',
                  '아동의 상태나 필요가 해당 프로그램의 대상과 현저히 맞지 않는 경우',
                ]}
              />
            </Section>

            <Section n="6" title="이용요금과 결제">
              <P>
                프로그램의 이용요금은 각 신청서와 안내 페이지에 표시된 금액에 따릅니다. 결제는 무통장
                입금 또는 회사가 제공하는 결제수단으로 하며, 무통장 입금의 경우 입금이 확인되어야 신청이
                확정됩니다. 예약 일정·요일에 따른 추가 비용이 있는 경우 신청 시점에 고지합니다.
              </P>
            </Section>

            <Section n="7" title="미성년자의 이용">
              <P>
                서비스의 대상은 아동이며, 신청과 결제는 법정대리인인 보호자가 진행합니다. 회사는 아동의
                개인정보를 법정대리인의 동의를 받아 수집·이용합니다.
              </P>
            </Section>

            <Section n="8" title="예약 변경·취소 및 환불">
              <P>
                프로그램별 취소·환불 규정은 아래와 같으며, 신청서에 별도로 고지된 규정이 있는 경우 그
                규정이 우선합니다.
              </P>
              <Table
                head={['프로그램', '취소·환불 규정']}
                rows={[
                  [
                    '코어 리셋 코칭',
                    '상담 하루 전까지 연락 주시면 예약 변경 및 100% 환불이 가능합니다. 당일 취소 및 노쇼의 경우 프로그램 준비와 예약 운영 특성상 환불이 어렵습니다.',
                  ],
                  [
                    '4주 코칭(예약제)',
                    '예약 시각 24시간 전까지는 온라인에서 직접 취소할 수 있습니다. 24시간 이내에는 온라인 취소가 어려우므로 연락처로 문의해 주세요.',
                  ],
                  [
                    '클래스 · 몸읽기 프로젝트',
                    '시작 전까지 취소하시면 100% 환불해 드립니다. 프로그램이 시작된 이후에는 자료 제공과 운영 특성상 환불이 어렵습니다.',
                  ],
                ]}
              />
              <P className="mt-3">
                회사의 사정으로 프로그램이 개설되지 않거나 중단된 경우에는 이용자가 이용하지 못한 부분에
                대해 전액 환불합니다.
              </P>
            </Section>

            <Section n="9" title="서비스의 성격과 면책">
              <Callout>
                회사가 제공하는 코칭·클래스·프로젝트는 <Strong>의료행위가 아닌 교육 및 홈케어 기반의
                프로그램</Strong>입니다. 질병의 진단·치료를 목적으로 하지 않으며, 의학적 진단이나 치료가
                필요한 경우 반드시 의료기관의 진료를 받으시기 바랍니다.
              </Callout>
              <List
                items={[
                  '아동의 상태와 발달 특성에 따라 변화의 속도와 반응에는 개인차가 있으며, 회사는 특정한 결과를 보증하지 않습니다.',
                  '프로그램의 효과는 보호자의 참여와 가정 내 반복 경험에 크게 좌우됩니다.',
                  '향(에센셜 오일 등) 사용 시 불편감이나 이상 반응이 있는 경우 즉시 사용을 중단하고 회사에 알려주셔야 합니다.',
                  '천재지변, 통신 장애 등 회사의 통제를 벗어난 사유로 서비스를 제공할 수 없는 경우 회사는 그 책임을 지지 않습니다.',
                ]}
              />
            </Section>

            <Section n="10" title="이용자의 의무">
              <List
                items={[
                  '신청 시 사실에 부합하는 정보를 제공해야 합니다. 아동의 건강 상태에 관한 정보가 사실과 다를 경우 프로그램 제공이 제한될 수 있습니다.',
                  '프로그램 진행 중 알게 된 다른 참여자의 정보를 외부에 공개해서는 안 됩니다.',
                  '회사가 제공한 자료를 무단으로 복제·배포·판매할 수 없습니다.',
                ]}
              />
            </Section>

            <Section n="11" title="지식재산권">
              <P>
                사이트에 게시된 콘텐츠와 프로그램 자료(영상·워크북·이미지 등)의 저작권은 회사에
                귀속됩니다. 이용자는 회사의 사전 동의 없이 이를 복제·전송·출판·배포하거나 제3자에게
                이용하게 할 수 없습니다.
              </P>
            </Section>

            <Section n="12" title="개인정보의 보호">
              <P>
                회사는 이용자의 개인정보를 관련 법령에 따라 보호하며, 구체적인 사항은{' '}
                <Strong>개인정보처리방침</Strong>에 따릅니다.
              </P>
            </Section>

            <Section n="13" title="분쟁의 해결">
              <P>
                서비스 이용과 관련하여 분쟁이 발생한 경우 회사와 이용자는 성실히 협의하여 해결합니다.
                협의가 이루어지지 않을 경우 「소비자기본법」에 따른 분쟁조정을 신청할 수 있으며, 소송이
                제기되는 경우 관할은 「민사소송법」에 따릅니다.
              </P>
            </Section>

            <Section n="14" title="사업자 정보">
              <Table
                head={['구분', '내용']}
                rows={[
                  ['상호', business.companyName],
                  ['대표자', business.ceo],
                  ['사업자등록번호', business.bizRegNo],
                  ['주소', business.address],
                  ['연락처', business.phone],
                  ['이메일', business.email],
                ]}
              />
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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5 text-[15px] leading-relaxed text-muted">
      {children}
    </div>
  )
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
              <th key={h} className={`px-4 py-2.5 ${i === 0 ? 'w-[8rem] sm:w-[11rem]' : ''}`}>
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

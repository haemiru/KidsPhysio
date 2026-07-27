import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check,
  Send,
  Loader2,
  PartyPopper,
  AlertCircle,
  Landmark,
  Copy,
  ShieldCheck,
  Info,
  CalendarClock,
  Package,
  RefreshCcw,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { site } from '../data/site'
import {
  coreResetMeta,
  coreResetIntro,
  coreResetSections,
  programNotice,
  programs,
  programOptions,
  scheduleInfo,
  refundPolicy,
  feeInfo,
  privacyConsent,
  privacyConsentLabel,
  type CoreResetQuestion,
} from '../data/coreReset'

type Answers = Record<string, unknown>
type Status = 'idle' | 'submitting' | 'done' | 'error'

/* 숫자만 추출해 010-XXXX-XXXX 형식으로 표시용 포매팅 */
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

/* 한글·영문·공백만 허용 (숫자·특수문자 제거) */
function sanitizeName(value: string) {
  return value.replace(/[^가-힣ㄱ-ㅎa-zA-Z\s]/g, '')
}

const NAME_IDS = ['guardian_name', 'child_name']

type ConsentKey = 'program' | 'refund' | 'fee' | 'privacy'

/** 동의 항목의 오류 키 — 같은 이름의 문항 id(program 등)와 충돌하지 않게 분리 */
const CONSENT_ERROR: Record<ConsentKey, string> = {
  program: 'program_consent',
  refund: 'refund_consent',
  fee: 'fee_consent',
  privacy: 'privacy_consent',
}

/** 마지막 글자의 받침 유무에 따라 목적격 조사(을/를)를 붙인다 */
function withParticle(word: string) {
  const last = word.trim().slice(-1)
  const code = last.charCodeAt(0)
  const isHangul = code >= 0xac00 && code <= 0xd7a3
  const hasJongseong = isHangul && (code - 0xac00) % 28 !== 0
  return `${word}${!isHangul || hasJongseong ? '을' : '를'}`
}

export default function CoreResetPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [consents, setConsents] = useState({
    program: false,
    refund: false,
    fee: false,
    privacy: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const honeypot = useRef<HTMLInputElement>(null)

  const str = (id: string) => (answers[id] as string) ?? ''
  const arr = (id: string) => (Array.isArray(answers[id]) ? (answers[id] as string[]) : [])

  const setValue = (qid: string, value: unknown) => {
    setAnswers((a) => ({ ...a, [qid]: value }))
    setErrors((e) => (e[qid] ? { ...e, [qid]: '' } : e))
  }

  const toggleMulti = (qid: string, value: string, max?: number, exclusive?: string) => {
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? (a[qid] as string[]) : []
      if (cur.includes(value)) return { ...a, [qid]: cur.filter((v) => v !== value) }
      if (exclusive && value === exclusive) return { ...a, [qid]: [value] }
      const base = exclusive ? cur.filter((v) => v !== exclusive) : cur
      if (max && base.length >= max) return a
      return { ...a, [qid]: [...base, value] }
    })
    setErrors((e) => (e[qid] ? { ...e, [qid]: '' } : e))
  }

  const setConsent = (key: ConsentKey, checked: boolean) => {
    setConsents((c) => ({ ...c, [key]: checked }))
    // 오류 키는 문항 id 와 겹치지 않도록 별도 접미사를 쓴다 (program 문항 ↔ program 동의)
    if (checked) {
      const ek = CONSENT_ERROR[key]
      setErrors((e) => (e[ek] ? { ...e, [ek]: '' } : e))
    }
  }

  /* 스키마를 훑어 required 문항을 일괄 검증한다 (문항이 늘어도 검증을 빠뜨리지 않도록) */
  const validate = () => {
    const next: Record<string, string> = {}

    for (const sec of coreResetSections) {
      for (const q of sec.questions) {
        if (!q.required) continue
        const name = withParticle(
          ('errorLabel' in q && q.errorLabel) || q.label || '이 항목',
        )
        if (q.type === 'text') {
          if (!str(q.id).trim()) next[q.id] = `${name} 입력해 주세요.`
        } else if (q.type === 'single') {
          if (!str(q.id)) next[q.id] = `${name} 선택해 주세요.`
        } else {
          const min = q.min ?? 1
          if (arr(q.id).length < min)
            next[q.id] = min > 1 ? `${min}개 이상 선택해 주세요.` : `${name} 선택해 주세요.`
        }
      }
    }

    // 형식 검증 (스키마로 표현하지 않은 규칙)
    if (str('guardian_name').trim() && str('guardian_name').trim().length < 2)
      next.guardian_name = '보호자 성함을 2자 이상 입력해 주세요.'
    if (!/^010\d{8}$/.test(str('guardian_phone').replace(/\D/g, '')))
      next.guardian_phone = '010으로 시작하는 11자리 휴대폰 번호를 입력해 주세요.'

    // 섹션 밖 문항
    if (!str('program')) next.program = '프로그램을 선택해 주세요.'
    if (arr('schedule').length < scheduleInfo.minSelect)
      next.schedule = `가능하신 일정을 ${scheduleInfo.minSelect}개 이상 선택해 주세요.`

    if (!consents.program)
      next[CONSENT_ERROR.program] = '프로그램 안내에 동의해 주셔야 신청할 수 있습니다.'
    if (!consents.refund) next[CONSENT_ERROR.refund] = '예약 및 환불 안내에 동의해 주세요.'
    if (!consents.fee) next[CONSENT_ERROR.fee] = '프로그램 비용 안내 확인에 체크해 주세요.'
    if (!consents.privacy)
      next[CONSENT_ERROR.privacy] = '개인정보 수집·이용에 동의해 주셔야 신청할 수 있습니다.'

    setErrors(next)
    return next
  }

  const scrollTargetId = (key: string) => {
    if (key === CONSENT_ERROR.program) return 'program-notice-box'
    if (key === CONSENT_ERROR.refund) return 'refund-box'
    if (key === CONSENT_ERROR.fee) return 'fee-box'
    if (key === CONSENT_ERROR.privacy) return 'privacy-box'
    if (key === 'program') return 'program-box'
    if (key === 'schedule') return 'schedule-box'
    return `q-${key}`
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return

    const found = validate()
    const firstKey = Object.keys(found)[0]
    if (firstKey) {
      document
        .getElementById(scrollTargetId(firstKey))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/core-reset-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          programConsent: consents.program,
          refundConsent: consents.refund,
          feeConsent: consents.fee,
          privacyConsent: consents.privacy,
          company: honeypot.current?.value ?? '', // 허니팟(봇 차단)
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('error')
    }
  }

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(`${feeInfo.account.bank} ${feeInfo.account.number}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* 클립보드 권한이 없으면 무시 — 계좌번호는 화면에 그대로 보입니다 */
    }
  }

  /* ── 신청 완료 화면 ── */
  if (status === 'done') {
    return (
      <>
        <PageHero
          eyebrow={coreResetMeta.eyebrow}
          title="신청이 접수되었습니다"
          crumbs={[{ label: '코어 리셋 신청서' }]}
        />
        <section className="py-16 lg:py-24">
          <div className="container-page max-w-xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <PartyPopper className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-ink">신청해 주셔서 감사합니다 💛</h2>
            <p className="mt-3 leading-relaxed text-muted">
              신청 내용이 담당자에게 전달되었습니다.
              <br />
              선택해주신 일정 중 최종 조율 후 개별 연락드리겠습니다.
              <br />
              아래 계좌로 입금해 주시면 예약이 최종 확정됩니다.
            </p>

            <AccountBox onCopy={copyAccount} copied={copied} />

            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              {feeInfo.depositNameNotice}
            </p>
            <Link to="/" className="btn btn-primary mt-8">
              홈으로 돌아가기
            </Link>
          </div>
        </section>
      </>
    )
  }

  /* ── 신청서 ── */
  return (
    <>
      <PageHero
        eyebrow={coreResetMeta.eyebrow}
        title={coreResetMeta.title}
        desc={coreResetMeta.desc}
        crumbs={[{ label: '코어 리셋 신청서' }]}
      />

      <section className="py-14 lg:py-20">
        <form onSubmit={onSubmit} className="container-page max-w-3xl space-y-8" noValidate>
          {/* 봇 차단용 허니팟 — 사용자에게 보이지 않음 */}
          <input
            ref={honeypot}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {/* 1. 안내 */}
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <Info className="h-5 w-5 text-brand-600" aria-hidden="true" />
              1. 안내
            </h2>
            <p className="mt-4 text-[15px] font-bold text-ink">{coreResetIntro.greeting}</p>
            <ul className="mt-3 space-y-3">
              {coreResetIntro.body.map((item) => (
                <li key={item.text} className="flex items-start gap-2.5">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-brand-600"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-[15px] leading-relaxed text-ink">{item.text}</p>
                    {item.sub && (
                      <p className="mt-1 text-[14px] leading-relaxed text-muted">({item.sub})</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-sand/60 px-5 py-4 text-[14px] leading-relaxed text-muted">
              ※ {coreResetIntro.notice}
            </p>
          </div>

          {/* 2 ~ 6. 문항 */}
          {coreResetSections.map((sec) => (
            <fieldset key={sec.id} className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
              <legend className="text-xl font-extrabold text-ink">{sec.title}</legend>
              {sec.description && (
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{sec.description}</p>
              )}

              <div className={sec.grid ? 'mt-6 grid gap-5 sm:grid-cols-2' : 'mt-6 space-y-8'}>
                {sec.questions.map((q) => (
                  <Question
                    key={q.id}
                    q={q}
                    answers={answers}
                    error={errors[q.id]}
                    setValue={setValue}
                    toggleMulti={toggleMulti}
                  />
                ))}
              </div>
            </fieldset>
          ))}

          {/* 7. 프로그램 안내 및 동의 */}
          <div id="program-notice-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              7. {programNotice.title}
            </h2>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand/60 p-5 text-[15px] leading-relaxed text-muted">
              {programNotice.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ConsentCheck
              checked={consents.program}
              onChange={(v) => setConsent('program', v)}
              label={programNotice.consentLabel}
              error={errors[CONSENT_ERROR.program]}
            />
          </div>

          {/* 8. 프로그램 선택 */}
          <div id="program-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <Package className="h-5 w-5 text-brand-600" aria-hidden="true" />
              8. 프로그램 선택
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{programs.intro}</p>

            <div className="mt-5 space-y-4">
              {programs.plans.map((plan) => {
                const selected = answers.program === plan.option
                return (
                  <div
                    key={plan.option}
                    className={`rounded-2xl border p-5 transition ${
                      selected ? 'border-brand-400 bg-brand-50' : 'border-brand-100 bg-brand-50/50'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-[17px] font-extrabold text-ink">
                        {plan.badge} {plan.name}
                      </h3>
                      {plan.schedule && (
                        <span className="text-sm font-semibold text-muted">📍 {plan.schedule}</span>
                      )}
                      <span className="text-lg font-extrabold text-brand-700">{plan.price}</span>
                    </div>

                    {plan.includes.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {plan.includes.map((it) => (
                          <li
                            key={it}
                            className="flex items-start gap-2 text-[15px] leading-relaxed text-ink"
                          >
                            <Check
                              className="mt-1 h-4 w-4 shrink-0 text-brand-600"
                              strokeWidth={3}
                              aria-hidden="true"
                            />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {plan.forWhom.length > 0 && (
                      <div className="mt-4 border-t border-brand-100 pt-3">
                        <p className="text-sm font-bold text-brand-700">이런 분께 권해요</p>
                        <ul className="mt-1.5 space-y-1 text-[14px] leading-relaxed text-muted">
                          {plan.forWhom.map((w) => (
                            <li key={w}>· {w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plan.note && (
                      <p className="mt-3 text-[14px] leading-relaxed text-muted">※ {plan.note}</p>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="mt-6 text-[15px] font-bold text-ink">
              신청할 프로그램
              <span className="ml-1 text-coral-600" aria-hidden="true">
                *
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {programOptions.map((opt) => (
                <Chip
                  key={opt}
                  active={answers.program === opt}
                  onClick={() => setValue('program', answers.program === opt ? '' : opt)}
                >
                  {answers.program === opt && (
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                  )}
                  {opt}
                </Chip>
              ))}
            </div>
            {errors.program && (
              <p className="mt-1.5 text-sm font-medium text-red-500">{errors.program}</p>
            )}
          </div>

          {/* 9. 상담 가능 일정 */}
          <div id="schedule-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <CalendarClock className="h-5 w-5 text-brand-600" aria-hidden="true" />
              9. 상담 가능 일정 선택
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{scheduleInfo.desc}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-muted/90">({scheduleInfo.sub})</p>

            <p className="mt-4 text-sm font-semibold text-brand-600">
              {arr('schedule').length}개 선택 · 최소 {scheduleInfo.minSelect}개
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {scheduleInfo.slots.map((slot) => (
                <Chip
                  key={slot}
                  active={arr('schedule').includes(slot)}
                  onClick={() => toggleMulti('schedule', slot)}
                >
                  {arr('schedule').includes(slot) && (
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                  )}
                  {slot}
                </Chip>
              ))}
            </div>
            {errors.schedule && (
              <p className="mt-1.5 text-sm font-medium text-red-500">{errors.schedule}</p>
            )}

            <div className="mt-6">
              <p className="text-[15px] font-bold text-ink">
                위 일정이 모두 어려우시면 희망 시간을 적어 주세요
              </p>
              <input
                type="text"
                value={str('schedule_other')}
                onChange={(e) => setValue('schedule_other', e.target.value)}
                placeholder="예) 8월 12일(수) 오후 3시"
                className="mt-2 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <ul className="mt-5 space-y-1.5 rounded-2xl bg-sand/60 p-5 text-[14px] leading-relaxed text-muted">
              {scheduleInfo.notes.map((n) => (
                <li key={n}>👉 {n}</li>
              ))}
            </ul>
          </div>

          {/* 10. 예약 및 환불 안내 */}
          <div id="refund-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <RefreshCcw className="h-5 w-5 text-brand-600" aria-hidden="true" />
              10. {refundPolicy.title}
            </h2>
            <div className="mt-5 space-y-3 rounded-2xl bg-sand/60 p-5 text-[15px] leading-relaxed text-muted">
              {refundPolicy.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ConsentCheck
              checked={consents.refund}
              onChange={(v) => setConsent('refund', v)}
              label={refundPolicy.consentLabel}
              error={errors[CONSENT_ERROR.refund]}
            />
          </div>

          {/* 11. 프로그램 비용 및 입금 안내 */}
          <div id="fee-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <Landmark className="h-5 w-5 text-brand-600" aria-hidden="true" />
              11. 프로그램 비용 및 입금 안내
            </h2>

            <dl className="mt-5 grid gap-3 rounded-2xl bg-sand/60 p-5 sm:grid-cols-2">
              {feeInfo.prices.map((p) => (
                <div key={p.name}>
                  <dt className="text-sm font-bold text-brand-700">{p.name}</dt>
                  <dd className="mt-1 text-[17px] font-extrabold text-ink">{p.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">※ {feeInfo.extra}</p>

            <AccountBox onCopy={copyAccount} copied={copied} />

            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              {feeInfo.afterDeposit} {feeInfo.depositNameNotice}
            </p>

            <ConsentCheck
              checked={consents.fee}
              onChange={(v) => setConsent('fee', v)}
              label={feeInfo.consentLabel}
              error={errors[CONSENT_ERROR.fee]}
            />
          </div>

          {/* 12. 개인정보 동의 */}
          <div id="privacy-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              12. 개인정보 동의
            </h2>

            <div className="mt-5 rounded-2xl bg-sand/60 p-5">
              <h3 className="text-[15px] font-extrabold text-ink">{privacyConsent.title}</h3>
              <dl className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-muted">
                {privacyConsent.items.map((it) => (
                  <div key={it.label} className="sm:flex sm:gap-3">
                    <dt className="shrink-0 font-bold text-ink/80 sm:w-24">{it.label}</dt>
                    <dd>{it.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[13px] leading-relaxed text-muted/90">
                ※ {privacyConsent.notice}
              </p>
            </div>
            <ConsentCheck
              checked={consents.privacy}
              onChange={(v) => setConsent('privacy', v)}
              label={privacyConsentLabel}
              error={errors[CONSENT_ERROR.privacy]}
            />
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-[15px] text-coral-600">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 계속 실패하면 {site.phone}
                로 알려주세요.
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  신청 중…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" aria-hidden="true" />
                  코어 리셋 코칭 신청하기
                </>
              )}
            </button>
            <p className="text-sm text-muted">입금이 확인되면 예약이 최종 확정됩니다.</p>
          </div>
        </form>
      </section>
    </>
  )
}

/* ─────────────────────────── 공통 조각 ─────────────────────────── */

function ConsentCheck({
  checked,
  onChange,
  label,
  error,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  error?: string
}) {
  return (
    <>
      <label className="mt-4 flex items-start gap-2.5 text-[15px] text-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--color-brand-500)]"
        />
        <span>
          {label} <span className="text-coral-600">(필수)</span>
        </span>
      </label>
      {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
    </>
  )
}

function AccountBox({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 text-left">
      <p className="text-sm font-bold text-brand-700">입금 계좌</p>
      <p className="mt-1.5 text-lg font-extrabold text-ink">
        {feeInfo.account.bank} {feeInfo.account.number}
      </p>
      <p className="mt-0.5 text-[15px] font-semibold text-muted">
        예금주 {feeInfo.account.holder}
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> 복사됨
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" aria-hidden="true" /> 계좌번호 복사
          </>
        )}
      </button>
    </div>
  )
}

/* ─────────────────────────── 문항 렌더러 ─────────────────────────── */

type QProps = {
  q: CoreResetQuestion
  answers: Answers
  error?: string
  setValue: (qid: string, value: unknown) => void
  toggleMulti: (qid: string, value: string, max?: number, exclusive?: string) => void
}

function Question({ q, answers, error, setValue, toggleMulti }: QProps) {
  const otherId = `${q.id}_other`
  const otherValue = (answers[otherId] as string) ?? ''

  return (
    <div id={`q-${q.id}`}>
      {'label' in q && q.label && (
        <p className="text-[15px] font-bold text-ink">
          {q.label}
          {'required' in q && q.required && (
            <span className="ml-1 text-coral-600" aria-hidden="true">
              *
            </span>
          )}
        </p>
      )}

      {q.type === 'text' &&
        (q.multiline ? (
          <textarea
            value={(answers[q.id] as string) ?? ''}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            rows={3}
            className={`${q.label ? 'mt-3' : ''} w-full resize-y rounded-2xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:ring-2 ${
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-brand-100 focus:border-brand-400 focus:ring-brand-100'
            }`}
          />
        ) : (
          <input
            type={q.inputType ?? 'text'}
            inputMode={q.inputType === 'tel' ? 'numeric' : undefined}
            autoComplete={q.inputType === 'tel' ? 'tel' : undefined}
            maxLength={q.inputType === 'tel' ? 13 : undefined}
            value={(answers[q.id] as string) ?? ''}
            onChange={(e) => {
              const v = e.target.value
              setValue(
                q.id,
                NAME_IDS.includes(q.id)
                  ? sanitizeName(v)
                  : q.inputType === 'tel'
                    ? formatPhone(v)
                    : v,
              )
            }}
            placeholder={q.placeholder}
            aria-invalid={error ? true : undefined}
            className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:ring-2 ${
              error
                ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                : 'border-brand-100 focus:border-brand-400 focus:ring-brand-100'
            }`}
          />
        ))}

      {q.type === 'text' && q.examples && (
        <div className="mt-3 rounded-2xl bg-sand/60 px-4 py-3">
          <p className="text-[13px] font-bold text-muted">예)</p>
          <ul className="mt-1.5 space-y-1 text-[14px] leading-relaxed text-muted">
            {q.examples.map((ex) => (
              <li key={ex}>· {ex}</li>
            ))}
          </ul>
        </div>
      )}

      {q.type === 'single' && (
        <>
          <div className={`${q.label ? 'mt-3' : ''} flex flex-wrap gap-2`}>
            {q.options.map((opt) => (
              <Chip
                key={opt}
                active={answers[q.id] === opt}
                onClick={() => setValue(q.id, answers[q.id] === opt ? '' : opt)}
              >
                {opt}
              </Chip>
            ))}
          </div>
          {q.otherOption && answers[q.id] === q.otherOption && (
            <OtherInput value={otherValue} onChange={(v) => setValue(otherId, v)} />
          )}
        </>
      )}

      {q.type === 'multi' &&
        (() => {
          const cur = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : []
          const atMax = q.max ? cur.length >= q.max : false
          return (
            <>
              {q.max && (
                <p className="mt-1 text-sm font-semibold text-brand-600">
                  {cur.length}/{q.max} 선택
                </p>
              )}
              <div className={`${q.label ? 'mt-3' : ''} flex flex-wrap gap-2`}>
                {q.options.map((opt) => {
                  const active = cur.includes(opt)
                  return (
                    <Chip
                      key={opt}
                      active={active}
                      disabled={!active && atMax && opt !== q.exclusiveOption}
                      onClick={() => toggleMulti(q.id, opt, q.max, q.exclusiveOption)}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
                      {opt}
                    </Chip>
                  )
                })}
              </div>
              {q.otherOption && cur.includes(q.otherOption) && (
                <OtherInput value={otherValue} onChange={(v) => setValue(otherId, v)} />
              )}
            </>
          )
        })()}

      {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}

      {'help' in q && q.help && (
        <p className="mt-3 text-sm leading-relaxed text-muted/90">💡 {q.help}</p>
      )}
    </div>
  )
}

function OtherInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="기타 내용을 직접 적어 주세요."
      className="mt-3 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
    />
  )
}

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[15px] font-semibold transition ${
        active
          ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
          : disabled
            ? 'cursor-not-allowed border-brand-50 bg-white text-ink/30'
            : 'border-brand-100 bg-white text-ink/80 hover:border-brand-300 hover:bg-brand-50'
      }`}
    >
      {children}
    </button>
  )
}

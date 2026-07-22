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
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { site } from '../data/site'
import {
  classMeta,
  classAccount,
  classSections,
  privacyConsent,
  marketingConsent,
  type ClassQuestion,
} from '../data/classApply'

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ClassApplyPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [privacyOk, setPrivacyOk] = useState(false)
  const [marketingOk, setMarketingOk] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const honeypot = useRef<HTMLInputElement>(null)

  const str = (id: string) => (answers[id] as string) ?? ''

  const setValue = (qid: string, value: unknown) => {
    setAnswers((a) => ({ ...a, [qid]: value }))
    setErrors((e) => (e[qid] ? { ...e, [qid]: '' } : e))
  }

  const toggleMulti = (qid: string, value: string, max?: number) =>
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? (a[qid] as string[]) : []
      if (cur.includes(value)) return { ...a, [qid]: cur.filter((v) => v !== value) }
      if (max && cur.length >= max) return a
      return { ...a, [qid]: [...cur, value] }
    })

  const validate = () => {
    const next: Record<string, string> = {}
    if (str('name').trim().length < 2) next.name = '성함을 2자 이상 입력해 주세요.'
    if (!/^010\d{8}$/.test(str('phone').replace(/\D/g, '')))
      next.phone = '010으로 시작하는 11자리 휴대폰 번호를 입력해 주세요.'
    if (!EMAIL_RE.test(str('email').trim())) next.email = '이메일 주소를 정확히 입력해 주세요.'
    if (!str('region').trim()) next.region = '거주지역을 입력해 주세요.'
    if (!privacyOk) next.privacy = '개인정보 수집·이용에 동의해 주셔야 신청할 수 있습니다.'
    setErrors(next)
    return next
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return

    const found = validate()
    const firstKey = Object.keys(found)[0]
    if (firstKey) {
      document
        .getElementById(firstKey === 'privacy' ? 'consent-box' : `q-${firstKey}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch('/api/class-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          privacyConsent: privacyOk,
          marketingConsent: marketingOk,
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
      await navigator.clipboard.writeText(`${classAccount.bank} ${classAccount.number}`)
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
          eyebrow={classMeta.eyebrow}
          title="신청이 접수되었습니다"
          crumbs={[{ label: '클래스 신청' }]}
        />
        <section className="py-16 lg:py-24">
          <div className="container-page max-w-xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <PartyPopper className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-ink">신청해 주셔서 감사합니다 💛</h2>
            <p className="mt-3 leading-relaxed text-muted">
              적어주신 연락처로 일정과 장소를 안내해 드리겠습니다.
              <br />
              아래 계좌로 수강료를 입금해 주시면 신청이 확정됩니다.
            </p>

            <AccountBox onCopy={copyAccount} copied={copied} />

            <p className="mt-6 text-sm text-muted">
              문의:{' '}
              <a href={site.phoneHref} className="font-bold text-brand-700 hover:underline">
                {site.phone}
              </a>
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
        eyebrow={classMeta.eyebrow}
        title={classMeta.title}
        desc={classMeta.desc}
        crumbs={[{ label: '클래스 신청' }]}
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

          {classSections.map((sec) => (
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

          {/* 수강료 입금 안내 */}
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <Landmark className="h-5 w-5 text-brand-600" aria-hidden="true" />
              수강료 입금 안내
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              신청서를 제출하신 뒤 아래 계좌로 입금해 주시면 신청이 확정됩니다. 입금자명은 신청자
              성함과 같게 해 주세요.
            </p>
            <AccountBox onCopy={copyAccount} copied={copied} />
          </div>

          {/* 개인정보 활용 동의 */}
          <div id="consent-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              개인정보 활용 동의
            </h2>

            {/* 필수 동의 */}
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
            <label className="mt-3 flex items-start gap-2.5 text-[15px] text-ink">
              <input
                type="checkbox"
                checked={privacyOk}
                onChange={(e) => {
                  setPrivacyOk(e.target.checked)
                  if (e.target.checked) setErrors((x) => ({ ...x, privacy: '' }))
                }}
                className="mt-1 h-4 w-4 accent-[var(--color-brand-500)]"
              />
              <span>
                위 개인정보 수집·이용에 동의합니다. <span className="text-coral-600">(필수)</span>
              </span>
            </label>
            {errors.privacy && (
              <p className="mt-1.5 text-sm font-medium text-red-500">{errors.privacy}</p>
            )}

            {/* 선택 동의 */}
            <div className="mt-6 rounded-2xl bg-sand/60 p-5">
              <h3 className="text-[15px] font-extrabold text-ink">{marketingConsent.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{marketingConsent.body}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted/90">
                ※ {marketingConsent.notice}
              </p>
            </div>
            <label className="mt-3 flex items-start gap-2.5 text-[15px] text-ink">
              <input
                type="checkbox"
                checked={marketingOk}
                onChange={(e) => setMarketingOk(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[var(--color-brand-500)]"
              />
              <span>
                마케팅·홍보 활용에 동의합니다. <span className="text-muted">(선택)</span>
              </span>
            </label>
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
                  클래스 신청하기
                </>
              )}
            </button>
            <p className="text-sm text-muted">
              제출 후 담당자가 확인하여 안내 문자를 보내드립니다.
            </p>
          </div>
        </form>
      </section>
    </>
  )
}

/* ─────────────────────────── 입금 계좌 박스 ─────────────────────────── */

function AccountBox({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
  return (
    <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 text-left">
      <p className="text-sm font-bold text-brand-700">입금 계좌</p>
      <p className="mt-1.5 text-lg font-extrabold text-ink">
        {classAccount.bank} {classAccount.number}
      </p>
      <p className="mt-0.5 text-[15px] font-semibold text-muted">예금주 {classAccount.holder}</p>
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
  q: ClassQuestion
  answers: Answers
  error?: string
  setValue: (qid: string, value: unknown) => void
  toggleMulti: (qid: string, value: string, max?: number) => void
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
            className={`${q.label ? 'mt-3' : ''} w-full resize-y rounded-2xl border border-brand-100 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100`}
          />
        ) : (
          <input
            type={q.inputType ?? 'text'}
            inputMode={q.inputType === 'tel' ? 'numeric' : undefined}
            autoComplete={
              q.inputType === 'tel' ? 'tel' : q.inputType === 'email' ? 'email' : undefined
            }
            maxLength={q.inputType === 'tel' ? 13 : undefined}
            value={(answers[q.id] as string) ?? ''}
            onChange={(e) => {
              const v = e.target.value
              setValue(
                q.id,
                q.id === 'name'
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
            <OtherInput
              value={otherValue}
              onChange={(v) => setValue(otherId, v)}
            />
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
                      disabled={!active && atMax}
                      onClick={() => toggleMulti(q.id, opt, q.max)}
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

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
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { site } from '../data/site'
import {
  projectMeta,
  projectInfo,
  projectFee,
  projectAccount,
  projectSections,
  privacyConsent,
  consentLabel,
  type ProjectQuestion,
} from '../data/bodyProject'

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

export default function ProjectApplyPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [privacyOk, setPrivacyOk] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const honeypot = useRef<HTMLInputElement>(null)

  const str = (id: string) => (answers[id] as string) ?? ''

  const setValue = (qid: string, value: unknown) => {
    setAnswers((a) => ({ ...a, [qid]: value }))
    setErrors((e) => (e[qid] ? { ...e, [qid]: '' } : e))
  }

  const toggleMulti = (qid: string, value: string, max?: number, exclusive?: string) =>
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? (a[qid] as string[]) : []
      if (cur.includes(value)) return { ...a, [qid]: cur.filter((v) => v !== value) }
      // '아직 결정하지 못했습니다.'처럼 단독으로만 고를 수 있는 보기 처리
      if (exclusive && value === exclusive) return { ...a, [qid]: [value] }
      const base = exclusive ? cur.filter((v) => v !== exclusive) : cur
      if (max && base.length >= max) return a
      return { ...a, [qid]: [...base, value] }
    })

  const validate = () => {
    const next: Record<string, string> = {}
    if (str('guardian_name').trim().length < 2) next.guardian_name = '보호자 성함을 2자 이상 입력해 주세요.'
    if (!/^010\d{8}$/.test(str('guardian_phone').replace(/\D/g, '')))
      next.guardian_phone = '010으로 시작하는 11자리 휴대폰 번호를 입력해 주세요.'
    if (!str('kakao_nickname').trim()) next.kakao_nickname = '카카오톡 닉네임을 입력해 주세요.'
    if (!str('child_name').trim()) next.child_name = '아이 이름을 입력해 주세요.'
    if (!str('child_age')) next.child_age = '아이 나이를 선택해 주세요.'
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
      const res = await fetch('/api/project-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          privacyConsent: privacyOk,
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
      await navigator.clipboard.writeText(`${projectAccount.bank} ${projectAccount.number}`)
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
          eyebrow={projectMeta.eyebrow}
          title="신청이 접수되었습니다"
          crumbs={[{ label: '4주 몸읽기 프로젝트' }]}
        />
        <section className="py-16 lg:py-24">
          <div className="container-page max-w-xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <PartyPopper className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-ink">신청해 주셔서 감사합니다 💛</h2>
            <p className="mt-3 leading-relaxed text-muted">
              아래 계좌로 참가비를 입금해 주시면 신청이 완료됩니다.
              <br />
              입금이 확인되면 적어주신 연락처로 카카오톡 단톡방 초대를 안내해 드립니다.
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
        eyebrow={projectMeta.eyebrow}
        title={projectMeta.title}
        desc={projectMeta.desc}
        crumbs={[{ label: '4주 몸읽기 프로젝트' }]}
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
            <p className="mt-4 text-[15px] font-bold leading-relaxed text-ink">
              {projectInfo.greeting}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{projectInfo.body}</p>

            <dl className="mt-5 grid gap-3 rounded-2xl bg-sand/60 p-5 sm:grid-cols-3">
              {projectInfo.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm font-bold text-brand-700">{f.label}</dt>
                  <dd className="mt-1 text-[15px] font-semibold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
              <p className="text-sm font-bold text-brand-700">{projectInfo.providesLabel}</p>
              <ul className="mt-2.5 space-y-2">
                {projectInfo.provides.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[15px] leading-relaxed text-ink">
                    <Check
                      className="mt-1 h-4 w-4 shrink-0 text-brand-600"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2 ~ 8. 문항 */}
          {projectSections.map((sec) => (
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

          {/* 9. 참가비 안내 */}
          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <Landmark className="h-5 w-5 text-brand-600" aria-hidden="true" />
              9. 참가비 안내
            </h2>
            <p className="mt-4 text-[15px] text-muted">
              참가비 <span className="text-lg font-extrabold text-ink">{projectFee.amount}</span>
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              신청서를 제출하신 뒤 아래 계좌로 입금해 주세요. 입금자명은 보호자 성함과 같게 해
              주시면 확인이 빠릅니다.
            </p>
            <AccountBox onCopy={copyAccount} copied={copied} />
            <p className="mt-3 text-[14px] font-semibold text-brand-700">※ {projectFee.notice}</p>
          </div>

          {/* 10. 개인정보 동의 */}
          <div id="consent-box" className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
              <ShieldCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
              10. 개인정보 동의
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
                {consentLabel} <span className="text-coral-600">(필수)</span>
              </span>
            </label>
            {errors.privacy && (
              <p className="mt-1.5 text-sm font-medium text-red-500">{errors.privacy}</p>
            )}
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
                  프로젝트 신청하기
                </>
              )}
            </button>
            <p className="text-sm text-muted">참가비 입금이 확인되면 신청이 완료됩니다.</p>
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
        {projectAccount.bank} {projectAccount.number}
      </p>
      <p className="mt-0.5 text-[15px] font-semibold text-muted">예금주 {projectAccount.holder}</p>
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
  q: ProjectQuestion
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
            className={`${q.label ? 'mt-3' : ''} w-full resize-y rounded-2xl border border-brand-100 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100`}
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
                q.id === 'guardian_name'
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

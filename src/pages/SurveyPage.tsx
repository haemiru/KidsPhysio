import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Send, Loader2, PartyPopper, AlertCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import {
  surveyMeta,
  surveySections,
  type SurveyQuestion,
} from '../data/survey'

type Answers = Record<string, unknown>
type Status = 'idle' | 'submitting' | 'done' | 'error'

export default function SurveyPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [status, setStatus] = useState<Status>('idle')

  const setValue = (qid: string, value: unknown) =>
    setAnswers((a) => ({ ...a, [qid]: value }))

  const toggleMulti = (qid: string, value: string, max?: number) =>
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? (a[qid] as string[]) : []
      if (cur.includes(value)) return { ...a, [qid]: cur.filter((v) => v !== value) }
      if (max && cur.length >= max) return a
      return { ...a, [qid]: [...cur, value] }
    })

  const setLikert = (qid: string, stmtId: string, value: number) =>
    setAnswers((a) => ({
      ...a,
      [qid]: { ...((a[qid] as Record<string, number>) ?? {}), [stmtId]: value },
    }))

  const hasAnyAnswer = Object.values(answers).some((v) =>
    Array.isArray(v)
      ? v.length > 0
      : v != null && v !== '' && !(typeof v === 'object' && Object.keys(v as object).length === 0),
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasAnyAnswer || status === 'submitting') return
    setStatus('submitting')
    try {
      const res = await fetch('/api/survey-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <>
        <PageHero
          eyebrow={surveyMeta.eyebrow}
          title="설문이 제출되었습니다"
          crumbs={[{ label: '설문' }]}
        />
        <section className="py-20 lg:py-28">
          <div className="container-page max-w-xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <PartyPopper className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold text-ink">소중한 응답 감사합니다 💛</h2>
            <p className="mt-3 leading-relaxed text-muted">
              보내주신 이야기는 아이들의 변화를 이해하고 브레인센트 앱을 만드는 데 소중히 쓰겠습니다.
            </p>
            <Link to="/" className="btn btn-primary mt-8">
              홈으로 돌아가기
            </Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow={surveyMeta.eyebrow}
        title={surveyMeta.title}
        desc={surveyMeta.desc}
        crumbs={[{ label: '설문' }]}
      />

      <section className="py-14 lg:py-20">
        <form onSubmit={onSubmit} className="container-page max-w-3xl space-y-8">
          {surveySections.map((sec) => (
            <fieldset
              key={sec.id}
              className="rounded-3xl bg-white p-6 shadow-card sm:p-8"
            >
              <legend className="text-xl font-extrabold text-ink">{sec.title}</legend>
              {sec.description && (
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{sec.description}</p>
              )}

              <div className="mt-6 space-y-8">
                {sec.questions.map((q) => (
                  <Question
                    key={q.id}
                    q={q}
                    answers={answers}
                    setValue={setValue}
                    toggleMulti={toggleMulti}
                    setLikert={setLikert}
                  />
                ))}
              </div>
            </fieldset>
          ))}

          {status === 'error' && (
            <div className="flex items-start gap-3 rounded-2xl border border-coral-200 bg-coral-50 p-4 text-[15px] text-coral-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요. 계속 실패하면 010-5686-4182로 알려주세요.
              </span>
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <button
              type="submit"
              disabled={!hasAnyAnswer || status === 'submitting'}
              className="btn btn-primary w-full text-base disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  제출 중…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" aria-hidden="true" />
                  설문 제출하기
                </>
              )}
            </button>
            <p className="text-sm text-muted">익명으로 제출됩니다. 편하게 답해 주세요.</p>
          </div>
        </form>
      </section>
    </>
  )
}

/* ─────────────────────────── 문항 렌더러 ─────────────────────────── */

type QProps = {
  q: SurveyQuestion
  answers: Answers
  setValue: (qid: string, value: unknown) => void
  toggleMulti: (qid: string, value: string, max?: number) => void
  setLikert: (qid: string, stmtId: string, value: number) => void
}

function Question({ q, answers, setValue, toggleMulti, setLikert }: QProps) {
  return (
    <div>
      {'label' in q && q.label && (
        <p className="text-[15px] font-bold text-ink">{q.label}</p>
      )}

      {q.type === 'single' && (
        <div className="mt-3 flex flex-wrap gap-2">
          {q.options.map((opt) => {
            const active = answers[q.id] === opt
            return (
              <Chip key={opt} active={active} onClick={() => setValue(q.id, opt)}>
                {opt}
              </Chip>
            )
          })}
        </div>
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
              <div className="mt-3 flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const active = cur.includes(opt)
                  const disabled = !active && atMax
                  return (
                    <Chip
                      key={opt}
                      active={active}
                      disabled={disabled}
                      onClick={() => toggleMulti(q.id, opt, q.max)}
                    >
                      {active && <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
                      {opt}
                    </Chip>
                  )
                })}
              </div>
            </>
          )
        })()}

      {q.type === 'likert' && (
        <div className="space-y-4">
          {q.statements.map((s) => {
            const val = (answers[q.id] as Record<string, number> | undefined)?.[s.id]
            return (
              <div key={s.id} className="rounded-2xl bg-sand/50 p-4">
                <p className="text-[15px] font-semibold text-ink">{s.text}</p>
                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {q.scale.map((label, i) => {
                    const score = i + 1
                    const active = val === score
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setLikert(q.id, s.id, score)}
                        className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-center transition ${
                          active
                            ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                            : 'border-brand-100 bg-white text-ink/70 hover:border-brand-300'
                        }`}
                      >
                        <span className="text-base font-extrabold">{score}</span>
                        <span className="text-[11px] leading-tight">{label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {q.type === 'nps' && (
        <div className="mt-3">
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
            {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.min + i).map((n) => {
              const active = answers[q.id] === n
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setValue(q.id, n)}
                  className={`rounded-xl border py-2.5 text-[15px] font-extrabold transition ${
                    active
                      ? 'border-brand-500 bg-brand-500 text-white shadow-soft'
                      : 'border-brand-100 bg-white text-ink/70 hover:border-brand-300'
                  }`}
                >
                  {n}
                </button>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between text-xs font-medium text-muted">
            <span>{q.minLabel}</span>
            <span>{q.maxLabel}</span>
          </div>
        </div>
      )}

      {q.type === 'text' &&
        (q.multiline ? (
          <textarea
            value={(answers[q.id] as string) ?? ''}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            rows={3}
            className="mt-3 w-full resize-y rounded-2xl border border-brand-100 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        ) : (
          <input
            type="text"
            value={(answers[q.id] as string) ?? ''}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            className="mt-3 w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        ))}

      {'help' in q && q.help && (
        <p className="mt-3 text-sm leading-relaxed text-muted/90">💡 {q.help}</p>
      )}
    </div>
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

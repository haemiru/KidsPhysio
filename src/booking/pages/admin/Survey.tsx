import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { surveyMeta, surveySections, type SurveyQuestion } from '../../../data/survey'

/**
 * 설문 응답 열람 (읽기 전용).
 * rf_survey_responses 는 RLS 로 rf_is_admin() 화이트리스트에게만 select 가 열려 있다
 * (supabase/migrations/0010_admin_read_survey.sql).
 *
 * 문항 라벨은 src/data/survey.ts 를 그대로 읽는다 — 설문 문항을 고치면 여기도 같이 따라온다.
 */

interface Row {
  id: string
  created_at: string
  survey_key: string
  child_age: string | null
  diagnosis: string | null
  nps: number | null
  app_intent: string | null
  marketing_consent: boolean | null
  answers: Record<string, unknown>
}

/** 헤더 행과 데이터 행이 공유하는 열 정의 */
const COLS = 'grid grid-cols-[10rem_7rem_9rem_4rem_10rem_5rem_3rem]'

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

/** 응답 값을 사람이 읽는 문자열로 */
function renderValue(q: SurveyQuestion, raw: unknown): string {
  if (raw == null || raw === '') return '—'
  if (Array.isArray(raw)) return raw.length ? raw.join(', ') : '—'
  if (q.type === 'nps') return `${raw} / 10`
  return String(raw)
}

/** 리커트 응답 { statementId: 1~5 } 를 문항별로 펼친다 */
function likertRows(q: Extract<SurveyQuestion, { type: 'likert' }>, raw: unknown) {
  const obj = (raw ?? {}) as Record<string, number>
  return q.statements.map((s) => {
    const score = obj[s.id]
    return {
      text: s.text,
      score,
      label: score ? (q.scale[score - 1] ?? String(score)) : null,
    }
  })
}

/** CSV 셀 이스케이프 */
const csvCell = (v: unknown) => {
  const s = v == null ? '' : Array.isArray(v) ? v.join(' | ') : typeof v === 'object' ? JSON.stringify(v) : String(v)
  return `"${s.replace(/"/g, '""')}"`
}

export default function Survey() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { data, error } = await supabase
        .from('rf_survey_responses')
        .select('id, created_at, survey_key, child_age, diagnosis, nps, app_intent, marketing_consent, answers')
        .order('created_at', { ascending: false })
        .limit(500)
      if (!alive) return
      if (error) setError(error.message)
      else setRows((data ?? []) as Row[])
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [])

  const stats = useMemo(() => {
    const nps = rows.map((r) => r.nps).filter((n): n is number => n != null)
    return {
      total: rows.length,
      npsAvg: nps.length ? (nps.reduce((a, b) => a + b, 0) / nps.length).toFixed(1) : '—',
      promoters: nps.filter((n) => n >= 9).length,
      marketing: rows.filter((r) => r.marketing_consent).length,
    }
  }, [rows])

  /** 문항 순서대로 CSV — 열 = 문항, 행 = 응답 */
  const downloadCsv = () => {
    const cols: { key: string; label: string }[] = [{ key: '_at', label: '작성시각' }]
    for (const sec of surveySections) {
      for (const q of sec.questions) {
        if (q.type === 'likert') {
          for (const s of q.statements) cols.push({ key: `${q.id}.${s.id}`, label: s.text })
        } else {
          cols.push({ key: q.id, label: q.label ?? q.id })
        }
      }
    }

    const lines = [cols.map((c) => csvCell(c.label)).join(',')]
    for (const r of rows) {
      lines.push(
        cols
          .map((c) => {
            if (c.key === '_at') return csvCell(fmt(r.created_at))
            const [head, sub] = c.key.split('.')
            const v = r.answers?.[head]
            return csvCell(sub ? (v as Record<string, unknown>)?.[sub] : v)
          })
          .join(','),
      )
    }

    // BOM 을 붙여야 엑셀에서 한글이 깨지지 않는다
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `설문응답_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <p className="py-10 text-center text-muted">불러오는 중…</p>

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        <p className="font-bold">응답을 불러오지 못했습니다.</p>
        <p className="mt-1">{error}</p>
        <p className="mt-2 text-red-600/80">
          `supabase/migrations/0010_admin_read_survey.sql` 을 Supabase SQL Editor 에서 실행했는지
          확인해 주세요. (관리자 조회 권한 정책)
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-ink">설문 응답</h1>
          <p className="mt-0.5 text-sm text-muted">{surveyMeta.title} · 익명 설문</p>
        </div>
        <button
          onClick={downloadCsv}
          disabled={!rows.length}
          className="rounded-lg border border-black/10 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-40"
        >
          CSV 내려받기
        </button>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="총 응답" value={`${stats.total}건`} />
        <Stat label="NPS 평균" value={stats.npsAvg} />
        <Stat label="추천 고객(9~10점)" value={`${stats.promoters}명`} />
        <Stat label="마케팅 동의" value={`${stats.marketing}명`} />
      </div>

      {!rows.length ? (
        <div className="rounded-xl border border-black/5 bg-white px-5 py-12 text-center">
          <p className="text-muted">아직 응답이 없습니다.</p>
          {/* RLS 로 막히면 에러가 아니라 빈 배열이 온다 — '응답 없음'과 구분되지 않으므로 함께 안내한다 */}
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted/80">
            응답이 있는데도 비어 보인다면 조회 권한 정책이 아직 적용되지 않은 것입니다.
            <br />
            <code className="rounded bg-black/5 px-1.5 py-0.5">
              supabase/migrations/0010_admin_read_survey.sql
            </code>
            을 Supabase SQL Editor 에서 실행해 주세요.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
          <div className="overflow-x-auto">
            {/* 헤더와 각 행이 같은 grid 템플릿을 쓴다 — table 로 하면 확장 행(colSpan) 때문에 열이 어긋난다 */}
            <div className="min-w-[46rem]">
              <div
                className={`${COLS} bg-black/[0.03] text-xs font-bold text-muted`}
                role="row"
                aria-hidden="true"
              >
                <span className="px-4 py-3">작성시각</span>
                <span className="px-4 py-3">아이 연령</span>
                <span className="px-4 py-3">진단</span>
                <span className="px-4 py-3">NPS</span>
                <span className="px-4 py-3">앱 사용 의향</span>
                <span className="px-4 py-3">마케팅</span>
                <span className="px-4 py-3" />
              </div>

              {rows.map((r) => {
                const open = openId === r.id
                return (
                  <div key={r.id} className="border-t border-black/5">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : r.id)}
                      aria-expanded={open}
                      className={`${COLS} w-full items-center text-left text-sm transition hover:bg-black/[0.02] ${
                        open ? 'bg-black/[0.02]' : ''
                      }`}
                    >
                      <span className="px-4 py-3 text-muted">{fmt(r.created_at)}</span>
                      <span className="px-4 py-3">{r.child_age ?? '—'}</span>
                      <span className="px-4 py-3">{r.diagnosis ?? '—'}</span>
                      <span className="px-4 py-3 font-bold">{r.nps ?? '—'}</span>
                      <span className="px-4 py-3">{r.app_intent ?? '—'}</span>
                      <span className="px-4 py-3">{r.marketing_consent ? 'O' : 'X'}</span>
                      <span className="px-4 py-3 text-muted">{open ? '▲' : '▼'}</span>
                    </button>

                    {open && (
                      <div className="border-t border-black/5 bg-[#faf9fc] px-4 py-5 sm:px-6">
                        {surveySections.map((sec) => (
                          <section key={sec.id} className="mb-5 last:mb-0">
                            <h3 className="text-[13px] font-extrabold text-primary-dark">
                              {sec.title}
                            </h3>
                            <dl className="mt-2 space-y-2.5">
                              {sec.questions.map((q) =>
                                q.type === 'likert' ? (
                                  <div key={q.id}>
                                    {likertRows(q, r.answers?.[q.id]).map((s) => (
                                      <div key={s.text} className="flex flex-wrap gap-x-2 py-0.5">
                                        <dt className="text-[13px] text-muted">{s.text}</dt>
                                        <dd className="text-[13px] font-semibold text-ink">
                                          {s.score ? `${s.score}점 (${s.label})` : '—'}
                                        </dd>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div key={q.id}>
                                    <dt className="text-[13px] text-muted">{q.label ?? q.id}</dt>
                                    <dd className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink">
                                      {renderValue(q, r.answers?.[q.id])}
                                    </dd>
                                  </div>
                                ),
                              )}
                            </dl>
                          </section>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white px-4 py-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 text-xl font-extrabold text-ink">{value}</p>
    </div>
  )
}

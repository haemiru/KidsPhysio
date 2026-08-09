import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { classSections } from '../../../data/classApply'
import { projectSections } from '../../../data/bodyProject'
import { coreResetSections } from '../../../data/coreReset'

/**
 * 신청 내역 열람 (읽기 전용) — 상담·클래스·몸읽기·코어리셋 4종.
 * 각 테이블은 RLS 로 rf_is_admin() 화이트리스트에게만 select 가 열려 있다
 * (supabase/migrations/0011_admin_read_applications.sql).
 *
 * 상세 문항 라벨은 각 폼의 데이터 스키마(src/data/*.ts)를 그대로 읽는다 —
 * 신청서 문항을 고치면 이 화면과 CSV 열이 함께 따라온다.
 */

/* 세 폼의 문항 타입이 조금씩 다르므로 공통으로 좁혀서 다룬다 */
type AnyQuestion = { id: string; type: string; label?: string }
type AnySection = { id: string; title: string; questions: readonly AnyQuestion[] }

type Column = { key: string; label: string; width: string }

type FormConfig = {
  key: string
  label: string
  table: string
  /** 목록에 보여줄 컬럼 (테이블 컬럼명 기준) */
  columns: Column[]
  /** 상세 보기를 만들 문항 스키마. 없으면 columns + extra 만 보여준다 */
  sections?: AnySection[]
  /** 스키마 바깥에 있는 추가 문항 (answers 안에 들어는 있음) */
  extra?: { id: string; label: string }[]
  /** 스키마가 없는 폼(상담)에서 본문으로 크게 보여줄 컬럼 */
  body?: { key: string; label: string }[]
}

const FORMS: FormConfig[] = [
  {
    key: 'consultations',
    label: '브레인 코칭 문의',
    table: 'rf_consultations',
    columns: [
      { key: 'guardian_name', label: '보호자', width: '7rem' },
      { key: 'guardian_phone', label: '연락처', width: '9.5rem' },
      { key: 'child_age', label: '아이 나이', width: '8rem' },
      { key: 'status', label: '상태', width: '6rem' },
    ],
    body: [{ key: 'message', label: '상담 내용' }],
  },
  {
    key: 'class',
    label: '클래스 신청',
    table: 'rf_class_applications',
    columns: [
      { key: 'applicant_name', label: '성함', width: '7rem' },
      { key: 'applicant_phone', label: '연락처', width: '9.5rem' },
      { key: 'email', label: '이메일', width: '12rem' },
      { key: 'region', label: '지역', width: '7rem' },
      { key: 'status', label: '상태', width: '6rem' },
    ],
    sections: classSections as unknown as AnySection[],
  },
  {
    key: 'project',
    label: '몸읽기 프로젝트',
    table: 'rf_project_applications',
    columns: [
      { key: 'guardian_name', label: '보호자', width: '7rem' },
      { key: 'guardian_phone', label: '연락처', width: '9.5rem' },
      { key: 'kakao_nickname', label: '카톡 닉네임', width: '9rem' },
      { key: 'child_name', label: '아이', width: '7rem' },
      { key: 'child_age', label: '나이', width: '7rem' },
      { key: 'status', label: '상태', width: '6rem' },
    ],
    sections: projectSections as unknown as AnySection[],
  },
  {
    key: 'core-reset',
    label: '코어 리셋',
    table: 'rf_core_reset_applications',
    columns: [
      { key: 'guardian_name', label: '보호자', width: '7rem' },
      { key: 'guardian_phone', label: '연락처', width: '9.5rem' },
      { key: 'region', label: '지역', width: '8rem' },
      { key: 'child_name', label: '아이', width: '7rem' },
      { key: 'program', label: '프로그램', width: '14rem' },
      { key: 'status', label: '상태', width: '6rem' },
    ],
    sections: coreResetSections as unknown as AnySection[],
    // 코어리셋은 프로그램·일정 문항이 스키마 바깥(전용 블록)에 있다
    extra: [
      { id: 'program', label: '선택한 프로그램' },
      { id: 'schedule', label: '상담 가능 일정' },
      { id: 'schedule_other', label: '희망 시간(직접 입력)' },
    ],
  },
]

const STATUS_LABEL: Record<string, string> = {
  new: '신규',
  contacted: '연락함',
  paid: '입금완료',
  scheduled: '일정확정',
  done: '완료',
  canceled: '취소',
}

interface Row {
  id: string
  created_at: string
  status?: string | null
  answers?: Record<string, unknown>
  [key: string]: unknown
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

/** 값 → 표시 문자열 */
const show = (v: unknown): string => {
  if (v == null || v === '') return '—'
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  if (typeof v === 'boolean') return v ? 'O' : 'X'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

/** '기타 직접입력'이 있으면 덧붙인다 (answers 에 `<id>_other` 로 들어 있음) */
const withOther = (answers: Record<string, unknown> | undefined, id: string) => {
  const base = show(answers?.[id])
  const other = answers?.[`${id}_other`]
  if (!other) return base
  return base === '—' ? `기타: ${other}` : `${base} (기타: ${other})`
}

const csvCell = (v: unknown) => {
  const s =
    v == null ? '' : Array.isArray(v) ? v.join(' | ') : typeof v === 'object' ? JSON.stringify(v) : String(v)
  return `"${s.replace(/"/g, '""')}"`
}

export default function Applications() {
  const [formKey, setFormKey] = useState(FORMS[0].key)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const form = useMemo(() => FORMS.find((f) => f.key === formKey) ?? FORMS[0], [formKey])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    setOpenId(null)
    ;(async () => {
      const { data, error } = await supabase
        .from(form.table)
        .select('*')
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
  }, [form.table])

  /** 헤더 행과 데이터 행이 공유하는 grid 템플릿 */
  const gridStyle = {
    gridTemplateColumns: `10rem ${form.columns.map((c) => c.width).join(' ')} 3rem`,
  }

  const statusCount = useMemo(() => {
    const c: Record<string, number> = {}
    for (const r of rows) if (r.status) c[r.status] = (c[r.status] ?? 0) + 1
    return c
  }, [rows])

  const downloadCsv = () => {
    const cols: { key: string; label: string; fromAnswers: boolean }[] = [
      { key: 'created_at', label: '작성시각', fromAnswers: false },
      ...form.columns.map((c) => ({ key: c.key, label: c.label, fromAnswers: false })),
    ]
    for (const sec of form.sections ?? []) {
      for (const q of sec.questions) {
        // 라벨 없는 문항은 섹션 제목이 곧 질문이므로 그걸 열 이름으로 쓴다
        cols.push({ key: q.id, label: q.label || sec.title, fromAnswers: true })
      }
    }
    for (const e of form.extra ?? []) cols.push({ key: e.id, label: e.label, fromAnswers: true })
    for (const b of form.body ?? []) cols.push({ key: b.key, label: b.label, fromAnswers: false })

    const lines = [cols.map((c) => csvCell(c.label)).join(',')]
    for (const r of rows) {
      lines.push(
        cols
          .map((c) => {
            if (c.key === 'created_at') return csvCell(fmt(r.created_at))
            return csvCell(c.fromAnswers ? r.answers?.[c.key] : r[c.key])
          })
          .join(','),
      )
    }

    // BOM 을 붙여야 엑셀에서 한글이 깨지지 않는다
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.label}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-ink">신청 내역</h1>
          <p className="mt-0.5 text-sm text-muted">
            사이트 신청 폼 4종 · 열람 전용 (상태 변경은 Supabase 에서)
          </p>
        </div>
        <button
          onClick={downloadCsv}
          disabled={!rows.length}
          className="rounded-lg border border-black/10 bg-white px-3.5 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-40"
        >
          CSV 내려받기
        </button>
      </div>

      {/* 폼 선택 */}
      <div className="flex flex-wrap gap-2">
        {FORMS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFormKey(f.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              f.key === formKey
                ? 'border-primary bg-primary text-white'
                : 'border-black/10 bg-white text-muted hover:bg-black/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-10 text-center text-muted">불러오는 중…</p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-bold">불러오지 못했습니다.</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span>
              총 <strong className="text-ink">{rows.length}건</strong>
            </span>
            {Object.entries(statusCount).map(([s, n]) => (
              <span key={s}>
                {STATUS_LABEL[s] ?? s} {n}
              </span>
            ))}
          </div>

          {!rows.length ? (
            <div className="rounded-xl border border-black/5 bg-white px-5 py-12 text-center">
              <p className="text-muted">아직 신청이 없습니다.</p>
              {/* RLS 로 막히면 에러가 아니라 빈 배열이 온다 — '신청 없음'과 구분되지 않으므로 함께 안내한다 */}
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted/80">
                신청이 있는데도 비어 보인다면 조회 권한 정책이 아직 적용되지 않은 것입니다.
                <br />
                <code className="rounded bg-black/5 px-1.5 py-0.5">
                  supabase/migrations/0011_admin_read_applications.sql
                </code>
                을 Supabase SQL Editor 에서 실행해 주세요.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <div
                    className="grid bg-black/[0.03] text-xs font-bold text-muted"
                    style={gridStyle}
                    aria-hidden="true"
                  >
                    <span className="px-4 py-3">작성시각</span>
                    {form.columns.map((c) => (
                      <span key={c.key} className="px-4 py-3">
                        {c.label}
                      </span>
                    ))}
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
                          className={`grid w-full items-center text-left text-sm transition hover:bg-black/[0.02] ${
                            open ? 'bg-black/[0.02]' : ''
                          }`}
                          style={gridStyle}
                        >
                          <span className="px-4 py-3 text-muted">{fmt(r.created_at)}</span>
                          {form.columns.map((c) => (
                            <span key={c.key} className="truncate px-4 py-3">
                              {c.key === 'status'
                                ? (STATUS_LABEL[String(r.status)] ?? show(r.status))
                                : show(r[c.key])}
                            </span>
                          ))}
                          <span className="px-4 py-3 text-muted">{open ? '▲' : '▼'}</span>
                        </button>

                        {open && (
                          <div className="border-t border-black/5 bg-[#faf9fc] px-4 py-5 sm:px-6">
                            {/* 스키마가 없는 폼(상담) — 본문 컬럼만 */}
                            {form.body?.map((b) => (
                              <div key={b.key} className="mb-4">
                                <p className="text-[13px] text-muted">{b.label}</p>
                                <p className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink">
                                  {show(r[b.key])}
                                </p>
                              </div>
                            ))}

                            {form.sections?.map((sec) => (
                              <section key={sec.id} className="mb-5 last:mb-0">
                                <h3 className="text-[13px] font-extrabold text-primary-dark">
                                  {sec.title}
                                </h3>
                                <dl className="mt-2 space-y-2.5">
                                  {sec.questions.map((q) => (
                                    <div key={q.id}>
                                      {/* 라벨이 없는 문항은 섹션 제목이 곧 질문이다 — 원본 id 를 노출하지 않는다 */}
                                      {q.label && (
                                        <dt className="text-[13px] text-muted">{q.label}</dt>
                                      )}
                                      <dd className="mt-0.5 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink">
                                        {withOther(r.answers, q.id)}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              </section>
                            ))}

                            {form.extra?.length ? (
                              <section>
                                <h3 className="text-[13px] font-extrabold text-primary-dark">
                                  프로그램 · 일정
                                </h3>
                                <dl className="mt-2 space-y-2.5">
                                  {form.extra.map((e) => (
                                    <div key={e.id}>
                                      <dt className="text-[13px] text-muted">{e.label}</dt>
                                      <dd className="mt-0.5 text-[13.5px] leading-relaxed text-ink">
                                        {show(r.answers?.[e.id])}
                                      </dd>
                                    </div>
                                  ))}
                                </dl>
                              </section>
                            ) : null}

                            <p className="mt-4 border-t border-black/5 pt-3 text-[12px] text-muted/70">
                              개인정보 동의 {show(r.privacy_consent)}
                              {'marketing_consent' in r && ` · 마케팅 동의 ${show(r.marketing_consent)}`}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

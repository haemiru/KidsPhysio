import { admin } from './_supabase.js'

// Brain Scent Project 종료 설문 — 응답 저장
// POST { answers: { ... } }  → rf_survey_responses insert
// 익명 설문. 서비스 롤로만 기록(클라이언트 직접 접근은 RLS로 차단됨).

const text = (v) => {
  if (v == null) return null
  const s = String(v).trim()
  return s ? s.slice(0, 500) : null
}

const intOrNull = (v) => {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    const answers = body.answers && typeof body.answers === 'object' ? body.answers : body

    // 응답이 완전히 비어 있으면 저장하지 않음
    const hasAny = answers && Object.values(answers).some((v) =>
      Array.isArray(v) ? v.length > 0 : v != null && v !== '' && !(typeof v === 'object' && Object.keys(v).length === 0),
    )
    if (!hasAny) {
      return res.status(400).json({ error: 'EMPTY_SURVEY' })
    }

    const consent = answers.marketing_consent
    const row = {
      survey_key: 'brain_scent_end',
      child_age: text(answers.child_age),
      diagnosis: text(answers.diagnosis),
      nps: intOrNull(answers.nps),
      app_intent: text(answers.app_intent),
      marketing_consent: consent == null ? null : consent === '예' || consent === true,
      answers,
      user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
    }

    const { error } = await admin.from('rf_survey_responses').insert(row)
    if (error) {
      console.error('[survey-submit] insert error:', error)
      return res.status(500).json({ error: 'INSERT_FAILED' })
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[survey-submit] error:', e)
    return res.status(500).json({ error: 'SERVER_ERROR' })
  }
}

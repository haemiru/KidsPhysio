import { admin } from './_supabase.js'
import { sendSms, parsePhones } from './_solapi.js'

// 브레인센트 후각키트 만들기 클래스 — 신청서 접수
// POST { answers: {...}, privacyConsent: boolean, marketingConsent: boolean, company? }
//  1) rf_class_applications 저장
//  2) 사장님(HOST_NOTIFY_PHONE)에게 문자(LMS) 알림
// company 는 허니팟(봇 차단용): 값이 있으면 봇으로 간주.

const text = (v, max = 1000) => {
  if (v == null) return null
  const s = String(v).trim()
  return s ? s.slice(0, max) : null
}
const onlyDigits = (s) => String(s ?? '').replace(/[^0-9]/g, '')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 배열 응답 정규화 (최대 40개, 각 항목 100자)
const list = (v) =>
  Array.isArray(v)
    ? v
        .map((x) => text(x, 100))
        .filter(Boolean)
        .slice(0, 40)
    : []

// '기타' 직접입력이 있으면 목록 뒤에 "기타: 내용" 형태로 덧붙인다
const withOther = (values, otherRaw, otherLabels) => {
  const other = text(otherRaw, 200)
  if (!other) return values
  return [...values.filter((v) => !otherLabels.includes(v)), `기타: ${other}`]
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})

    // 허니팟: 값이 채워져 있으면 봇 → 성공처럼 응답하되 저장·발송 생략
    if (text(body.company)) {
      return res.status(200).json({ ok: true })
    }

    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {}

    const name = text(answers.name, 60)
    const phone = onlyDigits(answers.phone)
    const email = text(answers.email, 120)
    const region = text(answers.region, 120)

    if (!name || name.length < 2) return res.status(400).json({ error: 'INVALID_NAME' })
    if (!/^010\d{8}$/.test(phone)) return res.status(400).json({ error: 'INVALID_PHONE' })
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'INVALID_EMAIL' })
    if (!region) return res.status(400).json({ error: 'INVALID_REGION' })
    if (body.privacyConsent !== true) return res.status(400).json({ error: 'CONSENT_REQUIRED' })

    const phoneFmt = `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
    const otherLabels = ['기타', '기타 (직접입력)']

    const occupations = withOther(
      list(answers.occupation),
      answers.occupation_other,
      otherLabels,
    )
    const wantedTopics = list(answers.wanted_topics)

    // 1) 저장
    const { data: row, error } = await admin
      .from('rf_class_applications')
      .insert({
        class_key: 'brain_scent_kit',
        applicant_name: name,
        applicant_phone: phoneFmt,
        email,
        region,
        occupations,
        olfactory_experience: text(answers.olfactory_experience, 100),
        apply_reason: text(answers.apply_reason, 2000),
        motivation: text(answers.motivation, 100),
        privacy_consent: true,
        marketing_consent: body.marketingConsent === true,
        answers,
        user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[class-apply] insert error:', error)
      return res.status(500).json({ error: 'INSERT_FAILED' })
    }

    // 2) 사장님에게 문자 알림 (여러 번호 지원, 실패해도 저장은 성공 처리 — 신청은 이미 접수됨)
    const hosts = parsePhones(process.env.HOST_NOTIFY_PHONE)
    if (hosts.length) {
      const at = new Intl.DateTimeFormat('ko-KR', {
        timeZone: 'Asia/Seoul',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(new Date())

      const reason = text(answers.apply_reason, 200)
      const smsText =
        `[짱샘 키즈피지오] 새 클래스 신청\n` +
        `후각키트 만들기 클래스\n\n` +
        `성함: ${name}\n` +
        `연락처: ${phoneFmt}\n` +
        `이메일: ${email}\n` +
        `지역: ${region}\n` +
        (occupations.length ? `직업: ${occupations.join(', ')}\n` : '') +
        (wantedTopics.length ? `관심주제: ${wantedTopics.slice(0, 5).join(', ')}\n` : '') +
        (reason ? `신청이유: ${reason}\n` : '') +
        `\n신청시각: ${at}`

      await Promise.all(
        hosts.map((h) =>
          sendSms({
            to: h,
            subject: '새 클래스 신청',
            text: smsText,
            kind: 'class_application',
          }).catch((e) => console.error('[class-apply] sms error:', e)),
        ),
      )
    }

    return res.status(200).json({ ok: true, id: row?.id ?? null })
  } catch (e) {
    console.error('[class-apply] error:', e)
    return res.status(500).json({ error: 'SERVER_ERROR' })
  }
}

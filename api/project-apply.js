import { admin } from './_supabase.js'
import { sendSms, parsePhones } from './_solapi.js'

// 브레인센트 4주 몸읽기 프로젝트 — 신청서 접수
// POST { answers: {...}, privacyConsent: boolean, company? }
//  1) rf_project_applications 저장
//  2) 사장님(HOST_NOTIFY_PHONE)에게 문자(LMS) 알림
// company 는 허니팟(봇 차단용): 값이 있으면 봇으로 간주.

const text = (v, max = 1000) => {
  if (v == null) return null
  const s = String(v).trim()
  return s ? s.slice(0, max) : null
}
const onlyDigits = (s) => String(s ?? '').replace(/[^0-9]/g, '')

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

    const guardianName = text(answers.guardian_name, 60)
    const phone = onlyDigits(answers.guardian_phone)
    const kakaoNickname = text(answers.kakao_nickname, 60)
    const childName = text(answers.child_name, 60)
    const childAge = text(answers.child_age, 40)

    if (!guardianName || guardianName.length < 2) return res.status(400).json({ error: 'INVALID_NAME' })
    if (!/^010\d{8}$/.test(phone)) return res.status(400).json({ error: 'INVALID_PHONE' })
    if (!kakaoNickname) return res.status(400).json({ error: 'INVALID_KAKAO' })
    if (!childName) return res.status(400).json({ error: 'INVALID_CHILD_NAME' })
    if (!childAge) return res.status(400).json({ error: 'INVALID_CHILD_AGE' })
    if (body.privacyConsent !== true) return res.status(400).json({ error: 'CONSENT_REQUIRED' })

    const phoneFmt = `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
    const otherLabels = ['기타', '기타 (직접입력)']

    const expectedChanges = withOther(
      list(answers.expected_changes),
      answers.expected_changes_other,
      otherLabels,
    )
    const futurePrograms = list(answers.future_programs)

    // 1) 저장
    const { data: row, error } = await admin
      .from('rf_project_applications')
      .insert({
        project_key: 'body_reading_4w',
        guardian_name: guardianName,
        guardian_phone: phoneFmt,
        kakao_nickname: kakaoNickname,
        child_name: childName,
        child_age: childAge,
        expected_changes: expectedChanges,
        helpful_7days: text(answers.helpful_7days, 2000),
        expectation_4w: text(answers.expectation_4w, 2000),
        question: text(answers.question, 2000),
        future_programs: futurePrograms,
        privacy_consent: true,
        answers,
        user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[project-apply] insert error:', error)
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

      const expectation = text(answers.expectation_4w, 200)
      const smsText =
        `[짱샘 키즈피지오] 새 프로젝트 신청\n` +
        `4주 몸읽기 프로젝트\n\n` +
        `보호자: ${guardianName}\n` +
        `연락처: ${phoneFmt}\n` +
        `카톡닉네임: ${kakaoNickname}\n` +
        `아이: ${childName} (${childAge})\n` +
        (expectedChanges.length ? `기대변화: ${expectedChanges.slice(0, 6).join(', ')}\n` : '') +
        (futurePrograms.length ? `다음관심: ${futurePrograms.slice(0, 4).join(', ')}\n` : '') +
        (expectation ? `4주기대: ${expectation}\n` : '') +
        `\n신청시각: ${at}`

      await Promise.all(
        hosts.map((h) =>
          sendSms({
            to: h,
            subject: '새 프로젝트 신청',
            text: smsText,
            kind: 'project_application',
          }).catch((e) => console.error('[project-apply] sms error:', e)),
        ),
      )
    }

    return res.status(200).json({ ok: true, id: row?.id ?? null })
  } catch (e) {
    console.error('[project-apply] error:', e)
    return res.status(500).json({ error: 'SERVER_ERROR' })
  }
}

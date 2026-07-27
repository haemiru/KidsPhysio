import { admin } from './_supabase.js'
import { sendSms, parsePhones } from './_solapi.js'

// 브레인센트 코어 리셋 시스템™ — 코칭 신청서 접수
// POST { answers: {...}, programConsent, refundConsent, feeConsent, privacyConsent, company? }
//  1) rf_core_reset_applications 저장
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

const MIN_SCHEDULE = 2

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
    const region = text(answers.region, 120)
    const childName = text(answers.child_name, 60)
    const childBirth = text(answers.child_birth, 20)
    const program = text(answers.program, 120)
    const schedule = list(answers.schedule)

    if (!guardianName || guardianName.length < 2)
      return res.status(400).json({ error: 'INVALID_NAME' })
    if (!/^010\d{8}$/.test(phone)) return res.status(400).json({ error: 'INVALID_PHONE' })
    if (!region) return res.status(400).json({ error: 'INVALID_REGION' })
    if (!childName) return res.status(400).json({ error: 'INVALID_CHILD_NAME' })
    if (!childBirth) return res.status(400).json({ error: 'INVALID_CHILD_BIRTH' })
    if (!program) return res.status(400).json({ error: 'INVALID_PROGRAM' })
    if (schedule.length < MIN_SCHEDULE) return res.status(400).json({ error: 'INVALID_SCHEDULE' })
    if (
      body.programConsent !== true ||
      body.refundConsent !== true ||
      body.feeConsent !== true ||
      body.privacyConsent !== true
    ) {
      return res.status(400).json({ error: 'CONSENT_REQUIRED' })
    }

    const phoneFmt = `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`
    const otherLabels = ['기타', '기타 (직접입력)']

    const therapies = withOther(list(answers.therapies), answers.therapies_other, otherLabels)

    // 1) 저장
    const { data: row, error } = await admin
      .from('rf_core_reset_applications')
      .insert({
        program_key: 'core_reset',
        guardian_name: guardianName,
        guardian_phone: phoneFmt,
        kakao_id: text(answers.kakao_id, 60),
        region,
        child_name: childName,
        child_birth: childBirth,
        gender: text(answers.gender, 10),
        birth_weeks: text(answers.birth_weeks, 30),
        birth_type: text(answers.birth_type, 30),
        nicu: text(answers.nicu, 10),
        diagnosis: text(answers.diagnosis, 1000),
        therapies,
        posture_core: list(answers.posture_core),
        breathing: list(answers.breathing),
        sensory_emotion: list(answers.sensory_emotion),
        movement_balance: list(answers.movement_balance),
        scent_reaction: text(answers.scent_reaction, 30),
        preferred_scent: text(answers.preferred_scent, 60),
        sleep: list(answers.sleep),
        biggest_concern: text(answers.biggest_concern, 2000),
        expected_change: text(answers.expected_change, 2000),
        program,
        schedule,
        schedule_other: text(answers.schedule_other, 200),
        program_consent: true,
        refund_consent: true,
        fee_consent: true,
        privacy_consent: true,
        answers,
        user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[core-reset-apply] insert error:', error)
      return res.status(500).json({ error: 'INSERT_FAILED' })
    }

    // 2) 사장님에게 문자 알림 (실패해도 저장은 성공 처리 — 신청은 이미 접수됨)
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

      const diagnosis = text(answers.diagnosis, 120)
      const scheduleOther = text(answers.schedule_other, 80)
      const smsText =
        `[짱샘 키즈피지오] 새 코어 리셋 신청\n\n` +
        `보호자: ${guardianName}\n` +
        `연락처: ${phoneFmt}\n` +
        `지역: ${region}\n` +
        `아이: ${childName} (${childBirth})\n` +
        (diagnosis ? `진단: ${diagnosis}\n` : '') +
        `프로그램: ${program}\n` +
        `가능일정: ${schedule.join(', ')}\n` +
        (scheduleOther ? `희망시간: ${scheduleOther}\n` : '') +
        `\n신청시각: ${at}`

      await Promise.all(
        hosts.map((h) =>
          sendSms({
            to: h,
            subject: '새 코어 리셋 신청',
            text: smsText,
            kind: 'core_reset_application',
          }).catch((e) => console.error('[core-reset-apply] sms error:', e)),
        ),
      )
    }

    return res.status(200).json({ ok: true, id: row?.id ?? null })
  } catch (e) {
    console.error('[core-reset-apply] error:', e)
    return res.status(500).json({ error: 'SERVER_ERROR' })
  }
}

import { admin } from './_supabase.js'
import { sendSms, parsePhones } from './_solapi.js'

// 무료 상담 신청 접수 — 홈 Contact 폼
// POST { name, phone, age?, message?, company? }
//  1) rf_consultations 저장
//  2) 사장님(HOST_NOTIFY_PHONE)에게 문자(LMS) 알림
// company 는 허니팟(봇 차단용): 값이 있으면 봇으로 간주.

const text = (v, max = 1000) => {
  if (v == null) return null
  const s = String(v).trim()
  return s ? s.slice(0, max) : null
}
const onlyDigits = (s) => String(s ?? '').replace(/[^0-9]/g, '')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}

    // 허니팟: 값이 채워져 있으면 봇 → 성공처럼 응답하되 저장·발송 생략
    if (text(body.company)) {
      return res.status(200).json({ ok: true })
    }

    const name = text(body.name, 60)
    const phone = onlyDigits(body.phone)
    if (!name || name.length < 2) return res.status(400).json({ error: 'INVALID_NAME' })
    if (!/^010\d{8}$/.test(phone)) return res.status(400).json({ error: 'INVALID_PHONE' })

    const childAge = text(body.age, 60)
    const message = text(body.message, 2000)
    const phoneFmt = `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`

    // 1) 저장
    const { data: row, error } = await admin
      .from('rf_consultations')
      .insert({
        guardian_name: name,
        guardian_phone: phoneFmt,
        child_age: childAge,
        message,
        privacy_consent: true,
        user_agent: String(req.headers['user-agent'] ?? '').slice(0, 300),
      })
      .select('id')
      .single()

    if (error) {
      console.error('[consult-submit] insert error:', error)
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

      const smsText =
        `[짱샘 키즈피지오] 새 무료상담 신청\n\n` +
        `보호자: ${name}\n` +
        `연락처: ${phoneFmt}\n` +
        (childAge ? `아이나이: ${childAge}\n` : '') +
        (message ? `내용: ${message}\n` : '') +
        `\n신청시각: ${at}`

      await Promise.all(
        hosts.map((h) =>
          sendSms({ to: h, subject: '새 무료상담 신청', text: smsText, kind: 'consultation' }).catch((e) =>
            console.error('[consult-submit] sms error:', e),
          ),
        ),
      )
    }

    return res.status(200).json({ ok: true, id: row?.id ?? null })
  } catch (e) {
    console.error('[consult-submit] error:', e)
    return res.status(500).json({ error: 'SERVER_ERROR' })
  }
}

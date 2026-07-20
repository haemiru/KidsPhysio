import crypto from 'node:crypto'
import { admin } from './_supabase.js'

// 솔라피 알림톡(ATA) 발송 — REST API + HMAC 서명 (별도 SDK 없이)
const API_BASE = 'https://api.solapi.com'

function authHeader() {
  const apiKey = process.env.SOLAPI_API_KEY
  const apiSecret = process.env.SOLAPI_API_SECRET
  const date = new Date().toISOString()
  const salt = crypto.randomBytes(32).toString('hex')
  const signature = crypto.createHmac('sha256', apiSecret).update(date + salt).digest('hex')
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`
}

const onlyDigits = (s) => String(s ?? '').replace(/[^0-9]/g, '')

// 콤마/세미콜론/공백으로 구분된 여러 번호 문자열 → 숫자만 남긴 번호 배열.
// (사장님 알림을 여러 명이 받도록 HOST_NOTIFY_PHONE="010...,010..." 지원)
export function parsePhones(raw) {
  return String(raw ?? '')
    .split(/[,;\s]+/)
    .map((s) => onlyDigits(s))
    .filter((p) => p.length >= 9)
}

// 알림톡 1건 발송. 성공/실패를 rf_notifications 에 기록.
// opts: { to, templateId, variables, kind, applicationId?, bookingId? }
export async function sendAlimtalk(opts) {
  const { to, templateId, variables = {}, kind, applicationId = null, bookingId = null } = opts
  const recipient = onlyDigits(to)
  const from = onlyDigits(process.env.SOLAPI_SENDER_PHONE)
  const pfId = process.env.SOLAPI_PFID

  // 설정 누락 시: 발송 생략하되 기록 남김 (결제 흐름은 막지 않음)
  if (!templateId || !recipient || !pfId || !process.env.SOLAPI_API_KEY) {
    await logNotification({ kind, applicationId, bookingId, recipient, status: 'failed', error: 'SOLAPI_NOT_CONFIGURED', payload: { templateId, variables } })
    return { ok: false, skipped: true }
  }

  try {
    const res = await fetch(`${API_BASE}/messages/v4/send`, {
      method: 'POST',
      headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          to: recipient,
          from,
          type: 'ATA',
          kakaoOptions: { pfId, templateId, variables, disableSms: false },
        },
      }),
    })
    const data = await res.json()
    const ok = res.ok && data?.statusCode !== '4000' && !data?.errorCode
    await logNotification({
      kind,
      applicationId,
      bookingId,
      recipient,
      status: ok ? 'sent' : 'failed',
      providerMsgId: data?.messageId ?? null,
      error: ok ? null : data?.errorMessage || data?.message || JSON.stringify(data).slice(0, 300),
      payload: { templateId, variables },
    })
    return { ok, data }
  } catch (e) {
    await logNotification({ kind, applicationId, bookingId, recipient, status: 'failed', error: String(e?.message ?? e), payload: { templateId, variables } })
    return { ok: false, error: e }
  }
}

// 일반 문자(LMS) 발송 — 알림톡 템플릿 불필요. 내부 알림(사장님 알림) 등에 사용.
// opts: { to, text, subject?, kind }
export async function sendSms({ to, text, subject = null, kind = 'sms' }) {
  const recipient = onlyDigits(to)
  const from = onlyDigits(process.env.SOLAPI_SENDER_PHONE)

  // 설정 누락 시: 발송 생략하되 기록 남김 (호출 흐름은 막지 않음)
  if (!recipient || !from || !process.env.SOLAPI_API_KEY) {
    await logNotification({ kind, recipient, status: 'failed', error: 'SOLAPI_NOT_CONFIGURED', channel: 'sms', payload: { text } })
    return { ok: false, skipped: true }
  }

  try {
    const message = { to: recipient, from, type: 'LMS', text }
    if (subject) message.subject = subject
    const res = await fetch(`${API_BASE}/messages/v4/send`, {
      method: 'POST',
      headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    const data = await res.json()
    const ok = res.ok && data?.statusCode !== '4000' && !data?.errorCode
    await logNotification({
      kind,
      recipient,
      channel: 'sms',
      status: ok ? 'sent' : 'failed',
      providerMsgId: data?.messageId ?? null,
      error: ok ? null : data?.errorMessage || data?.message || JSON.stringify(data).slice(0, 300),
      payload: { text },
    })
    return { ok, data }
  } catch (e) {
    await logNotification({ kind, recipient, status: 'failed', error: String(e?.message ?? e), channel: 'sms', payload: { text } })
    return { ok: false, error: e }
  }
}

export async function logNotification({ kind, applicationId = null, bookingId = null, recipient, status, providerMsgId = null, error = null, payload = null, channel = 'alimtalk' }) {
  try {
    await admin.from('rf_notifications').insert({
      application_id: applicationId,
      booking_id: bookingId,
      kind,
      channel,
      recipient,
      status,
      provider_msg_id: providerMsgId,
      error,
      payload,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    })
  } catch {
    // 로깅 실패는 무시 (알림 자체를 막지 않음)
  }
}

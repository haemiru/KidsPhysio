import { admin } from './_supabase.js'
import { sendAlimtalk, parsePhones } from './_solapi.js'

// 서버측 KST 일시 포맷: "5월 30일(금) 오후 2:00"
export function fmtKST(iso) {
  const f = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  return f.format(new Date(iso))
}

// 확정/예정 예약을 회차 순으로 (슬롯 시간 포함) 조회
async function loadBookings(applicationId) {
  const { data } = await admin
    .from('rf_bookings')
    .select('id, session_no, session_kind, status, rf_slots(starts_at)')
    .eq('application_id', applicationId)
    .neq('status', 'cancelled')
    .order('session_no')
  return data ?? []
}

// 호스트에게 신규 신청 알림 (HOST_NOTIFY_PHONE 에 콤마로 여러 번호 지정 가능)
export async function notifyHostNewApplication(app) {
  const hosts = parsePhones(process.env.HOST_NOTIFY_PHONE)
  const variables = {
    '#{보호자}': app.guardian_name ?? '',
    '#{아이}': app.child_name ?? '',
    '#{연락처}': app.guardian_phone ?? '',
  }
  return Promise.all(
    hosts.map((to) =>
      sendAlimtalk({
        to,
        templateId: process.env.SOLAPI_TPL_NEW_APPLICATION_HOST,
        kind: 'new_application',
        applicationId: app.id,
        variables,
      }),
    ),
  )
}

// 신청자에게 예약 조회 링크 발송 (매직 링크)
export async function notifyLookupLink(app, link) {
  return sendAlimtalk({
    to: app.guardian_phone,
    templateId: process.env.SOLAPI_TPL_LOOKUP,
    kind: 'lookup_link',
    applicationId: app.id,
    variables: {
      '#{이름}': app.guardian_name ?? '',
      '#{링크}': link,
    },
  })
}

// 신청자에게 예약 확정 알림 (첫 회차 일시 + 총 회차)
export async function notifyBookingConfirmed(app) {
  const bookings = await loadBookings(app.id)
  const first = bookings.find((b) => b.session_kind === 'consult') ?? bookings[0]
  const firstAt = first?.rf_slots?.starts_at
  return sendAlimtalk({
    to: app.guardian_phone,
    templateId: process.env.SOLAPI_TPL_BOOKING_CONFIRMED,
    kind: 'booking_confirmed',
    applicationId: app.id,
    bookingId: first?.id ?? null,
    variables: {
      '#{이름}': app.guardian_name ?? '',
      '#{일시}': firstAt ? fmtKST(firstAt) : '',
      '#{회차수}': String(bookings.length),
    },
  })
}

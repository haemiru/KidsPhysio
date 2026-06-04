// 코칭 예약 시스템(regist-form) 도메인 타입

export type FormFieldType =
  | 'short'
  | 'long'
  | 'tel'
  | 'date'
  | 'radio'
  | 'checkbox'
  | 'select'

export interface FormFieldDef {
  id: string
  section: string
  section_order: number
  field_order: number
  field_key: string
  label: string
  field_type: FormFieldType
  options: string[] | null
  placeholder?: string | null
  help_text?: string | null
  required: boolean
  min_select?: number | null
  is_consent?: boolean
  consent_kind?: 'privacy' | 'sensitive' | null
  active: boolean
}

export interface FormSection {
  section: string
  order: number
  fields: FormFieldDef[]
}

export type FieldValue = string | string[] | undefined
export type FormValues = Record<string, FieldValue>
export type FormErrors = Record<string, string | undefined>

export interface SubmitPayload {
  consent_privacy: boolean
  consent_sensitive: boolean
  answers: Record<string, unknown>
  [key: string]: unknown
}

export interface HeldBooking {
  sessionNo: number
  kind: string
  bookingId: string
  slotId: string
  startsAt: string
  endsAt: string
  holdExpiresAt: string
}

export interface StoredApplication {
  id: string
  accessToken: string
}

export interface Slot {
  id: string
  starts_at: string
  ends_at: string
  status: string
}

export interface Program {
  code: string
  name: string
  price: number
  description?: string | null
}

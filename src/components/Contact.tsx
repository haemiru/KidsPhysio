import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react'
import { site } from '../data/site'

// 숫자만 추출해 010-XXXX-XXXX 형식으로 표시용 포매팅
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

// 한글·영문·공백만 허용 (숫자·특수문자 제거)
function sanitizeName(value: string) {
  return value.replace(/[^가-힣ㄱ-ㅎa-zA-Z\s]/g, '')
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const isNameValid = name.trim().length >= 2
  const phoneDigits = phone.replace(/\D/g, '')
  const isPhoneValid = /^010\d{8}$/.test(phoneDigits)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(sanitizeName(e.target.value))
    if (nameError) setNameError('')
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
    if (phoneError) setPhoneError('')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isNameValid) {
      setNameError('보호자 성함을 2자 이상 입력해 주세요.')
      return
    }
    if (!isPhoneValid) {
      setPhoneError('010으로 시작하는 11자리 휴대폰 번호를 입력해 주세요.')
      return
    }
    // 데모: 실제 전송 대신 확인 메시지를 표시합니다. (백엔드 연동 시 교체)
    setSent(true)
  }

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container-page">
        <div className="overflow-hidden rounded-[2rem] bg-brand-700 shadow-card">
          <div className="grid lg:grid-cols-2">
            {/* Info side */}
            <div className="relative p-8 text-white sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-48 w-48 animate-blob bg-white/10"
              />
              <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold">
                무료 상담 예약
              </span>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                망설이는 지금이
                <br />
                가장 빠른 때입니다
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-white/80">
                아이의 발달이 걱정된다면 편하게 문의해 주세요. 전문 치료진이
                친절하게 안내해 드립니다.
              </p>

              <ul className="mt-9 space-y-5">
                <ContactRow icon={<Phone className="h-5 w-5" />} label="전화 문의">
                  <a href={site.phoneHref} className="hover:underline">
                    {site.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<Mail className="h-5 w-5" />} label="이메일">
                  <a href={site.emailHref} className="hover:underline">
                    {site.email}
                  </a>
                </ContactRow>
                <ContactRow icon={<MapPin className="h-5 w-5" />} label="오시는 길">
                  {site.address}
                </ContactRow>
                <ContactRow icon={<Clock className="h-5 w-5" />} label="운영 시간">
                  <ul className="space-y-0.5">
                    {site.hours.map((h) => (
                      <li key={h.day}>
                        <span className="text-white/70">{h.day}</span> · {h.time}
                      </li>
                    ))}
                  </ul>
                </ContactRow>
              </ul>
            </div>

            {/* Form side */}
            <div className="bg-white p-8 sm:p-12">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-16 w-16 text-brand-500" aria-hidden="true" />
                  <h3 className="mt-5 text-2xl font-extrabold text-ink">
                    상담 신청이 접수되었어요!
                  </h3>
                  <p className="mt-3 max-w-xs text-muted">
                    빠른 시일 내에 담당 선생님이 연락드리겠습니다. 감사합니다. 😊
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="btn btn-ghost mt-7"
                  >
                    다시 작성하기
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-2xl font-extrabold text-ink">상담 신청서</h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="보호자 성함" htmlFor="name">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="홍길동"
                        value={name}
                        onChange={handleNameChange}
                        aria-invalid={nameError ? true : undefined}
                        aria-describedby={nameError ? 'name-error' : undefined}
                        className={`${inputCls} ${
                          nameError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''
                        }`}
                      />
                      {nameError && (
                        <p id="name-error" className="mt-1.5 text-sm font-medium text-red-500">
                          {nameError}
                        </p>
                      )}
                    </Field>
                    <Field label="연락처" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        required
                        autoComplete="tel"
                        placeholder="010-1234-5678"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={13}
                        aria-invalid={phoneError ? true : undefined}
                        aria-describedby={phoneError ? 'phone-error' : undefined}
                        className={`${inputCls} ${
                          phoneError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''
                        }`}
                      />
                      {phoneError && (
                        <p id="phone-error" className="mt-1.5 text-sm font-medium text-red-500">
                          {phoneError}
                        </p>
                      )}
                    </Field>
                  </div>
                  <Field label="아이 나이(개월/세)" htmlFor="age">
                    <input
                      id="age"
                      name="age"
                      type="text"
                      placeholder="예) 36개월 / 4세"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="상담 내용" htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="아이의 발달 상황이나 궁금한 점을 자유롭게 적어주세요."
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                  <label className="flex items-start gap-2.5 text-sm text-muted">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 h-4 w-4 accent-[var(--color-brand-500)]"
                    />
                    <span>
                      개인정보 수집·이용에 동의합니다. (상담 목적, 보관 후 즉시 파기)
                    </span>
                  </label>
                  <button type="submit" className="btn btn-primary w-full text-base">
                    무료 상담 신청하기
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const inputCls =
  'w-full rounded-xl border border-sand bg-cream px-4 py-3 text-ink outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  )
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
        {icon}
      </span>
      <div className="text-[15px]">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
          {label}
        </p>
        <div className="mt-0.5 font-medium">{children}</div>
      </div>
    </li>
  )
}

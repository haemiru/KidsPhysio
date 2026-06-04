# 코칭 예약 시스템 통합 — 작업 인수인계 문서

> KidsPhysio(짱샘 키즈피지오) 사이트에 **regist-form 예약 시스템**을 이식한 작업 기록.
> 다시 돌아와 이어서 작업할 때 이 문서부터 읽으면 됩니다.
> 최종 커밋: `96a395e` (main) · 작성일: 2026-06-04

---

## 0. 한 줄 요약

별도 저장소였던 **브레인센트 코어 리셋 코칭 예약 시스템**(`regist-form`, JS)을
KidsPhysio(React+TS+Vite) 안으로 **TypeScript로 변환해 통합**했고, 원본 폴더는 삭제했다.
빌드/린트 통과 상태. **단, 실제로 동작시키려면 환경변수 설정이 필요**(아래 6번).

---

## 1. 지금 상태 (What works / What's pending)

| 구분 | 상태 |
|---|---|
| 코드 이식 (프론트 25개 파일 TS 변환) | ✅ 완료 |
| 백엔드(`api/` 서버리스 11종, `supabase/` 마이그레이션 4종) | ✅ 복사 완료 |
| 라우팅 통합 (`App.tsx`) | ✅ 완료 |
| `npm run build` (tsc + vite) | ✅ 통과 |
| `npm run lint` | ✅ 통과 |
| 커밋/푸시 (`haemiru/KidsPhysio` main) | ✅ 완료 |
| **환경변수 설정 (Vercel/로컬 `.env`)** | ⏳ **미설정 — 안 하면 예약 시스템 동작 안 함** |
| 메인 사이트 → 예약 진입 링크 (CTA) | ⏳ 미연결 |
| 예약 페이지 브랜딩 ("브레인센트…" 문구) | ⏳ 원본 그대로 (KidsPhysio로 리브랜딩 안 함) |
| 솔라피 알림톡 템플릿 승인 | ⏳ 원본 기준 대기 상태였음 (미설정 시 발송만 skip, 흐름은 정상) |

---

## 2. 출처 / 원본

- **원본 저장소**: https://github.com/haemiru/regist-form (`main`) — 로컬 폴더는 삭제했으나 GitHub에 그대로 있음. 필요 시 `git clone`으로 복구.
- 원본의 상세 설계 문서는 그 저장소의 `docs/PROJECT-SUMMARY.md`, `docs/NOTIFICATIONS.md`, `docs/SHARED-SUPABASE.md` 참고.
- 기술스택: Vite + React 19 + Tailwind v4 + react-router 7 / Supabase(PostgreSQL+Auth+RLS) / Vercel Serverless / 토스페이먼츠 v1 / 솔라피 카카오 알림톡.
- **DB 객체 prefix `rf_`**, Supabase는 **'짱샘의 책방' 프로젝트와 공유**(이름충돌 방지 위해 prefix·RLS·화이트리스트 설계).

---

## 3. 디렉토리 구조 (이번에 추가된 것)

```
KidsPhysio/
├─ api/                         # Vercel 서버리스 (JS, tsc 빌드 대상 아님)
│  ├─ _supabase.js              # service_role 클라이언트 + 토큰/관리자 검증
│  ├─ _solapi.js                # 알림톡 REST+HMAC 발송
│  ├─ _notify.js                # 고수준 알림(호스트/확정/조회링크)
│  ├─ payment-bank.js           # 무통장: 금액확정·슬롯확보·계좌안내
│  ├─ payment-toss-confirm.js   # 토스: 서버 금액검증→confirm→paid
│  ├─ my-lookup.js / my-get.js / my-cancel.js   # 본인 예약 조회·취소(매직링크)
│  ├─ admin/confirm-payment.js  # 관리자 입금확인→확정
│  └─ cron/release-holds.js, cron/send-reminders.js   # Cron 2종
├─ supabase/migrations/         # 0001_init ~ 0004_slots_and_booking (SQL)
├─ src/booking/                 # ★ 이식된 예약 시스템 프론트 (전부 TS)
│  ├─ types.ts                  # 도메인 공유 타입(신규 작성)
│  ├─ toss.d.ts                 # window.TossPayments 전역 타입(신규)
│  ├─ lib/        supabase, formKeys, datetime, sessionPlan, loadToss,
│  │              applicationStore, bookingStore, paymentStore, adminApi
│  ├─ hooks/      useFormFields, useSlots, useAdminSession
│  ├─ components/ PublicLayout, HoldCountdown, form/FormField
│  └─ pages/      BookingHome, Apply, Booking, Payment, PaymentSuccess,
│                 PaymentFail, Complete, MyReservation, Privacy
│                 admin/ (AdminApp, AdminLayout, AdminLogin, Dashboard,
│                         Bookings, Slots, FormEditor)
├─ .env.example                 # 환경변수 템플릿 (원본에서 복사)
└─ docs/BOOKING-INTEGRATION.md  # ← 이 문서
```

수정된 기존 파일: `src/App.tsx`(라우트), `src/index.css`(토큰·.card), `package.json`(supabase 의존성), `eslint.config.js`(booking 스코프 규칙 완화), `vercel.json`(Cron·rewrite), `.gitignore`(.env).

---

## 4. 라우트 맵

예약 시스템 페이지는 **자체 레이아웃(`PublicLayout`)**을 쓰므로 KidsPhysio `Layout` **밖**에 독립 마운트됨 (`src/App.tsx`).

| 경로 | 페이지 | 비고 |
|---|---|---|
| `/coaching` | BookingHome | 예약 시스템 랜딩 (원본의 `/` Home, KidsPhysio `/`와 충돌 피해 이동) |
| `/apply` | Apply | 동적 신청서 (DB `rf_form_fields` 기반) |
| `/booking` | Booking | 회차별 시간 선점(15분 Hold) |
| `/payment` | Payment | 프로그램 선택 + 무통장/카드 |
| `/payment/success` `/payment/fail` | 토스 리다이렉트 결과 | **절대경로 고정** — 바꾸면 서버/토스 설정도 같이 바꿔야 함 |
| `/complete` | Complete | 완료 + 계좌안내/결제완료 |
| `/my` | MyReservation | `?t=토큰` 또는 연락처→카톡 조회링크 |
| `/privacy` | Privacy | 개인정보 처리방침(초안) |
| `/admin/*` | AdminApp | 관리자(로그인 가드 + rf_admins 화이트리스트) |

> ⚠️ 라우트는 원본과 동일한 **절대경로**로 유지했다. 코드 곳곳에서 `navigate('/apply')`, `successUrl=.../payment/success`, 매직링크 `/my?t=` 등 절대경로에 의존하므로 base를 바꾸려면 서버 함수·DB·토스 설정까지 함께 손봐야 한다.

---

## 5. 빌드 / 실행

```bash
cd KidsPhysio
npm install
npm run dev      # Vite dev (5173). 단, /api 서버리스는 dev에서 안 돔 → 결제/알림 풀테스트는 vercel dev 또는 배포 필요
npm run build    # tsc -b && vite build  (통과 확인됨)
npm run lint     # 통과 확인됨
```

- `api/`는 **Node 서버리스(JS)** 라 tsc(`include: ["src"]`) 대상이 아니다. 로컬에서 API까지 돌리려면 `vercel dev` 사용.
- 번들 경고(>500kB)는 supabase 포함 때문 — 동작엔 무관. 추후 code-split 가능.

---

## 6. ⭐ 동작시키려면: 환경변수 (가장 중요 / 미완)

`.env.example`을 복사해 로컬 `.env` 만들고, **Vercel 프로젝트 환경변수**에도 동일 설정.
**기존 공유 Supabase 재사용**이 결정사항 → 원본 regist-form이 쓰던 값과 동일하게 넣으면 됨.

클라이언트(브라우저 노출, `VITE_` 접두사 — anon/공개키만):
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_TOSS_CLIENT_KEY`, `VITE_BANK_INFO`

서버 전용(`/api`에서만, `VITE_` 금지):
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `TOSS_SECRET_KEY`
- `BANK_INFO`
- `SOLAPI_API_KEY/SECRET/SENDER_PHONE/PFID` + 템플릿 ID 5종(`SOLAPI_TPL_*`)
- `HOST_NOTIFY_PHONE`, `APP_ORIGIN`(선택), `CRON_SECRET`(선택)

> `VITE_` 값 변경 시 Vercel **Redeploy** 필요.
> Supabase 마이그레이션(0001~0004)과 관리자 등록(`rf_admins`)은 **공유 Supabase에 이미 적용돼 있던 상태**(원본 운영 체크리스트 완료). 새 Supabase를 쓸 경우에만 `supabase/migrations` 재실행 + 관리자 insert 필요.

---

## 7. 데이터 모델 / 핵심 RPC (요약)

테이블(모두 `rf_`): `rf_admins`, `rf_programs`, `rf_form_fields`(신청서 항목 정의·관리자 편집), `rf_applications`(신청·access_token), `rf_slots`, `rf_bookings`, `rf_blackouts`(휴무), `rf_notifications`.

RPC: `rf_is_admin()`(RLS용), `rf_submit_application(jsonb)`(동의검증+삽입+토큰), `rf_hold_slot(...)`(FOR UPDATE 락 15분 Hold·동시예약방지), `rf_confirm_booking/cancel_booking`(service_role), `rf_release_expired_holds()`(Cron).

보안 핵심: anon은 비민감 데이터 읽기만, 쓰기·PII는 RPC/service_role. service_role·토스시크릿·솔라피는 서버 전용. 결제 금액은 서버가 프로그램 가격으로 재검증. 본인조회는 연락처 노출 대신 카톡 매직링크(토큰).

---

## 8. 이식하며 내린 결정 / 주의점 (재작업 시 헷갈리지 않게)

1. **언어**: 전부 TypeScript 변환. strict는 꺼져 있어 부담 적었음. `verbatimModuleSyntax`(타입은 `import type`), `erasableSyntaxOnly`(enum 금지 → const객체+유니온), `noUnusedLocals/Params` 준수.
2. **ESLint 완화는 `src/booking/**`만**: 이식된 코드의 관례(effect 내 데이터패칭=`set-state-in-effect`, 시계용 `Date.now()`=`purity`, supabase/toss 런타임 페이로드=`no-explicit-any`, `exhaustive-deps`)를 이 폴더 한정으로 off. **메인 KidsPhysio 코드는 strict 유지** (`eslint.config.js` 하단 override 블록).
3. **스타일 토큰**: 예약 UI는 라벤더 계열(`--color-primary` 등)·`.card`를 쓴다 → `src/index.css` `@theme`/`@layer components`에 추가. KidsPhysio 본래 블루 테마(`--color-brand-*`)와 별개로 공존.
4. **브랜딩 "그대로"**: 사용자 지시로 "브레인센트 코어 리셋 / 피지오 후각 연구소" 문구를 유지. KidsPhysio 브랜드로 바꾸려면 `PublicLayout.tsx`, `BookingHome.tsx`, `AdminLayout/AdminLogin`, `Privacy.tsx` 문구 수정.
5. **Supabase 타입 캐스팅**: 무타입 클라이언트라 중첩 관계 쿼리 결과를 `as unknown as X[]`로 캐스팅한 곳 있음(Dashboard, Bookings). 정식 타입을 원하면 `supabase gen types` 도입 고려.
6. **NotFound**: 예약용 NotFound는 이식 안 함(KidsPhysio 기존 `*` 라우트 재사용).

---

## 9. 다음에 할 일 (TODO 후보)

- [ ] **환경변수 설정**(6번) — 이거 해야 실제 동작. 최우선.
- [ ] 메인 사이트에서 예약 진입 동선 연결: `Contact`/`CtaBand`/`Header` 등에서 `/coaching` 또는 `/apply`로 링크.
- [ ] 예약 페이지 브랜딩을 KidsPhysio로 통일할지 결정(원하면 문구 일괄 변경).
- [ ] 개인정보 처리방침(`/privacy`) 실제 사업자정보·보유기간으로 확정.
- [ ] (원본 한계) 토스 결제 도중 15분 Hold 만료 가능 → 결제 시작 시 hold 연장 보강.
- [ ] (선택) 번들 code-split, supabase 타입 생성.

---

## 10. 빠른 참조

- 통합 커밋: `96a395e` "코칭 예약 시스템(regist-form) 통합 + 연락처/성함 검증 + 인스타 링크"
- 같은 커밋에 포함된 부수 작업: `Contact.tsx` 연락처 검증(010·11자리+자동 하이픈)·성함 숫자차단, `site.ts` 인스타 `@seochojiye`.
- 원본 복구: `git clone https://github.com/haemiru/regist-form`

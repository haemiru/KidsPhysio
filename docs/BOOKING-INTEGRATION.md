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
| **환경변수 설정 (로컬 `.env.local`)** | ✅ **완료** — Solapi 3개 포함 전체 채움(사용자 재확보). 상세 §11·§13 |
| **환경변수 설정 (Vercel `kids-physio`)** | ✅ **완료(2026-06-04)** — production+preview에 19키 등록(Solapi 3개 포함). 재배포로 함수 반영됨. |
| **배포 & 스모크 검증 (kidsphysio.kr)** | ✅ **통과(2026-06-04)** — `/coaching` 200, Supabase anon read, 서버리스→service_role(cron) `{ok:true}` 확인. §13 |
| 메인 사이트 → 예약 진입 링크 (CTA) | ⏳ **미연결 — 제품 결정 대기**(§12). 위치·문구를 사용자에게 물었으나 보류됨 |
| 예약 페이지 브랜딩 ("브레인센트…" 문구) | ⏳ 원본 그대로 (KidsPhysio로 리브랜딩 안 함) |
| 솔라피 알림톡 템플릿 승인 | 🟡 **검수진행중**(2026-06-04 4종 신규 등록·신청). 카카오 승인(1~2영업일) 후 실발송. 상세 §11 |

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

- [x] **로컬 `.env.local` 채우기**(6번) — Supabase/Toss/계좌/Solapi키 완료.
- [x] **Solapi 알림톡 값 채우기** — `SOLAPI_PFID` + 템플릿 4종 + `HOST_NOTIFY_PHONE` 완료(§11). 단 카카오 **검수 승인 대기 중**(승인돼야 실발송).
- [x] **Vercel `kids-physio` 환경변수 등록 + production 배포 + 스모크 검증**(2026-06-04, §13). kidsphysio.kr 동작 확인.
- [x] **Solapi `API_KEY`/`API_SECRET`/`SENDER_PHONE` 재확보**(2026-06-04, console.solapi.com) → 로컬+Vercel 등록 + 재배포 완료. 자격증명 유효 검증됨(`/cash/v1/balance` 200). ⚠️ 단 잔액 0/포인트 300 → 실발송 전 충전 필요할 수 있음. 카카오 템플릿 검수 승인 후 실발송.
- [ ] 실브라우저로 신청→슬롯Hold→무통장/카드 결제 UI 흐름 1회 통과 확인(라이브키 주의: 카드는 실결제).
- [ ] 메인 사이트에서 예약 진입 동선 연결 — **제품 결정 대기 중**. 상세 §12 (위치·문구를 사용자에게 물었으나 보류, 결정되면 바로 구현 가능).
- [ ] 예약 페이지 브랜딩을 KidsPhysio로 통일할지 결정(원하면 문구 일괄 변경).
- [ ] 개인정보 처리방침(`/privacy`) 실제 사업자정보·보유기간으로 확정.
- [ ] (원본 한계) 토스 결제 도중 15분 Hold 만료 가능 → 결제 시작 시 hold 연장 보강.
- [ ] (선택) 번들 code-split, supabase 타입 생성.

---

## 11. 환경변수 복구 작업 기록 (2026-06-04 추가)

원본 regist-form의 **로컬 폴더·GitHub 저장소·Vercel 프로젝트가 모두 삭제**되어 `.env.local`을 통째로 복구할 길이 없었음. 출처별로 다시 모음.

### 채워진 값 (로컬 `.env.local`, git 무시됨 — `.gitignore`에 `.env.local` 확인)

| 변수 | 출처 / 비고 |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | ✅ **'짱샘의 책방'(`ebook/jjangsaem-bookshop/.env.local`)에서 복구**. 같은 Supabase 프로젝트(`yvuekbmidwetaulasksk`)를 공유하므로 동일 값. |
| `TOSS_SECRET_KEY`, `VITE_TOSS_CLIENT_KEY` | ✅ 짱샘책방과 **동일 가맹점(live 키)** — 사용자 확인 완료(같은 사업자로 결제). 짱샘책방 값 그대로. |
| `BANK_INFO`, `VITE_BANK_INFO` | ✅ `기업은행 667-029459-01-011 (장지예)` — 서버/클라 동일 한 줄. `Complete.tsx`가 `BANK_INFO`를 그대로 표시(은행명 포함 필수). |
| `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SOLAPI_SENDER_PHONE` | ✅ 사용자 입력. 발신번호 하이픈은 `_solapi.js`의 `onlyDigits()`가 제거하므로 형식 무관. |
| `CRON_SECRET` | ✅ 신규 랜덤 생성. 본인이 정하는 값 → Vercel cron 설정과 같게만 맞추면 됨. |

### 알림톡 값 채움 완료 (2026-06-04)

원본 템플릿은 복구 불가(공유 Solapi 계정에 채널·템플릿 0건 = 신규 계정 상태)였음 → **카카오 채널 연동 + 템플릿 4종을 새로 등록**해서 해결.

- **카카오 채널**: `짱샘책방`(@) 채널을 Solapi에 연동 → `SOLAPI_PFID=KA01PF260604085006077be8JTWGFaxd` ✅
- **템플릿 4종 신규 등록**(모두 **기본형**, 본문은 코드의 `#{...}` 변수에 맞춤). 등록 직후 ID 발급됨:
  - `SOLAPI_TPL_NEW_APPLICATION_HOST` = `KA01TP260604085713705bJm1LuACYuk` ("신규신청 관리자 알림")
  - `SOLAPI_TPL_LOOKUP` = `KA01TP260604085800144geDtJpzLuGQ` ("[키즈피지오] 예약 조회 안내")
  - `SOLAPI_TPL_BOOKING_CONFIRMED` = `KA01TP260604085831196fLCFB2tkbbV` ("예약 확정")
  - `SOLAPI_TPL_REMINDER` = `KA01TP260604085854965lMyArmXHazS` ("회차 리마인더")
- `HOST_NOTIFY_PHONE=010-5776-3325` ✅ (관리자 알림 수신)
- ⚠️ **4종 모두 카카오 "검수진행중"** → 승인(1~2영업일) 전엔 발송 시도해도 카카오가 막음. 승인되면 자동 동작.

### 아직 비어있는 값 → 동작에 미치는 영향

- `SOLAPI_TPL_PAYMENT_REQUEST`: **코드에 발송 호출이 연결돼 있지 않음**(`.env.example`에만 정의). 무통장 안내를 알림톡으로도 보내려면 ① 템플릿 신규 등록 ② `api/`에서 `sendAlimtalk` 호출 추가 둘 다 필요. 현재 비워둬도 무방.
- `APP_ORIGIN`: 비면 요청 host 사용(보통 OK). 매직링크 도메인 고정하려면 배포 도메인 입력.
- 채널명이 `짱샘책방`이라 알림톡 발신자도 그렇게 표기됨. KidsPhysio 전용 채널을 원하면 별도 개설·연동 후 pfId/템플릿 재등록 필요.

### ⭐ 다시 돌아오면 곧바로 할 일

1. ~~Solapi 알림톡 값 채우기~~ ✅ **완료**(위 "알림톡 값 채움 완료" 참고). 남은 건 **카카오 검수 승인 확인**뿐 — console.solapi.com → 알림톡 템플릿에서 4종이 "검수진행중"→"정상/승인"으로 바뀌었는지 확인. 승인 전엔 발송 안 됨.
2. `vercel dev`로 예약 흐름 실제 동작 확인.
3. 배포 시 위 값들을 **Vercel 프로젝트 환경변수에 동일 등록**(`VITE_` 변경 시 Redeploy 필요). Solapi 값(`SOLAPI_PFID`, `SOLAPI_TPL_*`, `HOST_NOTIFY_PHONE`)도 함께 등록할 것.

---

## 10. 빠른 참조

- 통합 커밋: `96a395e` "코칭 예약 시스템(regist-form) 통합 + 연락처/성함 검증 + 인스타 링크"
- 같은 커밋에 포함된 부수 작업: `Contact.tsx` 연락처 검증(010·11자리+자동 하이픈)·성함 숫자차단, `site.ts` 인스타 `@seochojiye`.
- 원본 복구: `git clone https://github.com/haemiru/regist-form`

---

## 12. 메인 사이트 → 예약 진입점 연결 (2026-06-04 분석 / 결정 대기)

다음 작업으로 "메인 사이트에서 예약 시스템으로 가는 동선"을 연결하려다 **제품 결정이 필요해 보류**했다. 돌아오면 아래만 정하면 바로 구현 가능.

### 핵심 발견 — 두 흐름은 성격이 다르다
- 메인 사이트의 **"무료 상담 예약"** 버튼들(`Header.tsx`, `CtaBand.tsx`)은 전부 **`/contact`(문의 폼)** 로 감 = **무료 상담**.
- 예약 시스템 **`/coaching`(BookingHome)** → `/apply`는 **"브레인센트 코어 리셋" 4주 유료 코칭**(후각·호흡·원시반사, **결제 포함**).
- ⇒ 기존 "무료 상담" CTA를 예약 시스템으로 바꾸면 안 됨. **유료 코칭 진입점을 별도로 추가**하는 게 맞다.

### 정해야 할 것 (사용자 결정 필요)
1. **진입점 위치**(복수 가능):
   - `Header.tsx` 데스크톱/모바일에 '코칭 예약' 버튼 추가 (현재 "무료 상담 예약" `Link to="/contact"` 옆/아래)
   - `site.ts`의 `nav` 배열에 메뉴 항목 추가 (단 `nav`는 메인 `Layout` 네비라 `/coaching`는 독립 레이아웃 → 라우팅은 문제없음)
   - `/programs/breath` 상세 페이지 하단에 코칭 CTA (내용 맥락이 가장 맞음 — 후각·호흡)
   - 홈(`pages/Home.tsx`)에 '4주 코칭 프로그램' 섹션 추가
2. **버튼 문구**: "코칭 예약" / "4주 코칭 신청" / "브레인센트 코어 리셋 신청" 중.
3. **선결 이슈 — 브랜딩**: `/coaching` 페이지는 아직 "피지오 후각 연구소 / 브레인센트 코어 리셋" 문구(원본 그대로, §8-4). 메인 사이트(짱샘 키즈피지오)에서 링크로 보내면 **브랜드가 갑자기 바뀌어 보임**. 진입점 연결 전/후에 BookingHome 등 문구를 KidsPhysio 톤으로 통일할지 함께 결정 권장.

### 관련 파일
- `src/components/Header.tsx` (L64, L99 — "무료 상담 예약" Link)
- `src/components/CtaBand.tsx` (L26 — 동일 CTA)
- `src/data/site.ts` (L30 `nav`)
- `src/booking/pages/BookingHome.tsx` (브랜딩 문구 위치)
- 라우트: `/coaching`→BookingHome, `/apply`→Apply (`src/App.tsx` L45~46)

---

## 13. Vercel 배포 + 환경변수 등록 + 검증 (2026-06-04 추가)

### 배경 — `.env.local` 유실 사고
환경변수 등록 작업 중 `vercel link`(CLI 연결)를 실행했더니 **로컬 `.env.local`이 Vercel CLI에 의해 덮어써졌다**(파일에 `VERCEL_OIDC_TOKEN`만 남음). 백업 없음. → 출처별로 **재복구**:
- Supabase 4 + Toss 2 + CRON_SECRET: `ebook/jjangsaem-bookshop/.env.local`에서 복구(공유 가맹점/프로젝트).
- 계좌·Solapi PFID·템플릿4·HOST_NOTIFY_PHONE: 이 문서 §11에 기록돼 있어 복구.
- CRON_SECRET: 신규 재생성(임의값이라 무방).
- ❌ **`SOLAPI_API_KEY` / `SOLAPI_API_SECRET` / `SOLAPI_SENDER_PHONE`**: 사용자 직접입력값이라 문서·타프로젝트 어디에도 없어 **복구 불가** → console.solapi.com에서 재확인/재발급 필요. **단 `_solapi.js`가 미설정 시 fail-soft**(발송 skip, 결제흐름 정상)라 검증엔 지장 없었음.

> 교훈: `vercel link`/`vercel env pull`은 `.env.local`을 덮어쓴다. 실행 전 백업할 것.

### Git ↔ Vercel 연결 (이미 돼 있었음)
- `haemiru/KidsPhysio` → Vercel 프로젝트 **`kids-physio`**(team `junominus-projects`, 도메인 **kidsphysio.kr**)에 **GitHub 연동으로 이미 연결**돼 있음 → main push 시 자동 배포됨. (로컬 `.vercel` 폴더 없음 ≠ 미연결. CLI 링크와 대시보드 연동은 별개.)

### 환경변수 등록 (Vercel)
- `.env.local`의 비어있지 않은 **16키를 production+preview 양쪽에 등록**(`vercel env add`). Solapi 3개(공란)는 스킵.
- ⚠️ `VITE_*` 값은 **빌드타임 주입** → 등록 후 **재배포해야 반영**됨(`vercel --prod`로 재배포 완료).

### 배포 & 스모크 검증 결과 (모두 통과)
- `https://kidsphysio.kr/coaching` → **HTTP 200**
- Supabase anon read: `rf_form_fields`(보호자 성함/연락처… 시드됨), `rf_programs`(베이직 15만/프리미엄 39만) 조회 정상 → `/apply`·`/payment` 렌더 가능.
- 서버리스+service_role: `GET /api/cron/release-holds` (Bearer CRON_SECRET) → **`{"ok":true,"released":0}`** → 함수 실행·DB service_role 경로 정상.

### 남은 일
1. ~~Solapi 3개 값 재확보~~ ✅ **완료(2026-06-04)** — 사용자가 console.solapi.com에서 재확보 → 로컬+Vercel(prod+preview) 등록 + 재배포. 자격증명 유효(`/cash/v1/balance` 200, accountId 응답). ⚠️ 잔액 0/포인트 300 → 실발송 전 충전 검토. 카카오 템플릿 검수 승인 후 자동 발송.
2. 실브라우저로 신청→슬롯→결제 UI 1회 통과(카드는 **라이브키=실결제** 주의, 무통장 흐름으로 검증 권장).

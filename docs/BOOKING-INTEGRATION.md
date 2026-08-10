# 짱샘 키즈피지오 — 작업 인수인계 문서

> KidsPhysio(짱샘 키즈피지오) 사이트 작업 기록.
> 처음엔 **regist-form 예약 시스템 이식**(§0~§16) 기록이었고, 이후 **메인 사이트 개편 + 신청/설문 폼 5종**(§17~§22)까지 누적됐습니다.
> 다시 돌아와 이어서 작업할 때 이 문서부터 읽으면 됩니다.
> 최초 작성: 2026-06-04 · **최종 갱신: 2026-07-27** · 최종 커밋: `07e4012` (main)
>
> ### 🔖 다시 돌아왔다면 **§23(맨 마지막)부터** 읽으세요
> §23 = 현재 상태 한 장 요약 + 다음에 이어서 할 일 + 반복되는 함정 모음.
> 그 위 §0~§22 는 **시간순 작업 로그**라 오래된 내용이 섞여 있습니다(개별 섹션의 "남은 것"은 이후 섹션에서 해소된 경우가 많음 → **§23 이 최신 진실**).
>
> - **§0~§16 예약 시스템(booking)** — 오픈 전 남은 건 실브라우저 end-to-end 검증 1회뿐.
> - **§17~§22 메인 사이트** — 콘텐츠 개편 + **신청/설문 폼 5종** 구축·배포.

---

## 0. 한 줄 요약

> ⚠️ 아래 §0~§22 의 날짜·"남은 것"은 **작성 시점 기준**이다. 최신 상태는 **§23** 참고.

별도 저장소였던 **브레인센트 코어 리셋 코칭 예약 시스템**(`regist-form`, JS)을
KidsPhysio(React+TS+Vite) 안으로 **TypeScript로 변환해 통합**했고, 원본 폴더는 삭제했다.

**현재 상태(2026-06-16)**: 코드 통합·환경변수(로컬·Vercel)·배포(kidsphysio.kr)·솔라피 알림톡 승인·브랜딩 통일·메인 사이트 진입점 연결·개인정보 처리방침까지 **모두 완료**. 빌드/린트 통과. **오픈 전 남은 건 실브라우저 end-to-end 검증 1회 + 솔라피 캐시 충전 검토**(§16 맨 아래).

> **🆕 2026-07 추가 세션(§17)**: 위 예약 시스템과 **별개로**, 메인 사이트 콘텐츠·브랜딩 개편 + **설문(`/survey`→`rf_survey_responses`)·무료상담 폼(`Contact`→`rf_consultations` + 사장님 문자 알림)** 백엔드를 신규 구축·배포. 전자책 50여권·대표번호 010-5686-4182·치료진 "발달재활 전문가"·아로마→"후각발달훈련" 등 반영. **저장·문자 발송 동작 확인 완료.** 상세 §17.

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
| 메인 사이트 → 예약 진입 링크 (CTA) | ✅ **완료(2026-06-13)** — 헤더 버튼·네비 '코칭'·홈 섹션·호흡 프로그램 페이지 4곳에서 `/coaching` 연결. §16 |
| 예약 페이지 브랜딩 ("브레인센트…" 문구) | ✅ **완료(2026-06-13)** — 5개 파일 "피지오 후각 연구소/브레인센트 코어 리셋" → **키즈피지오 톤**으로 통일. 프로그램명 "호흡·후각 4주 코칭". §16 |
| 솔라피 알림톡 템플릿 승인 | ✅ **완료(2026-06-12)** — 키즈피지오 전용 채널(pfId `…819bHStn9Bcoyw`)의 새 4종이 **전부 APPROVED**(API 확인). templateId는 INSPECTING→APPROVED로 **상태만 변경, ID 동일** → `.env.local`·Vercel(prod) 5종 이미 일치, **env 교체·재배포 불필요**. 발신자명 "키즈피지오". 승인 즉시 발송 가능. ⚠️ 잔액 0/포인트 287 — 알림톡은 포인트 차감(가능)이나 SMS 대체발송은 불가, 오픈 전 캐시 충전 검토. §15 |

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

**메인 사이트(`Layout` 안)의 폼 라우트** — 2026-07 세션에서 추가됨. 상세 §23-B.

| 경로 | 페이지 | 추가 |
|---|---|---|
| `/contact` | ContactPage + `Contact.tsx` 폼 | §17 (브레인 코칭) |
| `/survey` | SurveyPage | §17 |
| `/class` | ClassApplyPage | §18 |
| `/project` | ProjectApplyPage | §19 |
| `/core-reset` | CoreResetPage | §20 |

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

## 6. 동작시키려면: 환경변수 (✅ 완료 — 참고용 레퍼런스)

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
- [x] **메인 사이트에서 예약 진입 동선 연결**(2026-06-13, §16) — 헤더·네비·홈 섹션·호흡 프로그램 페이지 4곳.
- [x] **예약 페이지 브랜딩 KidsPhysio로 통일**(2026-06-13, §16) — 5개 파일 문구 교체.
- [x] **개인정보 처리방침(`/privacy`) 사업자정보·보유기간 확정**(2026-06-14, §16) — `site.ts` `business`(주식회사 짱샘에듀/하성재/711-81-03824) + 전자상거래법 법정 보관기간.
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

### 검수 결과 + 반려 2종 수정·재신청 (2026-06-07 추가)

4종 중 **2종 승인 / 2종 반려**(2026-06-05 검수 회신).

| 템플릿 | 결과 | 비고 |
|---|---|---|
| `SOLAPI_TPL_NEW_APPLICATION_HOST` (신규신청 관리자 알림) | ✅ 승인 | 관리자 수신 → 맥락 명확 |
| `SOLAPI_TPL_BOOKING_CONFIRMED` (예약 확정) | ✅ 승인 | 행동·결과가 본문에 드러남 |
| `SOLAPI_TPL_LOOKUP` (예약 조회 안내) | ❌→재신청 | 표준 반려: 수신자 액션 불명확 |
| `SOLAPI_TPL_REMINDER` (회차 리마인더) | ❌→재신청 | 동일 반려 사유 |

**반려 사유(공통)**: 알림톡은 *수신자의 액션 기반 정보성 메시지*에만 발송 가능 — 본문만으로 "누가/왜 받는지" 확인 불가. 검수자가 `신청하신/요청하신/예약하신/예약완료되었습니다` 같은 행동 명시어를 본문에 넣으라고 안내.

**수정 후 재검수 신청(2026-06-07)** — 변수명은 그대로 유지(코드 변경 0):
- 예약 조회 안내: "**요청하신** 예약 조회 링크를 안내드립니다 … 직접 예약 조회를 요청하신 경우에 한해 발송" 문구 추가. (발송 트리거: 고객이 `/my`에서 연락처 입력해 본인조회 요청 → `api/my-lookup.js`)
- 회차 리마인더: "**예약하신** 회차 일정을 안내드립니다 … 예약 완료하신 고객님께 회차 진행 전 안내" 문구 추가.

> ⚠️ **ID 변경 주의**: Solapi에서 본문만 *수정*하면 보통 `templateId` 유지. 단 *삭제 후 신규 등록*했다면 ID가 바뀌므로 `.env.local`·Vercel 양쪽의 `SOLAPI_TPL_LOOKUP`/`SOLAPI_TPL_REMINDER`를 새 ID로 갱신할 것.
> 현재 상태: **재검수 대기 중**(승인 1~2영업일). 승인되면 4종 전부 실발송 가능.

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

---

## 14. 솔라피 알림톡 실발송 검증 (2026-06-11 추가)

검수 재신청(06-07)했던 2종 포함 **템플릿 4종이 전부 승인**됐고, 실발송까지 1건 성공시켜 알림톡 파이프라인 전체가 동작함을 확인.

### 검증 방법
- 점검 스크립트 `scripts/solapi-test.mjs`(신규, git 미추적) — `.env.local`을 직접 파싱해 HMAC 서명으로 솔라피 REST 호출. 무인자=읽기전용(잔액+템플릿상태), `--send`=HOST 폰으로 실발송 1건.
- `_solapi.js`와 동일한 HMAC-SHA256 인증 방식 재현.

### 결과
| 점검 | 결과 |
|---|---|
| `GET /cash/v1/balance` | ✅ 200 — `balance:0, point:300, accountId:26052808082283` |
| `GET /kakao/v2/templates/{id}` 4종 | ✅ **전부 `status:APPROVED`** (신규신청 관리자알림·예약확정·예약조회안내·회차리마인더) |
| templateId 변경 여부 | ✅ 06-04 등록값 그대로 — 본문만 수정해 ID 유지됨 → `.env.local`·Vercel **갱신 불필요** |
| `POST /messages/v4/send` (ATA, HOST→HOST) | ✅ `statusCode:2000` 정상 접수, `messageId:M4V2026...`. 신규신청 관리자알림 템플릿, 변수 `#{보호자}/#{아이}/#{연락처}` 채워 발송 |

### 주의 / 남은 점
- ⚠️ **잔액 0원 / 포인트 300** — 알림톡 본건은 포인트로 차감되나, `disableSms:false`라 카카오 발송 실패 시 **SMS 대체발송이 잔액 0이라 불가**. 운영 전 솔라피 캐시 충전 권장.
- 발송 1건은 실제 카카오톡으로 도착(수신처=사장님 본인 010-5776-3325).
- 코드 경로(`api/_notify.js` → `_solapi.js`)는 미검증이나, 동일 엔드포인트·인증·페이로드를 스크립트로 재현해 통과했으므로 자격증명·템플릿·발송 자체는 정상. 남은 건 실브라우저 신청→확정 시 `notifyHost/notifyBookingConfirmed`가 호출되는 end-to-end 흐름.

### 점검 스크립트 3종 (신규, git 미추적)
- `scripts/solapi-test.mjs` — 잔액+템플릿상태 조회, `--send`로 실발송 1건
- `scripts/solapi-channels.mjs` — 연동된 카카오 채널(발신프로필) 목록
- `scripts/solapi-templates.mjs` — 템플릿 4종 본문 덤프
- 셋 다 `.env.local`을 직접 파싱(시크릿 하드코딩 없음). `node scripts/solapi-*.mjs`로 실행.

---

## 15. ★ 진행 중: 키즈피지오 전용 카카오 채널 분리 (2026-06-11 — 채널 승인·연동·env교체·배포 완료, 새 템플릿 4종 검수 중)

**배경**: 현재 알림톡 발신자명이 **"주식회사 짱샘에듀"**(= 솔라피 계정에 연동된 *유일한* 카카오 채널 `짱샘책방`의 channelName). 사용자가 솔라피를 키즈피지오 외 여러 사업에서도 쓸 예정 → **브랜드별 카카오 채널 분리** 구조로 가기로 결정.

**구조 원칙**:
- 솔라피 **계정 1개**(주식회사 짱샘에듀, accountId `26052808082283`) = 로그인·캐시 공유. **메시지엔 안 나타남.**
- 알림톡 발신자명 = **연결된 카카오 채널명**. 채널은 계정에 **여러 개 연동 가능**(각 pfId 별도).
- 따라서: **계정엔 채널 "추가"**, 이 KidsPhysio 프로젝트 `.env`엔 값 **"교체"**(예약 코드는 채널 1개만 참조 — `SOLAPI_PFID` + `SOLAPI_TPL_*` 4개). 책방 채널은 책방 프로젝트에 그대로 살아있음.

**진행 이력**:
- 2026-06-11 ① 키즈피지오 전용 카카오톡 채널 **개설 신청** — 사업자등록증 법인명(주식회사 짱샘에듀) ≠ 채널명(키즈피지오) → "사업자 정보와 다른 이유" 소명 + `kidsphysio.kr` 링크 제출. 인허가 서류 단계 통과해 신청 완료.
- 2026-06-11 ② ❌ **비즈니스 채널 심사 반려** (카카오비즈니스 파트너센터 카톡). 사유 1건: **"사업자–채널 연관성 확인/검증 불가"** — 사업자 정보·채널명·콘텐츠(판매상품)가 동일 주체임을 확인할 자료 부족. 인정 자료: 홈페이지URL·기사·장소정보·간판이미지·(해당시)업무대행 계약서.
- 2026-06-11 ③ ✅ **연관성 보강 작업 완료** — `kidsphysio.kr` 푸터에 사업자 정보 블록 추가(상호 주식회사 짱샘에듀 / 대표 하성재 / 사업자등록번호 711-81-03824 / 주소). 사업자등록증과 100% 일치. commit `c03c673`, Vercel 자동배포 + 라이브 번들에서 값 노출 확인(`grep 711-81-03824` 통과). 파일: `src/data/site.ts`(`business` 객체) + `src/components/Footer.tsx`.
- 2026-06-11 ④ ✅ **재신청 완료**(사용자). 제출: 홈페이지 URL `https://kidsphysio.kr` + 연관성 소명 문구("짱샘에듀가 운영하는 아동발달·후각/호흡 교육 브랜드 = 키즈피지오, 전자책·후각키트·아로마 = 전자상거래 소매업").
- 2026-06-11 ⑤ ✅ **채널 심사 승인 + 솔라피 연동 완료** — 키즈피지오 전용 채널 `searchId 키즈피지오` / **pfId `KA01PF260611064605819bHStn9Bcoyw`** 발급(accountId `26052808082283` 동일 계정, `node scripts/solapi-channels.mjs`로 확인). 알림톡 발신자명이 "주식회사 짱샘에듀"→**"키즈피지오"**로 바뀜.
- 2026-06-11 ⑥ ✅ **템플릿 4종 새 채널에 재등록 + 검수요청 완료**(`scripts/solapi-create-templates.mjs`, API). 본문·변수·카테고리(999999)는 기존 승인본과 **동일 → 코드 변경 0**. 현재 4종 전부 `INSPECTING`. 발급된 새 templateId:

  | 변수 | 새 templateId (키즈피지오 채널) |
  |---|---|
  | `SOLAPI_TPL_NEW_APPLICATION_HOST` | `KA01TP260611065019777bo9z044JfXb` |
  | `SOLAPI_TPL_BOOKING_CONFIRMED` | `KA01TP2606110650198933MvoeCogWyn` |
  | `SOLAPI_TPL_LOOKUP` | `KA01TP260611065019978WlaQbheefMV` |
  | `SOLAPI_TPL_REMINDER` | `KA01TP2606110650200501SbL1Lii4gd` |

  > ⚠️ 검수 요청 엔드포인트는 `PUT /kakao/v2/templates/{id}/inspection` (POST 아님, POST는 404). 참고용.

- 2026-06-11 ⑦ ✅ **env 교체 + 재배포 완료**(서비스 전이라 승인 전 선반영 결정). `.env.local` + Vercel(prod·preview) 양쪽의 `SOLAPI_PFID` + `SOLAPI_TPL_*` 4개를 ⑥ 새 값으로 교체 → `vercel --prod` 재배포(alias `kidsphysio.kr`). `node scripts/solapi-test.mjs`로 PFID·템플릿 4종(INSPECTING) 정상 참조 확인.
  > ⚠️ 새 템플릿 4종이 **APPROVED 되기 전엔 실발송 시 카카오가 막음**. 서비스 오픈 전까지는 무방하나, 오픈 전 반드시 4종 승인 확인할 것. 짱샘책방 채널/템플릿은 책방 프로젝트에 그대로 살아있음(이 프로젝트는 더 이상 참조 안 함).
- 2026-06-11 ⑧ ✅ **고아 템플릿 1건 삭제**. ⑥ 첫 스크립트 실행이 버그(`res.json()`→`res.text()` 이중 read)로 1번째 템플릿 생성 직후 죽어, 검수요청 안 된 `신규신청 관리자 알림` 중복본(`KA01TP260611065009309j4B8ONk6Qvw`, status PENDING=콘솔 "검수필요")이 남아 있었음 → `DELETE /kakao/v2/templates/{id}`로 제거. 현재 키즈피지오 채널엔 **env와 일치하는 4종(전부 INSPECTING)만** 존재.
- 2026-06-12 ⑨ ✅ **새 템플릿 4종 전부 APPROVED**(`node scripts/solapi-new-channel-status.mjs` API 확인). templateId는 INSPECTING→APPROVED로 **상태만 변경, ID 그대로** → `.env.local`(5종 일치 재확인) + Vercel prod(5종 등록, 18h ago) **교체·재배포 불필요**. 카카오 알림톡 발송 차단 해제 — 발신자명 "키즈피지오"로 즉시 발송 가능.
- 2026-06-12 ⑩ ✅ **새 채널 실발송 검증 통과**. `node scripts/solapi-test.mjs --send` → 신규신청 관리자알림 ATA를 HOST(010-5776-3325)로 발송, `statusCode:2000` 정상 접수(`messageId:M4V20260612091616NLNJYSOVGBETWLM`). 키즈피지오 채널 알림톡 파이프라인 end-to-end 동작 확인. **잔액 0/포인트 287 유지**(알림톡은 포인트 차감).

**반려 핵심 교훈**: 사업자등록증 업종이 정보통신/출판/전자상거래/SW(=교육·이커머스)인데 채널은 "피지오(치료)" → 심사자가 연결고리를 못 봄. 푸터 등록번호 일치 + "짱샘에듀가 운영하는 키즈피지오 브랜드" 소명 + 전자상거래(전자책·키트 판매)와 채널 목적 일치, 이 3개로 연관성 입증.

**★ 검수 승인 완료(⑨). 오픈 전 남은 일**:
1. ✅ **검수 승인 확인 완료**(2026-06-12, ⑨). env 교체·배포 불필요(ID 동일).
2. **실발송 1건 검증**(선택): `node scripts/solapi-test.mjs --send` → HOST 폰으로 1건 발송, 발신자명이 **"키즈피지오"**로 도착하는지 확인. (포인트 차감)
3. ⚠️ **잔액 0/포인트 287** — 알림톡은 포인트 차감(가능), 단 SMS 대체발송은 잔액 0이라 불가. 오픈 전 솔라피 캐시 충전 검토.
- 템플릿 문구 수정은 "서비스하며 필요할 때" 하기로 보류(현행 4종 그대로 진행).

**관련 스크립트(신규, git 미추적)**: `scripts/solapi-create-templates.mjs`(재등록+검수요청), `scripts/solapi-new-channel-status.mjs`(검수상태 폴링+교체 env 출력).

---

## 16. 예약 진입점 연결 + 브랜딩 통일 + 개인정보방침 확정 (2026-06-13~14)

솔라피 승인(§15 ⑨⑩)으로 오픈 차단 요인이 풀려, §12에서 "제품 결정 대기"로 보류했던 두 가지를 사용자 결정대로 구현. **빌드(tsc+vite)·lint 모두 통과**. 코드만 변경(env·배포·DB 변화 없음).

### 사용자 결정
- **브랜딩**: 예약 페이지를 **키즈피지오로 통일**(원본 "피지오 후각 연구소/브레인센트 코어 리셋" 폐기).
- **진입점**: 헤더 버튼 + 네비 메뉴 + 홈 섹션 + 호흡 프로그램 페이지 **4곳 전부**.

### A. 브랜딩 통일 — 5개 파일 문구 교체 (라우트·코드 로직 변화 0)
프로그램 표시명을 **"호흡·후각 4주 코칭"**(부제: 후각·호흡·원시반사 기반 신경계 코어 회복)으로 통일.

| 파일 | 변경 |
|---|---|
| `src/booking/pages/BookingHome.tsx` | eyebrow "피지오 후각 연구소"→"짱샘 키즈피지오", h1 "브레인센트 코어 리셋 코칭 신청"→"호흡·후각 4주 코칭 신청" |
| `src/booking/components/PublicLayout.tsx` | 헤더 로고 링크 + 푸터 문구 → "짱샘 키즈피지오 / 호흡·후각 4주 코칭" |
| `src/booking/pages/admin/AdminLayout.tsx` | "관리자 · 브레인센트"→"관리자 · 키즈피지오 코칭" |
| `src/booking/pages/admin/AdminLogin.tsx` | "브레인센트 코어 리셋 운영"→"짱샘 키즈피지오 코칭 운영" |

> `grep -r "브레인센트\|피지오 후각 연구소"` → `src/booking/` 내 **0건**(메인 사이트 `site.ts`의 "피지오 후각 연구소 소장" 등 짱샘 소개 문구는 의도적으로 유지).

### B. 진입점 4곳 → `/coaching` 연결
| 위치 | 파일 | 구현 |
|---|---|---|
| 네비 메뉴 | `src/data/site.ts` `nav` | '발달치료' 다음에 `{ label: '코칭', to: '/coaching' }` 추가 (데스크톱 상단 nav + 모바일 드로어에 자동 노출) |
| 헤더 액션 버튼 | `src/components/Header.tsx` | 데스크톱 "무료 상담 예약"(coral) 옆에 **"4주 코칭"**(btn-ghost) 추가 / 모바일 드로어에 "4주 코칭 신청" 버튼 추가 |
| 홈 섹션 | `src/components/Coaching.tsx`(신규) + `src/pages/Home.tsx` | '발달치료(Programs)' 다음에 brand-600 밴드 섹션 삽입(3포인트 + "4주 코칭 신청하기" CTA) |
| 호흡 프로그램 페이지 | `src/pages/ProgramDetailPage.tsx` | `program.id === 'breath'`일 때만 사이드바에 코칭 CTA 카드 노출(후각·호흡 맥락 일치) |

> **설계 주의 유지**: 기존 "무료 상담 예약"(→`/contact`, 무료 문의)은 그대로 두고, **유료 4주 코칭 진입점만 신설**(§12 핵심 발견 = 두 흐름 성격 다름).

### C. `/privacy` 사업자정보·보유기간 확정 (2026-06-14 추가)
`src/booking/pages/Privacy.tsx` — "초안" 경고 제거하고 실제 내용으로 확정.
- `site.ts` `business`를 import해 **처리자 정보 섹션 신규**(상호 주식회사 짱샘에듀 / 대표 하성재 / 등록번호 711-81-03824 / 주소·연락처·이메일). 하드코딩 대신 단일 출처 참조.
- **보유기간**: "프로그램 종료 후 1년" + 전자상거래법 법정 보관(계약·결제 5년, 분쟁 3년) 명시. 결제(토스) 포함 서비스라 법정 보관 근거 필요.
- 처리위탁 3사(토스페이먼츠·솔라피·Supabase) 항목화. 권리 행사 항목 보강.
> 보유기간 "1년"은 일반적 기본값 — 운영 정책에 따라 조정 가능.

### 커밋
- `154ea37` — 브랜딩 통일(A) + 진입점 4곳(B). 10개 파일(코드 9 + 신규 `Coaching.tsx`).
- `fb3a7b5` — `/privacy` 사업자정보·보유기간(C). 2개 파일.
- (둘 다 main push 완료 → kidsphysio.kr 자동 배포 반영됨.)

---

## ⏭️ 다음에 돌아오면 곧바로 할 일 (오픈 전 최종 관문)

여기까지 오면 **코드/배포/알림톡/브랜딩/진입점/방침이 전부 끝난 상태**다. 오픈 전 남은 건 아래 둘뿐.

### 1. 실브라우저 end-to-end 검증 1회 (가장 중요)
실제 브라우저에서 무통장 흐름으로 한 바퀴 돌려, 신청→슬롯Hold→결제안내→알림톡 발송까지 코드 경로(`api/_notify.js`→`_solapi.js`)가 실제로 동작하는지 확인. (§14는 스크립트로 발송만 검증, end-to-end는 미검증.)

- **경로**: `https://kidsphysio.kr/coaching` → 신청(`/apply`) → 시간선점(`/booking`) → 결제(`/payment`)에서 **무통장 선택**(카드는 라이브키=실결제라 지양) → `/complete` 계좌안내 확인.
- **확인 포인트**:
  - 신청 직후 **관리자 알림톡**(`HOST_NOTIFY_PHONE=010-5776-3325`)이 발신자명 **"키즈피지오"**로 도착하는지.
  - 관리자(`/admin`)에서 입금확인→확정 시 **예약확정 알림톡**이 신청자에게 가는지.
  - `/my`에서 연락처로 본인조회 → **조회 안내 알림톡** 발송되는지.
- **로컬 풀테스트가 필요하면** `vercel dev`(그냥 `npm run dev`는 `/api` 서버리스가 안 돎).

### 2. 솔라피 캐시 충전 검토
⚠️ **잔액 0원 / 포인트 287**. 알림톡 본건은 포인트로 차감(현재 가능)이나, 카카오 발송 실패 시 **SMS 대체발송(`disableSms:false`)이 잔액 0이라 불가**. 운영 트래픽 전 console.solapi.com에서 캐시 충전 권장.

### 그 외 선택 항목 (오픈 필수 아님)
- `/privacy` 보유기간 "1년"은 기본값 — 운영 정책 확정 시 조정(§16-C).
- 토스 결제 도중 15분 Hold 만료 가능 → 결제 시작 시 hold 연장 보강(§9).
- 번들 code-split, supabase 타입 생성(§9).

### 참고
- **점검 스크립트**(git 미추적, `scripts/`): `solapi-test.mjs`(잔액·템플릿상태, `--send`로 실발송 1건), `solapi-channels.mjs`(채널 목록), `solapi-new-channel-status.mjs`(검수상태). `.env.local` 직접 파싱.
- 키 출처·복구는 §11·§13, 솔라피 채널 분리는 §15.

---

## 17. 메인 사이트 콘텐츠 개편 + 설문·무료상담 폼 백엔드 (2026-07-20~21)

> §0~16은 **코칭 예약 시스템**(booking) 이야기. 이 세션은 **메인 사이트 콘텐츠/브랜딩 개편**과, 예약과 별개인 **신규 백엔드 기능 2종**(설문 저장·무료상담 접수 + 문자 알림). 빌드(tsc) 통과, 브라우저로 확인, main push·자동배포 반영, 실제 저장·문자 발송까지 동작 확인 완료.

### A. 메인 사이트 콘텐츠·브랜딩 개편
| 항목 | 내용 | 파일 |
|---|---|---|
| 헤더 내비 깨짐 수정 | 메뉴 글자 세로 줄바꿈 문제 → `whitespace-nowrap` + 가로 메뉴를 **xl(≥1280px)** 에서만 표시, 그 이하 햄버거 | `Header.tsx` |
| 아로마 → **후각발달훈련** | 메뉴·홈 섹션·`/aroma` 페이지·히어로·푸터·메타 명칭 통일. **`/aroma` 경로는 유지**(기존 링크 보존) | `site.ts`, `Aroma.tsx`, `AromaPage.tsx`, `Hero.tsx`, `Footer.tsx`, `index.html` |
| 발달 프로그램 3종 삭제 | 감각통합·작업치료·언어치료 제거 → **6→3**(물리치료·호흡후각훈련·놀이원시반사통합). `programDetails`도 정리. "6가지/6개 영역"→3 | `site.ts`, `Programs.tsx`, `ProgramsPage.tsx` |
| 전자책 수 | 30여 권 → **50여 권**, 통계 30+ → 50+ | 전 노출 지점 |
| 대표 전화번호 | 010-5776-3325 → **010-5686-4182** (헤더·히어로·푸터·사업자정보·설문 안내 등) ⚠️ 아래 D의 발신/수신 번호와 **별개** | `site.ts` 등 |
| "전문 치료진" → **"발달재활 전문가"** | 제목·프로그램·상담·CTA·진행단계 전체 통일, "국가자격을 갖춘~" 문구 삭제 | `Team.tsx`, `TeamPage.tsx`, `Programs.tsx`, `ProgramsPage.tsx`, `Contact.tsx`, `CtaBand.tsx`, `site.ts` |
| 히어로 체크칩 추가 | "신경계 육아 코칭", "브레인센트 코칭" | `Hero.tsx` |
| 통계 정리 | "5종 아로마·후각 케어 라인" 삭제 → **25년/50+/3개 영역** 3칸 | `site.ts`, `Stats.tsx`, `AboutPage.tsx` |

> 코칭 프로그램 자체 이름(예약 시스템의 "호흡·후각 4주 코칭")은 사용자 지시로 **그대로 유지**. 히어로 칩에 "브레인센트 코칭" 문구만 추가.

### B. 짱샘 프로필 사진
- 새 헤드샷 **`public/team/jjangsaem.png`**(340×526)로 교체(기존 배포본에서 깨지던 `jjangsaem.jpg` 대체). `team[0].photo` + `founder.photo` 둘 다 이 파일로 통일 → 치료진·홈 소개·센터소개 일관.
- 원형/카드 사진 **머리 잘림 수정**: `object-cover object-top`(`Founder.tsx`, `AboutPage.tsx`, `Team.tsx`, `TeamPage.tsx`).
- 놀이·정서지원팀 삭제 → 치료진 **짱샘 1명**, 단일 카드 가운데 정렬(flex-wrap justify-center).

### C. 설문 (Brain Scent Project 종료 설문) — 신규 기능
- 네비 '설문' 탭 + 라우트 **`/survey`**. `src/pages/SurveyPage.tsx`(신규) + `src/data/survey.ts`(신규 스키마: **10섹션 + 추가문항**, 유형 = 단일/다중[최대 N개 제한]/5점 척도/NPS 0-10/서술형). 익명 제출.
- 저장: **`api/survey-submit.js`**(신규) → Supabase **`rf_survey_responses`**. RLS on + 공개정책 없음(서버 service_role만). 세분화 컬럼(child_age·diagnosis·nps·app_intent·marketing_consent) + 전체 `answers` jsonb.
- 마이그레이션 **`supabase/migrations/0005_survey.sql`** — **사용자가 Supabase SQL Editor에서 실행 완료.**
- 응답 확인: Supabase Table Editor → `rf_survey_responses`.

### D. 무료 상담 폼(Contact) 실동작화 + 사장님 문자 알림 — 신규 기능
> ⚠️ **핵심 발견**: 홈/오시는길 하단 "무료 상담 신청서"(`Contact.tsx`)는 **데모였음** — 제출해도 가짜 성공 화면만 뜨고 **데이터가 버려짐**(어디에도 저장·전송 안 됨). 이번에 실제 접수로 전환.

- **폼**: `Contact.tsx` — POST `/api/consult-submit`, 로딩/에러 상태, **허니팟**(봇 차단, 문자 과금 방지). `/contact` 페이지도 같은 `<Contact/>` 재사용이라 자동 반영.
- **저장 + 알림**: **`api/consult-submit.js`**(신규) → **`rf_consultations`** 저장 후 사장님께 **일반 문자(LMS)** 발송. 문자 실패해도 저장은 성공(신청 우선).
- **`api/_solapi.js` 확장**(예약 시스템과 공유 파일 — 추가만, 기존 로직 불변): 템플릿 불필요한 `sendSms`(LMS) 추가, `logNotification`에 `channel` 인자, `parsePhones`(콤마 다중 번호) 추가.
- **`api/_notify.js`**: 예약 호스트 알림(`notifyHostNewApplication`)도 다중 번호 지원(콤마값에 안 깨지게).
- 마이그레이션 **`supabase/migrations/0006_consultations.sql`** — **사용자 실행 완료.** RLS on, 공개정책 없음.
- 확인: Supabase Table Editor → `rf_consultations`(신청), `rf_notifications`(발송 로그, channel=sms·kind=consultation).

#### ★ 문자 알림 환경변수 — 3개 번호를 절대 혼동하지 말 것
| 환경변수 | 값(2026-07-21) | 의미 |
|---|---|---|
| `HOST_NOTIFY_PHONE` | `010-5686-4182,010-7700-3324` | 알림 **받는** 번호(콤마로 여러 명, `parsePhones`가 분해). 로컬 `.env.local` + Vercel 양쪽 |
| `SOLAPI_SENDER_PHONE` | **`010-7700-3324`** | 문자 **보내는** 번호. **솔라피 콘솔에 발신번호로 등록·인증된 번호여야 함** |
| 사이트 표시번호(`site.phone`) | `010-5686-4182` | 화면 노출용. 위 둘과 무관 |

- **디버깅 이력(중요)**: 처음엔 문자가 안 왔음 → `rf_notifications`에 `status=failed, error=발신번호 미등록`. 원인은 `SOLAPI_SENDER_PHONE`이 미등록 번호(구 010-5776-3325)였던 것. 솔라피 콘솔에 등록된 발신번호는 **010-7700-3324 하나뿐**(활성화·인증완료). → Vercel `SOLAPI_SENDER_PHONE`을 **010-7700-3324로 교체 + Redeploy** → **발송 성공 확인**(`status=sent`, 문자 도착).
- 진단 SQL: `select created_at, kind, channel, recipient, status, error from rf_notifications order by created_at desc limit 10;`
- ⚠️ **알림톡 vs 일반문자**: 예약(booking)은 카카오 **알림톡**(템플릿 필수, pfId로 발송 → 발신번호 등록과 무관). 상담은 **일반 문자(LMS, 템플릿 불필요)**. LMS/SMS는 **발신번호 등록이 필수**라 이번에 문제가 드러남.
- ⚠️ **잔액**: 솔라피 총 잔액 **약 274원**(2026-07-21). LMS ~30-40원/건 × 상담 1건당 2번호 = ~60-80원. **운영 트래픽 전 충전 필수**(console.solapi.com → 결제 및 잔액). §16-2·§15와 동일 이슈.
- Vercel 환경변수 변경 시 **반드시 Redeploy** 해야 함수에 반영됨(빈 커밋 `2abcfe2`로 재배포 트리거한 이력 있음). `.env.local`은 Vercel로 자동 동기화 안 됨(별도 등록).

### 이번 세션 커밋 (main, 자동배포됨)
| 커밋 | 내용 |
|---|---|
| `dcb10f4` | 후각발달훈련 리브랜딩 + 작업/언어/감통 제거 + 헤더 내비 정렬 |
| `c7ba35e` | 설문(`/survey`) 탭 신설 + 짱샘 사진 교체 + 놀이팀 삭제 |
| `b50edfa` | 전자책 50여권·전화번호 변경 + 사진 크롭 + 치료진→발달재활 전문가 + 통계/히어로 정리 |
| `3ac2ca2` | 무료 상담 폼 실동작화(Supabase 저장 + 문자 알림, 다중 번호) |
| `2abcfe2` | (빈 커밋) 환경변수 반영용 재배포 트리거 |

### DB 마이그레이션 추가 (공유 Supabase `yvuekbmidwetaulasksk`)
- `supabase/migrations/0005_survey.sql` → `rf_survey_responses` (설문)
- `supabase/migrations/0006_consultations.sql` → `rf_consultations` (무료 상담)
- 둘 다 RLS on + 공개정책 없음(서버 service_role 전용). **사용자가 SQL Editor에서 실행 완료.**

### 상태 / 남은 것
- 설문·무료상담 폼 **저장 + 문자 알림까지 전부 동작 확인 완료**(2026-07-21).
- 남은 권장 작업: **솔라피 캐시 충전**(잔액 ~274원). 그 외 오픈 필수 아님.

---

## 18. 클래스 신청 탭 신설 — 브레인센트 후각키트 만들기 (2026-07-22)

> 전문가·부모 대상 오프라인 클래스 신청서. 구조는 §17-C 설문(`/survey`)과 동일한 패턴(데이터 스키마 파일 + 렌더러 페이지 + `/api` 저장 + 사장님 문자). 설문과 달리 **실명·연락처를 받는 신청서**라 필수 검증 + 개인정보 동의가 붙는다.

### A. 구성 파일
| 파일 | 역할 |
|---|---|
| `src/data/classApply.ts` (신규) | 문항 스키마(11섹션) + 입금계좌(`classAccount`) + 개인정보 동의 문구(`privacyConsent`·`marketingConsent`). **문항 id는 분석 컬럼처럼 쓰이므로 변경 금지** |
| `src/pages/ClassApplyPage.tsx` (신규) | 스키마를 읽어 렌더 + 검증 + 제출. 유형 = 텍스트(text/tel/email)·서술형·단일선택·다중선택·**기타 직접입력** |
| `api/class-apply.js` (신규) | Supabase `rf_class_applications` 저장 → 사장님 LMS 발송(`sendSms`, kind=`class_application`) |
| `supabase/migrations/0007_class_applications.sql` (신규) | 테이블. RLS on + 공개정책 없음(서버 service_role 전용) |
| `src/App.tsx` / `src/data/site.ts` | 라우트 `/class` 추가 + 네비 '클래스' 탭 추가(푸터 바로가기는 `nav` 재사용이라 자동 반영) |

### B. 신청서 문항 (11섹션)
1. 기본 정보(성함·연락처·이메일·거주지역) — **전부 필수** / 2. 현재 하고 있는 일(+기타 직접입력) / 3. 주로 만나는 대상 / 4. 후각 중재 경험(단일) / 5. 신청 이유(서술) / 6. 대상의 고민(+기타) / 7. 먼저 적용하고 싶은 대상(+기타) / 8. 배우고 싶은 내용 / 9. 궁금한 질문(서술) / 10. 얻고 싶은 변화 + "후각을 배우면 당신의 일에서 무엇이 달라질 것 같나요?"(서술) / 11. 마케팅 문항(듣고 싶은 이유 1개 + 앞으로 배우고 싶은 주제 복수)

### C. 검증·봇 차단
- 클라이언트·서버 **양쪽에서 동일 검증**: 성함 2자↑, 연락처 `010`+11자리, 이메일 형식, 거주지역 필수, **개인정보 필수동의 체크**. 실패 시 첫 오류 항목으로 자동 스크롤.
- 성함은 한글·영문·공백만 허용(sanitize), 연락처는 입력 중 `010-XXXX-XXXX` 자동 포맷 — `Contact.tsx`와 동일 방식.
- **허니팟**(`company` 숨김 필드) — 봇이 채우면 성공처럼 응답하되 저장·문자 발송 생략(문자 과금 방지). `consult-submit`과 동일.

### D. 입금 계좌 (화면 노출)
- **기업은행 667-029459-01-011 (예금주 장지예)** — `classAccount`에 정의. 신청서 하단 + 제출 완료 화면 양쪽에 노출, 계좌번호 복사 버튼 제공.
- 입금 확인은 수기 관리(`rf_class_applications.status`: `new` → `paid` → `done`).

### E. 개인정보 활용 동의
- **필수** — 수집항목/이용목적/보유기간(클래스 종료 후 1년)/처리위탁(솔라피·Supabase) 4항목 명시 + 거부권 고지. 체크 없으면 제출 불가(서버도 `privacyConsent !== true` 면 400 `CONSENT_REQUIRED`).
- **선택** — 마케팅·홍보 활용. 미동의해도 신청 가능. `marketing_consent` 컬럼에 저장.

### F. 헤더 내비 오버플로 수정 (동반 수정)
> 메뉴가 9개일 때 이미 한계였음 — 헤더 컨테이너(76rem=1176px 가용)에 로고+메뉴+우측 CTA가 안 들어가 **전화번호가 3줄로 접히던 상태**. 클래스 탭(10번째)을 넣자 로고 워드마크까지 줄바꿈.
- **헤더만 본문보다 넓은 컨테이너 사용**: `container-page`(76rem) → `max-w-[86rem] px-5`. 본문 정렬은 그대로 두고 헤더만 여유 확보.
- 메뉴 항목 좌우 패딩 `px-3`→`px-2.5`, 로고 `shrink-0`+`whitespace-nowrap`, 전화번호 링크 `whitespace-nowrap`.
- 네비 라벨은 **'클래스'**(짧게). 페이지 제목·빵부스러기는 '클래스 신청' 유지.

### G. 확인한 것 / 남은 것
- ✅ `tsc -b` + `vite build` + eslint 통과, 브라우저에서 렌더·기타직접입력 토글·필수검증(4개 항목 오류 표시)·헤더 1줄 정렬 확인.
- ⚠️ **남은 필수 작업 2가지**
  1. ~~`supabase/migrations/0007_class_applications.sql`을 Supabase SQL Editor에서 실행~~ → **실행 완료**(2026-07-27 테이블 존재 확인, 누적 6건).
  2. main push → 자동배포. `/api/*`는 Vercel 함수라 **로컬 dev(`npm run dev`)에서는 제출이 동작하지 않음** — 배포본에서 실제 제출 1건으로 저장·문자 확인 필요.
- 알림 문자는 §17-D의 `HOST_NOTIFY_PHONE`·`SOLAPI_SENDER_PHONE`을 그대로 사용(추가 환경변수 없음). **솔라피 잔액 부족 시 문자만 실패하고 신청 저장은 성공** — 잔액 확인 필요(§17-D).
- 응답 확인: Supabase Table Editor → `rf_class_applications`(신청), `rf_notifications`(발송 로그, channel=sms·kind=`class_application`).

---

## 19. 신청서 탭 신설 — 브레인센트 4주 몸읽기 프로젝트 (2026-07-26)

> 7일 몸읽기 프로젝트 참여자를 대상으로 한 4주 유료 프로젝트 신청서. 구조는 §18 클래스(`/class`)와 **동일한 패턴**(데이터 스키마 파일 + 렌더러 페이지 + `/api` 저장 + 사장님 문자). 클래스와 달리 이메일·거주지역 대신 **카카오톡 닉네임·아이 정보**를 받는다(운영이 카톡 단톡방이라서).

### A. 구성 파일
| 파일 | 역할 |
|---|---|
| `src/data/bodyProject.ts` (신규) | 안내 문구(`projectInfo`) + 문항 스키마(7섹션) + 참가비·계좌(`projectFee`·`projectAccount`) + 개인정보 동의 문구. **문항 id는 분석 컬럼처럼 쓰이므로 변경 금지** |
| `src/pages/ProjectApplyPage.tsx` (신규) | 스키마를 읽어 렌더 + 검증 + 제출. 클래스 페이지 대비 추가된 것 = **안내 카드**, **서술형 예시(`examples`)**, **단독 선택 보기(`exclusiveOption`)** |
| `api/project-apply.js` (신규) | Supabase `rf_project_applications` 저장 → 사장님 LMS 발송(`sendSms`, kind=`project_application`) |
| `supabase/migrations/0008_project_applications.sql` (신규) | 테이블. RLS on + 공개정책 없음(서버 service_role 전용). 회차 구분은 `project_key`(기본 `body_reading_4w`) |
| `src/App.tsx` / `src/data/site.ts` | 라우트 `/project` 추가 + 네비 '몸읽기' 탭 추가(푸터 바로가기는 `nav` 재사용이라 자동 반영) |

### B. 신청서 구성 (10블록)
1. 안내(운영기간·참가비·운영·제공 4종 — 카드) / 2. 보호자 정보(성함·연락처·카톡닉네임) / 3. 아이 정보(이름·나이 6구간) / 4. 기대하는 변화(복수+기타 직접입력) / 5. 7일 프로젝트에서 도움된 것(서술) / 6. 4주 동안 기대하는 것(서술+예시 3종) / 7. 궁금한 내용(서술) / **8. 이후 함께하고 싶은 프로그램(복수)** / 9. 참가비 안내 / 10. 개인정보 동의

- **8번은 사장님이 추가 요청한 문항** — 다음 기획 우선순위를 정하는 데이터로 `future_programs` 컬럼에 따로 정규화해 쌓는다.
- 8번의 `아직 결정하지 못했습니다.`는 **단독 선택**(고르면 나머지 해제, 다른 걸 고르면 자동 해제) — `exclusiveOption`.

### C. 검증·봇 차단
- 클라이언트·서버 **양쪽에서 동일 검증**: 보호자 성함 2자↑, 연락처 `010`+11자리, **카카오톡 닉네임**, **아이 이름**, **아이 나이**, 개인정보 필수동의. 실패 시 첫 오류 항목으로 자동 스크롤.
- 성함은 한글·영문·공백만 허용(sanitize), 연락처는 입력 중 `010-XXXX-XXXX` 자동 포맷 — 클래스 신청서와 동일 방식.
- **허니팟**(`company` 숨김 필드) — 봇이 채우면 성공처럼 응답하되 저장·문자 발송 생략.
- 클래스 신청서와 달리 **선택(마케팅) 동의는 없다** — 필수 동의 1개만 받는다.

### D. 참가비 계좌 (화면 노출)
- 참가비 **40,000원** / **기업은행 667-029459-01-011 (예금주 장지예)** — §18 클래스와 **같은 계좌**를 `projectAccount`에 정의. 신청서 하단 + 제출 완료 화면 양쪽에 노출, 계좌번호 복사 버튼 제공.
- 입금 확인은 수기 관리(`rf_project_applications.status`: `new` → `paid` → `done`). 입금 확인 후 카톡 단톡방 초대.

### E. 헤더 내비 (동반 수정)
> 메뉴가 **11개**가 되면서 xl(1280px)에서 남는 여유가 7px까지 줄어듦(§18-F 재발 직전). 항목 좌우 패딩 `px-2.5`→`px-2`, 항목 간격 `gap-0.5`→제거로 **여유 71px 확보**(11개 기준 필요 폭 1209px < 1280px).
- 네비 라벨은 **'몸읽기'**(짧게). 페이지 제목·빵부스러기는 '4주 몸읽기 프로젝트'.
- ⚠️ **메뉴를 더 늘리려면** 헤더가 다시 접힌다. 12번째부터는 라벨 축약이 아니라 **드롭다운 묶음이나 xl 브레이크포인트 상향**을 검토할 것.

### F. 확인한 것 / 남은 것
- ✅ `tsc -b` + `vite build` + eslint 통과.
- ✅ 브라우저(1280px 기준) 확인: 헤더 1줄 정렬, 안내 카드·예시 블록 렌더, **필수검증 6건 모두 표시**, 성함 특수문자 제거·연락처 자동 포맷, **단독 선택 보기 동작**(2개 선택 → '아직 결정' 누르면 단독 → 다른 항목 누르면 '아직 결정' 해제).
- ⚠️ **남은 필수 작업 2가지**
  1. ~~`supabase/migrations/0008_project_applications.sql`을 Supabase SQL Editor에서 실행~~ → **2026-07-27 실행 완료.**
  2. main push → 자동배포. `/api/*`는 Vercel 함수라 **로컬 dev(`npm run dev`)에서는 제출이 동작하지 않음** — 배포본에서 실제 제출 1건으로 저장·문자 확인 필요.
- 알림 문자는 §17-D의 `HOST_NOTIFY_PHONE`·`SOLAPI_SENDER_PHONE`을 그대로 사용(추가 환경변수 없음).
- 응답 확인: Supabase Table Editor → `rf_project_applications`(신청), `rf_notifications`(발송 로그, channel=sms·kind=`project_application`).
- 📌 운영기간 문구(`projectInfo.facts`)는 **회차마다 손으로 바꿔야 한다** — 현재 '7월 27일(월)부터 4주간'.

---

## 20. 코어 리셋 신청 탭 신설 + 헤더 '신청서' 드롭다운 (2026-07-27)

> 구글폼 **'브레인 센트 코어 리셋 코칭 신청서'**(`forms/d/e/1FAIpQLSdsHH…`)를 사이트 내 폼으로 이식. 구조는 §18·§19와 동일한 패턴이나, **문항 수가 많고 필수가 24개**라 검증을 스키마 기반으로 바꿨다.

### A. 구성 파일
| 파일 | 역할 |
|---|---|
| `src/data/coreReset.ts` (신규) | 안내 + 문항 스키마(6섹션) + 프로그램/일정/환불/비용 안내 + 개인정보 동의 문구 |
| `src/pages/CoreResetPage.tsx` (신규) | 렌더 + 검증 + 제출. **스키마를 훑어 required 를 일괄 검증**(문항 추가 시 검증 누락 방지) |
| `api/core-reset-apply.js` (신규) | `rf_core_reset_applications` 저장 → 사장님 LMS(`kind=core_reset_application`) |
| `supabase/migrations/0009_core_reset_applications.sql` (신규) | 테이블. RLS on + 공개정책 없음 |
| `src/data/site.ts` | **nav 구조 변경** — `NavItem = NavLink | { label, children }`. 평면 목록이 필요한 곳용 `navLinks` export 추가 |
| `src/components/Header.tsx` | `NavDropdown`(데스크톱) + 모바일 드로어 그룹 렌더 |
| `src/components/Footer.tsx` | `nav` → `navLinks` (children 까지 평면으로 노출) |

### B. 헤더 '신청서' 드롭다운 — §19-E 경고의 후속 조치
> 메뉴 12번째를 그냥 넣으면 헤더가 접힌다(§19-E). 사장님 요청대로 **'몸읽기' 탭을 '신청서' 드롭다운으로 바꾸고** 그 아래 2개를 넣었다.
- `신청서 ▾` → `몸읽기 신청서`(`/project`) · `코어 리셋 신청서`(`/core-reset`)
- **상태 없이 CSS로만 제어** — 마우스는 `group-hover`, 키보드는 `group-focus-within`. 버튼↔패널 사이 `pt-2` 여백으로 hover 끊김 방지.
- 최상위 11개 유지 → **필요 폭 1211px, xl(1280px) 여유 69px** (변경 전 71px과 사실상 동일).
- 모바일 드로어는 접지 않고 **그룹 제목 + 들여쓰기**로 펼쳐 둔다.
- 📌 신청서를 더 만들면 이 드롭다운에 `children` 으로 추가하면 된다 — **최상위 항목은 더 늘리지 말 것.**

### C. 원본 구글폼 대비 바꾼 것 (의도된 차이)
| 항목 | 구글폼 | 사이트 | 이유 |
|---|---|---|---|
| 3개 동의(프로그램/환불/비용) | 라디오 `동의합니다`/`동의하지 않습니다` | **필수 체크박스** | 라디오는 '동의하지 않음'으로도 제출됨 |
| 개인정보 수집·이용 동의 | **없음** | **필수 동의 신설** | 진단·치료 이력 = **민감정보**. 수집항목/목적/보유기간/위탁 명시 + 거부권 고지 |
| `제왈절개` | 오타 | `제왕절개` | 오타 교정 |
| `37미만` | | `37주 미만` | 표기 보정 |
| `해당 사항없음`/`해당사항 없음` 혼용 | | `해당 사항 없음` 통일 | 배타 선택 로직이 라벨 일치로 동작 |
| 일정 `📅 6월` 라벨 | 8월 날짜인데 6월로 표기 | 라벨 삭제 | 날짜·요일은 원본대로(8/5 수, 8/6 목, 8/7 금, 8/19 수 — **2026년 기준 요일 일치 확인**) |

### D. 검증
- **스키마 기반 일괄 검증** + 형식 검증(성함 2자↑, `010`+11자리) + 섹션 밖 문항(프로그램 선택, 일정 **최소 2개**) + 동의 4종. 총 **24건**.
- 오류 문구는 **받침에 따라 조사(을/를)를 붙인다**(`withParticle`). 의문문 라벨은 `errorLabel` 로 대체(예: '아이가 선호하는 향이 있나요?' → '선호하는 향').
- ⚠️ **주의(버그 수정 기록)**: 동의 상태 키(`program`)가 문항 id(`program`)와 겹쳐, 프로그램 안내 동의를 체크하면 **프로그램 선택 오류가 대신 지워지는** 버그가 있었다. `CONSENT_ERROR` 맵으로 오류 키를 `*_consent` 로 분리해 해결. **동의 항목을 추가할 땐 문항 id 와 겹치지 않는지 확인할 것.**
- 배타 선택(`exclusiveOption`): `해당 사항 없음`·`없음` 을 고르면 나머지 해제, 다른 걸 고르면 자동 해제.

### E. 확인한 것 / 남은 것
- ✅ `tsc -b` + `vite build` + eslint 통과.
- ✅ 브라우저 확인: 드롭다운 개폐(키보드 focus 포함)·현재 페이지 하이라이트, 모바일 드로어 그룹 렌더, 푸터 12개 링크(children 평면화), **필수검증 24건 전부 표시 → 전부 채우면 0건**, 배타 선택 동작, 조사 교정.
- ⚠️ **남은 필수 작업 2가지**
  1. ~~`supabase/migrations/0009_core_reset_applications.sql` 을 Supabase SQL Editor 에서 실행~~ → **2026-07-27 실행 완료.**
  2. main push → 자동배포. `/api/*` 는 로컬 dev 에서 동작하지 않음 — 배포본에서 실제 제출 1건 확인 필요.
- 📌 **상담 가능 일정(`scheduleInfo.slots`)은 회차마다 손으로 갱신해야 한다** — 현재 8월 5·6·7·19일.
- 📌 프로그램은 현재 **베이직만 선택 가능**(구글폼과 동일). 프리미엄 390,000원은 비용 안내에만 노출 — 선택지로 열려면 `programs.options` 에 추가.

---

## 21. 브레인 코칭 리네이밍 + 프리미엄 프로그램 개방 (2026-07-27)

> §19~§20 사이·이후에 진행된 두 건. 커밋은 각각 `8c06bf7`, 본 세션 마지막 커밋.

### A. "무료 상담 예약" → **"브레인 코칭"** 전면 리네이밍 (`8c06bf7`)
사이트 전역의 무료 상담 진입점 명칭을 바꿨다. **라우트(`/contact`)와 저장 로직(`rf_consultations`)은 그대로** — 순수 문구 변경.

| 파일 | 변경 |
|---|---|
| `src/components/Hero.tsx` | 히어로 CTA `무료 발달 상담 예약` → `브레인 코칭` |
| `src/components/Header.tsx` | 데스크톱·모바일 헤더 버튼 2곳 |
| `src/components/CtaBand.tsx` | 서브페이지 하단 배너 버튼 + 기본 안내 문구 |
| `src/components/Contact.tsx` | 배지 / 폼 제목 `상담 신청서`→`브레인 코칭 신청서` / 제출 버튼 / 접수 완료 문구 |
| `src/pages/ContactPage.tsx` | 오시는 길 상단 안내 문구 |
| `api/consult-submit.js` | 사장님 알림 문자 제목·머리글 → `새 브레인 코칭 신청` |

- 폼 필드 라벨 `상담 내용`, 동의 문구의 `상담 목적`은 **서비스명이 아니라 입력 내용 설명**이라 그대로 뒀다.
- `src/` 에 '무료' 잔존 0건. 라벨이 짧아져 헤더 가로 여유는 오히려 늘었다.
- ⚠️ 헤더에 `4주 코칭`(유료 `/coaching`)과 `브레인 코칭`(무료 문의 `/contact`)이 나란히 놓인다. 링크 목적지는 다르니 **둘을 혼동하지 말 것.**

### B. 코어 리셋 — 프리미엄 프로그램 선택지 개방
`§20`에서는 구글폼과 동일하게 베이직만 선택 가능했으나, 프리미엄(390,000원)도 신청 가능하도록 열었다.

- `programs.basic` (단일 객체) → **`programs.plans` 배열 + `ProgramPlan` 타입**으로 구조 변경. 카드 2장을 동일 렌더러로 그린다.
- 선택지는 `programOptions`(= `plans.map(p => p.option)`)에서 파생 → **플랜을 추가하면 카드와 선택지가 함께 늘어난다.**
- 선택한 카드는 테두리·배경이 강조되고, 칩에는 체크가 붙는다(단일 선택).
- ⚠️ **원본 구글폼에 프리미엄 구성 내역이 없었다**(①만 기재). 구성을 지어내지 않고 `includes`/`forWhom` 을 **빈 배열로 두고** `note`("구성 상세는 신청 후 상담 시 개별 안내드립니다.")를 표시한다.
  **구성이 정해지면 `coreReset.ts` 의 `plans[1].includes` / `forWhom` 만 채우면 카드에 그대로 반영된다.**
- ⚠️ `plan.option` 문자열은 **DB `program` 컬럼에 그대로 저장되는 값**이다. 바꾸면 기존 응답과 값이 어긋나므로 변경 금지.

### C. DB 마이그레이션 실행 상태 (2026-07-27 기준)
| 파일 | 테이블 | 실행 |
|---|---|---|
| `0005_survey.sql` | `rf_survey_responses` | ✅ |
| `0006_consultations.sql` | `rf_consultations` | ✅ |
| `0007_class_applications.sql` | `rf_class_applications` | ✅ |
| `0008_project_applications.sql` | `rf_project_applications` | ✅ 2026-07-27 |
| `0009_core_reset_applications.sql` | `rf_core_reset_applications` | ✅ 2026-07-27 |

### D. 현재 사이트의 폼 5종 한눈에
| 경로 | 이름 | 테이블 | 문자 `kind` |
|---|---|---|---|
| `/contact` | 브레인 코칭(무료 문의) | `rf_consultations` | `consultation` |
| `/survey` | 브레인센트 종료 설문 | `rf_survey_responses` | — |
| `/class` | 후각키트 만들기 클래스 | `rf_class_applications` | `class_application` |
| `/project` | 4주 몸읽기 프로젝트 | `rf_project_applications` | `project_application` |
| `/core-reset` | 코어 리셋 코칭 | `rf_core_reset_applications` | `core_reset_application` |

- 헤더 노출: `/class` = '클래스' 탭, `/project`·`/core-reset` = **'신청서' 드롭다운**, `/survey` = '설문' 탭, `/contact` = '오시는 길' 탭 + CTA 버튼.
- 신청서를 더 만들면 **'신청서' 드롭다운에 `children` 으로 추가** — 최상위 항목은 늘리지 말 것(§20-B).

### E. 확인한 것 / 남은 것
- ✅ `tsc -b` + `vite build` + eslint 통과. 브라우저에서 프리미엄 카드 렌더·선택 시 하이라이트·베이직↔프리미엄 단일 선택 전환 확인.
- ⚠️ 남은 것: **배포본에서 `/project`·`/core-reset` 실제 제출 1건씩** 넣어 저장·문자 확인(로컬 dev 에서는 `/api/*` 가 동작하지 않음).
- 📌 프리미엄 구성 내역 확정 시 `coreReset.ts` 채워 넣기(위 B 참고).
- 📌 상담 가능 일정(`scheduleInfo.slots`)은 회차마다 수기 갱신 — 현재 8월 5·6·7·19일.

---

## 22. 드롭다운 닫힘 버그 수정 + 입금 후 수동 문자 안내 제거 (2026-07-27)

### A. '신청서' 드롭다운이 항목 클릭 후에도 열린 채 남던 문제
> §20-B 의 드롭다운은 **상태 없이 CSS(`group-hover` / `group-focus-within`)로만** 제어했다. 그 결과 항목을 클릭하면 **그 링크에 포커스가 남아 `focus-within` 이 계속 참** → 페이지를 이동해도 메뉴가 내려온 채 남았다.

- `NavDropdown` 을 **상태 기반**으로 전환(`useState` + `useRef`).
- **닫히는 조건 5가지**: ① 항목 클릭(`onClick`) ② 라우트 변경 ③ 마우스 이탈(`onMouseLeave`) ④ 포커스 이탈(`onBlur` + `relatedTarget` 확인) ⑤ 바깥 `mousedown`/`touchstart` 또는 `Esc`.
- 라우트 변경 감지는 **effect 가 아니라 렌더 중 비교**(`seenPath !== pathname`)로 처리. effect 로 하면 한 프레임 열린 채 깜빡이고, `react-hooks/set-state-in-effect` 린트에도 걸린다.
- `aria-expanded` / `aria-haspopup` 추가, 셰브론 회전도 `open` 상태에 연동.
- ✅ 브라우저에서 5가지 닫힘 조건 전부 확인(다른 페이지 링크 / 같은 페이지 링크 / Esc / 바깥 클릭 / 라우트 이동).
- ⚠️ 브라우저 자동화로 테스트할 때 주의: **같은 JS 태스크 안에서 열기→바깥클릭을 연달아 하면** React 커밋 전이라 `document` 리스너가 아직 안 붙어 있어 안 닫힌다. 호출을 나눠서 검증할 것.

### B. 코어 리셋 — "입금 후 아이 이름·입금자명을 문자로 보내주세요" 안내 제거
> 원본 구글폼에는 입금 후 `010-5686-4182` 로 **아이 이름·입금자명을 직접 문자 발송**하라는 안내가 있었다. 그런데 **사이트 폼은 제출 즉시 서버가 담당자에게 문자를 보낸다**(`api/core-reset-apply.js` → `sendSms` → `HOST_NOTIFY_PHONE`). 보호자 성함·아이 이름·연락처·프로그램·희망일정이 이미 그 문자에 들어 있어 **수동 문자는 중복**이다.

- `feeInfo.sendTo` 삭제 → `feeInfo.depositNameNotice`(“입금자명은 보호자 성함과 같게 해 주시면 확인이 빠릅니다.”)로 대체.
- 신청서 §11 과 **제출 완료 화면 양쪽**에서 수동 문자 안내·체크리스트 제거. 완료 화면에는 “신청 내용이 담당자에게 전달되었습니다.” 를 추가해 자동 발송을 명시.
- **`HOST_NOTIFY_PHONE` 에 `010-5686-4182` 가 포함되어 있음을 확인**(다른 번호 1개와 함께 등록). 즉 신청 버튼 = 짱샘 폰으로 문자 발송.
- 📌 담당자 번호를 바꾸려면 **코드가 아니라 Vercel 환경변수 `HOST_NOTIFY_PHONE`** 을 수정한다(콤마로 여러 번호 지정 가능). 5종 폼이 모두 이 값을 공유한다.

---
---

# 23. 📌 현재 상태 & 다음에 이어서 할 일 (2026-07-27 기준)

> **여기가 최신 진실이다.** 위 §0~§22 는 시간순 로그라 개별 섹션의 "남은 것"이 이후에 해소된 경우가 많다.
> 다시 돌아왔다면 이 섹션만 읽고 바로 작업을 이어가면 된다.

## A. 한 장 요약

- **사이트**: kidsphysio.kr (React 19 + TS + Vite, Vercel 자동배포 / `main` push = 배포)
- **백엔드**: Supabase(공유 프로젝트 `yvuekbmidwetaulasksk`) + Vercel 서버리스 `api/*` + 솔라피(문자·알림톡)
- **두 갈래 시스템**
  1. **예약 시스템(booking)** — `/coaching` 이하. 유료 4주 코칭. 결제·슬롯·알림톡까지 구현 완료, **오픈 전 실브라우저 e2e 1회만 남음**.
  2. **메인 사이트 폼 5종** — 아래 B. 전부 배포 완료.
- **최종 커밋**: `07e4012`

## B. 폼 5종 — 경로 · 파일 · 테이블 · 문자

| 경로 | 이름 | 데이터 스키마 | 페이지 | API | 테이블 | 문자 `kind` |
|---|---|---|---|---|---|---|
| `/contact` | 브레인 코칭(무료 문의) | — (폼이 하드코딩) | `components/Contact.tsx` | `api/consult-submit.js` | `rf_consultations` | `consultation` |
| `/survey` | 브레인센트 종료 설문 | `data/survey.ts` | `pages/SurveyPage.tsx` | `api/survey-submit.js` | `rf_survey_responses` | — |
| `/class` | 후각키트 만들기 클래스 | `data/classApply.ts` | `pages/ClassApplyPage.tsx` | `api/class-apply.js` | `rf_class_applications` | `class_application` |
| `/project` | 4주 몸읽기 프로젝트 | `data/bodyProject.ts` | `pages/ProjectApplyPage.tsx` | `api/project-apply.js` | `rf_project_applications` | `project_application` |
| `/core-reset` | 코어 리셋 코칭 | `data/coreReset.ts` | `pages/CoreResetPage.tsx` | `api/core-reset-apply.js` | `rf_core_reset_applications` | `core_reset_application` |

**공통 패턴** (새 폼을 만들 때 그대로 따라가면 된다 — §18~§20이 전부 이 구조):
```
src/data/<폼>.ts        문항 스키마 + 안내 문구 + 동의 문구   ← 문구 수정은 여기만
src/pages/<폼>Page.tsx  스키마를 읽어 렌더 + 검증 + 제출
api/<폼>-apply.js       허니팟 차단 → 서버 재검증 → Supabase insert → 사장님 LMS
supabase/migrations/…   RLS on + 공개정책 없음(service_role 전용)
src/App.tsx             라우트 추가
src/data/site.ts        nav 에 추가 (⚠️ 최상위 말고 '신청서' children 으로!)
```

**테이블 실재 확인 (2026-07-27, service_role 조회)**
`rf_consultations` 4건 · `rf_survey_responses` 1건 · `rf_class_applications` 6건 · `rf_project_applications` 0건 · `rf_core_reset_applications` 0건
→ **마이그레이션 0005~0009 전부 실행 완료.** 뒤 두 개가 0건인 건 아직 실제 신청이 없어서다(아래 C-1).

## C. 다음에 할 일

### 1. ⚠️ 최우선 — 신규 폼 2종 실제 제출 검증
`/project`·`/core-reset` 은 **누적 0건**이라 실제 저장·문자 발송이 한 번도 확인되지 않았다.
배포본에서 각각 1건씩 넣고 확인:
- Supabase Table Editor → 해당 테이블에 row 생성되는지
- `rf_notifications` (channel=`sms`, kind=위 표) 에 `sent` 로 기록되는지 / 사장님 폰 수신
- ❗ `npm run dev`(로컬)에서는 `/api/*` 가 Vercel 함수라 **동작하지 않는다.** 로컬 제출은 항상 에러 배너가 뜨는 게 정상.

### 2. 코어 리셋 — 프리미엄 구성 내역 채우기
원본 구글폼에 ②프리미엄 구성이 없어서 `coreReset.ts` 의 `plans[1].includes` / `forWhom` 을 **빈 배열**로 두고 `note`("구성 상세는 신청 후 상담 시 개별 안내드립니다.")만 띄우고 있다.
사장님께 구성 받아서 두 배열만 채우면 카드에 그대로 렌더된다.

### 3. 코어 리셋 — 상담 가능 일정 갱신
`coreReset.ts` 의 `scheduleInfo.slots` 는 **수기 관리**. 현재 `8월 5·6·7·19일`. 회차가 지나면 반드시 교체.

### 4. 예약 시스템(booking) 오픈 전 e2e 1회
신청 → 슬롯 Hold → 무통장 결제 → 알림톡 발송. 상세는 §16 아래 "⏭️ 다음에 돌아오면 곧바로 할 일".

### 5. 솔라피 잔액 확인
잔액이 부족하면 **문자만 실패하고 신청 저장은 성공**한다(설계상 의도). 사장님이 알림을 못 받는 상황이 될 수 있으니 주기적으로 확인. §17-D·§15.

## D. 반복해서 걸렸던 함정 (같은 실수 반복 금지)

1. **헤더 가로 폭** — 데스크톱 메뉴는 xl(1280px)에서 **여유가 70px 남짓**이다. 최상위 항목을 늘리면 로고·전화번호가 접힌다(§18-F에서 한 번, §19-E에서 또 한 번 터졌다).
   → **신청서를 추가할 땐 `site.ts` 의 '신청서' 항목 `children` 에 넣을 것.** 최상위 추가 금지.
2. **드롭다운을 CSS로만 만들지 말 것** — `focus-within` 만 쓰면 항목 클릭 후 포커스가 남아 메뉴가 안 닫힌다(§22-A). 상태 기반 + 5가지 닫힘 조건 유지.
3. **동의 체크박스의 오류 키가 문항 id 와 겹치면 안 된다** — `program`(문항) vs `program`(동의) 충돌로 엉뚱한 오류가 지워졌다(§20-D). `CONSENT_ERROR` 맵으로 `*_consent` 분리.
4. **`plan.option` 등 DB 에 그대로 저장되는 문자열은 바꾸지 말 것** — 기존 응답과 값이 어긋난다. 문항 `id` 도 마찬가지(분석 시 컬럼처럼 쓰인다).
5. **마이그레이션은 자동 적용되지 않는다** — `supabase/migrations/*.sql` 을 **Supabase SQL Editor 에서 수기 실행**해야 한다. 안 하면 제출 시 `INSERT_FAILED`.
6. **담당자 알림 번호는 코드가 아니라 환경변수** — Vercel `HOST_NOTIFY_PHONE`(콤마로 여러 번호). 현재 `010-5686-4182`(짱샘) 포함 2개. 폼 5종이 공유한다.
7. **`.bkit/`·`scripts/` 는 커밋하지 않는다** — 이번 세션 내내 미추적으로 남겨 둔 무관한 디렉토리.
8. **브라우저 자동화로 React 상태를 검증할 때** — 같은 JS 태스크 안에서 클릭→상태읽기를 연달아 하면 커밋 전이라 옛 값이 읽힌다. 호출을 나눌 것(§22-A).

## E. 이번 세션(2026-07-26~27) 커밋 목록

| 커밋 | 내용 |
|---|---|
| `46095ec` | §19 4주 몸읽기 프로젝트 신청 탭 신설 |
| `8c06bf7` | §21-A "무료 상담 예약" → "브레인 코칭" 전면 리네이밍 |
| `1de4a28` | §20 코어 리셋 신청 탭 신설 + 헤더 '신청서' 드롭다운 |
| `482a902` | §21-B 프리미엄 프로그램 선택지 개방 + 문서 정리 |
| `07e4012` | §22 드롭다운 닫힘 버그 수정 + 입금 후 수동 문자 안내 제거 |

---

## 24. 설문 응답 관리자 페이지 (2026-08-09)

> 설문 응답을 확인할 방법이 **Supabase Table Editor 뿐**이었다(`/admin` 은 예약 시스템 전용). 사이트 안에서 볼 수 있게 `/admin/survey` 탭 신설.

### A. 구성
| 파일 | 역할 |
|---|---|
| `supabase/migrations/0010_admin_read_survey.sql` (신규) | `rf_survey_responses` 에 **select 전용** 관리자 정책(`rf_is_admin()`) 추가 |
| `src/booking/pages/admin/Survey.tsx` (신규) | 요약 4종 + 목록 + 행 펼침(전체 응답) + CSV 내려받기 |
| `AdminApp.tsx` / `AdminLayout.tsx` | 라우트 `survey` + 탭 '설문 응답' 추가 |

- 문항 라벨은 **`src/data/survey.ts` 를 그대로 읽는다** — 설문 문항을 고치면 관리자 화면·CSV 열이 자동으로 따라온다. 별도 라벨 표를 만들지 말 것.
- 리커트(`effect`)는 `{statementId: 1~5}` 중첩 객체다. 화면에는 `5점 (매우 그렇다)` 로, CSV 에는 **문항별 열로 펼쳐서** 넣는다(열 21개).
- CSV 는 엑셀 한글 깨짐 방지를 위해 **BOM(`\uFEFF`) 을 붙인다.**

### B. 권한 설계
- `0005_survey.sql` 은 RLS 만 켜고 **정책을 하나도 만들지 않았다** = anon/authenticated 전면 차단(서버 service_role 전용). 그래서 관리자도 볼 수 없었다.
- 0010 은 예약 시스템 테이블(`0001_init.sql` 의 `rf_admin_*`)과 동일하게 **`rf_is_admin()` 화이트리스트에게만** 개방한다.
- ⚠️ **select 만 허용.** 설문 응답은 열람 전용이며 관리자도 수정·삭제할 수 없다.

### C. ⚠️ 함정 — RLS 차단은 에러가 아니라 '빈 배열'로 온다
정책이 없으면 PostgREST 가 **에러 대신 `[]`** 를 반환한다. 그래서 "응답 0건"과 "권한 없음"이 화면상 구분되지 않는다.
→ 빈 목록 안내에 **"응답이 있는데도 비어 보이면 0010 마이그레이션을 실행하라"** 는 문구를 함께 넣었다. 다른 테이블에 관리자 화면을 붙일 때도 같은 처리를 할 것.

### D. 확인한 것 / 남은 것
- ✅ `tsc -b` + `vite build` + eslint 통과.
- ✅ **실제 응답 7건으로 렌더링 검증** — 요약(총 7건·NPS 평균 7.9·추천 3명·마케팅 6명), 목록 정렬, 행 펼침(10개 섹션 전 문항 라벨·리커트 점수·서술형), CSV 열 21개 생성(빈 열 없음)까지 확인.
  - 관리자 로그인이 필요해 `/admin` 을 직접 열 수 없어서, 임시 미리보기 라우트 + 실데이터 픽스처로 검증한 뒤 **임시 코드는 전부 제거**했다.
  - 검증 중 발견해 고친 것: 헤더는 `<th>` 자동폭인데 본문은 CSS grid 라 **열이 어긋나던 문제** → 헤더/행이 같은 grid 템플릿(`COLS`)을 공유하도록 변경.
- ⚠️ **남은 필수 작업**: `0010_admin_read_survey.sql` 을 Supabase SQL Editor 에서 실행. 실행 전에는 목록이 빈 채로 보인다.
- 📌 나머지 폼 4종(상담·클래스·몸읽기·코어리셋)도 같은 방식으로 관리자 화면을 붙일 수 있다. 테이블별 select 정책 + 페이지 1개씩이면 된다.

---

## 25. 신청 내역 관리자 페이지 — 폼 4종 (2026-08-09)

> §24(설문)에 이어 나머지 4종(상담·클래스·몸읽기·코어리셋)도 `/admin` 에서 본다. **페이지 4개 대신 설정 기반 단일 페이지** 하나로 만들었다.

### A. 구성
| 파일 | 역할 |
|---|---|
| `supabase/migrations/0011_admin_read_applications.sql` (신규) | 4개 테이블에 **select 전용** 관리자 정책(`rf_is_admin()`) |
| `src/booking/pages/admin/Applications.tsx` (신규) | 폼 선택 칩 4개 + 목록 + 행 펼침 + CSV. `FORMS` 설정 배열이 전부를 구동 |
| `AdminApp.tsx` / `AdminLayout.tsx` | 라우트 `applications` + 탭 '신청 내역' |

**폼을 추가할 때는 `FORMS` 배열에 한 항목만 넣으면 된다** — `{ key, label, table, columns, sections?, extra?, body? }`.
- `sections` = 그 폼의 데이터 스키마(`classSections`/`projectSections`/`coreResetSections`)를 그대로 넘긴다 → 상세·CSV 라벨이 신청서와 자동으로 동기화된다.
- `extra` = 스키마 바깥에 있는 문항(코어리셋의 프로그램·일정처럼 전용 블록으로 렌더된 것).
- `body` = 스키마가 없는 폼(상담)에서 크게 보여줄 컬럼.

### B. ⚠️ 함정 — 라벨 없는 문항의 id 노출
클래스·몸읽기 폼은 **섹션 제목이 곧 질문**이라 문항에 `label` 이 없다. `q.label || q.id` 로 대체하면 화면에 `occupation`, `apply_reason` 같은 **원본 id 가 그대로 노출된다**(검증 중 발견해 수정).
→ 라벨이 없으면 **`<dt>` 자체를 그리지 않고**(섹션 제목이 질문 역할), CSV 열 이름만 `sec.title` 로 채운다.

### C. 확인한 것 / 남은 것
- ✅ `tsc -b` + `vite build` + eslint 통과.
- ✅ **실데이터로 4종 전부 검증** — 상담 4건 / 클래스 6건 / 몸읽기 7건 / 코어리셋 1건.
  탭 전환, 폼별 컬럼 구성, 행 펼침(전 섹션·문항 라벨), 코어리셋의 `프로그램·일정` 블록, 동의 표시까지 확인.
  §24 와 같이 임시 미리보기 라우트 + 픽스처로 검증한 뒤 **임시 코드는 전부 제거**했다.
- ⚠️ **남은 필수 작업**: `0011_admin_read_applications.sql` 을 Supabase SQL Editor 에서 실행. 실행 전에는 목록이 빈 채로 보인다(§24-C 와 동일하게 안내 문구를 넣어 뒀다).
- 📌 **열람 전용이다.** 입금 확인(`status` 변경)은 여전히 Supabase Table Editor 에서 한다. 관리자 화면에서 바꾸려면 update 정책 + UI 가 따로 필요하다.
- 🔒 `rf_core_reset_applications` 에는 **진단·치료 이력 등 민감정보**가 있다. `rf_admins` 화이트리스트를 최소 인원으로 유지할 것.

### D. §23-C1 해소 — 신규 폼 실제 제출 검증 완료
§23 에서 "최우선"으로 남겨 뒀던 `/project`·`/core-reset` 실제 저장 검증이 **실제 신청으로 확인됐다**
(2026-08-09 기준 몸읽기 7건, 코어리셋 1건 저장 확인). 별도 테스트 제출은 불필요.

---

## 26. 개인정보처리방침 · 이용약관 정리 (2026-08-10)

> 푸터의 `개인정보처리방침`·`이용약관` 링크가 **둘 다 `href="#"`** 로 아무 데도 가지 않았다. 개인정보처리방침 페이지는 `/privacy` 에 있었지만 **예약 시스템 전용 내용**이었고 푸터에서 연결도 안 돼 있었다.

### A. 구성
| 파일 | 역할 |
|---|---|
| `src/pages/PrivacyPage.tsx` (신규) | 개인정보처리방침 — 사이트 전체(폼 5종 + 예약) 포괄. 11개 조항 |
| `src/pages/TermsPage.tsx` (신규) | 이용약관 — 14개 조항 |
| `src/booking/pages/Privacy.tsx` (삭제) | 예약 전용 방침. 새 문서로 대체 |
| `src/App.tsx` | `/privacy` → PrivacyPage(본문 Layout), `/terms` 신규. **`/privacy` 가 중복 정의돼 있었음 → 하나로 정리** |
| `src/components/Footer.tsx` | 두 링크를 `#` → 실제 라우트로 연결 |

- 두 페이지 모두 **본문 Layout + PageHero** 를 쓴다. 예약 시스템(`PublicLayout`)의 동의 링크·푸터도 같은 `/privacy` 를 가리키므로 **문서는 하나뿐이다**(회사 문서가 두 벌이 되지 않게).
- 조항 렌더 조각(`Section`/`P`/`List`/`Table`)은 각 파일에 로컬로 둔다 — 폼 페이지들과 같은 관례(파일 단독 수정 가능).

### B. 내용의 근거 — 지어내지 않은 것
방침·약관의 사실관계는 **코드에 이미 있는 것에서 가져왔다.**
| 항목 | 출처 |
|---|---|
| 폼별 수집 항목 | 각 마이그레이션 테이블 컬럼 + `src/data/*.ts` 의 `privacyConsent` |
| 민감정보(진단·치료 이력) | `0009_core_reset_applications.sql` · 코어리셋 동의 문구 |
| 처리위탁(솔라피·Supabase·토스·Vercel) | `api/_solapi.js`, `_supabase.js`, 결제 연동, 배포 환경 |
| 보유기간 프로그램 종료 후 1년 | 각 신청서 동의 문구와 동일하게 맞춤 |
| 코어리셋 환불 규정 | `src/data/coreReset.ts` 의 `refundPolicy` |
| 4주 코칭 24시간 규정 | `booking/pages/MyReservation.tsx` 의 취소 실패 안내 |
| 의료행위 아님 고지 | 코어리셋 `programNotice` |
| 사업자 정보 | `src/data/site.ts` 의 `business` |

### C. 사장님 확인 결과 (2026-08-10 반영 완료)
1. ~~클래스·몸읽기 프로젝트 환불 규정~~ → **확정: 시작 전 100% 환불, 시작 이후 환불 불가.** 약관 제8조에 반영.
   - ⚠️ 다만 **다회차 유료 프로그램에서 "시작 이후 환불 전면 불가"는 「소비자분쟁해결기준」·전자상거래법의 계속거래 중도해지 규정과 충돌할 소지**가 있다(미이용분 정산을 요구할 수 있음). 분쟁 시 다퉈질 수 있는 조항이니 필요하면 전문가 확인을 권함. **사장님이 이 방침으로 결정함.**
2. ~~개인정보 보호책임자~~ → **확정: 장지예**(대표자 하성재와 별도). `site.ts` 의 `business.privacyOfficer` 로 분리해 관리한다.
3. 두 문서 모두 **법률 전문가 검토를 받은 것이 아니다.** 표준 양식과 실제 수집 내역에 근거한 초안이다.
4. ~~환불 규정이 약관에만 있고 신청서 화면에는 없음~~ → **2026-08-10 적용 완료.** 클래스·몸읽기 신청서의 입금 계좌 바로 아래에 '취소 · 환불 안내' 블록을 노출한다(`classRefund` / `projectRefund`). 코어리셋은 원래 §10 에 동의 체크까지 있었다.
   - ⚠️ **문구가 세 곳에 흩어져 있다** — `TermsPage.tsx` 제8조 · `classApply.ts` 의 `classRefund` · `bodyProject.ts` 의 `projectRefund`. 하나를 고치면 나머지도 반드시 같이 고칠 것.

### D. 유지보수 규칙
- 신청서의 수집 항목·보유기간·위탁업체를 바꾸면 **`PrivacyPage.tsx` 와 각 폼의 `privacyConsent` 를 함께** 고친다(둘이 어긋나면 안 된다).
- 환불 규정을 바꾸면 **`TermsPage.tsx` 제8조와 `coreReset.ts` 의 `refundPolicy`** 를 함께 고친다.
- 내용을 고치면 각 파일 상단의 `EFFECTIVE_DATE`(시행일)도 갱신한다.

# CLAUDE.md — KidsPhysio

키즈피지오 예약·신청 사이트. 상담·수업·프로젝트·코어리셋 신청을 받고, 슬롯 예약과
결제(토스 / 무통장), 알림톡 발송까지 처리한다.

> ⚠️ `README.md`는 **Vite 기본 템플릿 문구 그대로**라 아무 정보가 없다. 무시할 것.
> 예약 연동 설명은 `docs/BOOKING-INTEGRATION.md`.

## 명령

```bash
npm run dev      # Vite 개발 서버
npm run build
npm run preview
npm run lint
```

테스트 러너는 없다.

## 스택

React + TypeScript + **Vite** · React Router · Supabase · lucide-react.
배포는 **Vercel** (`vercel.json`, `.vercel/`). 정적 빌드 + `api/` 서버리스 함수 조합.

## 구조

```
src/
├── pages/ · components/ · data/ · lib/
└── booking/            예약 모듈 (독립 구조)
    ├── pages/ · pages/admin/
    ├── components/ · components/form/
    ├── hooks/ · lib/

api/                    Vercel 서버리스 함수
├── _supabase.js _solapi.js _notify.js     공용 (밑줄 = 라우트 아님)
├── class-apply · consult-submit · core-reset-apply · project-apply · survey-submit
├── my-lookup · my-get · my-cancel          비로그인 조회·취소
├── payment-toss-confirm · payment-bank · confirm-payment
└── release-holds · send-reminders          크론 (CRON_SECRET 필요)

supabase/  0001_init → 0009_core_reset_applications (순차 마이그레이션 9개)
```

## 🔴 주의

- **`api/_*.js` 는 라우트가 아니라 공용 모듈이다.** 밑줄 접두어로 구분한다 — 새 공용
  코드를 추가할 때 이 규칙을 지킬 것.
- **`release-holds` · `send-reminders` 는 크론이다.** `CRON_SECRET`으로 보호되며
  아무나 호출하면 안 된다. 슬롯 홀드 해제가 안 돌면 예약이 잠긴 채로 남는다.
- **알림톡은 Solapi**다. 템플릿 ID가 환경변수로 4종 분리돼 있어
  (`SOLAPI_TPL_BOOKING_CONFIRMED` / `_NEW_APPLICATION_HOST` / `_REMINDER` /
  `_PAYMENT_REQUEST` / `_LOOKUP`) 문구를 바꾸려면 **카카오 채널에서 템플릿을 다시
  승인받아야** 한다. 코드만 고쳐서는 안 바뀐다.
- 신청 종류가 4가지(상담·수업·프로젝트·코어리셋)이고 **각각 별도 테이블·별도 API**다
  (마이그레이션 0006~0009). 하나를 고칠 때 나머지도 같은 처리가 필요한지 확인할 것.

## 환경 변수 (`.env.example`)

```
VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY      # 브라우저 노출됨
SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY        # 서버 전용
CRON_SECRET                                      # 크론 보호
SOLAPI_API_KEY / _API_SECRET / _SENDER_PHONE / _PFID / _TPL_*
TOSS_SECRET_KEY                                  # 서버 전용
VITE_TOSS_CLIENT_KEY                             # 브라우저용 (공개키)
BANK_INFO / VITE_BANK_INFO / APP_ORIGIN / HOST_NOTIFY_PHONE
```

⚠️ `VITE_` 접두어는 **번들에 인라인 = 공개**다. `SUPABASE_SERVICE_ROLE_KEY`,
`TOSS_SECRET_KEY`, `SOLAPI_*`, `CRON_SECRET`에는 절대 붙이지 말 것.

## UI

**한국어.** 대상은 아이 보호자다.

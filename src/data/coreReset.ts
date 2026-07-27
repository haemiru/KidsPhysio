/**
 * 브레인센트 코어 리셋 시스템™ — 코칭 신청서 문항 스키마
 * 페이지(CoreResetPage)가 이 스키마를 읽어 렌더링하고, 응답을 answers 객체로 수집합니다.
 * 응답 키(question.id)는 분석 시 컬럼처럼 쓰이므로 안정적으로 유지하세요.
 */

export const coreResetMeta = {
  key: 'core_reset',
  eyebrow: '브레인센트 코어 리셋',
  title: '브레인 센트 코어 리셋 코칭 신청서',
  desc: '후각·호흡·원시반사·코어 안정성을 기반으로 아이의 신경계 상태를 이해하고, 가정 내 반복 경험으로 몸의 안정성과 기능적 움직임 회복을 돕는 부모 참여형 홈케어 코칭입니다.',
}

/** 1. 안내 — 대면 코칭에서 실제로 무엇을 하는지 안내한다 */
export const coreResetIntro = {
  greeting: '안녕하세요.',
  body: [
    { text: '호흡, 후각, 움직임, 원시반사, 근긴장도 등을 관찰 평가합니다.' },
    {
      text: '뇌파·자율신경계·스트레스 검사 진행이 가능한 아동은 옴니핏 자율신경계 검사 진행합니다.',
      sub: '검사 진행이 어려울 경우 무리해서 진행하지 않는 부분 참고해주세요.',
    },
    { text: '감각프로파일링 검사가 필요한 아이는 같이 진행합니다.' },
    { text: '소요시간은 대략 60분~80분입니다.' },
    { text: '특별히 주의 깊게 살펴보았으면 하는 부분은 상담시 얘기 해주세요.' },
  ] as { text: string; sub?: string }[],
  notice: '작성해주신 내용은 맞춤 코칭 및 프로그램 설계를 위해 사용됩니다.',
} as const

/** '기타' 직접입력을 트리거하는 보기 라벨 */
export const OTHER = '기타'
/** 다른 보기와 함께 고를 수 없는(고르면 나머지가 해제되는) 보기 */
export const NONE = '해당 사항 없음'

export type CoreResetQuestion =
  | {
      id: string
      type: 'text'
      label: string
      inputType?: 'text' | 'tel' | 'date'
      placeholder?: string
      multiline?: boolean
      required?: boolean
      help?: string
      examples?: string[]
    }
  | {
      id: string
      type: 'single'
      label?: string
      options: string[]
      otherOption?: string
      required?: boolean
      help?: string
      /** 라벨이 의문문이라 오류 문구에 그대로 쓰기 어색할 때 대체할 짧은 이름 */
      errorLabel?: string
    }
  | {
      id: string
      type: 'multi'
      label?: string
      options: string[]
      /** 최소 선택 개수 (미달 시 제출 불가) */
      min?: number
      max?: number
      otherOption?: string
      exclusiveOption?: string
      required?: boolean
      help?: string
    }

export type CoreResetSection = {
  id: string
  title: string
  description?: string
  grid?: boolean
  questions: CoreResetQuestion[]
}

export const coreResetSections: CoreResetSection[] = [
  {
    id: 'sec2',
    title: '2. 보호자 정보',
    description: '코칭 일정 안내와 자료 발송에 사용됩니다.',
    grid: true,
    questions: [
      { id: 'guardian_name', type: 'text', label: '보호자 성함', placeholder: '홍길동', required: true },
      {
        id: 'guardian_phone',
        type: 'text',
        label: '연락처',
        inputType: 'tel',
        placeholder: '010-1234-5678',
        required: true,
      },
      { id: 'kakao_id', type: 'text', label: '카카오톡 아이디', placeholder: '선택 입력' },
      {
        id: 'region',
        type: 'text',
        label: '거주지역',
        placeholder: '예) 서울 강남구 / 경기 성남시',
        required: true,
      },
    ],
  },
  {
    id: 'sec3',
    title: '3. 아동 정보',
    grid: true,
    questions: [
      { id: 'child_name', type: 'text', label: '아이 이름', placeholder: '아이 이름', required: true },
      { id: 'child_birth', type: 'text', label: '생년월일', inputType: 'date', required: true },
    ],
  },
  {
    id: 'sec3b',
    title: '3-1. 출생·병력',
    questions: [
      { id: 'gender', type: 'single', label: '성별', required: true, options: ['남', '여'] },
      {
        id: 'birth_weeks',
        type: 'single',
        label: '출생주수',
        required: true,
        options: ['만삭', '37주 미만', '잘 모르겠음'],
      },
      {
        id: 'birth_type',
        type: 'single',
        label: '출산 방식',
        required: true,
        options: ['자연분만', '제왕절개'],
      },
      {
        id: 'nicu',
        type: 'single',
        label: 'NICU 입원 경험',
        required: true,
        options: ['있음', '없음'],
      },
      {
        id: 'diagnosis',
        type: 'text',
        label: '현재 진단 또는 상담받은 내용',
        placeholder: '자유롭게 적어 주세요.',
        required: true,
        examples: ['발달지연 / ASD / ADHD / 감각과민 등'],
      },
      {
        id: 'therapies',
        type: 'multi',
        label: '현재 받고 있는 치료',
        required: true,
        otherOption: OTHER,
        exclusiveOption: '없음',
        options: [
          '감각통합',
          '언어',
          'ABA',
          '물리',
          '작업',
          '인지',
          '놀이',
          '행동',
          '수중',
          '심리',
          '없음',
          OTHER,
        ],
      },
    ],
  },
  {
    id: 'sec4',
    title: '4. 현재 아이의 모습 체크',
    description: '아래 항목 중 현재 아이와 가장 가까운 모습을 모두 체크해 주세요.',
    questions: [
      {
        id: 'posture_core',
        type: 'multi',
        label: '자세 / 코어',
        required: true,
        exclusiveOption: NONE,
        options: [
          '자주 기대려고 한다',
          '앉으면 몸이 무너진다',
          'W sitting을 자주 한다',
          '엎드림을 싫어한다',
          '까치발이 있다',
          '몸이 뻣뻣하다',
          '몸이 축 처진다',
          NONE,
        ],
      },
      {
        id: 'breathing',
        type: 'multi',
        label: '호흡',
        required: true,
        exclusiveOption: NONE,
        options: [
          '입을 자주 벌리고 있다',
          '코막힘이 잦다',
          '잠잘 때 입호흡한다',
          '숨을 참는 모습이 있다',
          '한숨을 자주 쉰다',
          '호흡이 얕고 빠른 편이다',
          NONE,
        ],
      },
      {
        id: 'sensory_emotion',
        type: 'multi',
        label: '감각 / 정서',
        required: true,
        exclusiveOption: NONE,
        options: [
          '예민하다',
          '깜짝 반응이 많다',
          '특정 자극을 싫어한다',
          '쉽게 흥분한다',
          '멜트다운이 있다',
          '감정 기복이 있다',
          '불안해 보인다',
          NONE,
        ],
      },
      {
        id: 'movement_balance',
        type: 'multi',
        label: '움직임 / 균형',
        required: true,
        exclusiveOption: NONE,
        options: [
          '잘 넘어진다',
          '균형이 불안하다',
          '움직임이 느리다',
          '가만히 있지 못한다',
          '몸을 계속 움직인다',
          '양손 사용이 어색하다',
          NONE,
        ],
      },
    ],
  },
  {
    id: 'sec5',
    title: '5. 후각 · 수면 체크',
    questions: [
      {
        id: 'scent_reaction',
        type: 'single',
        label: '향기에 대한 반응',
        required: true,
        options: ['매우 민감함', '조금 민감함', '보통', '반응이 적음', '잘 모르겠음'],
      },
      {
        id: 'preferred_scent',
        type: 'single',
        label: '아이가 선호하는 향이 있나요?',
        errorLabel: '선호하는 향',
        required: true,
        options: [
          '오렌지 계열',
          '라벤더 계열',
          '우디/샌달우드 계열',
          '생활향 (비누·샴푸 또는 특정 식품·음식향)',
          '잘 모르겠음',
        ],
      },
      {
        id: 'sleep',
        type: 'multi',
        label: '수면 상태',
        required: true,
        exclusiveOption: NONE,
        options: [
          '잠들기 어렵다',
          '자주 깬다',
          '깊게 못 잔다',
          '뒤척임이 많다',
          '새벽에 자주 깬다',
          NONE,
        ],
      },
    ],
  },
  {
    id: 'sec6',
    title: '6. 부모 목표 및 고민',
    questions: [
      {
        id: 'biggest_concern',
        type: 'text',
        multiline: true,
        label: '현재 가장 걱정되는 부분은 무엇인가요?',
        placeholder: '자유롭게 적어 주세요.',
      },
      {
        id: 'expected_change',
        type: 'text',
        multiline: true,
        label: '가장 기대하는 변화는 무엇인가요?',
        placeholder: '자유롭게 적어 주세요.',
      },
    ],
  },
]

/* ── 7. 프로그램 안내 및 동의 ── */

export const programNotice = {
  title: '프로그램 안내',
  body: [
    '브레인센트 코어 리셋 시스템™은 의료행위가 아닌 교육 및 홈케어 기반 코칭 프로그램입니다.',
    '아이의 신경계 상태와 발달 특성에 따라 변화 속도와 반응에는 개인차가 있을 수 있으며, 보호자의 참여와 가정 내 반복 경험이 매우 중요합니다.',
    '향 사용 시 불편감 또는 이상 반응이 있을 경우 즉시 사용을 중단하고 상담해 주세요.',
  ],
  consentLabel: '위 내용을 확인했으며 동의합니다.',
} as const

/* ── 8. 프로그램 선택 ── */

export type ProgramPlan = {
  badge: string
  name: string
  /** 운영 방식 한 줄 (없으면 표시 생략) */
  schedule?: string
  price: string
  /** 신청서에서 고를 때 저장되는 값 — 변경하면 기존 응답과 값이 어긋난다 */
  option: string
  includes: string[]
  forWhom: string[]
  /** 구성이 아직 확정되지 않았을 때 카드에 대신 띄울 안내 */
  note?: string
}

export const programs = {
  intro:
    '브레인센트 코어 리셋 시스템™은 아이의 신경계 상태와 보호자의 필요에 따라 2가지 프로그램 중 선택할 수 있습니다.',
  plans: [
    {
      badge: '①',
      name: 'BASIC 코어 코칭 프로그램',
      schedule: '월 1회 대면 코칭',
      price: '150,000원',
      option: '베이직 코어 리셋 시스템 150,000원',
      includes: [
        '대면 코칭 1회 (60~90분)',
        '맞춤 홈케어 가이드',
        '인헤일러 키트 3종 — 오렌지 · 라벤더 · 샌달우드',
        '후각 스프레이 3종 — 오렌지 · 라벤더 · 샌달우드',
        '라벤프랑 필로우 미스트 / 자율신경계 밸런스 바디오일',
      ],
      forWhom: [
        '현재 아이 상태를 먼저 평가받고 싶은 경우',
        '홈케어 방향이 필요한 경우',
        '단기 코칭이 필요한 경우',
      ],
    },
    {
      badge: '②',
      name: 'PREMIUM 코어 코칭 프로그램',
      price: '390,000원',
      option: '프리미엄 코어 리셋 시스템 390,000원',
      // ⚠️ 원본 신청서에 프리미엄 구성이 적혀 있지 않았다.
      //    구성이 정해지면 includes / forWhom 을 채우면 카드에 그대로 표시된다.
      includes: [],
      forWhom: [],
      note: '구성 상세는 신청 후 상담 시 개별 안내드립니다.',
    },
  ] as ProgramPlan[],
} as const

/** 신청서에서 고를 수 있는 프로그램 (문항 id: program) */
export const programOptions = programs.plans.map((p) => p.option)

/* ── 9. 상담 가능 일정 ── */

export const scheduleInfo = {
  desc: '대면 코칭 상담은 예약제로 진행됩니다. 가능하신 날짜와 시간을 최소 2개 이상 선택해 주세요.',
  sub: '선택해주신 일정 중 최종 조율 후 개별 연락드립니다.',
  slots: [
    '8월 5일(수) 10시',
    '8월 5일(수) 2시',
    '8월 6일(목) 10시',
    '8월 7일(금) 10시',
    '8월 19일(수) 10시',
    '8월 19일(수) 2시',
  ],
  minSelect: 2,
  notes: [
    '신청 순서에 따라 예약이 마감될 수 있습니다.',
    '일정 확정 후 개별 연락드립니다.',
    '위 시간 외 가능한 시간에 신청 시 30,000원, 일요일 및 공휴일 신청 시 50,000원 추가 비용이 적용됩니다.',
  ],
} as const

/* ── 10. 예약 및 환불 안내 ── */

export const refundPolicy = {
  title: '예약 및 환불 안내',
  body: [
    '브레인센트 코어 리셋 시스템™은 예약제로 운영되며, 한 아이를 위한 맞춤 코칭 시간으로 준비됩니다.',
    '예약 변경 및 환불은 상담 하루 전까지 연락주시면 100% 가능합니다.',
    '당일 취소 및 노쇼의 경우 프로그램 준비 및 예약 운영 특성상 환불이 어려운 점 양해 부탁드립니다.',
    '보다 안정적인 운영과 원활한 상담을 위해 협조 부탁드립니다 😊',
  ],
  consentLabel: '예약 및 환불 안내에 동의합니다.',
} as const

/* ── 11. 프로그램 비용 및 입금 안내 ── */

export const feeInfo = {
  prices: [
    { name: '베이직', value: '150,000원' },
    { name: '프리미엄', value: '390,000원' },
  ],
  extra: '일요일·공휴일 예약 진행 시 50,000원 추가 비용이 발생합니다.',
  account: { bank: '기업은행', number: '667-029459-01-011', holder: '장지예' },
  afterDeposit: '입금 완료 후 예약이 최종 확정됩니다.',
  // 신청 접수 시 보호자·아이 이름이 담당자에게 자동으로 문자 발송되므로
  // (api/core-reset-apply.js → HOST_NOTIFY_PHONE) 별도로 문자를 보낼 필요가 없다.
  depositNameNotice: '입금자명은 보호자 성함과 같게 해 주시면 확인이 빠릅니다.',
  consentLabel: '프로그램 비용 및 입금 안내를 이해했습니다.',
} as const

/* ── 개인정보 수집·이용 동의 ── */

export type ConsentItem = { label: string; value: string }

export const privacyConsent: { title: string; items: ConsentItem[]; notice: string } = {
  title: '개인정보 수집·이용 동의 (필수)',
  items: [
    {
      label: '수집 항목',
      value:
        '보호자 성함, 연락처, 카카오톡 아이디, 거주지역, 아이 이름·생년월일·성별, 출생 정보, 진단·치료 이력 등 건강 관련 정보, 신청서 응답 내용',
    },
    {
      label: '수집·이용 목적',
      value:
        '코칭 신청 접수 및 확인, 상담 일정 조율과 안내, 아이 상태에 맞춘 코칭·홈케어 프로그램 설계, 참가비 입금 확인',
    },
    {
      label: '보유·이용 기간',
      value:
        '수집일로부터 코칭 종료 후 1년까지 보유하며, 기간이 지나거나 동의를 철회하시면 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.',
    },
    {
      label: '처리 위탁',
      value:
        '솔라피(SOLAPI) — 안내 문자 발송 / Supabase — 신청 정보 저장·관리. 위탁 목적 외의 용도로는 제3자에게 제공하지 않습니다.',
    },
  ],
  notice:
    '진단·치료 이력 등 건강에 관한 정보(민감정보)가 포함됩니다. 정보주체는 수집·이용 동의를 거부할 권리가 있으나, 위 항목은 맞춤 코칭 설계에 반드시 필요한 최소한의 정보로 동의를 거부하실 경우 신청 접수가 어렵습니다.',
}

export const privacyConsentLabel =
  '민감정보를 포함한 개인정보 수집·이용에 동의합니다.'

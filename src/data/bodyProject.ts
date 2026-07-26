/**
 * 브레인센트 4주 몸읽기 프로젝트 — 신청서 문항 스키마
 * 페이지(ProjectApplyPage)가 이 스키마를 읽어 렌더링하고, 응답을 answers 객체로 수집합니다.
 * 응답 키(question.id)는 분석 시 컬럼처럼 쓰이므로 안정적으로 유지하세요.
 */

export const projectMeta = {
  key: 'body_reading_4w',
  eyebrow: '브레인센트 프로젝트',
  title: '브레인센트 4주 몸읽기 프로젝트',
  desc: '7일 몸읽기 프로젝트에서 배운 관찰을 이어서, 4주 동안 아이의 몸을 조금 더 깊이 이해하고 일상에서 부담 없이 실천할 수 있는 루틴을 함께 만들어 갑니다.',
}

/** 1. 안내 — 신청서 맨 위 안내 카드 */
export const projectInfo = {
  greeting: '브레인센트 4주 몸읽기 프로젝트에 관심을 가져주셔서 감사합니다.',
  body: '7일 몸읽기 프로젝트에서 배운 관찰을 바탕으로 앞으로 4주 동안 아이의 몸을 조금 더 깊이 이해하고, 일상 속에서 부담 없이 실천할 수 있는 루틴을 함께 만들어갑니다.',
  facts: [
    { label: '운영기간', value: '7월 27일(월)부터 4주간' },
    { label: '참가비', value: '40,000원' },
    { label: '운영', value: '카카오톡 전용 단톡방' },
  ],
  providesLabel: '제공',
  provides: [
    '주 2회 몸읽기 실천 영상',
    '하루 5~10분 몸 루틴',
    '주간 몸읽기 미션',
    '함께 기록하고 변화 나누기',
  ],
} as const

/** 참가비 · 입금 계좌 */
export const projectFee = {
  amount: '40,000원',
  notice: '입금이 확인되면 신청이 완료되며, 카카오톡 단톡방으로 초대해 드립니다.',
} as const

export const projectAccount = {
  bank: '기업은행',
  number: '667-029459-01-011',
  holder: '장지예',
} as const

/** '기타' 직접입력을 트리거하는 보기 라벨 */
export const OTHER = '기타'

/** 다른 보기와 함께 고를 수 없는(고르면 나머지가 해제되는) 보기 */
export const UNDECIDED = '아직 결정하지 못했습니다.'

export type ProjectQuestion =
  | {
      id: string
      type: 'text'
      label: string
      inputType?: 'text' | 'tel'
      placeholder?: string
      multiline?: boolean
      required?: boolean
      help?: string
      /** 서술형 문항 아래에 보여줄 예시 문장 */
      examples?: string[]
    }
  | {
      id: string
      type: 'single'
      label?: string
      options: string[]
      /** 이 보기를 고르면 직접입력 칸이 열립니다 */
      otherOption?: string
      required?: boolean
      help?: string
    }
  | {
      id: string
      type: 'multi'
      label?: string
      options: string[]
      max?: number
      otherOption?: string
      /** 이 보기를 고르면 나머지 선택이 해제됩니다 (예: '아직 결정하지 못했습니다.') */
      exclusiveOption?: string
      required?: boolean
      help?: string
    }

export type ProjectSection = {
  id: string
  title: string
  description?: string
  /** 짧은 입력칸을 2열로 배치 */
  grid?: boolean
  questions: ProjectQuestion[]
}

export const projectSections: ProjectSection[] = [
  {
    id: 'sec2',
    title: '2. 보호자 정보',
    description: '단톡방 초대와 안내 문자 발송에 사용됩니다.',
    grid: true,
    questions: [
      {
        id: 'guardian_name',
        type: 'text',
        label: '보호자 성함',
        placeholder: '홍길동',
        required: true,
      },
      {
        id: 'guardian_phone',
        type: 'text',
        label: '연락처',
        inputType: 'tel',
        placeholder: '010-1234-5678',
        required: true,
      },
      {
        id: 'kakao_nickname',
        type: 'text',
        label: '카카오톡 닉네임',
        placeholder: '단톡방에서 사용하시는 닉네임',
        required: true,
        help: '단톡방에 초대해 드릴 때 신청자를 확인하는 데 사용합니다.',
      },
    ],
  },
  {
    id: 'sec3',
    title: '3. 아이 정보',
    questions: [
      {
        id: 'child_name',
        type: 'text',
        label: '아이 이름',
        placeholder: '아이 이름 또는 태명',
        required: true,
      },
      {
        id: 'child_age',
        type: 'single',
        label: '아이 나이',
        required: true,
        options: ['0~12개월', '13~24개월', '25~36개월', '4~5세', '6~7세', '초등학생 이상'],
      },
    ],
  },
  {
    id: 'sec4',
    title: '4. 현재 가장 기대하는 변화',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택 가능)',
    questions: [
      {
        id: 'expected_changes',
        type: 'multi',
        otherOption: OTHER,
        options: [
          '코호흡',
          '수면',
          '입벌림',
          '코골이',
          '식사 및 씹기',
          '감각 예민',
          '집중',
          '자세',
          '긴장 완화',
          '전반적인 몸 상태',
          OTHER,
        ],
      },
    ],
  },
  {
    id: 'sec5',
    title: '5. 7일 프로젝트에서 가장 도움이 되었던 것은 무엇인가요?',
    questions: [
      {
        id: 'helpful_7days',
        type: 'text',
        multiline: true,
        label: '',
        placeholder: '자유롭게 적어 주세요.',
      },
    ],
  },
  {
    id: 'sec6',
    title: '6. 앞으로 4주 동안 가장 기대하는 것은 무엇인가요?',
    questions: [
      {
        id: 'expectation_4w',
        type: 'text',
        multiline: true,
        label: '',
        placeholder: '자유롭게 적어 주세요.',
        examples: [
          '아이의 변화를 꾸준히 관찰하고 싶어요.',
          '혼자보다 함께 실천하고 싶어요.',
          '몸을 읽는 방법을 더 배우고 싶어요.',
        ],
      },
    ],
  },
  {
    id: 'sec7',
    title: '7. 가장 궁금한 내용이 있다면 적어주세요.',
    questions: [
      {
        id: 'question',
        type: 'text',
        multiline: true,
        label: '',
        placeholder: '프로젝트에서 꼭 답을 얻고 싶은 질문을 적어 주세요.',
      },
    ],
  },
  {
    id: 'sec8',
    title: '8. 이번 프로젝트가 끝난 후에도 함께하고 싶은 프로그램이 있다면?',
    description: '앞으로의 프로그램 기획에 참고할 문항입니다. (복수 선택 가능)',
    questions: [
      {
        id: 'future_programs',
        type: 'multi',
        exclusiveOption: UNDECIDED,
        options: [
          '매달 몸읽기 프로젝트',
          '수면 집중 프로젝트',
          '코호흡 프로젝트',
          '식사·씹기 프로젝트',
          '영유아 발달 프로젝트',
          '온라인 부모 모임',
          '오프라인 클래스',
          UNDECIDED,
        ],
      },
    ],
  },
]

/* ── 개인정보 수집·이용 동의 ── */

export type ConsentItem = { label: string; value: string }

/** 필수 동의 — 신청 접수를 위해 반드시 필요한 항목 */
export const privacyConsent: { title: string; items: ConsentItem[]; notice: string } = {
  title: '개인정보 수집·이용 동의 (필수)',
  items: [
    {
      label: '수집 항목',
      value: '보호자 성함, 연락처, 카카오톡 닉네임, 아이 이름·나이, 신청서 응답 내용',
    },
    {
      label: '수집·이용 목적',
      value:
        '프로젝트 신청 접수 및 확인, 카카오톡 단톡방 초대와 일정·자료 안내, 참가비 입금 확인, 프로그램 구성을 위한 통계 분석',
    },
    {
      label: '보유·이용 기간',
      value:
        '수집일로부터 프로젝트 종료 후 1년까지 보유하며, 기간이 지나거나 동의를 철회하시면 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.',
    },
    {
      label: '처리 위탁',
      value:
        '솔라피(SOLAPI) — 안내 문자 발송 / Supabase — 신청 정보 저장·관리. 위탁 목적 외의 용도로는 제3자에게 제공하지 않습니다.',
    },
  ],
  notice:
    '정보주체는 개인정보 수집·이용 동의를 거부할 권리가 있습니다. 다만 위 항목은 프로젝트 운영에 반드시 필요한 최소한의 정보로, 동의를 거부하실 경우 신청 접수가 어렵습니다.',
}

/** 동의 체크박스 문구 */
export const consentLabel = '신청 및 프로젝트 운영을 위한 개인정보 수집·이용에 동의합니다.'

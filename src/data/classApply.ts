/**
 * 브레인센트 후각키트 만들기 클래스 — 신청서 문항 스키마
 * 페이지(ClassApplyPage)가 이 스키마를 읽어 렌더링하고, 응답을 answers 객체로 수집합니다.
 * 응답 키(question.id)는 분석 시 컬럼처럼 쓰이므로 안정적으로 유지하세요.
 */

export const classMeta = {
  key: 'brain_scent_kit',
  eyebrow: '브레인센트 클래스',
  title: '브레인센트 후각키트 만들기 클래스',
  desc: '코호흡과 자율신경계부터 인헤일러·후각스프레이 제작까지, 현장에서 바로 쓰는 후각 중재를 배웁니다. 아래 신청서를 작성해 주시면 담당자가 안내 문자를 보내드립니다.',
}

/** 수강료 입금 계좌 */
export const classAccount = {
  bank: '기업은행',
  number: '667-029459-01-011',
  holder: '장지예',
} as const

/** 기타 직접입력을 트리거하는 보기 라벨 */
export const OTHER = '기타 (직접입력)'

export type ClassQuestion =
  | {
      id: string
      type: 'text'
      label: string
      inputType?: 'text' | 'tel' | 'email'
      placeholder?: string
      multiline?: boolean
      required?: boolean
      help?: string
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
      required?: boolean
      help?: string
    }

export type ClassSection = {
  id: string
  title: string
  description?: string
  /** 짧은 입력칸을 2열로 배치 */
  grid?: boolean
  questions: ClassQuestion[]
}

export const classSections: ClassSection[] = [
  {
    id: 'sec1',
    title: '1. 기본 정보',
    description: '안내 문자와 교육 자료 발송에 사용됩니다.',
    grid: true,
    questions: [
      {
        id: 'name',
        type: 'text',
        label: '성함',
        placeholder: '홍길동',
        required: true,
      },
      {
        id: 'phone',
        type: 'text',
        label: '연락처',
        inputType: 'tel',
        placeholder: '010-1234-5678',
        required: true,
      },
      {
        id: 'email',
        type: 'text',
        label: '이메일',
        inputType: 'email',
        placeholder: 'example@email.com',
        required: true,
      },
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
    id: 'sec2',
    title: '2. 현재 하고 있는 일',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택)',
    questions: [
      {
        id: 'occupation',
        type: 'multi',
        otherOption: OTHER,
        options: [
          '물리치료사',
          '작업치료사',
          '언어치료사',
          '감각통합치료사',
          '산후마사지',
          '산후조리원',
          '필라테스',
          '요가',
          '운동지도자',
          '간호사',
          '의사',
          '한의사',
          '심리상담사',
          '특수교사',
          '어린이집/유치원',
          '부모',
          OTHER,
        ],
      },
    ],
  },
  {
    id: 'sec3',
    title: '3. 현재 주로 만나는 대상은?',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택)',
    questions: [
      {
        id: 'clients',
        type: 'multi',
        options: [
          '신생아',
          '영유아',
          '아동',
          '청소년',
          '성인',
          '임산부',
          '산모',
          '노인',
          '발달장애',
          '자폐',
          'ADHD',
          '감각조절 어려움',
          '일반인',
        ],
      },
    ],
  },
  {
    id: 'sec4',
    title: '4. 후각을 활용한 중재 경험이 있으신가요?',
    questions: [
      {
        id: 'olfactory_experience',
        type: 'single',
        options: [
          '전혀 없다',
          '향은 사용하지만 체계적으로는 아니다',
          '아로마를 공부한 적 있다',
          '현재 임상에서 활용 중이다',
        ],
      },
    ],
  },
  {
    id: 'sec5',
    title: '5. 이 교육을 신청하게 된 가장 큰 이유는 무엇인가요?',
    questions: [
      {
        id: 'apply_reason',
        type: 'text',
        multiline: true,
        label: '',
        placeholder: '자유롭게 적어 주세요.',
      },
    ],
  },
  {
    id: 'sec6',
    title: '6. 현재 가장 많이 만나는 대상의 고민은 무엇인가요?',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택)',
    questions: [
      {
        id: 'client_concerns',
        type: 'multi',
        otherOption: '기타',
        options: [
          '입벌림',
          '구강호흡',
          '수면',
          '스트레스',
          '불안',
          '통증',
          '감각과민',
          '집중력',
          '산후회복',
          '만성피로',
          '자율신경계 문제',
          '기타',
        ],
      },
    ],
  },
  {
    id: 'sec7',
    title: '7. 후각을 배우면 가장 먼저 적용하고 싶은 대상은?',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택)',
    questions: [
      {
        id: 'first_target',
        type: 'multi',
        otherOption: '기타',
        options: ['나 자신', '가족', '아이', '환자', '회원', '산모', '직원', '기타'],
      },
    ],
  },
  {
    id: 'sec8',
    title: '8. 가장 배우고 싶은 내용은?',
    description: '해당하는 항목을 모두 선택해 주세요. (복수 선택)',
    questions: [
      {
        id: 'wanted_topics',
        type: 'multi',
        options: [
          '코호흡과 후각',
          '자율신경계',
          '향 선택법',
          '블렌딩',
          '인헤일러 제작',
          '후각스프레이 제작',
          '마사지와 함께 사용하는 방법',
          '수면 루틴',
          '집중 루틴',
          '스트레스 관리',
          '임상 적용',
        ],
      },
    ],
  },
  {
    id: 'sec9',
    title: '9. 현재 가장 궁금한 질문은 무엇인가요?',
    questions: [
      {
        id: 'question',
        type: 'text',
        multiline: true,
        label: '',
        placeholder: '교육에서 꼭 답을 얻고 싶은 질문을 적어 주세요.',
      },
    ],
  },
  {
    id: 'sec10',
    title: '10. 교육 후 가장 얻고 싶은 변화는 무엇인가요?',
    questions: [
      {
        id: 'wanted_change',
        type: 'multi',
        label: '해당하는 항목을 모두 선택해 주세요. (복수 선택)',
        options: [
          '내 몸이 편안해지고 싶다',
          '환자 만족도를 높이고 싶다',
          '프로그램을 만들고 싶다',
          '후각을 임상에 적용하고 싶다',
          '수익화하고 싶다',
          '전문가로 성장하고 싶다',
        ],
      },
      {
        id: 'change_in_work',
        type: 'text',
        multiline: true,
        label: '“후각을 배우면 당신의 일에서 무엇이 달라질 것 같나요?”',
        placeholder: '떠오르는 대로 편하게 적어 주세요.',
      },
    ],
  },
  {
    id: 'sec11',
    title: '11. 브레인센트에 바라는 점',
    description: '앞으로의 교육 기획에 참고할 문항입니다.',
    questions: [
      {
        id: 'motivation',
        type: 'single',
        label: '교육을 듣고 싶은 이유를 하나만 선택해 주세요.',
        options: [
          '과학적인 근거가 궁금하다',
          '실제 임상 사례가 궁금하다',
          '직접 만들어 보고 싶다',
          '내 프로그램에 적용하고 싶다',
          '가족 건강관리에 활용하고 싶다',
          '브레인센트만의 관점이 궁금하다',
        ],
      },
      {
        id: 'future_topics',
        type: 'multi',
        label: '앞으로 브레인센트에서 가장 배우고 싶은 주제는 무엇인가요? (복수 선택)',
        options: [
          '후각',
          '코호흡',
          '수면',
          '자율신경계',
          '영유아 발달',
          '마사지',
          '얼굴·구강',
          '발바닥 감각',
          '원시반사',
          '움직임',
          '향기 블렌딩',
          '호흡 운동',
          '전문가 과정',
          '부모 교육',
        ],
      },
    ],
  },
]

/* ── 개인정보 수집·이용 동의서 ── */

export type ConsentItem = { label: string; value: string }

/** 필수 동의 — 신청 접수를 위해 반드시 필요한 항목 */
export const privacyConsent: { title: string; items: ConsentItem[]; notice: string } = {
  title: '개인정보 수집·이용 동의 (필수)',
  items: [
    {
      label: '수집 항목',
      value: '성함, 연락처, 이메일, 거주지역, 직업·근무 형태, 신청서 응답 내용',
    },
    {
      label: '수집·이용 목적',
      value:
        '클래스 신청 접수 및 확인, 일정·장소 안내와 교육 자료 발송, 수강료 입금 확인, 교육 과정 구성을 위한 통계 분석',
    },
    {
      label: '보유·이용 기간',
      value:
        '수집일로부터 클래스 종료 후 1년까지 보유하며, 기간이 지나거나 동의를 철회하시면 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.',
    },
    {
      label: '처리 위탁',
      value:
        '솔라피(SOLAPI) — 안내 문자·알림톡 발송 / Supabase — 신청 정보 저장·관리. 위탁 목적 외의 용도로는 제3자에게 제공하지 않습니다.',
    },
  ],
  notice:
    '정보주체는 개인정보 수집·이용 동의를 거부할 권리가 있습니다. 다만 위 항목은 클래스 운영에 반드시 필요한 최소한의 정보로, 동의를 거부하실 경우 신청 접수가 어렵습니다.',
}

/** 선택 동의 — 거부해도 신청에는 영향이 없는 항목 */
export const marketingConsent = {
  title: '마케팅·홍보 활용 동의 (선택)',
  body: '신청서에 적어주신 응답과 교육 후기를 개인을 식별할 수 없는 형태로 가공하여, 브레인센트의 교육 안내·전자책·강의자료·홈페이지·SNS 등에 활용하는 것에 동의합니다. 또한 신규 클래스·전자책 소식 등 유익한 정보를 문자·이메일로 받아보는 데 동의합니다.',
  notice: '선택 항목이므로 동의하지 않으셔도 클래스 신청과 수강에는 아무런 불이익이 없습니다.',
}

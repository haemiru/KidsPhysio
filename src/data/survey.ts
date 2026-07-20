/**
 * Brain Scent Project 종료 설문 — 문항 스키마
 * 페이지(SurveyPage)가 이 스키마를 읽어 렌더링하고, 응답을 answers 객체로 수집합니다.
 * 응답 키(question.id / statement.id)는 분석 시 컬럼처럼 쓰이므로 안정적으로 유지하세요.
 */

export const surveyMeta = {
  key: 'brain_scent_end',
  eyebrow: 'Brain Scent Project',
  title: '브레인센트 프로젝트 종료 설문',
  desc: '프로젝트를 함께해 주셔서 감사합니다. 아이의 변화와 소중한 의견을 들려주세요. 익명으로 진행되며, 5~7분이면 충분합니다.',
}

export type LikertStatement = { id: string; text: string }

export type SurveyQuestion =
  | { id: string; type: 'single'; label: string; options: string[]; help?: string; required?: boolean }
  | { id: string; type: 'multi'; label: string; options: string[]; max?: number; help?: string }
  | { id: string; type: 'likert'; label?: string; scale: string[]; statements: LikertStatement[]; help?: string }
  | { id: string; type: 'nps'; label: string; min: number; max: number; minLabel?: string; maxLabel?: string; help?: string }
  | { id: string; type: 'text'; label: string; multiline?: boolean; placeholder?: string; help?: string }

export type SurveySection = {
  id: string
  title: string
  description?: string
  questions: SurveyQuestion[]
}

export const surveySections: SurveySection[] = [
  {
    id: 'sec1',
    title: '1. 기본 정보',
    description: '세분화 분석을 위한 기본 정보입니다.',
    questions: [
      {
        id: 'child_age',
        type: 'single',
        label: '1-1. 아이 연령',
        options: ['0~6개월', '7~12개월', '13~24개월', '25~36개월', '4~6세', '초등학생', '기타'],
      },
      {
        id: 'diagnosis',
        type: 'single',
        label: '1-2. 진단 여부',
        options: ['특별한 진단 없음', '발달지연', '자폐스펙트럼', 'ADHD', '희귀질환', '뇌병변', '저긴장', '기타'],
      },
      {
        id: 'concerns',
        type: 'multi',
        label: '1-3. 현재 가장 고민인 문제 (최대 3개 선택)',
        max: 3,
        options: [
          '입벌림', '코호흡', '잠들기 어려움', '자주 깨는 수면', '침흘림', '씹기', '삼키기',
          '코골이', '코막힘', '감각예민', '집중력', '불안', '틱', '자세', '사두증', '사경', '기타',
        ],
        help: '이 문항은 이후 앱 추천 알고리즘에도 사용할 수 있습니다.',
      },
    ],
  },
  {
    id: 'sec2',
    title: '2. 프로젝트 효과',
    description: '프로젝트 후 얼마나 그렇게 느끼셨는지 5점 척도로 표시해 주세요.',
    questions: [
      {
        id: 'effect',
        type: 'likert',
        scale: ['전혀 아니다', '조금 아니다', '보통', '그렇다', '매우 그렇다'],
        statements: [
          { id: 'effect_view', text: '① 아이를 이해하는 관점이 달라졌다.' },
          { id: 'effect_signals', text: '② 몸의 신호를 읽는 방법을 알게 되었다.' },
          { id: 'effect_breath_sleep', text: '③ 호흡과 수면이 연결된다는 것을 이해하게 되었다.' },
          { id: 'effect_body', text: '④ 아이를 문제보다 몸의 반응으로 보게 되었다.' },
          { id: 'effect_parent', text: '⑤ 부모인 내가 덜 불안해졌다.' },
        ],
        help: '이 다섯 문항은 브레인센트 철학 검증에도 사용할 수 있습니다.',
      },
    ],
  },
  {
    id: 'sec3',
    title: '3. 실제 변화',
    description: '프로젝트 이후 변화를 느낀 부분을 모두 선택해 주세요.',
    questions: [
      {
        id: 'changes',
        type: 'multi',
        label: '변화를 느낀 부분 (복수 선택)',
        options: [
          '입을 덜 벌린다', '코호흡이 늘었다', '침흘림 감소', '잠드는 시간이 짧아졌다', '밤에 덜 깬다',
          '뒤척임 감소', '코막힘 감소', '잘 놀라지 않는다', '표정이 부드러워졌다', '식사가 편해졌다',
          '씹기가 좋아졌다', '자세가 좋아졌다', '부모와 눈맞춤 증가', '변화 없음', '잘 모르겠다',
        ],
        help: '이 데이터는 논문 및 사례 분석에 매우 유용합니다.',
      },
    ],
  },
  {
    id: 'sec4',
    title: '4. 가장 도움이 되었던 활동',
    questions: [
      {
        id: 'helpful_activities',
        type: 'multi',
        label: '도움이 되었던 활동 (복수 선택)',
        options: [
          '코호흡 관찰', '몸읽기 체크', '구강마사지', '혀 자극', '볼 마사지', '발바닥 자극', '후각 활동',
          '수면 루틴', '자세 관찰', 'AI 피드백', '매일 영상', '체크리스트', '다른 부모 사례',
        ],
      },
    ],
  },
  {
    id: 'sec5',
    title: '5. 가장 어려웠던 점',
    questions: [
      {
        id: 'difficulties',
        type: 'multi',
        label: '어려웠던 점 (복수 선택)',
        options: [
          '시간이 부족했다', '아이 협조가 어려웠다', '무엇을 먼저 해야 할지 헷갈렸다',
          '체크하는 것이 어려웠다', '변화가 잘 느껴지지 않았다', '가족 협조가 어려웠다', '기타',
        ],
        help: '앱 UX 설계에 매우 중요한 자료입니다.',
      },
    ],
  },
  {
    id: 'sec6',
    title: '6. 앱 개발 조사',
    description: '이 부분이 가장 중요합니다.',
    questions: [
      {
        id: 'app_intent',
        type: 'single',
        label: '매일 3분 정도 기록하는 앱이 있다면 사용할 의향이 있나요?',
        options: ['매우 사용하고 싶다', '사용할 것 같다', '잘 모르겠다', '사용하지 않을 것 같다'],
      },
      {
        id: 'app_features',
        type: 'multi',
        label: '앱에서 가장 필요한 기능은? (최대 3개 선택)',
        max: 3,
        options: [
          'AI가 몸 상태 분석', '오늘의 체크리스트', '수면기록', '호흡기록', '침흘림 기록', '코막힘 기록',
          '대변기록', '식사기록', '냄새기록', '사진비교', '성장그래프', '영상기록', '전문가 피드백',
          'AI 질문답변', '주간리포트', '월간리포트',
        ],
        help: '이 데이터는 MVP 기능 우선순위를 정하는 데 큰 도움이 됩니다.',
      },
    ],
  },
  {
    id: 'sec7',
    title: '7. 신경계 육아 다이어리',
    description: '매일 기록할 수 있다면 어떤 항목이 부담 없을지 알려주세요.',
    questions: [
      {
        id: 'diary_easy',
        type: 'multi',
        label: '부담 없는 기록은 무엇인가요? (복수 선택)',
        options: ['잠', '입벌림', '코호흡', '침흘림', '대변', '식사', '감정', '울음', '냄새', '활동', '사진', '동영상', '부모 메모'],
      },
      {
        id: 'ai_wanted',
        type: 'multi',
        label: 'AI가 자동으로 분석해주길 원하는 것은? (복수 선택)',
        options: [
          '오늘 컨디션', '자율신경 변화', '수면패턴', '감각패턴', '반복되는 증상',
          '성장변화', '원인 추정', '오늘 추천 활동', '내일 해야 할 것',
        ],
        help: '이 부분이 브레인센트 앱의 핵심 가치가 됩니다.',
      },
    ],
  },
  {
    id: 'sec8',
    title: '8. 프로젝트 만족도',
    questions: [
      {
        id: 'nps',
        type: 'nps',
        label: '브레인센트 프로젝트를 다른 부모에게 추천할 의향은 얼마나 있으신가요?',
        min: 0,
        max: 10,
        minLabel: '전혀 없음',
        maxLabel: '매우 높음',
        help: 'NPS(고객 추천 지수) 측정용 문항입니다.',
      },
    ],
  },
  {
    id: 'sec9',
    title: '9. 브레인센트만의 차별점',
    questions: [
      {
        id: 'impressive',
        type: 'text',
        multiline: true,
        label: '프로젝트를 경험하며 가장 인상 깊었던 것은 무엇인가요?',
        placeholder: '자유롭게 적어 주세요.',
      },
      {
        id: 'one_sentence',
        type: 'text',
        label: '브레인센트를 한 문장으로 표현한다면?',
        placeholder: '예) 아이의 숨을 다시 보게 한 시간',
      },
    ],
  },
  {
    id: 'sec10',
    title: '10. 마케팅 활용 동의',
    questions: [
      {
        id: 'marketing_consent',
        type: 'single',
        label: '프로젝트 경험을 익명으로 전자책·논문·홈페이지·인스타그램·강의자료 등에 활용해도 괜찮으신가요?',
        options: ['예', '아니오'],
      },
      {
        id: 'biggest_change',
        type: 'text',
        multiline: true,
        label: '프로젝트를 시작하기 전에는 몰랐는데, 지금 가장 크게 달라진 생각은 무엇인가요?',
        placeholder:
          '예) 입벌림만의 문제가 아니라는 걸 알게 됐어요 / 아이를 혼내기보다 몸을 먼저 보게 됐어요',
      },
    ],
  },
]

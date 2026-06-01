/**
 * 키즈피지오 아동발달센터 — 사이트 콘텐츠 데이터
 * 텍스트/이미지/연락처를 여기서 한 곳에 모아 관리합니다.
 */

export const site = {
  name: '키즈피지오',
  fullName: '키즈피지오 아동발달센터',
  tagline: '아이의 가능성을 키우는 곳',
  phone: '02-1234-5678',
  phoneHref: 'tel:0212345678',
  email: 'hello@kidsphysio.kr',
  emailHref: 'mailto:hello@kidsphysio.kr',
  address: '서울특별시 강남구 발달로 123, 키즈피지오빌딩 3층',
  hours: [
    { day: '평일', time: '09:00 - 19:00' },
    { day: '토요일', time: '09:00 - 14:00' },
    { day: '일요일 · 공휴일', time: '휴진' },
  ],
  kakao: '#',
  instagram: '#',
  blog: '#',
} as const

export const nav = [
  { label: '센터소개', to: '/about' },
  { label: '발달 프로그램', to: '/programs' },
  { label: '치료진', to: '/team' },
  { label: '칼럼', to: '/blog' },
  { label: '오시는 길', to: '/contact' },
] as const

export const stats = [
  { value: '12년+', label: '센터 운영 경력' },
  { value: '8,500+', label: '함께한 아이들' },
  { value: '20명', label: '국가자격 치료진' },
  { value: '98%', label: '부모 만족도' },
] as const

export type Program = {
  id: string
  icon: string // lucide icon name key (mapped in component)
  title: string
  summary: string
  points: string[]
  color: 'brand' | 'coral' | 'sun' | 'sky'
}

export const programs: Program[] = [
  {
    id: 'sensory',
    icon: 'Sparkles',
    title: '감각통합치료',
    summary: '감각 정보를 조절하고 통합하는 힘을 길러 일상 적응력을 높입니다.',
    points: ['감각 예민·둔감 조절', '대근육·평형감각 발달', '집중력과 자기조절'],
    color: 'brand',
  },
  {
    id: 'physical',
    icon: 'Activity',
    title: '물리치료',
    summary: '운동 발달이 늦은 아이의 자세와 움직임을 전문적으로 돕습니다.',
    points: ['근력·균형 향상', '바른 자세·보행 훈련', '운동 발달 지연 개선'],
    color: 'sky',
  },
  {
    id: 'occupational',
    icon: 'Hand',
    title: '작업치료',
    summary: '소근육과 일상생활 기술을 키워 스스로 해내는 경험을 만듭니다.',
    points: ['소근육·눈손 협응', '식사·옷입기 등 일상기술', '시지각·인지 발달'],
    color: 'coral',
  },
  {
    id: 'speech',
    icon: 'MessageCircle',
    title: '언어치료',
    summary: '듣고 말하고 소통하는 즐거움으로 표현의 세계를 넓혀 줍니다.',
    points: ['언어 이해·표현 향상', '조음·발음 교정', '상호작용·화용 언어'],
    color: 'sun',
  },
  {
    id: 'play',
    icon: 'ToyBrick',
    title: '놀이치료',
    summary: '놀이를 통해 마음을 표현하고 정서적 안정을 찾도록 돕습니다.',
    points: ['정서·사회성 발달', '불안·위축 완화', '자존감과 또래관계'],
    color: 'brand',
  },
  {
    id: 'counsel',
    icon: 'HeartHandshake',
    title: '심리·부모상담',
    summary: '아이와 가정 전체를 살피는 상담으로 함께 성장의 길을 찾습니다.',
    points: ['발달·심리 평가', '양육 코칭', '가정 연계 프로그램'],
    color: 'coral',
  },
]

export const why = [
  {
    icon: 'UserCheck',
    title: '아이마다 다른 1:1 맞춤',
    desc: '표준화된 평가로 아이의 강점과 필요를 파악하고, 한 명 한 명에게 맞는 개별 프로그램을 설계합니다.',
  },
  {
    icon: 'BadgeCheck',
    title: '국가자격 전문 치료진',
    desc: '물리·작업·언어·놀이치료 국가자격을 갖춘 평균 경력 8년 이상의 치료사가 함께합니다.',
  },
  {
    icon: 'Users',
    title: '부모와 함께하는 치료',
    desc: '정기 상담과 가정 연계 과제로 센터의 변화가 집에서도 이어지도록 돕습니다.',
  },
  {
    icon: 'ShieldCheck',
    title: '안전하고 쾌적한 환경',
    desc: '연령별 맞춤 치료실과 매일 소독 관리되는 감염 안전 공간에서 아이를 케어합니다.',
  },
]

export const process = [
  {
    step: '01',
    title: '전화·온라인 상담',
    desc: '아이의 발달 상황과 고민을 편하게 나누고 방문 일정을 잡습니다.',
  },
  {
    step: '02',
    title: '발달 평가',
    desc: '표준화 검사와 관찰로 아이의 발달 수준과 필요 영역을 정밀하게 진단합니다.',
  },
  {
    step: '03',
    title: '맞춤 프로그램 설계',
    desc: '평가 결과를 바탕으로 목표와 회기 계획을 세워 부모님과 공유합니다.',
  },
  {
    step: '04',
    title: '치료 진행',
    desc: '전문 치료사와 1:1 세션을 꾸준히 진행하며 아이의 성장을 이끌어 갑니다.',
  },
  {
    step: '05',
    title: '주기적 재평가·피드백',
    desc: '정기적으로 변화를 점검하고 목표를 조정하며 가정 코칭을 제공합니다.',
  },
]

export type Therapist = {
  name: string
  role: string
  tags: string[]
  photo: string
}

export const team: Therapist[] = [
  {
    name: '김서연 센터장',
    role: '작업치료사 · 감각통합 전문',
    tags: ['작업치료 15년', '감각통합(SI) 인증'],
    photo:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: '이준호 치료사',
    role: '소아물리치료사',
    tags: ['물리치료 11년', '보바스(NDT) 과정'],
    photo:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: '박지민 치료사',
    role: '언어재활사 1급',
    tags: ['언어치료 9년', '조음·유창성'],
    photo:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=640&q=80',
  },
  {
    name: '최은채 치료사',
    role: '놀이심리상담사',
    tags: ['놀이치료 8년', '정서·사회성'],
    photo:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=640&q=80',
  },
]

export type Testimonial = {
  quote: string
  parent: string
  child: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      '낯가림이 심하던 아이가 6개월 만에 먼저 인사를 건네요. 매주 변화를 자세히 설명해 주셔서 집에서도 무엇을 해야 할지 알 수 있었어요.',
    parent: '36개월 아동 어머니',
    child: '감각통합 · 놀이치료',
  },
  {
    quote:
      '말이 늦어 걱정이 많았는데, 선생님과 즐겁게 수업하며 어휘가 부쩍 늘었습니다. 아이가 센터 가는 날을 가장 기다려요.',
    parent: '4세 아동 아버지',
    child: '언어치료',
  },
  {
    quote:
      '걸음이 불안정했던 아이가 또래처럼 뛰어놀게 되었어요. 평가부터 목표 설정까지 투명하게 안내해 주셔서 믿고 맡겼습니다.',
    parent: '5세 아동 어머니',
    child: '물리치료',
  },
]

/* ── 프로그램 상세 (프로그램 상세 페이지에서 사용) ── */
export type ProgramDetail = {
  intro: string
  image: string
  forWhom: string[]
  how: { title: string; desc: string }[]
  outcomes: string[]
}

export const programDetails: Record<string, ProgramDetail> = {
  sensory: {
    intro:
      '감각통합치료는 촉각·전정(균형)·고유수용성 감각 등 여러 감각 정보를 뇌가 효율적으로 조직화하도록 돕는 치료입니다. 놀이 기반 활동을 통해 아이가 자신의 몸과 환경을 더 잘 다루도록 이끕니다.',
    image:
      'https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '소리·촉감·움직임에 지나치게 예민하거나 둔감한 아이',
      '쉽게 산만하고 가만히 앉아 있기 어려운 아이',
      '대근육 활동이나 균형 잡기를 어려워하는 아이',
    ],
    how: [
      { title: '감각 프로파일 평가', desc: '아이의 감각 반응 특성을 표준화 도구로 파악합니다.' },
      { title: '맞춤 감각 활동', desc: '그네·볼풀·균형판 등 전정·고유수용 활동을 단계적으로 제공합니다.' },
      { title: '자기조절 훈련', desc: '스스로 각성 수준을 조절하는 전략을 놀이 속에서 익힙니다.' },
    ],
    outcomes: ['감각 예민·둔감 완화', '집중력·자기조절 향상', '일상 적응력 증진'],
  },
  physical: {
    intro:
      '소아물리치료는 운동 발달이 또래보다 늦거나 자세·움직임에 어려움이 있는 아이를 돕습니다. 근력과 균형, 협응 능력을 키워 바르게 서고 걷고 움직이도록 합니다.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '뒤집기·앉기·걷기 등 운동 발달이 늦은 영유아',
      '자세가 무너지거나 쉽게 넘어지는 아이',
      '근긴장도가 낮거나 높은 아이',
    ],
    how: [
      { title: '운동 발달 평가', desc: '대근육 운동 기능과 자세를 정밀하게 진단합니다.' },
      { title: '근력·균형 훈련', desc: '놀이 형태의 운동으로 핵심 근육과 평형감각을 키웁니다.' },
      { title: '보행·자세 교정', desc: '바른 움직임 패턴을 반복 학습합니다.' },
    ],
    outcomes: ['근력·균형 향상', '바른 자세·보행', '운동 발달 지연 개선'],
  },
  occupational: {
    intro:
      '작업치료는 소근육과 눈손 협응, 일상생활 기술을 길러 아이가 스스로 해내는 경험을 쌓도록 돕습니다. 식사·옷입기·쓰기 같은 실제 생활 과제를 중심으로 진행합니다.',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '손 사용이 서툴거나 글씨·가위질을 어려워하는 아이',
      '식사·옷입기 등 자조 기술이 더딘 아이',
      '시지각·인지 발달 지원이 필요한 아이',
    ],
    how: [
      { title: '기능 평가', desc: '소근육·시지각·일상생활 수행 수준을 평가합니다.' },
      { title: '소근육 활동', desc: '조작 놀이와 도구 활동으로 손 기능을 발달시킵니다.' },
      { title: '일상기술 훈련', desc: '실제 생활 과제를 단계별로 연습합니다.' },
    ],
    outcomes: ['소근육·눈손 협응', '자조 기술 향상', '시지각·인지 발달'],
  },
  speech: {
    intro:
      '언어치료는 듣고 이해하고 표현하며 소통하는 힘을 키웁니다. 아이의 언어 수준에 맞춰 놀이와 상호작용 속에서 자연스럽게 언어를 끌어냅니다.',
    image:
      'https://images.unsplash.com/photo-1597413545419-4013431dbfec?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '말이 늦거나 어휘가 부족한 아이',
      '발음이 부정확한 아이',
      '대화·상호작용을 어려워하는 아이',
    ],
    how: [
      { title: '언어 평가', desc: '수용·표현 언어와 조음 능력을 진단합니다.' },
      { title: '표현 언어 확장', desc: '놀이 중심으로 어휘와 문장을 늘려갑니다.' },
      { title: '조음·화용 훈련', desc: '발음 교정과 상황에 맞는 언어 사용을 연습합니다.' },
    ],
    outcomes: ['언어 이해·표현 향상', '조음·발음 교정', '상호작용 능력 증진'],
  },
  play: {
    intro:
      '놀이치료는 아이가 가장 편안해하는 ‘놀이’라는 언어로 마음을 표현하게 합니다. 안전한 관계 속에서 정서적 안정과 사회성을 키워 갑니다.',
    image:
      'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '불안·위축이 크거나 감정 조절이 어려운 아이',
      '또래 관계에 어려움을 겪는 아이',
      '자존감 회복이 필요한 아이',
    ],
    how: [
      { title: '관계 형성', desc: '치료사와 신뢰로운 관계를 먼저 만듭니다.' },
      { title: '정서 표현 놀이', desc: '놀이를 통해 감정을 안전하게 표현하고 다룹니다.' },
      { title: '사회성 코칭', desc: '상황극·역할 놀이로 또래 관계 기술을 익힙니다.' },
    ],
    outcomes: ['정서·사회성 발달', '불안·위축 완화', '자존감·또래관계 향상'],
  },
  counsel: {
    intro:
      '심리·부모상담은 아이만이 아니라 가정 전체를 살핍니다. 발달·심리 평가와 양육 코칭으로 부모님이 든든한 조력자가 되도록 함께합니다.',
    image:
      'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '아이의 발달·정서 상태를 정확히 알고 싶은 부모',
      '양육 방법에 도움이 필요한 가정',
      '가정 연계 프로그램을 원하는 부모',
    ],
    how: [
      { title: '발달·심리 평가', desc: '표준화 검사로 아이를 객관적으로 이해합니다.' },
      { title: '양육 코칭', desc: '가정에서 적용할 구체적 전략을 안내합니다.' },
      { title: '가정 연계', desc: '센터의 변화가 집에서도 이어지도록 돕습니다.' },
    ],
    outcomes: ['아이에 대한 이해 향상', '효능감 있는 양육', '가정-센터 연계 강화'],
  },
}

/* ── 센터소개 페이지 콘텐츠 ── */
export const aboutStory = {
  intro:
    '키즈피지오는 2013년 작은 치료실에서 시작했습니다. “아이마다 자라는 속도와 방식이 다르다”는 믿음 하나로, 지금까지 8,500명이 넘는 아이들의 발달 여정을 함께해 왔습니다.',
  mission:
    '우리는 아이의 부족함이 아니라 가능성에서 출발합니다. 평가부터 치료, 가정 연계까지 한 팀이 되어 아이와 가족이 일상에서 더 단단해지도록 돕는 것이 키즈피지오의 사명입니다.',
  image:
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1100&q=80',
}

export const values = [
  { icon: 'UserCheck', title: '아이 중심', desc: '모든 결정의 기준은 언제나 아이의 성장과 안전입니다.' },
  { icon: 'Users', title: '가족과 함께', desc: '부모를 치료의 동반자로 여기고 정보를 투명하게 공유합니다.' },
  { icon: 'BadgeCheck', title: '근거 기반', desc: '표준화된 평가와 검증된 치료 방법만을 사용합니다.' },
  { icon: 'HeartHandshake', title: '따뜻한 전문성', desc: '실력은 기본, 마음으로 아이를 대합니다.' },
]

export const history = [
  { year: '2013', text: '강남 1호 치료실 개소' },
  { year: '2016', text: '감각통합·언어치료실 확장, 치료진 10명' },
  { year: '2019', text: '누적 아동 3,000명 돌파' },
  { year: '2022', text: '현 위치 통합 센터 이전, 6개 전문 영역 운영' },
  { year: '2025', text: '누적 아동 8,500명, 부모 만족도 98%' },
]

/* ── 칼럼(블로그) ── */
export type Post = {
  slug: string
  title: string
  category: string
  date: string
  readingTime: string
  excerpt: string
  cover: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'when-to-start',
    title: '“조금 더 기다려 볼까요?” — 발달 치료, 언제 시작해야 할까',
    category: '발달 가이드',
    date: '2026-05-20',
    readingTime: '4분',
    excerpt:
      '“크면서 좋아지겠지” 하는 마음과 “지금 시작해야 하나” 하는 걱정 사이에서 고민하는 부모님께 드리는 이야기.',
    cover:
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=1000&q=80',
    body: [
      '많은 부모님이 “조금 더 지켜보자”와 “지금 시작해야 하나” 사이에서 고민합니다. 결론부터 말씀드리면, 발달에서 가장 중요한 것은 ‘시기’입니다.',
      '뇌가 가장 유연하게 변화하는 영유아기에는 같은 노력으로도 더 큰 변화를 만들 수 있습니다. 그래서 ‘걱정이 든다면 그때가 상담의 적기’라고 말씀드립니다. 치료가 꼭 필요하지 않더라도, 평가를 통해 안심하거나 가정에서의 방향을 얻을 수 있습니다.',
      '특히 또래보다 말이 늦거나, 눈맞춤·상호작용이 적거나, 운동 발달이 더딘 경우에는 한 번쯤 전문가의 평가를 받아보시길 권합니다. 빠른 확인이 아이에게도 부모에게도 가장 큰 도움이 됩니다.',
    ],
  },
  {
    slug: 'sensory-at-home',
    title: '집에서 할 수 있는 감각통합 놀이 5가지',
    category: '가정 코칭',
    date: '2026-05-08',
    readingTime: '5분',
    excerpt:
      '특별한 도구 없이도 거실에서 할 수 있는, 아이의 감각 발달을 돕는 간단한 놀이를 소개합니다.',
    cover:
      'https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&w=1000&q=80',
    body: [
      '감각통합은 센터에서만 이루어지는 것이 아닙니다. 일상 속 작은 놀이가 모이면 큰 힘이 됩니다.',
      '① 이불 그네 태우기, ② 쿠션 산 넘기, ③ 콩·쌀 촉감 상자 탐색, ④ 빨대 불기 놀이, ⑤ 까꿍 균형 놀이 — 모두 전정·고유수용·촉각 감각을 자연스럽게 자극합니다.',
      '중요한 것은 ‘즐거움’입니다. 아이가 웃으며 반복하고 싶어 한다면 그 활동이 지금 아이에게 필요한 자극일 가능성이 높습니다. 무리하지 말고 아이의 반응을 따라가 주세요.',
    ],
  },
  {
    slug: 'language-burst',
    title: '말이 늦은 아이, 어떻게 도와줄 수 있을까',
    category: '발달 가이드',
    date: '2026-04-22',
    readingTime: '4분',
    excerpt:
      '언어 폭발기를 앞둔 아이를 위해 부모가 가정에서 실천할 수 있는 상호작용 방법.',
    cover:
      'https://images.unsplash.com/photo-1591348122449-02525d70379b?auto=format&fit=crop&w=1000&q=80',
    body: [
      '언어는 ‘주고받는 경험’ 속에서 자랍니다. 아이가 바라보는 것을 함께 보고, 아이의 소리에 반응해 주는 것만으로도 큰 자극이 됩니다.',
      '말을 재촉하기보다 아이의 행동을 말로 표현해 주세요. “물 마시고 싶구나”, “자동차 굴러간다”처럼 상황을 언어로 입혀 주면 아이는 단어와 의미를 연결합니다.',
      '다만 또래보다 현저히 느리다고 느껴진다면, 언어 평가를 통해 정확한 수준을 확인하는 것이 좋습니다. 원인에 따라 접근이 달라지기 때문입니다.',
    ],
  },
  {
    slug: 'parent-burnout',
    title: '치료실 밖의 부모님께 — 나를 돌보는 일도 치료입니다',
    category: '부모 마음',
    date: '2026-04-05',
    readingTime: '3분',
    excerpt:
      '아이를 돌보느라 지친 부모님의 마음을 위한 짧은 글. 부모의 안정이 아이의 안정입니다.',
    cover:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1000&q=80',
    body: [
      '아이의 발달을 챙기다 보면 정작 부모님 자신은 뒤로 미뤄지기 쉽습니다. 하지만 아이는 부모의 정서를 그대로 느낍니다.',
      '완벽한 부모가 되려 애쓰지 않아도 괜찮습니다. 하루 10분이라도 자신을 위한 시간을 갖고, 힘들 땐 도움을 청하세요. 그것이 결코 약함이 아닙니다.',
      '키즈피지오는 아이뿐 아니라 부모님의 마음도 함께 살핍니다. 언제든 편하게 상담을 요청해 주세요.',
    ],
  },
]

export const faqs = [
  {
    q: '몇 살부터 발달 치료를 받을 수 있나요?',
    a: '생후 18개월부터 초등 고학년까지 연령별 맞춤 프로그램을 운영합니다. 발달이 걱정된다면 빠른 상담이 가장 큰 도움이 됩니다.',
  },
  {
    q: '치료 전에 꼭 평가를 받아야 하나요?',
    a: '네. 아이마다 필요한 영역이 다르기 때문에 표준화된 발달 평가를 먼저 진행한 뒤, 결과를 바탕으로 프로그램을 설계합니다.',
  },
  {
    q: '부모도 치료 과정에 참여하나요?',
    a: '정기 부모 상담과 가정 연계 과제를 통해 센터의 변화가 가정에서도 이어지도록 함께합니다.',
  },
  {
    q: '주차가 가능한가요?',
    a: '건물 내 전용 주차장을 무료로 이용하실 수 있으며, 유모차 접근이 편한 배리어프리 동선을 갖추고 있습니다.',
  },
]

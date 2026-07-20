/**
 * 짱샘 키즈피지오 — 사이트 콘텐츠 데이터
 * 짱샘(장지예) 소개 · 발달 치료 · 짱샘의 책방 · 아로마 테라피를 한 곳에서 관리합니다.
 */

export const site = {
  name: '짱샘 키즈피지오',
  fullName: '짱샘 키즈피지오 아동발달센터',
  tagline: '아이의 가능성을 키우는 곳',
  /** 짱샘 본명 */
  founderName: '장지예',
  founderNick: '짱샘',
  phone: '010-5776-3325',
  phoneHref: 'tel:01057763325',
  email: 'ybongee@naver.com',
  emailHref: 'mailto:ybongee@naver.com',
  address: '서울시 강남구 논현로8길 10-4, 1층',
  hours: [
    { day: '평일', time: '10:00 - 19:00' },
    { day: '토요일', time: '10:00 - 14:00' },
    { day: '일요일 · 공휴일', time: '휴무' },
  ],
  /** 짱샘의 책방 (전자책방) */
  bookshop: 'https://jjangsaem.com',
  kakao: '#',
  instagram: 'https://instagram.com/seochojiye',
  blog: '#',
} as const

/** 사업자 정보 (카카오 비즈니스 채널 연관성 검증·전자상거래 표시 의무용) */
export const business = {
  companyName: '주식회사 짱샘에듀',
  ceo: '하성재',
  bizRegNo: '711-81-03824',
  /** 사업자등록증상 사업장 소재지 */
  address: '서울특별시 강남구 강남대로112길 47, 2층 672A호(논현동)',
  phone: '010-5776-3325',
  phoneHref: 'tel:01057763325',
  email: 'ybongee@naver.com',
} as const

export const nav = [
  { label: '센터소개', to: '/about' },
  { label: '발달치료', to: '/programs' },
  { label: '코칭', to: '/coaching' },
  { label: '책방', to: '/bookshop' },
  { label: '후각발달훈련', to: '/aroma' },
  { label: '치료진', to: '/team' },
  { label: '칼럼', to: '/blog' },
  { label: '오시는 길', to: '/contact' },
] as const

export const stats = [
  { value: '25년', label: '소아재활 임상 경력' },
  { value: '30+', label: '출간한 발달 전자책' },
  { value: '3개 영역', label: '1:1 발달 치료' },
  { value: '5종', label: '아로마·후각 케어 라인' },
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
    id: 'physical',
    icon: 'Activity',
    title: '물리치료',
    summary: '운동 발달이 늦은 아이의 자세와 움직임을 전문적으로 돕습니다.',
    points: ['근력·균형 향상', '바른 자세·보행 훈련', '운동 발달 지연 개선'],
    color: 'sky',
  },
  {
    id: 'breath',
    icon: 'Wind',
    title: '호흡·후각 훈련',
    summary: '코호흡과 후각 자극으로 신경계를 안정시켜 발달의 토대를 다집니다.',
    points: ['코호흡·복식호흡 훈련', '후각 발달 자극', '자율신경 안정·수면 개선'],
    color: 'brand',
  },
  {
    id: 'play',
    icon: 'ToyBrick',
    title: '놀이·원시반사 통합',
    summary: '놀이로 마음을 표현하고 남은 원시반사를 통합해 발달을 돕습니다.',
    points: ['정서·사회성 발달', '원시반사 통합 놀이', '불안·위축 완화'],
    color: 'coral',
  },
]

export const why = [
  {
    icon: 'BadgeCheck',
    title: '25년 임상의 깊이',
    desc: '수천 명의 아이를 만나온 소아재활 전문가 짱샘이 평가부터 프로그램 설계까지 직접 살핍니다.',
  },
  {
    icon: 'Wind',
    title: '호흡·후각이라는 다른 시작점',
    desc: '근육만 보지 않습니다. 아이의 숨과 신경계 안정에서 출발하는 짱샘만의 통합 접근을 만나보세요.',
  },
  {
    icon: 'UserCheck',
    title: '아이마다 다른 1:1 맞춤',
    desc: '표준화된 평가로 강점과 필요를 파악하고, 한 명 한 명에게 맞는 개별 프로그램을 설계합니다.',
  },
  {
    icon: 'Users',
    title: '부모와 함께하는 치료',
    desc: '정기 상담과 가정 연계 과제, 그리고 30여 권의 전자책으로 센터 밖에서도 함께합니다.',
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
    desc: '짱샘과 전문 치료진이 1:1 세션을 꾸준히 진행하며 아이의 성장을 이끌어 갑니다.',
  },
  {
    step: '05',
    title: '주기적 재평가·피드백',
    desc: '정기적으로 변화를 점검하고 목표를 조정하며 가정 코칭을 제공합니다.',
  },
]

/* ── 짱샘(장지예) 소개 ── */
export const founder = {
  name: '장지예',
  nick: '짱샘',
  role: '소아·청소년 재활 전문가 · 키즈피지오 센터장',
  lab: '피지오 후각 연구소 소장',
  // 실물 프로필 사진 (없으면 avatar 이모지로 대체)
  photo: '/team/jjangsaem-avatar.jpg',
  avatar: '👩‍⚕️',
  lead: '“근육보다 먼저, 아이의 숨과 신경계를 봅니다.”',
  bio: [
    '짱샘 장지예 선생님은 25년간 소아 물리치료사로 수천 명의 아이를 만나온 소아·청소년 재활 전문가입니다. 치료를 열심히 받는데도 변화가 느린 아이들에게서 공통점을 발견했습니다. 바로 ‘호흡’과 ‘신경계 안정’이었습니다.',
    '그래서 짱샘은 근육만 스트레칭하지 않습니다. 아이의 호흡 패턴을 보고, 원시반사의 통합 상태를 평가하며, 후각과 자율신경계 연구를 바탕으로 아이의 발달을 뿌리부터 돕습니다. 키즈피지오와 피지오 후각 연구소는 이 철학 위에 세워졌습니다.',
    '현장에서 얻은 깨달음은 30여 권의 발달 전자책과 아로마·후각 케어 프로그램으로 이어졌습니다. 치료실에 오지 못하는 부모님도 가정에서 아이를 도울 수 있도록, 짱샘은 오늘도 책과 향기로 손을 내밉니다.',
  ],
  credentials: [
    '소아 물리치료사 · 25년 임상',
    '키즈피지오 아동발달센터 센터장',
    '피지오 후각 연구소 소장',
    '발달·호흡·후각 전자책 30여 권 저술',
  ],
}

export type Therapist = {
  name: string
  role: string
  tags: string[]
  /** 실물 사진(있을 때만 표시). 없으면 icon 대체 블록을 보여준다 */
  photo?: string
  /** 사진이 없는 팀 카드의 대체 아이콘(이모지) */
  icon?: string
}

export const team: Therapist[] = [
  {
    name: '장지예 (짱샘)',
    role: '센터장 · 소아 물리치료사',
    tags: ['소아재활 25년', '호흡·후각 통합', '전자책 30여 권 저술'],
    photo: '/team/jjangsaem.jpg',
  },
  {
    name: '놀이·정서지원팀',
    role: '놀이심리상담사',
    tags: ['정서·사회성', '원시반사 통합 놀이'],
    icon: '🧸',
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
      '혼자 삼키고 있던 죄책감을 이 책이 꺼내줬어요. “엄마도 아플 수 있다”는 말에 한참 울었습니다. 모든 특수 부모님께 추천합니다.',
    parent: '김지원 · 발달지연 아동 어머니',
    child: '『엄마라서 괜찮아!』 독자',
  },
  {
    quote:
      '수면에 어려움을 겪는 아이들에게 실제로 적용해봤는데, 2주차부터 눈에 띄는 변화가 있었어요. 향기 훈련이 이렇게 효과적일 줄 몰랐습니다.',
    parent: '이서연 · 특수교육 교사',
    child: '후각·호흡 수면 프로그램',
  },
  {
    quote:
      '노즈워터 만드는 법이 이렇게 자세히 나온 자료는 처음이에요. 우리 원에서 직접 만들어 아이들에게 적용하고 있습니다.',
    parent: '윤정아 · 어린이집 원장',
    child: '후각 키트 활용',
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
  breath: {
    intro:
      '호흡·후각 훈련은 짱샘의 25년 임상에서 비롯된 통합 접근입니다. 코호흡과 후각 자극으로 자율신경계를 안정시켜, 수면·집중·정서의 토대를 다지고 다른 치료의 효과까지 끌어올립니다.',
    image:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '입을 벌리고 자거나 코가 자주 막히는 아이',
      '잠들기 어렵고 자주 깨는 아이',
      '쉽게 흥분하거나 진정이 어려운 아이',
    ],
    how: [
      { title: '호흡·코 상태 평가', desc: '코호흡 여부와 호흡 패턴, 심박 안정도를 살핍니다.' },
      { title: '후각·호흡 훈련', desc: '향기 자극과 코·복식호흡 루틴을 단계적으로 익힙니다.' },
      { title: '가정 루틴 코칭', desc: '아로마와 노즈워터를 활용한 수면 루틴을 안내합니다.' },
    ],
    outcomes: ['코호흡 정착', '수면의 질 향상', '자율신경·정서 안정'],
  },
  play: {
    intro:
      '놀이·원시반사 통합은 아이가 가장 편안해하는 ‘놀이’라는 언어로 마음을 표현하게 하고, 발달의 발목을 잡는 남은 원시반사를 자연스럽게 통합합니다. 안전한 관계 속에서 정서적 안정과 사회성을 키워 갑니다.',
    image:
      'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1000&q=80',
    forWhom: [
      '불안·위축이 크거나 감정 조절이 어려운 아이',
      '가만히 앉아 있기 힘들고 자세가 불안정한 아이',
      '또래 관계나 자존감 회복이 필요한 아이',
    ],
    how: [
      { title: '관계·반사 평가', desc: '정서 상태와 남은 원시반사를 함께 관찰합니다.' },
      { title: '정서 표현 놀이', desc: '놀이를 통해 감정을 안전하게 표현하고 다룹니다.' },
      { title: '반사 통합 놀이', desc: '움직임 놀이로 원시반사를 통합하고 사회성을 코칭합니다.' },
    ],
    outcomes: ['정서·사회성 발달', '원시반사 통합', '자존감·또래관계 향상'],
  },
}

/* ── 짱샘의 책방 (전자책) ── */
export type BookCategory = {
  key: string
  label: string
  emoji: string
  desc: string
}

export const bookCategories: BookCategory[] = [
  { key: '발달', label: '발달', emoji: '🧩', desc: '터미타임·원시반사·사경사두증·감각까지 발달의 뿌리를 다지는 책' },
  { key: '호흡', label: '호흡', emoji: '🌬️', desc: '코호흡과 자율신경 안정으로 아이의 숨을 회복하는 책' },
  { key: '후각', label: '후각', emoji: '👃', desc: '향기로 뇌와 신경계를 깨우는 후각 발달 훈련의 모든 것' },
  { key: '수면', label: '수면', emoji: '🌙', desc: '후각·호흡으로 잠 못 드는 아이의 밤을 바꾸는 책' },
  { key: '치유', label: '치유', emoji: '💛', desc: '아이를 키우는 부모의 마음을 먼저 돌보는 내면 치유서' },
]

export type Book = {
  slug: string
  title: string
  subtitle: string
  category: string
  cover: string
  blurb: string
}

/** 대표작 — 전체 30여 권은 짱샘의 책방(jjangsaem.com)에서 만날 수 있습니다. */
export const books: Book[] = [
  {
    slug: 'golden-time-breathing',
    title: '성장하는 골든타임을 위한 호흡의 비밀',
    subtitle: '발달장애 아동의 호흡 관리 — 25년 임상 경험의 기록',
    category: '호흡',
    cover: '/books/golden-time-breathing.webp',
    blurb: '겉으로 괜찮아 보여도 이미 무너져 있는 아이의 숨. 25년 임상이 담긴 183쪽 호흡 관리 바이블입니다.',
  },
  {
    slug: 'beyond-the-tilt',
    title: '사경·사두증, 머리 모양보다 뇌 패턴이 먼저다',
    subtitle: '소아 근막·반사 통합 놀이를 통한 8주간 교정 가이드',
    category: '발달',
    cover: '/books/beyond-the-tilt.webp',
    blurb: '머리 모양만 보지 마세요. 원시반사와 호흡·근막을 통합하는 8주 신경발달 교정 프로그램.',
  },
  {
    slug: 'olfactory-development',
    title: '후각 발달 훈련 가이드북',
    subtitle: '후각 발달 실전 적용 가이드',
    category: '후각',
    cover: '/books/olfactory-development.webp',
    blurb: '냄새가 뇌로 전달되는 과정부터 실제 훈련법까지, 148쪽에 담은 후각 발달의 교과서.',
  },
  {
    slug: 'sensory-sleep',
    title: '숙면으로 가는 향기로운 호흡',
    subtitle: '발달장애 아동을 위한 후각·호흡 훈련 가이드',
    category: '수면',
    cover: '/books/sensory-sleep.webp',
    blurb: '향기와 호흡으로 완성하는 4주 수면 훈련. 잠 못 드는 아이의 밤을 바꿉니다.',
  },
  {
    slug: 'healing-parent',
    title: '엄마라서 괜찮아!',
    subtitle: '발달지연 아동 부모를 위한 내면 치유 가이드',
    category: '치유',
    cover: '/books/healing-parent.webp',
    blurb: '죄책감과 번아웃을 따뜻하게 어루만지는, 발달지연 아동 부모를 위한 마음 치유서.',
  },
  {
    slug: 'is-my-child-okay',
    title: '우리 아이, 괜찮은 걸까?',
    subtitle: '발달 신호 3가지로 아이의 위치를 파악하는 가이드',
    category: '발달',
    cover: '/books/is-my-child-okay.webp',
    blurb: '눈맞춤·호명반응·공동주의. 부모가 가장 헷갈리는 발달 신호를 짚어 드립니다.',
  },
  {
    slug: 'breath-first',
    title: '아이를 고치기 전에 숨부터 봅니다',
    subtitle: '발달장애 아동의 호흡을 이해하는 부모를 위한 안내서',
    category: '호흡',
    cover: '/books/breath-first.webp',
    blurb: '치료가 더딘 아이에겐 이유가 있습니다. 모든 발달의 시작, ‘숨’을 다시 봅니다.',
  },
  {
    slug: 'olfactory-kit',
    title: '느린아이 레벨업 후각키트 제작·활용 가이드',
    subtitle: '후각 훈련 키트 개발 실전 가이드',
    category: '후각',
    cover: '/books/olfactory-kit.webp',
    blurb: '노즈워터부터 후각 키트 제작·활용까지. 가정과 현장에서 바로 쓰는 실전 매뉴얼.',
  },
]

/* ── 아로마 테라피 ── */
export const aromaIntro = {
  lead: '향기는 코를 지나 가장 빠르게 뇌에 닿습니다.',
  body: '짱샘의 후각발달훈련은 단순한 좋은 향이 아니라, 아이의 자율신경계 안정과 후각 발달을 위해 설계된 케어입니다. 검증된 에센셜 오일·하이드로졸과 후각 훈련법으로, 가정에서도 안전하게 아이의 숨과 잠을 돌볼 수 있도록 돕습니다.',
}

export type AromaService = {
  icon: string
  title: string
  desc: string
  points: string[]
}

export const aromaServices: AromaService[] = [
  {
    icon: 'Flower2',
    title: '아로마 제품',
    desc: '아이에게 안전한 농도로 준비한 에센셜 오일·하이드로졸과 후각 키트를 소개·제공합니다.',
    points: ['아동 안전 농도 블렌딩', '용도별 향기 큐레이션', '후각 키트·노즈워터 재료'],
  },
  {
    icon: 'HeartHandshake',
    title: '1:1 후각·호흡 상담',
    desc: '아이의 호흡·수면·감각 상태를 살펴 향기와 호흡 루틴을 맞춤으로 설계합니다.',
    points: ['후각·호흡 상태 점검', '맞춤 향기 처방', '가정 루틴 코칭'],
  },
  {
    icon: 'BookOpen',
    title: '향기 훈련 클래스',
    desc: '부모와 전문가를 위한 후각 훈련·아로마 활용 교육과 워크숍을 진행합니다.',
    points: ['후각 훈련법 교육', '노즈워터·키트 제작 실습', '연령별 안전 가이드'],
  },
]

export type AromaProduct = {
  emoji: string
  name: string
  tag: string
  use: string
}

export const aromaProducts: AromaProduct[] = [
  { emoji: '🪴', name: '프랑킨센스 하이드로졸 100ml', tag: '진정 · 신경계 안정', use: '예민한 아이의 긴장을 풀어주는 순한 미스트' },
  { emoji: '✨', name: '프랑킨센스 에센셜 오일 10ml', tag: '후각 훈련', use: '후각 자극과 집중을 위한 깊고 따뜻한 향' },
  { emoji: '🌼', name: '캐모마일저먼 하이드로졸 100ml', tag: '호흡 · 코 편안', use: '코가 자주 막히는 아이의 호흡을 돕는 향' },
  { emoji: '🌿', name: '불가리안 라벤더 에센셜 오일 10ml', tag: '수면 · 이완', use: '잠들기 어려운 아이의 저녁 루틴에' },
  { emoji: '💧', name: '노즈워터(코 케어 워터)', tag: '코 건강', use: '직접 만들어 쓰는 위생적인 코 케어' },
  { emoji: '🧰', name: '후각 훈련 키트 5종', tag: '후각 발달', use: '집에서 단계별로 진행하는 후각 발달 훈련' },
]

export const aromaSafety = [
  '에센셜 오일은 반드시 캐리어 오일에 희석해 사용합니다. (2~5세 0.25~0.5%, 6~12세 0.5~1%)',
  '코나 피부에 직접 바르지 않고, 코튼 패드나 디퓨저를 30cm 거리에서 사용합니다.',
  '2세 미만 영아에게는 에센셜 오일 사용을 자제하고 자연 그대로의 향을 권합니다.',
  '사용 중에는 항상 성인이 감독하고, 아이의 반응을 살피며 진행합니다.',
]

/* ── 센터소개 페이지 콘텐츠 ── */
export const aboutStory = {
  intro:
    '짱샘 키즈피지오는 “아이마다 자라는 속도와 방식이 다르다”는 믿음, 그리고 “근육보다 먼저 아이의 숨을 본다”는 짱샘의 철학에서 시작됐습니다. 25년 임상의 기록이 한 자리에 모여 키즈피지오와 피지오 후각 연구소가 되었습니다.',
  mission:
    '우리는 아이의 부족함이 아니라 가능성에서 출발합니다. 평가부터 치료, 호흡·후각 케어, 그리고 가정 연계까지 — 아이와 가족이 일상에서 더 단단해지도록 돕는 것이 짱샘 키즈피지오의 사명입니다.',
  image:
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1100&q=80',
}

export const values = [
  { icon: 'Wind', title: '숨에서 시작', desc: '근육보다 먼저 아이의 호흡과 신경계 안정을 살핍니다.' },
  { icon: 'Users', title: '가족과 함께', desc: '부모를 치료의 동반자로 여기고 정보를 투명하게 공유합니다.' },
  { icon: 'BadgeCheck', title: '근거 기반', desc: '뇌과학·자율신경계 연구와 검증된 방법만을 사용합니다.' },
  { icon: 'HeartHandshake', title: '따뜻한 전문성', desc: '실력은 기본, 마음으로 아이와 부모를 대합니다.' },
]

export const history = [
  { year: '임상 초기', text: '소아 물리치료사로 수많은 아이들을 만나며 ‘호흡’의 중요성을 발견' },
  { year: '연구', text: '후각·자율신경계 연구를 접목한 호흡·후각 통합 접근 정립' },
  { year: '키즈피지오', text: '강남 키즈피지오 아동발달센터 운영, 3개 영역 1:1 발달 치료' },
  { year: '피지오 후각 연구소', text: '후각 키트·아로마 케어와 후각 발달 프로그램 개발' },
  { year: '짱샘의 책방', text: '발달·호흡·후각·수면·치유 전자책 30여 권 출간' },
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
    slug: 'breath-first',
    title: '아이를 고치기 전에, 숨부터 봅니다',
    category: '호흡 이야기',
    date: '2026-05-20',
    readingTime: '4분',
    excerpt:
      '치료를 열심히 받는데도 변화가 느린 아이들에게는 공통점이 있습니다. 바로 ‘호흡’입니다.',
    cover:
      'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=80',
    body: [
      '25년간 소아 물리치료사로 일하면서 수천 명의 아이를 만났습니다. 치료를 열심히 받는데도 변화가 느린 아이들에게는 한 가지 공통점이 있었어요. 바로 입을 벌리고 숨을 쉬는, 구강호흡 문제였습니다.',
      '입으로 숨을 쉬는 아이들은 밤에 깊이 잠들지 못하고, 낮에 집중하기 어려워합니다. 그래서 저는 더 이상 근육만 스트레칭하지 않습니다. 아이의 호흡 패턴을 먼저 봅니다.',
      '코로 천천히 숨을 쉬는 것만으로도 자율신경계가 안정되고, 수면과 집중, 정서가 함께 좋아집니다. 아이의 발달이 더디게 느껴진다면, 오늘은 아이의 ‘숨’을 한 번 바라봐 주세요.',
    ],
  },
  {
    slug: 'scent-and-sleep',
    title: '향기로 잠드는 아이 — 후각과 수면의 연결',
    category: '후각·아로마',
    date: '2026-05-08',
    readingTime: '5분',
    excerpt:
      '라벤더 디퓨저를 켰는데 오히려 흥분하던 아이. 향기는 아이마다 다르게 반응합니다.',
    cover:
      'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=1000&q=80',
    body: [
      '향기는 코를 지나 가장 빠르게 뇌의 감정·기억 영역에 닿습니다. 라벤더·캐모마일·베르가못 같은 향은 아이의 긴장을 풀어주는 데 도움이 됩니다.',
      '다만 모든 아이가 같은 향에 같게 반응하지는 않습니다. 어떤 아이는 라벤더에 흥분하기도 합니다. 그럴 땐 바닐라나 다른 순한 향으로 바꿔, 아이가 편안해하는 향을 찾아가는 과정이 중요합니다.',
      '향기는 직접 코에 대지 말고, 디퓨저나 코튼 패드를 30cm 거리에서 사용하세요. 저녁마다 같은 향으로 수면 루틴을 만들면, 향기가 ‘이제 잘 시간’이라는 신호가 되어 줍니다.',
    ],
  },
  {
    slug: 'primitive-reflex',
    title: '가만히 못 앉는 아이, 원시반사를 의심해 보세요',
    category: '발달 가이드',
    date: '2026-04-22',
    readingTime: '4분',
    excerpt:
      '자세가 자꾸 무너지고 산만한 아이. 발달의 발목을 잡는 ‘남은 원시반사’ 이야기.',
    cover:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80',
    body: [
      '원시반사는 신생아 시기에 생존을 돕는 자동 반응으로, 발달이 진행되며 자연스럽게 통합되어 사라집니다. 그런데 이 반사가 남아 있으면 자세 유지와 집중에 어려움이 생길 수 있어요.',
      '작은 소리에도 움찔하거나, 가만히 앉아 있기 힘들고, 글씨 쓰기를 유난히 힘들어한다면 남은 원시반사를 한 번 살펴볼 필요가 있습니다.',
      '다행히 원시반사는 ‘놀이’로 통합할 수 있습니다. 구르기, 기기, 균형 놀이처럼 즐거운 움직임이 곧 치료가 됩니다. 무리하지 않고 아이가 웃으며 반복하는 활동을 따라가 주세요.',
    ],
  },
  {
    slug: 'parent-burnout',
    title: '엄마라서 괜찮아 — 나를 돌보는 일도 치료입니다',
    category: '부모 마음',
    date: '2026-04-05',
    readingTime: '3분',
    excerpt:
      '아이를 돌보느라 지친 부모님의 마음을 위한 짧은 글. 부모의 안정이 아이의 안정입니다.',
    cover:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1000&q=80',
    body: [
      '아이의 발달을 챙기다 보면 정작 부모님 자신은 뒤로 미뤄지기 쉽습니다. 하지만 아이는 부모의 정서를 그대로 느낍니다.',
      '완벽한 부모가 되려 애쓰지 않아도 괜찮습니다. 하루 10분이라도 자신을 위한 시간을 갖고, 힘들 땐 도움을 청하세요. 그것은 결코 약함이 아닙니다.',
      '짱샘 키즈피지오는 아이뿐 아니라 부모님의 마음도 함께 살핍니다. 책 『엄마라서 괜찮아!』처럼, 당신의 마음에 먼저 안부를 묻고 싶습니다.',
    ],
  },
]

export const faqs = [
  {
    q: '몇 살부터 발달 치료를 받을 수 있나요?',
    a: '생후 18개월부터 초등 고학년까지 연령별 맞춤 프로그램을 운영합니다. 발달이 걱정된다면 빠른 상담이 가장 큰 도움이 됩니다.',
  },
  {
    q: '호흡·후각 훈련은 다른 센터와 무엇이 다른가요?',
    a: '짱샘은 25년 임상에서 ‘근육보다 먼저 호흡과 신경계를 봐야 한다’는 결론에 이르렀습니다. 코호흡과 후각 자극으로 자율신경을 안정시켜 수면·집중·정서의 토대를 다지고, 다른 치료의 효과까지 높이는 통합 접근입니다.',
  },
  {
    q: '짱샘의 책방에서는 어떤 책을 살 수 있나요?',
    a: '발달·호흡·후각·수면·치유 5개 분야의 전자책 30여 권을 만나실 수 있습니다. 터미타임, 원시반사, 사경·사두증, 후각 훈련 등 주제별로 가정에서 바로 활용할 수 있도록 구성했습니다. 책방은 jjangsaem.com에서 운영합니다.',
  },
  {
    q: '아로마 제품은 아이에게 안전한가요?',
    a: '아동에게 맞는 안전 농도로 안내하며, 직접 접촉이 아닌 디퓨저·코튼 패드 사용을 원칙으로 합니다. 연령별 사용 농도와 주의사항을 함께 안내해 드리니 안심하고 문의해 주세요.',
  },
  {
    q: '주차가 가능한가요?',
    a: '센터는 강남구 논현로8길 10-4, 1층에 있습니다. 방문 주차 안내와 오시는 길은 전화로 친절히 도와드립니다.',
  },
]

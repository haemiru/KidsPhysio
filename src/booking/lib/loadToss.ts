// 토스페이먼츠 v1 결제 SDK를 동적으로 로드 (CDN script)
let loading: Promise<void> | null = null

export function loadTossPayments(clientKey: string): Promise<TossPaymentsInstance> {
  if (typeof window !== 'undefined' && window.TossPayments) {
    return Promise.resolve(window.TossPayments(clientKey))
  }
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://js.tosspayments.com/v1/payment'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('TOSS_SDK_LOAD_FAILED'))
      document.head.appendChild(script)
    })
  }
  return loading.then(() => window.TossPayments!(clientKey))
}

// 주문 ID 생성 (영문/숫자/하이픈, 6~64자)
export function makeOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `rf-${Date.now()}-${rand}`
}

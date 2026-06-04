// 토스페이먼츠 v1 SDK (CDN 동적 로드) 전역 타입
interface TossRequestPaymentOptions {
  amount: number
  orderId: string
  orderName: string
  successUrl: string
  failUrl: string
}

interface TossPaymentsInstance {
  requestPayment(method: string, options: TossRequestPaymentOptions): Promise<void>
}

interface Window {
  TossPayments?: (clientKey: string) => TossPaymentsInstance
}

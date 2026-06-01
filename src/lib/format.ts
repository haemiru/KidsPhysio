/** ISO 날짜 문자열(YYYY-MM-DD)을 'YYYY년 M월 D일'로 변환. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${y}년 ${m}월 ${d}일`
}

import { useEffect, useState } from 'react'
import { mmss } from '../lib/datetime'

// 가장 임박한 hold 만료까지 남은 시간을 1초마다 표시
export default function HoldCountdown({
  expiresAt,
  onExpire,
}: {
  expiresAt: string | null | undefined
  onExpire?: () => void
}) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const remaining = expiresAt ? new Date(expiresAt).getTime() - now : null
  const expired = remaining !== null && remaining <= 0

  useEffect(() => {
    if (expired) onExpire?.()
  }, [expired, onExpire])

  if (!expiresAt) return null

  return (
    <span className={expired ? 'text-accent' : 'text-primary-dark'}>
      {expired ? '시간 만료' : `남은 시간 ${mmss(remaining as number)}`}
    </span>
  )
}

import {
  Sparkles,
  Activity,
  Hand,
  MessageCircle,
  ToyBrick,
  HeartHandshake,
  UserCheck,
  BadgeCheck,
  Users,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  Sparkles,
  Activity,
  Hand,
  MessageCircle,
  ToyBrick,
  HeartHandshake,
  UserCheck,
  BadgeCheck,
  Users,
  ShieldCheck,
}

type Props = {
  name: string
  className?: string
  strokeWidth?: number
}

/** Resolve a lucide icon by name (falls back to Sparkles). */
export default function Icon({ name, className, strokeWidth = 2 }: Props) {
  const Cmp = map[name] ?? Sparkles
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}

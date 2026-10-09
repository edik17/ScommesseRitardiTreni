import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCredits(amount: number): string {
  return new Intl.NumberFormat('it-IT').format(Math.round(amount)) + ' 🪙'
}

export function formatOdds(odds: number): string {
  return odds.toFixed(2)
}

export function formatDelay(delay: number): string {
  if (delay === 0) return 'In orario'
  if (delay > 0) return `+${delay} min`
  return `${delay} min`
}

export function getDelayColor(delay: number): {
  bg: string
  text: string
  border: string
  dot: string
} {
  if (delay <= 0) {
    return {
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-400',
      border: 'border-emerald-800/50',
      dot: 'bg-emerald-500',
    }
  }
  if (delay <= 5) {
    return {
      bg: 'bg-amber-950/40',
      text: 'text-amber-400',
      border: 'border-amber-800/50',
      dot: 'bg-amber-500',
    }
  }
  if (delay <= 15) {
    return {
      bg: 'bg-orange-950/40',
      text: 'text-orange-400',
      border: 'border-orange-800/50',
      dot: 'bg-orange-500',
    }
  }
  return {
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    border: 'border-rose-800/50',
    dot: 'bg-rose-500',
  }
}

export function getOperatorBadge(operator: string): {
  label: string
  bg: string
  text: string
} {
  switch (operator) {
    case 'FRECCIAROSSA':
      return { label: 'Frecciarossa', bg: 'bg-rose-600', text: 'text-white' }
    case 'ITALO':
      return { label: 'Italo', bg: 'bg-red-800', text: 'text-white' }
    case 'INTERCITY':
      return { label: 'Intercity', bg: 'bg-sky-600', text: 'text-white' }
    case 'REGIONALE':
      return { label: 'Regionale', bg: 'bg-emerald-600', text: 'text-white' }
    default:
      return { label: operator, bg: 'bg-slate-700', text: 'text-white' }
  }
}

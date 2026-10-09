import React from 'react'
import { getDelayColor, formatDelay } from '@/lib/utils'

interface DelayBadgeProps {
  delay: number
  showDot?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const DelayBadge: React.FC<DelayBadgeProps> = ({
  delay,
  showDot = true,
  className = '',
  size = 'md',
}) => {
  const color = getDelayColor(delay)

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5 font-semibold',
  }[size]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${color.bg} ${color.text} ${color.border} ${sizeClasses} font-mono font-medium ${className}`}
    >
      {showDot && (
        <span
          className={`h-2 w-2 rounded-full ${color.dot} ${
            delay > 15 ? 'animate-ping' : ''
          }`}
        />
      )}
      {formatDelay(delay)}
    </span>
  )
}

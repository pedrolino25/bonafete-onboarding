'use client'
import { cn } from '@/lib/utils'

function Title({
  children,
  className,
}: React.InputHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-utility-gray-700', className)}
    >
      {children}
    </h3>
  )
}

function Subtitle({
  children,
  className,
}: React.InputHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm font-light text-utility-gray-500 pt-1 pr-4',
        className
      )}
    >
      {children}
    </p>
  )
}

export const OnboardingSectionLayout = {
  Title,
  Subtitle,
}

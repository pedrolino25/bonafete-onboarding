'use client'
import { cn } from '@/lib/utils'

function Root({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col w-full gap-6', className)}>
      {children}
    </div>
  )
}

function Info({
  children,
  className,
}: React.InputHTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn('text-sm font-medium text-utility-brand-500', className)}
    >
      {children}
    </span>
  )
}

function Container({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-full pt-4 flex flex-col gap-4', className)}>
      {children}
    </div>
  )
}

function Main({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-full border-t border-utility-gray-300', className)}>
      {children}
    </div>
  )
}

function Title({
  children,
  className,
}: React.InputHTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-base pt-4', className)}>{children}</p>
}

function Subtitle({
  children,
  className,
}: React.InputHTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('font-light text-sm text-utility-gray-600', className)}>
      {children}
    </span>
  )
}

export const EditSpaceFormsLayout = {
  Root,
  Container,
  Title,
  Subtitle,
  Main,
  Info,
}

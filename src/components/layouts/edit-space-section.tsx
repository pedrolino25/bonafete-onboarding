'use client'
import { cn } from '@/lib/utils'

function HeaderTitle({
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

function HeaderSubtitle({
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

function Title({
  children,
  className,
}: React.InputHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-md font-medium text-utility-gray-700 pb-2',
        className
      )}
    >
      {children}
    </p>
  )
}

function Subtitle({
  children,
  className,
}: React.InputHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm font-light text-utility-gray-500 pb-6', className)}
    >
      {children}
    </p>
  )
}

function Container({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full grid grid-cols-5 border-b border-dashed py-6 px-6',
        className
      )}
    >
      {children}
    </div>
  )
}

function Header({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'col-span-2 max-sm:col-span-5 pr-12 max-sm:pr-0',
        className
      )}
    >
      {children}
    </div>
  )
}

function Content({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'col-span-3 max-sm:col-span-5 flex flex-col gap-4',
        className
      )}
    >
      {children}
    </div>
  )
}

export const EditSpaceSectionLayout = {
  HeaderTitle,
  HeaderSubtitle,
  Title,
  Subtitle,
  Container,
  Header,
  Content,
}

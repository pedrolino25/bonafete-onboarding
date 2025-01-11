'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CircleAlert, CircleCheckBig } from 'lucide-react'
import { useTranslations } from 'next-intl'

function Root({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full px-1', className)}>{children}</div>
}

function Header({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="px-6 w-full">
      <div className={cn('border-b py-6 w-full', className)}>{children}</div>
    </div>
  )
}

function Main({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full pt-4 pr-6 flex max-sm:flex-col max-sm:pr-2',
        className
      )}
    >
      {children}
    </div>
  )
}

function Container({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full pl-2 pt-2', className)}>{children}</div>
}

function Title({
  children,
  className,
}: React.InputHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-2xl font-bold text-utility-brand-600', className)}>
      {children}
    </h2>
  )
}

function Subtitle({
  children,
  className,
}: React.InputHTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-utility-gray-500 text-sm font-light pt-1', className)}
    >
      {children}
    </p>
  )
}

export interface SidebarLink {
  label: string
  value: string
  disabled?: boolean
  complete?: boolean
  incomplete?: boolean
}

export interface SidebarProps {
  items: SidebarLink[]
  value?: SidebarLink
  onChange: (item: SidebarLink) => void
}

function Sidebar({ items, value, onChange }: SidebarProps) {
  const t = useTranslations()

  return (
    <div className="group justify-between flex flex-col gap-4 transition-all duration-200 ease-out w-fit max-sm:w-full h-full pr-4 max-sm:pr-0">
      <div>
        <nav className="grid gap-1 px-2 pt-2">
          {items.map((item) => (
            <Button
              disabled={item.disabled}
              key={item.value}
              color="link"
              size="md"
              variant={item.value === value?.value ? 'fill' : 'ghost'}
              className="hover:underline justify-between"
              onClick={() => onChange(item)}
              endAdornment={
                item.incomplete ? (
                  <CircleAlert className="w-4 h-4 text-utility-warning-400" />
                ) : (
                  <CircleCheckBig
                    className={`w-4 h-4 ${
                      item.complete
                        ? 'text-utility-success-500'
                        : 'text-transparent'
                    }`}
                  />
                )
              }
            >
              <div className="w-max font-medium text-left pr-2">
                {t(`sections.onboarding.navigation.${item.value}`)}
              </div>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export const SidebarLayout = {
  Root,
  Header,
  Main,
  Container,
  Title,
  Subtitle,
  Sidebar,
}

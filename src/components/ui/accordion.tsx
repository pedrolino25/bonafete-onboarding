'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, CircleCheck, Info, Minus, Plus } from 'lucide-react'
import { ReactNode, useState } from 'react'

interface CustomAccordionProps {
  disabled?: boolean
  open?: boolean
  title: string
  children: ReactNode
  variant?: 'default' | 'add'
  complete?: boolean
}
export default function CustomAccordion({
  disabled,
  open = false,
  title,
  children,
  variant = 'default',
  complete = false,
}: CustomAccordionProps) {
  const [opened, setOpened] = useState<boolean>(open)
  return (
    <div
      className={cn(
        'w-full h-fit transition-all border-dashed rounded-xl border-[1.5px] border-utility-gray-300 hover:border-utility-gray-500',
        disabled &&
          'border-utility-gray-300 hover:border-utility-gray-300 cursor-not-allowed pointer-events-none',
        (opened || complete) && 'border-solid'
      )}
    >
      <div
        className="px-4 py-4 flex items-center justify-between cursor-pointer"
        onClick={() => setOpened(!opened)}
      >
        <div className="flex items-center gap-2">
          {complete ? (
            <CircleCheck className="h-4 w-4 text-utility-success-500" />
          ) : (
            <Info
              className={cn(
                'h-4 w-4 text-utility-gray-500',
                disabled && 'text-utility-gray-400'
              )}
            />
          )}
          <span
            className={cn(
              'text-utility-gray-700 font-medium text-sm',
              disabled && 'text-utility-gray-400'
            )}
          >
            {title}
          </span>
        </div>

        {variant === 'default' ? (
          <ChevronDown
            className={cn(
              'h-4 w-4 text-utility-gray-700',
              disabled && 'text-utility-gray-400',
              opened && 'rotate-180 transition-all'
            )}
          />
        ) : (
          <>
            {opened ? (
              <Minus
                className={cn(
                  'h-4 w-4 text-utility-gray-700',
                  disabled && 'text-utility-gray-400',
                  opened && 'rotate-180 transition-all'
                )}
              />
            ) : (
              <Plus
                className={cn(
                  'h-4 w-4 text-utility-gray-700',
                  disabled && 'text-utility-gray-400',
                  opened && 'rotate-180 transition-all'
                )}
              />
            )}
          </>
        )}
      </div>
      <div
        className={cn(
          'h-0 hidden px-6 pb-6 max-sm:px-4',
          opened && '!block !h-fit transition-all'
        )}
      >
        {children}
      </div>
    </div>
  )
}

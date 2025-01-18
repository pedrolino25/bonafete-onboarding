'use client'

import { cn } from '@/lib/utils'
import { HandPlatter, Info } from 'lucide-react'
import { ReactNode } from 'react'

interface SpaceServiceCardProps {
  disabled?: boolean
  title: string
  children?: ReactNode
  complete?: boolean
  onClick?: () => void
}
export default function SpaceServiceCard({
  disabled,
  title,
  children,
  complete = false,
  onClick,
}: SpaceServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer w-full h-fit transition-all border-dashed rounded-xl border-[1.5px] border-utility-gray-300 hover:border-utility-gray-500',
        disabled &&
          'border-utility-gray-300 hover:border-utility-gray-300 !cursor-not-allowed pointer-events-none',
        complete && 'border-solid'
      )}
    >
      {children ? (
        <div>{children}</div>
      ) : (
        <div className="h-20 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {complete ? (
              <HandPlatter className="h-6 w-6 text-utility-gray-600" />
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
        </div>
      )}
    </div>
  )
}

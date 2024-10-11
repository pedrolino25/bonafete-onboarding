import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { useEffect } from 'react'

const inputVariants = cva(
  'flex w-full shadow-xs rounded-lg border border-utility-gray-300 bg-white text-base font-light placeholder:text-utility-gray-500 text-utility-gray-900 hover:placeholder:text-utility-gray-900 disabled:cursor-not-allowed disabled:bg-utility-gray-50 disabled:!text-utility-gray-500 disabled:hover:!text-utility-gray-500 disabled:hover:placeholder:!text-utility-gray-500 focus-visible:outline-none',
  {
    variants: {
      variant: {
        default:
          'focus-visible:border-utility-brand-300 focus-visible:shadow-brand-md',
        error:
          '!border-utility-error-300 focus-visible:border-utility-error-300 focus-visible:shadow-error-md',
      },
      dimension: {
        sm: 'h-10 px-3.5 py-2.5',
        md: 'h-11 px-4 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      dimension: 'sm',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  fixedStartAdornment?: React.ReactNode
  fixedEndAdornment?: React.ReactNode
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      fixedStartAdornment,
      fixedEndAdornment,
      startAdornment,
      endAdornment,
      className,
      type,
      variant,
      dimension,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      const handleWheel = (event: WheelEvent) => {
        const activeElement = document.activeElement as HTMLInputElement
        if (
          activeElement &&
          activeElement.type === 'number' &&
          activeElement.contains(event.target as Node)
        ) {
          event.preventDefault()
        }
      }

      document.addEventListener('wheel', handleWheel, { passive: false })

      return () => {
        document.removeEventListener('wheel', handleWheel)
      }
    }, [])

    return (
      <div className="relative w-full flex">
        {startAdornment && (
          <div
            data-testid="start-adornment"
            className="absolute top-[12px] left-[12px] w-[15px] h-[15px] text-utility-gray-500"
          >
            {startAdornment}
          </div>
        )}
        {fixedStartAdornment && (
          <div
            data-testid="start-adornment"
            className="border-t border-b border-l border-utility-gray-300 rounded-s-lg bg-white px-3 text-utility-gray-500 items-center"
          >
            {fixedStartAdornment}
          </div>
        )}
        <input
          data-testid="input-field"
          type={type}
          className={cn(
            inputVariants({ variant, dimension, className }),
            startAdornment ? 'pl-[36px]' : null,
            endAdornment ? 'pr-[36px]' : null,
            fixedStartAdornment ? '!rounded-s-none' : null,
            fixedEndAdornment ? '!rounded-e-none' : null
          )}
          ref={ref}
          {...props}
        />
        {fixedEndAdornment && (
          <div
            data-testid="fixed-end-adornment"
            className="border-t border-b border-r border-utility-gray-300 rounded-e-lg bg-white  text-utility-gray-500"
          >
            {fixedEndAdornment}
          </div>
        )}
        {endAdornment && (
          <div
            data-testid="end-adornment"
            className="absolute top-[12px] right-[12px] w-[15px] h-[15px] text-utility-gray-500"
          >
            {endAdornment}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }

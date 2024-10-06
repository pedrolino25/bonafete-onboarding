import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const badgeVariants = cva(
  'inline-flex gap-1 items-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        fill: 'border',
        outline: 'border border-[1.5px] !bg-transparent',
      },
      shape: {
        square: 'rounded-md',
        rounded: 'rounded-full',
      },
      color: {
        white: 'bg-white border-utility-gray-300 text-utility-gray-700',
        gray: 'bg-utility-gray-50 border-utility-gray-200 text-utility-gray-700',
        brand:
          'bg-utility-brand-50 border-utility-brand-200 text-utility-brand-700',
        error:
          'bg-utility-error-50 border-utility-error-200 text-utility-error-700',
        warning:
          'bg-utility-warning-50 border-utility-warning-200 text-utility-warning-700',
        success:
          'bg-utility-success-50 border-utility-success-200 text-utility-success-700',
        gray_blue:
          'bg-utility-gray-blue-50 border-utility-gray-blue-200 text-utility-gray-blue-700',
        blue_light:
          'bg-utility-blue-light-50 border-utility-blue-light-200 text-utility-blue-light-700',
        blue: 'bg-utility-blue-50 border-utility-blue-200 text-utility-blue-700',
        indigo:
          'bg-utility-indigo-50 border-utility-indigo-200 text-utility-indigo-700',
        purple:
          'bg-utility-purple-50 border-utility-purple-200 text-utility-purple-700',
        pink: 'bg-utility-pink-50 border-utility-pink-200 text-utility-pink-700',
        orange:
          'bg-utility-orange-50 border-utility-orange-200 text-utility-orange-700',
      },
      size: {
        sm: 'py-0.5 px-2 text-xs font-medium',
        md: 'py-0.5 px-2.5 text-sm font-medium',
        lg: 'py-1 px-3 text-sm font-medium',
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'gray',
        class: '!border-utility-gray-600 !text-utility-gray-700',
      },
      {
        variant: 'outline',
        color: 'brand',
        class: '!border-utility-brand-600 !text-utility-brand-700',
      },
      {
        variant: 'outline',
        color: 'error',
        class: '!border-utility-error-600 !text-utility-error-700',
      },
      {
        variant: 'outline',
        color: 'warning',
        class: '!border-utility-warning-600 !text-utility-warning-700',
      },
      {
        variant: 'outline',
        color: 'success',
        class: '!border-utility-success-600 !text-utility-success-700',
      },
      {
        variant: 'outline',
        color: 'gray_blue',
        class: '!border-utility-gray-blue-600 !text-utility-gray-blue-700',
      },
      {
        variant: 'outline',
        color: 'blue_light',
        class: '!border-utility-blue-light-600 !text-utility-blue-light-700',
      },
      {
        variant: 'outline',
        color: 'blue',
        class: '!border-utility-blue-600 !text-utility-blue-700',
      },
      {
        variant: 'outline',
        color: 'indigo',
        class: '!border-utility-indigo-600 !text-utility-indigo-700',
      },
      {
        variant: 'outline',
        color: 'purple',
        class: '!border-utility-purple-600 !text-utility-purple-700',
      },
      {
        variant: 'outline',
        color: 'pink',
        class: '!border-utility-pink-600 !text-utility-pink-700',
      },
      {
        variant: 'outline',
        color: 'orange',
        class: '!border-utility-orange-600 !text-utility-orange-700',
      },
    ],
    defaultVariants: {
      variant: 'fill',
      shape: 'rounded',
      color: 'white',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?:
    | 'white'
    | 'gray'
    | 'brand'
    | 'error'
    | 'warning'
    | 'success'
    | 'gray_blue'
    | 'blue_light'
    | 'blue'
    | 'indigo'
    | 'purple'
    | 'pink'
    | 'orange'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'rounded'
}

function Badge({
  className,
  variant,
  color,
  size,
  shape,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, color, size, shape }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

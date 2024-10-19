import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircle } from 'lucide-react'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex gap-x-2 items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        fill: '!text-white',
        outline: 'border',
        ghost: '!shadow-none',
        link: '!shadow-none !bg-transparent hover:!bg-transparent',
      },
      color: {
        primary:
          'text-utility-brand-700 shadow-xs bg-transparent hover:bg-utility-brand-50 active:bg-transparent active:shadow-brand-md disabled:bg-utility-gray-100 disabled:!bg-utility-gray-100 border-utility-brand-300 disabled:!border-utility-gray-200 disabled:!text-utility-gray-400',
        secondary:
          'text-utility-gray-700 shadow-xs bg-transparent hover:bg-utility-gray-50 active:bg-transparent active:shadow-gray-md disabled:bg-utility-gray-100 disabled:!bg-white border-utility-gray-300 disabled:!border-utility-gray-200 disabled:!text-utility-gray-400',
        destructive:
          'text-utility-error-700 shadow-xs bg-transparent hover:bg-utility-error-50 active:bg-transparent active:shadow-error-md disabled:bg-utility-gray-100 disabled:!bg-white border-utility-error-300 disabled:!border-utility-gray-200 disabled:!text-utility-gray-400',
        link: 'text-utility-gray-700 bg-transparent disabled:bg-utility-gray-100 disabled:!bg-white disabled:!text-utility-gray-400 font-medium disabled:font-medium',
      },
      size: {
        xs: 'h-8 px-3 py-2 font-medium text-sm',
        sm: 'h-10 px-3.5 py-2.5',
        md: 'h-11 px-4 py-2.5',
        lg: 'h-12 px-[18px] py-3',
        xl: 'h-[60px] px-[22px] py-4 text-lg',
      },
    },
    compoundVariants: [
      {
        color: 'link',
        variant: 'fill',
        class:
          '!bg-utility-gray-200 hover:!bg-utility-gray-200 active:!bg-utility-gray-50 !text-utility-gray-700',
      },
      {
        color: 'primary',
        variant: 'fill',
        class:
          '!bg-utility-brand-600 hover:!bg-utility-brand-700 active:!bg-utility-brand-600',
      },
      {
        color: 'primary',
        variant: 'link',
        class: 'hover:!text-utility-brand-800',
      },
      {
        color: 'secondary',
        variant: 'fill',
        class:
          '!bg-white hover:!bg-utility-gray-50 !text-utility-gray-700 !border',
      },
      {
        color: 'secondary',
        variant: 'link',
        class: 'hover:!text-utility-gray-800',
      },
      {
        color: 'destructive',
        variant: 'fill',
        class:
          '!bg-utility-error-600 hover:!bg-utility-error-700 active:!bg-utility-error-600',
      },
      {
        color: 'destructive',
        variant: 'link',
        class: 'hover:!text-utility-error-800',
      },
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'fill',
      size: 'sm',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  color?: 'primary' | 'secondary' | 'destructive' | 'link'
  asChild?: boolean
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      color,
      asChild = false,
      children,
      startAdornment,
      endAdornment,
      loading,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, color, className }))}
        ref={ref}
        type={type}
        {...props}
      >
        {startAdornment}
        {children}
        {loading && <LoaderCircle className="w-4 h-4 animate-spin" />}
        {endAdornment}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

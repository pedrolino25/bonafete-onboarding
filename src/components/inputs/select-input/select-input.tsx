'use client'

import { Select, SelectProps } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectInputProps extends SelectProps {
  label?: string
  labelSmall?: boolean
  hint?: string
  error?: string
  startAdornment?: React.ReactNode
  required?: boolean
  'data-testid'?: string
}

export function SelectInput({
  label,
  labelSmall,
  hint,
  error,
  startAdornment,
  required,
  ...props
}: SelectInputProps) {
  return (
    <div data-testid={props['data-testid']} className="flex flex-col w-full">
      {label && (
        <label
          data-testid="label"
          className={cn(
            'text-sm font-medium text-utility-gray-700 p-0 m-0 mb-1.5',
            labelSmall && 'text-xs font-light text-utility-gray-600'
          )}
        >
          {label}
          {required && '*'}
        </label>
      )}
      <Select
        className="max-w-full"
        variant={error ? 'error' : 'default'}
        startAdornment={startAdornment}
        {...props}
      />
      {hint && !error && (
        <p
          className="text-sm font-light text-utility-gray-600 p-0 m-0 mt-1.5"
          data-testid="hint-text"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          className="text-sm font-light text-utility-error-600 p-0 m-0 mt-1.5"
          data-testid="error-test"
        >
          {error}
        </p>
      )}
    </div>
  )
}

'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import * as React from 'react'

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelSmall?: boolean
  hint?: string
  info?: string
  error?: string
  dimension?: 'sm' | 'md'
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  fixedStartAdornment?: React.ReactNode
  fixedEndAdornment?: React.ReactNode
  required?: boolean
  'data-testid'?: string
}

// Use React.forwardRef to pass the ref down to Input
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      labelSmall,
      hint,
      info,
      error,
      startAdornment,
      endAdornment,
      fixedStartAdornment,
      fixedEndAdornment,
      dimension,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div data-testid={props['data-testid']} className="grid">
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
        <Input
          ref={ref}
          variant={error ? 'error' : 'default'}
          dimension={dimension}
          fixedStartAdornment={fixedStartAdornment}
          fixedEndAdornment={fixedEndAdornment}
          startAdornment={startAdornment}
          endAdornment={
            info ? (
              <Info
                xlinkTitle={info}
                className={
                  error ? 'text-utility-error-500' : 'text-utility-gray-400'
                }
              />
            ) : (
              endAdornment
            )
          }
          {...props}
          data-testid="input-field"
        />
        {hint && !error && (
          <p
            className="pl-2 text-xs font-light text-utility-gray-600 p-0 m-0 mt-1.5"
            data-testid="hint-text"
          >
            {hint}
          </p>
        )}
        {error && (
          <p
            className="text-sm font-light text-utility-error-600 p-0 m-0 mt-1.5"
            data-testid="error-text"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

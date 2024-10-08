import { Select, SelectProps } from '@/components/ui/select'

export interface SelectInputProps extends SelectProps {
  label?: string
  hint?: string
  error?: string
  startAdornment?: React.ReactNode
  required?: boolean
  'data-testid'?: string
}

export function SelectInput({
  label,
  hint,
  error,
  startAdornment,
  required,
  ...props
}: SelectInputProps) {
  return (
    <div data-testid={props['data-testid']} className="grid">
      {label && (
        <label
          data-testid="label"
          className="text-sm font-medium text-utility-gray-700 p-0 m-0 mb-1.5"
        >
          {label}
          {required && '*'}
        </label>
      )}
      <Select
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

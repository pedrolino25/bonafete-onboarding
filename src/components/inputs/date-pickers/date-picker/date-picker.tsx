import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslations } from 'next-intl'
import { cn } from '../../../../lib/utils'

export interface DatePickerProps {
  placeholder?: string
  onChange?: (date: Date) => void
  label?: string
  hint?: string
  error?: string
  required?: boolean
  defaultValue?: Date
  value?: Date
  'data-testid'?: string
  disabled?: boolean
  sideOffset?: number
  align?: 'center' | 'end' | 'start'
  side?: 'top' | 'right' | 'bottom' | 'left'
  avoidCollisions?: boolean
}

export function DatePicker({
  placeholder = 'Select date',
  onChange,
  label,
  hint,
  error,
  required,
  defaultValue,
  value,
  disabled,
  sideOffset,
  align,
  side,
  avoidCollisions,
  ...props
}: DatePickerProps) {
  const t = useTranslations()
  const [date, setDate] = React.useState<Date>((defaultValue || value) as Date)
  const [selectedDate, setSelectedDate] = React.useState<Date>(
    (defaultValue || value) as Date
  )
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const handleApply = () => {
    setDate(selectedDate)
    setPopoverOpen(false)
    onChange?.(selectedDate as Date)
  }

  return (
    <div data-testid={props['data-testid']}>
      {label && (
        <p className="text-sm font-medium text-utility-gray-700 p-0 m-0 mb-1.5">
          {label}
          {required && '*'}
        </p>
      )}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            color={error ? 'destructive' : 'secondary'}
            variant={error ? 'outline' : 'fill'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span className="font-normal text-utility-gray-700">
                {format(date, 'PP')}
              </span>
            ) : (
              <span className="font-normal text-utility-gray-500">
                {placeholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          avoidCollisions={avoidCollisions}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className="!rounded-md !border !bg-popover !text-popover-foreground !animate-in !shadow-dropdown-shadow w-full p-0"
        >
          <div className="w-full px-6 pt-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(val) => setSelectedDate(val as Date)}
              initialFocus
            />
          </div>
          <div className="w-full flex items-center gap-3 mt-4 px-4 py-4 border-t-[1px] border-t-utility-gray-200">
            <Button
              color="secondary"
              className="w-full"
              onClick={() => setPopoverOpen(false)}
            >
              {t('button-actions.cancel')}
            </Button>
            <Button
              className="w-full"
              onClick={handleApply}
              disabled={!selectedDate}
            >
              {t('button-actions.apply')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {hint && !error && (
        <p className="text-sm font-light text-utility-gray-600 p-0 m-0 mt-1.5">
          {hint}
        </p>
      )}
      {error && (
        <p className="text-sm font-light text-utility-error-600 p-0 m-0 mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}

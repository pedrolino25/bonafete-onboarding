import { format, isValid, parse } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  ...props
}: DatePickerProps) {
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
        <PopoverContent className="!rounded-md !border !bg-popover !text-popover-foreground !animate-in !shadow-dropdown-shadow w-full p-0">
          <div className="w-full px-6 pt-5">
            <div className="w-full flex items-center gap-3">
              <Input
                type="date"
                className="date-picker-hide w-full"
                onChange={(val) => {
                  if (
                    isValid(parse(val.target.value, 'yyyy-MM-dd', new Date()))
                  ) {
                    setSelectedDate(
                      parse(val.target.value, 'yyyy-MM-dd', new Date())
                    )
                  }
                }}
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              />
              <Button
                color="secondary"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </Button>
            </div>
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
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handleApply}
              disabled={!selectedDate}
            >
              Apply
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

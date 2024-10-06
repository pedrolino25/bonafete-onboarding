import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format, isValid, parse } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { Control, Controller } from 'react-hook-form'

export interface DateRangePickerComponentProps {
  placeholder?: string
  variant?: 'compact' | 'extended'
  onChange?: (date: DateRange) => void
  label?: string
  hint?: string
  error?: string
  required?: boolean
  defaultValue?: DateRange
  value?: DateRange
  'data-testid'?: string
  disabled?: boolean
}

export function DateRangePickerComponent({
  placeholder = 'Select dates',
  variant = 'compact',
  onChange,
  label,
  hint,
  error,
  required,
  defaultValue,
  value,
  disabled,
  ...props
}: DateRangePickerComponentProps) {
  const [date, setDate] = React.useState<DateRange>(
    (defaultValue || value) as DateRange
  )
  const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(
    (defaultValue || value) as DateRange
  )
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const handleApply = () => {
    setDate(selectedDate as DateRange)
    setPopoverOpen(false)
    onChange?.(selectedDate as DateRange)
  }

  const handleCancel = () => {
    setSelectedDate(date)
    setPopoverOpen(false)
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
              'w-[280px] justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from && date?.to ? (
              <span className="font-extrabold text-utility-gray-700">{`${format(
                date.from,
                'PP'
              )} - ${format(date.to, 'PP')}`}</span>
            ) : (
              <span className="font-extrabold text-utility-gray-500">
                {placeholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!rounded-md !border !bg-popover !text-popover-foreground !animate-in !shadow-dropdown-shadow w-full p-0">
          <div className="w-full px-6 pt-5">
            {variant === 'compact' && (
              <div className="w-full flex items-center gap-3">
                <Input
                  data-testid="compact-input-from"
                  type="date"
                  className="!w-[125px] date-picker-hide w-full"
                  value={
                    selectedDate?.from
                      ? format(selectedDate.from, 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={(val) => {
                    if (
                      isValid(parse(val.target.value, 'yyyy-MM-dd', new Date()))
                    ) {
                      setSelectedDate({
                        from: parse(val.target.value, 'yyyy-MM-dd', new Date()),
                        to: selectedDate?.to,
                      })
                    }
                  }}
                />
                <div className="utility-gray-500 font-light text-base">-</div>
                <Input
                  data-testid="compact-input-to"
                  type="date"
                  className="!w-[125px] date-picker-hide w-full"
                  value={
                    selectedDate?.to
                      ? format(selectedDate.to, 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={(val) => {
                    if (
                      isValid(parse(val.target.value, 'yyyy-MM-dd', new Date()))
                    ) {
                      setSelectedDate({
                        from: selectedDate?.from,
                        to: parse(val.target.value, 'yyyy-MM-dd', new Date()),
                      })
                    }
                  }}
                />
              </div>
            )}
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={selectedDate?.from}
              selected={selectedDate}
              onSelect={setSelectedDate}
              numberOfMonths={variant === 'compact' ? 1 : 2}
            />
          </div>
          {variant === 'compact' && (
            <div className="w-full flex items-center gap-3 mt-4 px-4 py-4 border-t-[1px] border-t-utility-gray-200">
              <Button
                color="secondary"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                onClick={handleApply}
                disabled={!selectedDate?.from || !selectedDate?.to}
              >
                Apply
              </Button>
            </div>
          )}
          {variant === 'extended' && (
            <div className="w-full flex justify-between items-center mt-4 px-4 py-4 border-t-[1px] border-t-utility-gray-200">
              <div className="flex items-center gap-3">
                <Input
                  data-testid="extended-input-from"
                  type="date"
                  className="date-picker-hide w-full"
                  value={
                    selectedDate?.from
                      ? format(selectedDate.from, 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={(val) => {
                    if (
                      isValid(parse(val.target.value, 'yyyy-MM-dd', new Date()))
                    ) {
                      setSelectedDate({
                        from: parse(val.target.value, 'yyyy-MM-dd', new Date()),
                        to: selectedDate?.to,
                      })
                    }
                  }}
                />
                <div className="utility-gray-500 font-light text-base">-</div>
                <Input
                  data-testid="extended-input-to"
                  type="date"
                  className="date-picker-hide w-full"
                  value={
                    selectedDate?.to
                      ? format(selectedDate.to, 'yyyy-MM-dd')
                      : ''
                  }
                  onChange={(val) => {
                    if (
                      isValid(parse(val.target.value, 'yyyy-MM-dd', new Date()))
                    ) {
                      setSelectedDate({
                        from: selectedDate?.from,
                        to: parse(val.target.value, 'yyyy-MM-dd', new Date()),
                      })
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  color="secondary"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full"
                  onClick={handleApply}
                  disabled={!selectedDate?.from || !selectedDate?.to}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
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

export interface DateRangePickerProps {
  name: string
  control: Control
  variant?: 'compact' | 'extended'
  placeholder?: string
}

export function DateRangePicker({
  name,
  control,
  placeholder,
  variant,
}: DateRangePickerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <DateRangePickerComponent
            placeholder={placeholder}
            variant={variant}
            onChange={field.onChange}
          />
        )
      }}
    />
  )
}

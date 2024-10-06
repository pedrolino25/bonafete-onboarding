import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { buttonVariants } from './button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('pt-3 w-full', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center py-1 relative items-center',
        caption_label: 'text-base text-utility-gray-700 font-extrabold',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'ghost', color: 'secondary' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-10 font-medium text-sm text-utility-gray-700',
        row: 'flex w-full mt-2',
        cell: 'h-10 w-10 !text-primary-foreground text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost', color: 'secondary' }),
          '!rounded-full active:rounded-full !shadow-none h-10 w-10 p-0 font-normal hover:font-medium hover:text-utility-gray-900 active:!text-primary-foreground active:!font-normal'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          '!rounded-full !bg-utility-brand-600 !text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          '!rounded-full day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          '!rounded-none aria-selected:!bg-utility-gray-50 aria-selected:!text-utility-gray-700 !font-medium',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4 pointer-events-none" />,
        IconRight: () => (
          <ChevronRight className="h-4 w-4 pointer-events-none" />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }

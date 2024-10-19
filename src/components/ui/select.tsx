'use client'

import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { Command as CommandPrimitive } from 'cmdk'
import { Check, ChevronDown, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Badge } from './badge'
import { Command, CommandGroup, CommandItem, CommandList } from './command'

export interface Option {
  value: string
  label: string
  info?: string
  node?: React.ReactNode
  disabled?: boolean
}

const selectVariants = cva(
  'group flex min-h-10 w-full shadow-xs px-3.5 py-1.5 rounded-lg border border-utility-gray-300 bg-white text-base font-light placeholder:text-utility-gray-500 text-utility-gray-900 hover:placeholder:text-utility-gray-900 focus-within:outline-none',
  {
    variants: {
      variant: {
        default:
          'focus-within:border-utility-brand-300 focus-within:shadow-brand-md',
        error:
          '!border-utility-error-300 focus-within:border-utility-error-300 focus-within:shadow-error-md',
      },
      dimension: {
        sm: 'min-h-10 px-3.5 py-1.5',
        md: '!min-h-11 px-4 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      dimension: 'sm',
    },
  }
)

export interface SelectProps extends VariantProps<typeof selectVariants> {
  options: Option[]
  placeholder?: string
  multiple?: boolean
  className?: string
  startAdornment?: React.ReactNode
  defaultSelected?: Option[]
  value?: Option[]
  onSelect?: (value: Option[]) => void
  disabled?: boolean
  useTranslation?: boolean
}

export function Select({
  options,
  placeholder = '',
  multiple = false,
  className,
  variant,
  dimension,
  startAdornment,
  defaultSelected,
  value,
  onSelect,
  disabled,
  useTranslation = false,
}: SelectProps) {
  const t = useTranslations()
  const comandRef = React.useRef<HTMLDivElement>(null)
  const comandListRef = React.useRef<HTMLDivElement>(null)
  const comandListGroupRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Option[]>(
    value || defaultSelected || []
  )
  const [inputValue, setInputValue] = React.useState('')
  const [selectAll, setSelectAll] = React.useState(false)

  React.useEffect(() => {
    if (value) {
      setSelected(value as Option[])
      if (value.length === 0) {
        setSelectAll(false)
      }
    }
  }, [value])

  const handleUnselect = (option: Option) => {
    if (option.disabled) return
    const opts = selected.filter((s) => s.value !== option.value)
    setSelected(opts)
    onSelect?.(opts)
  }

  const handleSelect = (option: Option, multiple: boolean) => {
    setSelectAll(false)
    if (multiple) {
      if (selected.filter((s) => s.value === option.value).length > 0) {
        handleUnselect(option)
      } else {
        const value = [...selected, option]
        setSelected(value)
        onSelect?.(value)
      }
    } else {
      setSelected([option])
      onSelect?.([option])
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      const optionsToUnselect = options.filter((item) => item.disabled)
      setSelected(optionsToUnselect)
      setSelectAll(false)
      onSelect?.(optionsToUnselect)
    } else {
      setSelected(options)
      setSelectAll(true)
      onSelect?.(options)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (input.value === '') {
          const newSelected = [...selected]
          newSelected.pop()
          setSelected(newSelected)
          onSelect?.(newSelected)
          return newSelected
        }
      }
      if (e.key === 'Escape') {
        input.blur()
      }
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comandRef.current &&
        containerRef.current &&
        comandListGroupRef.current &&
        inputRef.current &&
        !comandRef.current.contains(event.target as Node) &&
        !containerRef.current.contains(event.target as Node) &&
        !comandListGroupRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isSelected = selected?.length > 0

  return (
    <Command ref={comandRef} onKeyDown={handleKeyDown}>
      <div
        ref={containerRef}
        className={cn(
          selectVariants({ variant, dimension, className }),
          !multiple
            ? 'flex items-center justify-between'
            : 'flex items-center flex-wrap gap-1',
          disabled
            ? '!cursor-not-allowed !bg-utility-gray-50 !text-utility-gray-500 hover:!text-utility-gray-500 hover:placeholder:!text-utility-gray-500'
            : ''
        )}
      >
        {startAdornment && <div className="mr-2">{startAdornment}</div>}
        {multiple && (
          <>
            {selected.map((option, index) => (
              <Badge
                data-testid={`select-value-${index}`}
                key={option.value}
                variant="fill"
                size="md"
                shape="rounded"
              >
                {option.node && <div>{option.node}</div>}
                {useTranslation ? t(option.label) : option.label}
                {!option.disabled && (
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(option)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(option)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </Badge>
            ))}
          </>
        )}
        <CommandPrimitive.Input
          data-testid="select-input"
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onClick={() => {
            setOpen(!open)
          }}
          placeholder={
            !multiple
              ? useTranslation
                ? selected[0]?.label
                  ? t(selected[0]?.label)
                  : placeholder
                : selected[0]?.label || placeholder
              : placeholder
          }
          className={cn(
            'flex-1 bg-transparent outline-none text-base font-light placeholder:text-utility-gray-500',
            isSelected && !multiple
              ? 'placeholder:text-utility-gray-900 font-light'
              : null,
            !multiple ? 'cursor-pointer caret-transparent min-w-0' : null
          )}
          disabled={disabled}
        />
        {!multiple && (
          <button
            className="ml-2 rounded-full outline-none"
            onClick={(e) => {
              e.preventDefault()
              setOpen(!open)
            }}
            disabled={disabled}
          >
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>
      <div className={`relative ${!multiple ? '' : 'hidden'}`}>
        <CommandList ref={comandListRef} data-testid="select-list">
          {open && options.length > 0 ? (
            <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground animate-in shadow-dropdown-shadow !border-utility-gray-200">
              <CommandGroup
                ref={comandListGroupRef}
                className="h-full overflow-auto max-h-[200px]"
              >
                {options.map((option: Option, index) => (
                  <CommandItem
                    data-testid={`select-list-item-${index}`}
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue('')
                      if (multiple) {
                        handleSelect(option, true)
                      } else {
                        handleSelect(option, false)
                        setOpen(false)
                      }
                    }}
                    className="cursor-pointer flex items-center justify-between hover:!bg-utility-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {option.node && <div>{option.node}</div>}
                      <span className="text-utility-gray-900 font-medium">
                        {useTranslation ? t(option.label) : option.label}
                      </span>
                      {option.info && (
                        <span className="text-utility-gray-600 font-light">
                          {useTranslation ? t(option.info) : option.info}
                        </span>
                      )}
                    </div>
                    {selected?.some((s) => s.value === option.value) && (
                      <Check className="h-4 w-4 text-utility-brand-600" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
      {multiple && (
        <div className="relative">
          <CommandList ref={comandListRef} data-testid="select-list">
            {open && options.length > 0 ? (
              <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground animate-in">
                <CommandGroup
                  ref={comandListGroupRef}
                  className="h-full overflow-auto max-h-[200px]"
                >
                  <CommandItem
                    data-testid={'select-all-list-item'}
                    key={'select-all'}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue('')
                      handleSelectAll()
                    }}
                    className="cursor-pointer flex items-center justify-between hover:!bg-utility-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-utility-gray-900 font-medium">
                        {selectAll
                          ? t('button-actions.unselect-all')
                          : t('button-actions.select-all')}
                      </span>
                    </div>
                    {selectAll && (
                      <Check className="h-4 w-4 text-utility-brand-600" />
                    )}
                  </CommandItem>
                  {options.map((option, index) => (
                    <CommandItem
                      data-testid={`select-list-item-${index}`}
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        setInputValue('')
                        if (multiple) {
                          handleSelect(option, true)
                        } else {
                          handleSelect(option, false)
                          setOpen(false)
                        }
                      }}
                      className="cursor-pointer flex items-center justify-between hover:!bg-utility-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {option.node && <div>{option.node}</div>}
                        <span className="text-utility-gray-900 font-medium">
                          {useTranslation ? t(option.label) : option.label}
                        </span>
                        {option.info && (
                          <span className="text-utility-gray-600 font-light">
                            {useTranslation ? t(option.info) : option.info}
                          </span>
                        )}
                      </div>
                      {selected?.some((s) => s.value === option.value) && (
                        <Check className="h-4 w-4 text-utility-brand-600" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ) : null}
          </CommandList>
        </div>
      )}
    </Command>
  )
}

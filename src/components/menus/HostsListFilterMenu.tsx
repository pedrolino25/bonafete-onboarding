import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { HostsListItemResponse } from '@/services/api/hosts'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnFiltersState } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { SelectInput } from '../inputs/select-input/select-input'

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
})

const hostsListFilterFormSchema = z.object({
  business_type: z.array(optionSchema).optional(),
  locality: z.array(optionSchema).optional(),
  created_at: z.date().optional(),
})

export type HostsListFilterFormType = z.infer<typeof hostsListFilterFormSchema>

export interface HostsListFilterMenuProps {
  data: HostsListItemResponse[]
  open?: boolean
  onOpenChange: (val: boolean) => void
  submit: (filters: ColumnFiltersState) => void
}

export function HostsListFilterMenu({
  data,
  open,
  onOpenChange,
  submit,
}: HostsListFilterMenuProps) {
  const t = useTranslations()
  const getBusinessTypeOptions = (): Option[] => {
    const modelSet = new Set<string>()
    data.forEach((item) => {
      modelSet.add(item.business_type)
    })
    const options: Option[] = Array.from(modelSet).map((item) => ({
      value: item,
      label: t(`business_type.${item}`),
    }))
    return options
  }

  const getLocalityOptions = (): Option[] => {
    const modelSet = new Set<string>()
    data.forEach((item) => {
      modelSet.add(item.locality)
    })
    const options: Option[] = Array.from(modelSet).map((item) => ({
      value: item,
      label: item,
    }))
    return options
  }

  const [businessTypeOptions] = useState<Option[]>(getBusinessTypeOptions())
  const [localityOptions] = useState<Option[]>(getLocalityOptions())

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<HostsListFilterFormType>({
    mode: 'onChange',
    resolver: zodResolver(hostsListFilterFormSchema),
  })

  const handleSelectChange =
    (field: keyof HostsListFilterFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const onSubmit = (values: HostsListFilterFormType) => {
    const filter = []
    if (values.business_type && values.business_type[0]) {
      filter.push({
        id: 'business_type',
        value: values.business_type[0].value,
      })
    }

    if (values.locality && values.locality[0]) {
      filter.push({ id: 'locality', value: values.locality[0].value })
    }
    submit(filter)
  }

  const onClear = () => {
    setValue('business_type', [], {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('locality', [], { shouldDirty: true })
    submit([])
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('table.filters')}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col pt-6 justify-between h-full">
          <div className="flex flex-col gap-4">
            <SelectInput
              data-testid="locality"
              label={t('columns.locality')}
              placeholder={t('table.select-from-list')}
              options={localityOptions}
              value={getValues().locality}
              onSelect={handleSelectChange('locality')}
            />
            <SelectInput
              data-testid="business_type"
              label={t('columns.business_type')}
              placeholder={t('table.select-from-list')}
              options={businessTypeOptions}
              value={getValues().business_type}
              onSelect={handleSelectChange('business_type')}
            />
          </div>
          <div className="flex gap-4 py-6">
            <Button
              color="secondary"
              className="w-full"
              onClick={onClear}
              disabled={!isDirty}
            >
              {t('table.clear')}
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              className="w-full"
              disabled={!isDirty}
            >
              {t('table.apply')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

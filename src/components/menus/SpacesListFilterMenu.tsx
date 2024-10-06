import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SpaceListItemResponse } from '@/services/api/spaces'
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

const spaceListFilterFormSchema = z.object({
  business_model: z.array(optionSchema).optional(),
  targets: z.array(optionSchema).optional(),
  type: z.array(optionSchema).optional(),
  locality: z.array(optionSchema).optional(),
  created_at: z.date().optional(),
})

export type SpaceListFilterFormType = z.infer<typeof spaceListFilterFormSchema>

export interface SpacesListFilterMenuProps {
  data: SpaceListItemResponse[]
  open?: boolean
  onOpenChange: (val: boolean) => void
  submit: (filters: ColumnFiltersState) => void
}

export function SpacesListFilterMenu({
  data,
  open,
  onOpenChange,
  submit,
}: SpacesListFilterMenuProps) {
  const t = useTranslations()
  const getBusinessModelOptions = (): Option[] => {
    const modelSet = new Set<string>()
    data.forEach((item) => {
      modelSet.add(item.business_model)
    })
    const options: Option[] = Array.from(modelSet).map((item) => ({
      value: item,
      label: t(`business_model.${item}`),
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

  const getTypeOptions = (): Option[] => {
    const modelSet = new Set<string>()
    data.forEach((item) => {
      modelSet.add(item.type)
    })
    const options: Option[] = Array.from(modelSet).map((item) => ({
      value: item,
      label: item,
    }))
    return options
  }

  const [businessModelOptions] = useState<Option[]>(getBusinessModelOptions())
  const [localityOptions] = useState<Option[]>(getLocalityOptions())
  const [typeOptions] = useState<Option[]>(getTypeOptions())

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<SpaceListFilterFormType>({
    mode: 'onChange',
    resolver: zodResolver(spaceListFilterFormSchema),
  })

  const handleSelectChange =
    (field: keyof SpaceListFilterFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const onSubmit = (values: SpaceListFilterFormType) => {
    const filter = []
    if (values.business_model && values.business_model[0]) {
      filter.push({
        id: 'business_model',
        value: values.business_model[0].value,
      })
    }

    if (values.type && values.type[0]) {
      filter.push({ id: 'type', value: values.type[0].value })
    }
    if (values.locality && values.locality[0]) {
      filter.push({ id: 'locality', value: values.locality[0].value })
    }
    submit(filter)
  }

  const onClear = () => {
    setValue('business_model', [], {
      shouldValidate: true,
      shouldDirty: true,
    })
    setValue('type', [], { shouldValidate: true, shouldDirty: true })
    setValue('locality', [], { shouldValidate: true, shouldDirty: true })
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
              data-testid="business_model"
              label={t('columns.business_model')}
              placeholder={t('table.select-from-list')}
              options={businessModelOptions}
              value={getValues().business_model}
              onSelect={handleSelectChange('business_model')}
            />
            <SelectInput
              data-testid="type"
              label={t('columns.type')}
              placeholder={t('table.select-from-list')}
              options={typeOptions}
              value={getValues().type}
              onSelect={handleSelectChange('type')}
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

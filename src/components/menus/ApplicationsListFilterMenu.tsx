import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ApplicationsListItemResponse } from '@/services/api/applications'
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

const ApplicationsListFilterFormSchema = z.object({
  business_model: z.array(optionSchema).optional(),
  targets: z.array(optionSchema).optional(),
  type: z.array(optionSchema).optional(),
  locality: z.array(optionSchema).optional(),
  assigned_user_name: z.array(optionSchema).optional(),
  created_at: z.date().optional(),
})

export type ApplicationsListFilterFormType = z.infer<
  typeof ApplicationsListFilterFormSchema
>

export interface ApplicationsListFilterMenuProps {
  data: ApplicationsListItemResponse[]
  open?: boolean
  onOpenChange: (val: boolean) => void
  submit: (filters: ColumnFiltersState) => void
}

export function ApplicationsListFilterMenu({
  data,
  open,
  onOpenChange,
  submit,
}: ApplicationsListFilterMenuProps) {
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

  const getResponsableUserModelOptions = (): Option[] => {
    const modelSet = new Set<string>()
    data.forEach((item) => {
      modelSet.add(item.assigned_user_name)
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
  const [responsableUserModelOptions] = useState<Option[]>(
    getResponsableUserModelOptions()
  )

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<ApplicationsListFilterFormType>({
    mode: 'onChange',
    resolver: zodResolver(ApplicationsListFilterFormSchema),
  })

  const handleSelectChange =
    (field: keyof ApplicationsListFilterFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const onSubmit = (values: ApplicationsListFilterFormType) => {
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
    if (values.assigned_user_name && values.assigned_user_name[0]) {
      filter.push({
        id: 'assigned_user_name',
        value: values.assigned_user_name[0].value,
      })
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
    setValue('assigned_user_name', [], {
      shouldValidate: true,
      shouldDirty: true,
    })
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
            <SelectInput
              data-testid="assigned_user_name"
              label={t('columns.assigned_user_name')}
              placeholder={t('table.select-from-list')}
              options={responsableUserModelOptions}
              value={getValues().assigned_user_name}
              onSelect={handleSelectChange('assigned_user_name')}
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

import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { OnboardingProcessListItemResponse } from '@/services/api/onboardings'
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

const OnboardingsListFilterFormSchema = z.object({
  assigned_user_name: z.array(optionSchema).optional(),
})

export type OnboardingsListFilterFormType = z.infer<
  typeof OnboardingsListFilterFormSchema
>

export interface OnboardingsListFilterMenuProps {
  data: OnboardingProcessListItemResponse[]
  open?: boolean
  onOpenChange: (val: boolean) => void
  submit: (filters: ColumnFiltersState) => void
}

export function OnboardingsListFilterMenu({
  data,
  open,
  onOpenChange,
  submit,
}: OnboardingsListFilterMenuProps) {
  const t = useTranslations()
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

  const [responsableUserModelOptions] = useState<Option[]>(
    getResponsableUserModelOptions()
  )

  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<OnboardingsListFilterFormType>({
    mode: 'onChange',
    resolver: zodResolver(OnboardingsListFilterFormSchema),
  })

  const handleSelectChange =
    (field: keyof OnboardingsListFilterFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  const onSubmit = (values: OnboardingsListFilterFormType) => {
    const filter = []
    if (values.assigned_user_name && values.assigned_user_name[0]) {
      filter.push({
        id: 'assigned_user_name',
        value: values.assigned_user_name[0].value,
      })
    }
    submit(filter)
  }

  const onClear = () => {
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

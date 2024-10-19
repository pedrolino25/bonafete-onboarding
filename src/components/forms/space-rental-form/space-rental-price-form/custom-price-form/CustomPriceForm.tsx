'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { Option } from '@/components/ui/select'
import { HOURS } from '@/lib/utils/consts'
import { zodResolver } from '@hookform/resolvers/zod'
import { Euro } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export interface CustomPriceFormInfoProps {
  minHour: Option[]
  maxHour: Option[]
}

interface CustomPriceFormProps {
  defaultValues?: CustomPriceFormType
  onChange?: (values: CustomPriceFormType) => void
  info?: CustomPriceFormInfoProps
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

export const customPriceFormSchema = z.object({
  time_from_1: z.array(optionSchema).min(1, 'time_not_defined'),
  time_to_1: z.array(optionSchema).min(1, 'time_not_defined'),
  price_1: z.string().min(1, 'price_not_defined'),
  time_from_2: z.array(optionSchema).min(1, 'time_not_defined'),
  time_to_2: z.array(optionSchema).min(1, 'time_not_defined'),
  price_2: z.string().min(1, 'price_not_defined'),
  time_from_3: z.array(optionSchema).optional(),
  time_to_3: z.array(optionSchema).optional(),
  price_3: z.string().optional(),
  time_from_4: z.array(optionSchema).optional(),
  time_to_4: z.array(optionSchema).optional(),
  price_4: z.string().optional(),
  time_from_5: z.array(optionSchema).optional(),
  time_to_5: z.array(optionSchema).optional(),
  price_5: z.string().optional(),
})

type CustomPriceFormType = z.infer<typeof customPriceFormSchema>

export default function CustomPriceForm({
  defaultValues,
  onChange,
  info,
}: CustomPriceFormProps) {
  const t = useTranslations()

  interface AvailableHourOptionsProps {
    fromDeviation?: number
    toDeviation?: number
  }

  interface AvailableHourParamsProps {
    hoursList: Option[]
    from: Option[]
    to?: Option[]
    options?: AvailableHourOptionsProps
  }
  const getAvailableHourOptions = ({
    hoursList,
    from,
    to,
    options,
  }: AvailableHourParamsProps): Option[] => {
    if (from.length > 0 && hoursList.length > 0) {
      const fromIndex = hoursList.findIndex(
        (option) => option.label === from[0].label
      )

      const toIndex =
        to && to[0]?.label
          ? hoursList.findIndex((option) => option.label === to[0].label) + 1
          : 0

      if (fromIndex >= 0 && toIndex > 0) {
        const updatedOptions = hoursList.slice(
          fromIndex + (options?.fromDeviation || 0),
          toIndex + (options?.toDeviation || 0)
        )
        return updatedOptions
      } else if (fromIndex >= 0) {
        const updatedOptions = hoursList.slice(
          fromIndex + (options?.fromDeviation || 0)
        )
        return updatedOptions
      }
      return hoursList
    } else {
      return []
    }
  }

  const getDefaultHoursOptions = (): Option[] => {
    const hours = HOURS.filter((item) => item.value !== '--:--')
    if (info && info.minHour.length > 0 && info.maxHour.length > 0) {
      return getAvailableHourOptions({
        hoursList: hours,
        from: info?.minHour,
        to: info?.maxHour,
      })
    } else {
      return hours
    }
  }

  const initHoursOptions = getDefaultHoursOptions()
  const [timeFromOptions1] = useState<Option[]>(initHoursOptions?.slice(0, 1))
  const [timeToOptions1, setTimeToOptions1] = useState<Option[]>([])
  const [timeToOptions2, setTimeToOptions2] = useState<Option[]>([])
  const [timeToOptions3, setTimeToOptions3] = useState<Option[]>([])
  const [timeToOptions4, setTimeToOptions4] = useState<Option[]>([])
  const [timeToOptions5, setTimeToOptions5] = useState<Option[]>([])
  const [timeFromOptions2, setTimeFromOptions2] = useState<Option[]>([])
  const [timeFromOptions3, setTimeFromOptions3] = useState<Option[]>([])
  const [timeFromOptions4, setTimeFromOptions4] = useState<Option[]>([])
  const [timeFromOptions5, setTimeFromOptions5] = useState<Option[]>([])

  const {
    setValue,
    getValues,
    watch,
    formState: { errors, isValid },
  } = useForm<CustomPriceFormType>({
    resolver: zodResolver(customPriceFormSchema),
    defaultValues,
  })

  const handleSelectChange =
    (field: keyof CustomPriceFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
      switch (field) {
        case 'time_from_1':
          const val = getAvailableHourOptions({
            hoursList: initHoursOptions,
            from: option,
            options: {
              fromDeviation: 1,
            },
          })
          console.log(val)
          setTimeToOptions1(val)
          return
        case 'time_to_1':
          setTimeFromOptions2(
            getAvailableHourOptions({
              hoursList: timeToOptions1,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_from_2':
          setTimeToOptions2(
            getAvailableHourOptions({
              hoursList: timeFromOptions2,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_to_2':
          setTimeFromOptions3(
            getAvailableHourOptions({
              hoursList: timeToOptions2,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_from_3':
          setTimeToOptions3(
            getAvailableHourOptions({
              hoursList: timeFromOptions3,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_to_3':
          setTimeFromOptions4(
            getAvailableHourOptions({
              hoursList: timeToOptions3,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_from_4':
          setTimeToOptions4(
            getAvailableHourOptions({
              hoursList: timeFromOptions4,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_to_4':
          setTimeFromOptions5(
            getAvailableHourOptions({
              hoursList: timeToOptions4,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        case 'time_from_5':
          setTimeToOptions5(
            getAvailableHourOptions({
              hoursList: timeFromOptions5,
              from: option,
              options: {
                fromDeviation: 1,
              },
            })
          )
          return
        default:
          return
      }
    }

  const handleChange =
    (field: keyof CustomPriceFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const time_from_1 = watch('time_from_1')
  const time_from_2 = watch('time_from_2')
  const time_from_3 = watch('time_from_3')
  const time_from_4 = watch('time_from_4')
  const time_from_5 = watch('time_from_5')
  const time_to_1 = watch('time_to_1')
  const time_to_2 = watch('time_to_2')
  const time_to_3 = watch('time_to_3')
  const time_to_4 = watch('time_to_4')
  const time_to_5 = watch('time_to_5')
  const price_1 = watch('price_1')
  const price_2 = watch('price_2')
  const price_3 = watch('price_3')
  const price_4 = watch('price_4')
  const price_5 = watch('price_5')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [
    isValid,
    time_from_1,
    time_from_2,
    time_from_3,
    time_from_4,
    time_from_5,
    time_to_1,
    time_to_2,
    time_to_3,
    time_to_4,
    time_to_5,
    price_1,
    price_2,
    price_3,
    price_4,
    price_5,
  ])

  return (
    <div className="w-full grid grid-cols-3 gap-2 pt-4">
      <SelectInput
        data-testid="time_from_1"
        placeholder={t('sections.onboarding.rental-form.from')}
        options={timeFromOptions1}
        value={getValues('time_from_1')}
        onSelect={handleSelectChange('time_from_1')}
        error={
          errors.time_from_1?.message
            ? t(`error-messages.${errors.time_from_1?.message}`)
            : undefined
        }
      />
      <SelectInput
        data-testid="time_to_1"
        placeholder={t('sections.onboarding.rental-form.to')}
        options={timeToOptions1}
        disabled={timeToOptions1.length === 0}
        value={getValues('time_to_1')}
        onSelect={handleSelectChange('time_to_1')}
        error={
          errors.time_to_1?.message
            ? t(`error-messages.${errors.time_to_1?.message}`)
            : undefined
        }
      />
      <TextInput
        data-testid="price_1"
        placeholder={'Preço'}
        value={getValues('price_1')}
        onChange={handleChange('price_1')}
        type="number"
        fixedEndAdornment={
          <div className="px-3 pt-2.5 text-sm">
            <Euro className="h-4 w-4" />
          </div>
        }
        error={
          errors.price_1?.message
            ? t(`error-messages.${errors.price_1?.message}`)
            : undefined
        }
      />
      {/** */}
      <SelectInput
        data-testid="time_from_2"
        placeholder={t('sections.onboarding.rental-form.from')}
        options={timeFromOptions2}
        disabled={timeFromOptions2.length === 0}
        value={getValues('time_from_2')}
        onSelect={handleSelectChange('time_from_2')}
        error={
          errors.time_from_2?.message
            ? t(`error-messages.${errors.time_from_2?.message}`)
            : undefined
        }
      />
      <SelectInput
        data-testid="time_to_2"
        placeholder={t('sections.onboarding.rental-form.to')}
        options={timeToOptions2}
        disabled={timeToOptions2.length === 0}
        value={getValues('time_to_2')}
        onSelect={handleSelectChange('time_to_2')}
        error={
          errors.time_to_2?.message
            ? t(`error-messages.${errors.time_to_2?.message}`)
            : undefined
        }
      />
      <TextInput
        data-testid="price_2"
        placeholder={'Preço'}
        value={getValues('price_2')}
        onChange={handleChange('price_2')}
        type="number"
        fixedEndAdornment={
          <div className="px-3 pt-2.5 text-sm">
            <Euro className="h-4 w-4" />
          </div>
        }
        error={
          errors.price_2?.message
            ? t(`error-messages.${errors.price_2?.message}`)
            : undefined
        }
      />
      {/** */}
      <SelectInput
        data-testid="time_from_3"
        placeholder={t('sections.onboarding.rental-form.to')}
        options={timeFromOptions3}
        disabled={timeFromOptions3.length === 0}
        value={getValues('time_from_3')}
        onSelect={handleSelectChange('time_from_3')}
        error={
          errors.time_from_3?.message
            ? t(`error-messages.${errors.time_from_3?.message}`)
            : undefined
        }
      />
      <SelectInput
        data-testid="time_to_3"
        placeholder={t('sections.onboarding.rental-form.to')}
        options={timeToOptions3}
        disabled={timeToOptions3.length === 0}
        value={getValues('time_to_3')}
        onSelect={handleSelectChange('time_to_3')}
        error={
          errors.time_to_3?.message
            ? t(`error-messages.${errors.time_to_3?.message}`)
            : undefined
        }
      />
      <TextInput
        data-testid="price_3"
        placeholder={'Preço'}
        value={getValues('price_3')}
        onChange={handleChange('price_3')}
        type="number"
        fixedEndAdornment={
          <div className="px-3 pt-2.5 text-sm">
            <Euro className="h-4 w-4" />
          </div>
        }
        error={
          errors.price_3?.message
            ? t(`error-messages.${errors.price_3?.message}`)
            : undefined
        }
      />
      {/** */}
      <SelectInput
        data-testid="time_from_4"
        placeholder={t('sections.onboarding.rental-form.from')}
        options={timeFromOptions4}
        disabled={timeFromOptions4.length === 0}
        value={getValues('time_from_4')}
        onSelect={handleSelectChange('time_from_4')}
        error={
          errors.time_from_4?.message
            ? t(`error-messages.${errors.time_from_4?.message}`)
            : undefined
        }
      />
      <SelectInput
        data-testid="time_to_4"
        placeholder={t('sections.onboarding.rental-form.to')}
        options={timeToOptions4}
        disabled={timeToOptions4.length === 0}
        value={getValues('time_to_4')}
        onSelect={handleSelectChange('time_to_4')}
        error={
          errors.time_to_4?.message
            ? t(`error-messages.${errors.time_to_4?.message}`)
            : undefined
        }
      />
      <TextInput
        data-testid="price_4"
        placeholder={'Preço'}
        value={getValues('price_4')}
        onChange={handleChange('price_4')}
        type="number"
        fixedEndAdornment={
          <div className="px-3 pt-2.5 text-sm">
            <Euro className="h-4 w-4" />
          </div>
        }
        error={
          errors.price_4?.message
            ? t(`error-messages.${errors.price_4?.message}`)
            : undefined
        }
      />
      {/** */}
      <SelectInput
        data-testid="time_from_5"
        placeholder={t('sections.onboarding.rental-form.from')}
        options={timeFromOptions5}
        disabled={timeFromOptions5.length === 0}
        value={getValues('time_from_5')}
        onSelect={handleSelectChange('time_from_5')}
        error={
          errors.time_from_5?.message
            ? t(`error-messages.${errors.time_from_5?.message}`)
            : undefined
        }
      />
      <SelectInput
        data-testid="time_to_5"
        placeholder={t('sections.onboarding.rental-form.to')}
        options={timeToOptions5}
        disabled={timeToOptions5.length === 0}
        value={getValues('time_to_5')}
        onSelect={handleSelectChange('time_to_5')}
        error={
          errors.time_to_5?.message
            ? t(`error-messages.${errors.time_to_5?.message}`)
            : undefined
        }
      />
      <TextInput
        data-testid="price_5"
        placeholder={'Preço'}
        value={getValues('price_5')}
        onChange={handleChange('price_5')}
        type="number"
        fixedEndAdornment={
          <div className="px-3 pt-2.5 text-sm">
            <Euro className="h-4 w-4" />
          </div>
        }
        error={
          errors.price_5?.message
            ? t(`error-messages.${errors.price_5?.message}`)
            : undefined
        }
      />
    </div>
  )
}

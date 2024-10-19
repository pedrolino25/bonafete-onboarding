'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { Option } from '@/components/ui/select'
import { HOURS } from '@/lib/utils/consts'
import { getAvailableHourOptions } from '@/lib/utils/functions'
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
  resetFormValues?: boolean
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const validateHourPrice = (
  isRequired: boolean,
  from?: Option[],
  to?: Option[],
  price?: string
) => {
  if (from && from.length > 0 && to && to.length > 0) {
    return price && price.length > 0
  } else if ((!from || from.length === 0) && (!to || to.length === 0)) {
    return !isRequired
  }
}

export const customPriceFormSchema = z
  .object({
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
  .refine((data) => {
    return (
      validateHourPrice(true, data.time_from_1, data.time_to_1, data.price_1) &&
      validateHourPrice(true, data.time_from_2, data.time_to_2, data.price_2) &&
      validateHourPrice(
        false,
        data.time_from_3,
        data.time_to_3,
        data.price_3
      ) &&
      validateHourPrice(
        false,
        data.time_from_4,
        data.time_to_4,
        data.price_4
      ) &&
      validateHourPrice(false, data.time_from_5, data.time_to_5, data.price_5)
    )
  })

type CustomPriceFormType = z.infer<typeof customPriceFormSchema>

export default function CustomPriceForm({
  defaultValues,
  onChange,
  info,
  resetFormValues,
}: CustomPriceFormProps) {
  const t = useTranslations()
  const scheduleDefined =
    info && info.minHour.length > 0 && info.maxHour.length > 0
  const getDefaultHoursOptions = (): Option[] => {
    const hours = HOURS.filter((item) => item.value !== '--:--')
    if (scheduleDefined) {
      const values = getAvailableHourOptions(hours, info.minHour, info.maxHour)
      return values
    } else {
      return hours
    }
  }

  const initHoursOptions = getDefaultHoursOptions()
  const [timeFromOptions1] = useState<Option[]>(
    scheduleDefined ? initHoursOptions?.slice(0, 1) : initHoursOptions
  )
  const [timeToOptions1, setTimeToOptions1] = useState<Option[]>([])
  const [timeToOptions2, setTimeToOptions2] = useState<Option[]>([])
  const [timeToOptions3, setTimeToOptions3] = useState<Option[]>([])
  const [timeToOptions4, setTimeToOptions4] = useState<Option[]>([])
  const [timeToOptions5, setTimeToOptions5] = useState<Option[]>([])
  const [timeFromOptions2, setTimeFromOptions2] = useState<Option[]>([])
  const [timeFromOptions3, setTimeFromOptions3] = useState<Option[]>([])
  const [timeFromOptions4, setTimeFromOptions4] = useState<Option[]>([])
  const [timeFromOptions5, setTimeFromOptions5] = useState<Option[]>([])
  const [initialMinHour] = useState<string | undefined>(
    info?.minHour?.[0]?.value
  )
  const [initialMaxHour] = useState<string | undefined>(
    info?.maxHour?.[0]?.value
  )

  const {
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CustomPriceFormType>({
    resolver: zodResolver(customPriceFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (
      resetFormValues ||
      initialMinHour !== info?.minHour?.[0]?.value ||
      initialMaxHour !== info?.maxHour?.[0]?.value
    ) {
      reset()
    }
  }, [
    resetFormValues,
    initialMinHour,
    initialMaxHour,
    info?.minHour?.[0]?.value,
    info?.maxHour?.[0]?.value,
  ])

  const handleSelectChange =
    (field: keyof CustomPriceFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
      let options = []
      switch (field) {
        case 'time_from_1':
          setTimeToOptions1(
            getAvailableHourOptions(initHoursOptions, option, undefined, {
              fromDeviation: 1,
            })
          )
          return
        case 'time_to_1':
          options = getAvailableHourOptions(timeToOptions1, option, undefined, {
            fromDeviation: 1,
          })
          setTimeFromOptions2(scheduleDefined ? options : [options[0]])
          if (options[0]) {
            if (scheduleDefined) {
              setValue('time_from_2', [options[0]], {
                shouldValidate: true,
                shouldDirty: true,
              })
            } else {
              setValue('time_from_2', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_2', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_from_3', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_3', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_from_4', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_4', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_from_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setTimeToOptions2([])
              setTimeFromOptions3([])
              setTimeToOptions3([])
              setTimeFromOptions4([])
              setTimeToOptions4([])
              setTimeFromOptions5([])
              setTimeToOptions5([])
            }
            setTimeToOptions2(
              getAvailableHourOptions(options, [options[0]], undefined, {
                fromDeviation: 1,
              })
            )
          } else {
            setValue('time_from_2', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_2', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_from_3', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_3', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_from_4', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_4', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_from_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setTimeToOptions2([])
            setTimeFromOptions3([])
            setTimeToOptions3([])
            setTimeFromOptions4([])
            setTimeToOptions4([])
            setTimeFromOptions5([])
            setTimeToOptions5([])
          }
          return
        case 'time_to_2':
          options = getAvailableHourOptions(timeToOptions2, option, undefined, {
            fromDeviation: 1,
          })
          setTimeFromOptions3(scheduleDefined ? options : [options[0]])
          if (options[0]) {
            if (scheduleDefined) {
              setValue('time_from_3', [options[0]], {
                shouldValidate: true,
                shouldDirty: true,
              })
            } else {
              setValue('time_from_3', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_3', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_from_4', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_4', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_from_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setTimeToOptions3([])
              setTimeFromOptions4([])
              setTimeToOptions4([])
              setTimeFromOptions5([])
              setTimeToOptions5([])
            }
            setTimeToOptions3(
              getAvailableHourOptions(options, [options[0]], undefined, {
                fromDeviation: 1,
              })
            )
          } else {
            setValue('time_from_3', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_3', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_from_4', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_4', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_from_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setTimeToOptions3([])
            setTimeFromOptions4([])
            setTimeToOptions4([])
            setTimeFromOptions5([])
            setTimeToOptions5([])
          }
          return
        case 'time_to_3':
          options = getAvailableHourOptions(timeToOptions3, option, undefined, {
            fromDeviation: 1,
          })
          setTimeFromOptions4(scheduleDefined ? options : [options[0]])
          if (options[0]) {
            if (scheduleDefined) {
              setValue('time_from_4', [options[0]], {
                shouldValidate: true,
                shouldDirty: true,
              })
            } else {
              setValue('time_from_4', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_4', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_from_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setTimeToOptions4([])
              setTimeFromOptions5([])
              setTimeToOptions5([])
            }
            setTimeToOptions4(
              getAvailableHourOptions(options, [options[0]], undefined, {
                fromDeviation: 1,
              })
            )
          } else {
            setValue('time_from_4', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_4', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_from_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setTimeToOptions4([])
            setTimeFromOptions5([])
            setTimeToOptions5([])
          }
          return
        case 'time_to_4':
          options = getAvailableHourOptions(timeToOptions4, option, undefined, {
            fromDeviation: 1,
          })
          setTimeFromOptions5(scheduleDefined ? options : [options[0]])
          if (options[0]) {
            if (scheduleDefined) {
              setValue('time_from_5', [options[0]], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_5', [options[options.length - 1]], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setTimeToOptions5([options[options.length - 1]])
            } else {
              setValue('time_from_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setValue('time_to_5', [], {
                shouldValidate: true,
                shouldDirty: true,
              })
              setTimeToOptions5(
                getAvailableHourOptions(options, [options[0]], undefined, {
                  fromDeviation: 1,
                })
              )
            }
          } else {
            setValue('time_from_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setValue('time_to_5', [], {
              shouldValidate: true,
              shouldDirty: true,
            })
            setTimeToOptions5([])
          }
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

  const extractHourlyPricesMessage = (
    data: z.infer<typeof customPriceFormSchema>
  ) => {
    let text = ''

    for (let i = 1; i <= 5; i++) {
      const timeFromKey = `time_from_${i}` as keyof typeof data
      const timeToKey = `time_to_${i}` as keyof typeof data
      const priceKey = `price_${i}` as keyof typeof data

      if (data[timeFromKey] && data[timeToKey]) {
        const from = (data[timeFromKey] as Option[])[0]?.value
        const to = (data[timeToKey] as Option[])[0]?.value
        const price = data[priceKey] as string

        if (from && to) {
          const separator = i === 1 ? '' : ','
          text =
            text +
            separator +
            t(
              'sections.onboarding.rental-form.explanation-messages.hourly-custom-price-2'
            )
              .replace('$1', price)
              .replace('$2', from)
              .replace('$3', to)
        }
      }
    }

    return text
  }

  return (
    <OnboardingFormLayout.Container>
      <div className="w-full grid grid-cols-3 gap-2">
        <SelectInput
          data-testid="time_from_1"
          placeholder={t('sections.onboarding.rental-form.from')}
          options={timeFromOptions1}
          value={time_from_1 || []}
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
          disabled={!time_from_1 || time_from_1.length === 0}
          value={time_to_1 || []}
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
          value={price_1 || ''}
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
          disabled={
            !scheduleDefined ? !time_to_1 || time_to_1?.length === 0 : true
          }
          value={time_from_2 || []}
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
          disabled={!time_from_2 || time_from_2.length === 0}
          value={time_to_2 || []}
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
          value={price_2 || ''}
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
          placeholder={t('sections.onboarding.rental-form.from')}
          options={timeFromOptions3}
          disabled={
            !scheduleDefined ? !time_to_2 || time_to_2?.length === 0 : true
          }
          value={time_from_3 || []}
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
          disabled={!time_from_3 || time_from_3.length === 0}
          value={time_to_3 || []}
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
          value={price_3 || ''}
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
          disabled={
            !scheduleDefined ? !time_to_3 || time_to_3?.length === 0 : true
          }
          value={time_from_4 || []}
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
          disabled={!time_from_4 || time_from_4.length === 0}
          value={time_to_4 || []}
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
          value={price_4 || ''}
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
          disabled={
            !scheduleDefined ? !time_to_4 || time_to_4?.length === 0 : true
          }
          value={time_from_5 || []}
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
          disabled={
            !scheduleDefined ? !time_from_5 || time_from_5?.length === 0 : true
          }
          value={time_to_5 || []}
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
          value={price_5 || ''}
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
      {isValid && (
        <OnboardingFormLayout.Info>
          {t(
            'sections.onboarding.rental-form.explanation-messages.hourly-custom-price'
          ).replace('$1', extractHourlyPricesMessage(getValues()))}
        </OnboardingFormLayout.Info>
      )}
    </OnboardingFormLayout.Container>
  )
}

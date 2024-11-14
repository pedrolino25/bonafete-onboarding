'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { Option } from '@/components/ui/select'
import { HOURS } from '@/lib/utils/consts'
import { getAvailableHourOptions } from '@/lib/utils/functions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export interface CustomScheduleFormInfoProps {
  minHours?: number
  limits?: {
    start: Option[]
    end: Option[]
  }
  addUnavailable?: boolean
}

interface ScheduleFormProps {
  defaultValues?: ScheduleFormType
  onChange?: (values: ScheduleFormType) => void
  disabled?: boolean
  resetFormValues?: boolean
  info?: CustomScheduleFormInfoProps
  title?: string
  subtitle?: string
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const isUnavailable = (option: Option[]) => {
  return option?.[0]?.value === '--:--'
}

const validateDay = (from: Option[], to: Option[] | undefined) => {
  if (isUnavailable(from)) return true
  return to && to.length > 0
}

export const scheduleFormSchema = z
  .object({
    monday_from: z.array(optionSchema).min(1),
    monday_to: z.array(optionSchema).optional(),
    tuesday_from: z.array(optionSchema).min(1),
    tuesday_to: z.array(optionSchema).optional(),
    wednesday_from: z.array(optionSchema).min(1),
    wednesday_to: z.array(optionSchema).optional(),
    thursday_from: z.array(optionSchema).min(1),
    thursday_to: z.array(optionSchema).optional(),
    friday_from: z.array(optionSchema).min(1),
    friday_to: z.array(optionSchema).optional(),
    saturday_from: z.array(optionSchema).min(1),
    saturday_to: z.array(optionSchema).optional(),
    sunday_from: z.array(optionSchema).min(1),
    sunday_to: z.array(optionSchema).optional(),
    min_hour: z.array(optionSchema).min(1),
    max_hour: z.array(optionSchema).min(1),
  })
  .refine(
    (data) => {
      return (
        validateDay(data.monday_from, data.monday_to) &&
        validateDay(data.tuesday_from, data.tuesday_to) &&
        validateDay(data.wednesday_from, data.wednesday_to) &&
        validateDay(data.thursday_from, data.thursday_to) &&
        validateDay(data.friday_from, data.friday_to) &&
        validateDay(data.saturday_from, data.saturday_to) &&
        validateDay(data.sunday_from, data.sunday_to) &&
        !(
          isUnavailable(data.monday_from) &&
          isUnavailable(data.tuesday_from) &&
          isUnavailable(data.wednesday_from) &&
          isUnavailable(data.thursday_from) &&
          isUnavailable(data.friday_from) &&
          isUnavailable(data.saturday_from) &&
          isUnavailable(data.sunday_from)
        )
      )
    },
    {
      path: [
        'monday_to',
        'tuesday_to',
        'wednesday_to',
        'thursday_to',
        'friday_to',
        'saturday_to',
        'sunday_to',
      ],
      message: 'Defina a hora',
    }
  )

export type ScheduleFormType = z.infer<typeof scheduleFormSchema>

export default function ScheduleForm({
  defaultValues,
  onChange,
  disabled = false,
  resetFormValues,
  info,
  title,
  subtitle,
}: ScheduleFormProps) {
  const t = useTranslations()
  const [mondayHoursOptions, setMondayHoursOptions] = useState<Option[]>([])
  const [tuesdayHoursOptions, setTuesdayHoursOptions] = useState<Option[]>([])
  const [wednesdayHoursOptions, setWednesdayHoursOptions] = useState<Option[]>(
    []
  )
  const [thursdayHoursOptions, setThursdayHoursOptions] = useState<Option[]>([])
  const [fridayHoursOptions, setFridayHoursOptions] = useState<Option[]>([])
  const [saturdayHoursOptions, setSaturdayHoursOptions] = useState<Option[]>([])
  const [sundayHoursOptions, setSundayHoursOptions] = useState<Option[]>([])

  const getDefaultHoursList = () => {
    if (info?.limits?.start && info?.limits?.end) {
      const fromIndex = HOURS.findIndex(
        (option) => option.label === info?.limits?.start[0].label
      )
      const toIndex = HOURS.findIndex(
        (option) => option.label === info?.limits?.end[0].label
      )
      const hours = HOURS.slice(fromIndex, toIndex + 1)
      const unavailable = info?.addUnavailable
        ? [{ value: '--:--', label: 'Indisponível' }].concat(hours)
        : hours
      return unavailable
    } else {
      return HOURS
    }
  }

  const [defaultHoursList] = useState<Option[]>(getDefaultHoursList())

  const {
    setValue,
    getValues,
    watch,
    reset,
    formState: { isValid, errors },
  } = useForm<ScheduleFormType>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (resetFormValues) reset()
  }, [resetFormValues])

  const monday_from = watch('monday_from')
  const monday_to = watch('monday_to')
  const tuesday_from = watch('tuesday_from')
  const tuesday_to = watch('tuesday_to')
  const wednesday_from = watch('wednesday_from')
  const wednesday_to = watch('wednesday_to')
  const thursday_from = watch('thursday_from')
  const thursday_to = watch('thursday_to')
  const friday_from = watch('friday_from')
  const friday_to = watch('friday_to')
  const saturday_from = watch('saturday_from')
  const saturday_to = watch('saturday_to')
  const sunday_from = watch('sunday_from')
  const sunday_to = watch('sunday_to')

  const isValidForm = (data: ScheduleFormType) => {
    return (
      validateDay(data.monday_from, data.monday_to) &&
      validateDay(data.tuesday_from, data.tuesday_to) &&
      validateDay(data.wednesday_from, data.wednesday_to) &&
      validateDay(data.thursday_from, data.thursday_to) &&
      validateDay(data.friday_from, data.friday_to) &&
      validateDay(data.saturday_from, data.saturday_to) &&
      validateDay(data.sunday_from, data.sunday_to) &&
      !(
        isUnavailable(data.monday_from) &&
        isUnavailable(data.tuesday_from) &&
        isUnavailable(data.wednesday_from) &&
        isUnavailable(data.thursday_from) &&
        isUnavailable(data.friday_from) &&
        isUnavailable(data.saturday_from) &&
        isUnavailable(data.sunday_from)
      )
    )
  }

  const handleMinMaxHours = () => {
    const data = getValues()
    if (isValidForm(data)) {
      const weekdays = [
        { from: data.monday_from, to: data.monday_to },
        { from: data.tuesday_from, to: data.tuesday_to },
        { from: data.wednesday_from, to: data.wednesday_to },
        { from: data.thursday_from, to: data.thursday_to },
        { from: data.friday_from, to: data.friday_to },
        { from: data.saturday_from, to: data.saturday_to },
        { from: data.sunday_from, to: data.sunday_to },
      ]

      let minHourOption: number = defaultHoursList.length
      let maxHourOption: number = 0

      weekdays.forEach(({ from, to }) => {
        if (!isUnavailable(from)) {
          const fromIndex = defaultHoursList.findIndex(
            (option) => option.label === from[0].label
          )
          minHourOption = minHourOption > fromIndex ? fromIndex : minHourOption
        }

        if (to && to.length > 0) {
          const toIndex = defaultHoursList.findIndex(
            (option) => option.label === to[0].label
          )
          maxHourOption = maxHourOption < toIndex ? toIndex : maxHourOption
        }
      })

      setValue('min_hour', [defaultHoursList[minHourOption]], {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue('max_hour', [defaultHoursList[maxHourOption]], {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }

  useEffect(() => {
    if (isValid) {
      handleMinMaxHours()
      onChange?.(getValues())
    } else {
      handleMinMaxHours()
    }
  }, [
    isValid,
    monday_from,
    monday_to,
    tuesday_from,
    tuesday_to,
    wednesday_from,
    wednesday_to,
    thursday_from,
    thursday_to,
    friday_from,
    friday_to,
    saturday_from,
    saturday_to,
    sunday_from,
    sunday_to,
  ])

  const handleHourFromChange = (
    field: keyof ScheduleFormType,
    option: Option[]
  ) => {
    const fromDeviation =
      info?.minHours && info.minHours > 1 ? info?.minHours : 1
    const options = getAvailableHourOptions(
      defaultHoursList,
      option,
      undefined,
      {
        fromDeviation: fromDeviation,
        returnEmptyForUnavailable: true,
      }
    )
    switch (field) {
      case 'monday_from':
        if (options.length === 0) {
          setValue('monday_to', [], { shouldDirty: true })
        }
        setMondayHoursOptions(options)
        return
      case 'tuesday_from':
        if (options.length === 0) {
          setValue('tuesday_to', [], { shouldDirty: true })
        }
        setTuesdayHoursOptions(options)
        return
      case 'wednesday_from':
        if (options.length === 0) {
          setValue('wednesday_to', [], { shouldDirty: true })
        }
        setWednesdayHoursOptions(options)
        return
      case 'thursday_from':
        if (options.length === 0) {
          setValue('thursday_to', [], { shouldDirty: true })
        }
        setThursdayHoursOptions(options)
        return
      case 'friday_from':
        if (options.length === 0) {
          setValue('friday_to', [], { shouldDirty: true })
        }
        setFridayHoursOptions(options)
        return
      case 'saturday_from':
        if (options.length === 0) {
          setValue('saturday_to', [], { shouldDirty: true })
        }
        setSaturdayHoursOptions(options)
        return
      case 'sunday_from':
        if (options.length === 0) {
          setValue('sunday_to', [], { shouldDirty: true })
        }
        setSundayHoursOptions(options)
        return
      default:
        return
    }
  }

  const handleSelectChange =
    (field: keyof ScheduleFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
      handleHourFromChange(field, option)
    }

  return (
    <OnboardingFormLayout.Main>
      <OnboardingFormLayout.Title>
        {title || t('sections.onboarding.rental-form.schedule')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {subtitle || t('sections.onboarding.rental-form.define-schedule')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <div className="w-full grid grid-cols-5 gap-2 items-center">
          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.monday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="monday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={monday_from}
              onSelect={handleSelectChange('monday_from')}
              disabled={disabled}
              error={
                errors.monday_from?.message
                  ? t(`error-messages.${errors.monday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="monday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={mondayHoursOptions}
              disabled={mondayHoursOptions.length === 0 || disabled}
              value={monday_to}
              onSelect={handleSelectChange('monday_to')}
              error={
                errors.monday_to?.message
                  ? t(`error-messages.${errors.monday_to?.message}`)
                  : undefined
              }
            />
          </div>

          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.tuesday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="tuesday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={tuesday_from}
              onSelect={handleSelectChange('tuesday_from')}
              disabled={disabled}
              error={
                errors.tuesday_from?.message
                  ? t(`error-messages.${errors.tuesday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="tuesday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={tuesdayHoursOptions}
              disabled={tuesdayHoursOptions.length === 0 || disabled}
              value={tuesday_to}
              onSelect={handleSelectChange('tuesday_to')}
              error={
                errors.tuesday_to?.message
                  ? t(`error-messages.${errors.tuesday_to?.message}`)
                  : undefined
              }
            />
          </div>

          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.wednesday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="wednesday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={wednesday_from}
              onSelect={handleSelectChange('wednesday_from')}
              disabled={disabled}
              error={
                errors.wednesday_from?.message
                  ? t(`error-messages.${errors.wednesday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="wednesday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={wednesdayHoursOptions}
              disabled={wednesdayHoursOptions.length === 0 || disabled}
              value={wednesday_to}
              onSelect={handleSelectChange('wednesday_to')}
              error={
                errors.wednesday_to?.message
                  ? t(`error-messages.${errors.wednesday_to?.message}`)
                  : undefined
              }
            />
          </div>

          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.thursday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="thursday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={thursday_from}
              onSelect={handleSelectChange('thursday_from')}
              disabled={disabled}
              error={
                errors.thursday_from?.message
                  ? t(`error-messages.${errors.thursday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="thursday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={thursdayHoursOptions}
              disabled={thursdayHoursOptions.length === 0 || disabled}
              value={thursday_to}
              onSelect={handleSelectChange('thursday_to')}
              error={
                errors.thursday_to?.message
                  ? t(`error-messages.${errors.thursday_to?.message}`)
                  : undefined
              }
            />
          </div>

          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.friday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="friday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={friday_from}
              onSelect={handleSelectChange('friday_from')}
              disabled={disabled}
              error={
                errors.friday_from?.message
                  ? t(`error-messages.${errors.friday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="friday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={fridayHoursOptions}
              disabled={fridayHoursOptions.length === 0 || disabled}
              value={friday_to}
              onSelect={handleSelectChange('friday_to')}
              error={
                errors.friday_to?.message
                  ? t(`error-messages.${errors.friday_to?.message}`)
                  : undefined
              }
            />
          </div>

          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.saturday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="saturday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={saturday_from}
              onSelect={handleSelectChange('saturday_from')}
              disabled={disabled}
              error={
                errors.saturday_from?.message
                  ? t(`error-messages.${errors.saturday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="saturday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={saturdayHoursOptions}
              disabled={saturdayHoursOptions.length === 0 || disabled}
              value={saturday_to}
              onSelect={handleSelectChange('saturday_to')}
              error={
                errors.saturday_to?.message
                  ? t(`error-messages.${errors.saturday_to?.message}`)
                  : undefined
              }
            />
          </div>

          <span className="text-sm text-utility-gray-700 col-span-1">
            {t('week-days.sunday')}
          </span>
          <div className="col-span-2">
            <SelectInput
              data-testid="sunday_from"
              placeholder={t('sections.onboarding.rental-form.from')}
              options={defaultHoursList}
              value={sunday_from}
              onSelect={handleSelectChange('sunday_from')}
              disabled={disabled}
              error={
                errors.sunday_from?.message
                  ? t(`error-messages.${errors.sunday_from?.message}`)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <SelectInput
              data-testid="sunday_to"
              placeholder={t('sections.onboarding.rental-form.to')}
              options={sundayHoursOptions}
              disabled={sundayHoursOptions.length === 0 || disabled}
              value={sunday_to}
              onSelect={handleSelectChange('sunday_to')}
              error={
                errors.sunday_to?.message
                  ? t(`error-messages.${errors.sunday_to?.message}`)
                  : undefined
              }
            />
          </div>
        </div>
        {isValid && (
          <OnboardingFormLayout.Info>
            {t('sections.onboarding.rental-form.explanation-messages.schedule')}
          </OnboardingFormLayout.Info>
        )}
      </OnboardingFormLayout.Container>
    </OnboardingFormLayout.Main>
  )
}

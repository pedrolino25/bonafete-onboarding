'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface SpaceRentalMinimumHoursFormProps {
  defaultValues?: SpaceRentalMinimumHoursFormType
  onChange?: (values: SpaceRentalMinimumHoursFormType) => void
  disabled?: boolean
}

export const spaceRentalMinimumHoursFormSchema = z.object({
  min_hours: z.string().min(1, 'define-min-hours'),
})

type SpaceRentalMinimumHoursFormType = z.infer<
  typeof spaceRentalMinimumHoursFormSchema
>

export default function SpaceRentalMinimumHoursForm({
  defaultValues,
  onChange,
  disabled = false,
}: SpaceRentalMinimumHoursFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<SpaceRentalMinimumHoursFormType>({
    resolver: zodResolver(spaceRentalMinimumHoursFormSchema),
    defaultValues,
  })

  const min_hours = watch('min_hours')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, min_hours])

  const handleChange =
    (field: keyof SpaceRentalMinimumHoursFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <OnboardingFormLayout.Main>
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.rental-form.min-hours')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.rental-form.define-min-hours')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <TextInput
          data-testid="min_hours"
          placeholder={t('sections.onboarding.rental-form.min-hours')}
          value={getValues('min_hours')}
          onChange={handleChange('min_hours')}
          type="number"
          disabled={disabled}
          error={
            errors.min_hours?.message
              ? t(`error-messages.${errors.min_hours?.message}`)
              : undefined
          }
        />
        {isValid && (
          <OnboardingFormLayout.Info>
            {t(
              'sections.onboarding.rental-form.explanation-messages.min-hours'
            ).replace('$1', min_hours)}
          </OnboardingFormLayout.Info>
        )}
      </OnboardingFormLayout.Container>
    </OnboardingFormLayout.Main>
  )
}

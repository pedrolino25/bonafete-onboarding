'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface MinimumHoursFormProps {
  defaultValues?: MinimumHoursFormType
  onChange?: (values: MinimumHoursFormType) => void
  disabled?: boolean
}

export const minimumHoursFormSchema = z.object({
  min_hours: z.string().min(1, 'define-min-hours'),
})

export type MinimumHoursFormType = z.infer<typeof minimumHoursFormSchema>

export default function MinimumHoursForm({
  defaultValues,
  onChange,
  disabled = false,
}: MinimumHoursFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<MinimumHoursFormType>({
    resolver: zodResolver(minimumHoursFormSchema),
    defaultValues,
  })

  const min_hours = watch('min_hours')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, min_hours])

  const handleChange =
    (field: keyof MinimumHoursFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <div className="w-full">
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
    </div>
  )
}

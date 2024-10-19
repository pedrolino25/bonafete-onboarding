'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface SpaceRentalCleaningFeeFormProps {
  defaultValues?: SpaceRentalCleaningFeeFormType
  onChange?: (values: SpaceRentalCleaningFeeFormType) => void
  disabled?: boolean
}

export const spaceRentalCleaningFeeFormSchema = z.object({
  cleaning_fee: z.string().optional(),
})

type SpaceRentalCleaningFeeFormType = z.infer<
  typeof spaceRentalCleaningFeeFormSchema
>

export default function SpaceRentalCleaningFeeForm({
  defaultValues,
  onChange,
  disabled = false,
}: SpaceRentalCleaningFeeFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<SpaceRentalCleaningFeeFormType>({
    resolver: zodResolver(spaceRentalCleaningFeeFormSchema),
    defaultValues,
  })

  const cleaning_fee = watch('cleaning_fee')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, cleaning_fee])

  const handleChange =
    (field: keyof SpaceRentalCleaningFeeFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <OnboardingFormLayout.Main>
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.rental-form.cleaning-fee')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.rental-form.define-cleaning-fee')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <TextInput
          data-testid="cleaning_fee"
          placeholder={t('sections.onboarding.rental-form.cleaning-fee')}
          value={getValues('cleaning_fee')}
          onChange={handleChange('cleaning_fee')}
          type="number"
          disabled={disabled}
        />
        {isValid && !disabled && (
          <OnboardingFormLayout.Info>
            {cleaning_fee
              ? t(
                  'sections.onboarding.rental-form.explanation-messages.cleaning-fee'
                ).replace('$1', cleaning_fee)
              : t(
                  'sections.onboarding.rental-form.explanation-messages.cleaning-fee-undefined'
                )}
          </OnboardingFormLayout.Info>
        )}
      </OnboardingFormLayout.Container>
    </OnboardingFormLayout.Main>
  )
}

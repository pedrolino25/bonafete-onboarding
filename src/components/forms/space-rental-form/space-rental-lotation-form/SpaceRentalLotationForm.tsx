'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface SpaceRentalLotationFormProps {
  defaultValues?: SpaceRentalLotationFormType
  onChange?: (values: SpaceRentalLotationFormType) => void
  disabled?: boolean
}

export const spaceRentalLotationFormSchema = z.object({
  lotation: z.string().min(1, 'define-lotation'),
})

type SpaceRentalLotationFormType = z.infer<typeof spaceRentalLotationFormSchema>

export default function SpaceRentalLotationForm({
  defaultValues,
  onChange,
  disabled = false,
}: SpaceRentalLotationFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<SpaceRentalLotationFormType>({
    resolver: zodResolver(spaceRentalLotationFormSchema),
    defaultValues,
  })

  const lotation = watch('lotation')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, lotation])

  const handleChange =
    (field: keyof SpaceRentalLotationFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <OnboardingFormLayout.Main>
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.rental-form.lotation')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.rental-form.define-lotation')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <TextInput
          data-testid="lotation"
          placeholder={t('sections.onboarding.rental-form.lotation')}
          value={getValues('lotation')}
          onChange={handleChange('lotation')}
          type="number"
          disabled={disabled}
          error={
            errors.lotation?.message
              ? t(`error-messages.${errors.lotation?.message}`)
              : undefined
          }
        />
        {isValid && (
          <OnboardingFormLayout.Info>
            {t(
              'sections.onboarding.rental-form.explanation-messages.lotation'
            ).replace('$1', lotation)}
          </OnboardingFormLayout.Info>
        )}
      </OnboardingFormLayout.Container>
    </OnboardingFormLayout.Main>
  )
}

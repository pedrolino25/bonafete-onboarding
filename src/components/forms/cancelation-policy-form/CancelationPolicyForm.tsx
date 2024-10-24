'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarClock, Percent } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface CancelationPolicyFormProps {
  defaultValues?: CancelationPolicyFormType
  onChange?: (values: CancelationPolicyFormType) => void
  disabled?: boolean
}

export const cancelationPolicyFormSchema = z.object({
  base_refund: z.string().min(1),
  late_cancellation_days: z.string().min(1),
  late_cancellation_refund: z.string().min(1),
})

export type CancelationPolicyFormType = z.infer<
  typeof cancelationPolicyFormSchema
>

export default function CancelationPolicyForm({
  defaultValues,
  onChange,
  disabled = false,
}: CancelationPolicyFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<CancelationPolicyFormType>({
    resolver: zodResolver(cancelationPolicyFormSchema),
    defaultValues: defaultValues,
  })

  const base_refund = watch('base_refund')
  const late_cancellation_days = watch('late_cancellation_days')
  const late_cancellation_refund = watch('late_cancellation_refund')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, base_refund, late_cancellation_days, late_cancellation_refund])

  const handleChange =
    (field: keyof CancelationPolicyFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <OnboardingFormLayout.Main>
      <OnboardingFormLayout.Title>
        {t('sections.onboarding.rental-form.cancellation-policy')}
      </OnboardingFormLayout.Title>
      <OnboardingFormLayout.Subtitle>
        {t('sections.onboarding.rental-form.define-cancellation-policy')}
      </OnboardingFormLayout.Subtitle>
      <OnboardingFormLayout.Container>
        <TextInput
          data-testid="base_refund"
          placeholder={t('sections.onboarding.rental-form.base-refund')}
          value={getValues('base_refund')}
          onChange={handleChange('base_refund')}
          type="number"
          disabled={disabled}
          fixedEndAdornment={
            <div className="px-3 pt-2.5 text-sm">
              <Percent className="h-4 w-4" />
            </div>
          }
        />
        <TextInput
          data-testid="late_cancellation_days"
          placeholder={t(
            'sections.onboarding.rental-form.late-cancellation-days'
          )}
          value={getValues('late_cancellation_days')}
          onChange={handleChange('late_cancellation_days')}
          type="number"
          disabled={disabled}
          fixedEndAdornment={
            <div className="px-3 pt-2.5 text-sm">
              <CalendarClock className="h-4 w-4" />
            </div>
          }
        />
        <TextInput
          data-testid="late_cancellation_refund"
          placeholder={t(
            'sections.onboarding.rental-form.late-cancellation-refund'
          )}
          value={getValues('late_cancellation_refund')}
          onChange={handleChange('late_cancellation_refund')}
          type="number"
          disabled={disabled}
          fixedEndAdornment={
            <div className="px-3 pt-2.5 text-sm">
              <Percent className="h-4 w-4" />
            </div>
          }
        />
        {isValid && !disabled && (
          <OnboardingFormLayout.Info>
            {t(
              'sections.onboarding.rental-form.explanation-messages.cancellation-policy'
            )
              .replace('$1', base_refund)
              .replace('$2', late_cancellation_days)
              .replace('$3', late_cancellation_refund)}
          </OnboardingFormLayout.Info>
        )}
      </OnboardingFormLayout.Container>
    </OnboardingFormLayout.Main>
  )
}

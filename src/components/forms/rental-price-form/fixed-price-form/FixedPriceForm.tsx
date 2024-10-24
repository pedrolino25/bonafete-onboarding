'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Euro } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface FixedPriceFormProps {
  defaultValues?: FixedPriceFormType
  onChange?: (values: FixedPriceFormType) => void
  resetFormValues?: boolean
}

export const fixedPriceFormSchema = z.object({
  price: z.string().min(1, 'price_not_defined'),
})

export type FixedPriceFormType = z.infer<typeof fixedPriceFormSchema>

export default function FixedPriceForm({
  defaultValues,
  onChange,
  resetFormValues,
}: FixedPriceFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FixedPriceFormType>({
    resolver: zodResolver(fixedPriceFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (resetFormValues) reset()
  }, [resetFormValues])

  const handleChange =
    (field: keyof FixedPriceFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const price = watch('price')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, price])

  return (
    <OnboardingFormLayout.Container>
      <TextInput
        data-testid="price"
        placeholder={t('sections.onboarding.rental-form.price')}
        value={getValues('price')}
        onChange={handleChange('price')}
        type="number"
        fixedEndAdornment={
          <div className="px-3 pt-2.5 text-sm">
            <Euro className="h-4 w-4" />
          </div>
        }
        error={
          errors.price?.message
            ? t(`error-messages.${errors.price?.message}`)
            : undefined
        }
      />
      {isValid && (
        <OnboardingFormLayout.Info>
          {t(
            'sections.onboarding.rental-form.explanation-messages.hourly-fixed-price'
          ).replace('$1', price)}
        </OnboardingFormLayout.Info>
      )}
    </OnboardingFormLayout.Container>
  )
}

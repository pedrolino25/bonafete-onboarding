'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
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
    <div className="w-full border-t border-utility-gray-300">
      <p className="text-base pt-4">
        {t('sections.onboarding.rental-form.lotation')}
      </p>
      <span className="font-light text-sm text-utility-gray-600">
        {t('sections.onboarding.rental-form.define-lotation')}
      </span>
      <div className="w-full pt-4">
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
      </div>
    </div>
  )
}

'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
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
    <div className="w-full border-t border-utility-gray-300">
      <p className="text-base pt-4">
        {t('sections.onboarding.rental-form.cleaning-fee')}
      </p>
      <span className="font-light text-sm text-utility-gray-600">
        {t('sections.onboarding.rental-form.define-cleaning-fee')}
      </span>
      <div className="w-full pt-4">
        <TextInput
          data-testid="cleaning_fee"
          placeholder={t('sections.onboarding.rental-form.cleaning-fee')}
          value={getValues('cleaning_fee')}
          onChange={handleChange('cleaning_fee')}
          type="number"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

interface LotationFormProps {
  defaultValues?: LotationFormType
  onChange?: (values: LotationFormType) => void
  disabled?: boolean
}

export const lotationFormSchema = z.object({
  lotation: z.string().min(1, 'define-lotation'),
})

export type LotationFormType = z.infer<typeof lotationFormSchema>

export default function LotationForm({
  defaultValues,
  onChange,
  disabled = false,
}: LotationFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<LotationFormType>({
    resolver: zodResolver(lotationFormSchema),
    defaultValues,
  })

  const lotation = watch('lotation')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [isValid, lotation])

  const handleChange =
    (field: keyof LotationFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <div className="w-full">
      <TextInput
        label={t('columns.max_of_persons')}
        labelSmall
        required
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
  )
}

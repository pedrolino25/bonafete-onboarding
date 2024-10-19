'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { Option } from '@/components/ui/select'
import { PRICE_MODEL_OPTIONS } from '@/lib/utils/consts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import CustomPriceForm, {
  CustomPriceFormInfoProps,
  customPriceFormSchema,
} from './custom-price-form/CustomPriceForm'
import FixedPriceForm, {
  fixedPriceFormSchema,
} from './fixed-price-form/FixedPriceForm'
import FlexiblePriceForm, {
  flexiblePriceFormSchema,
} from './flexible-price-form/FlexiblePriceForm'

interface SpaceRentalPriceFormProps {
  defaultValues?: SpaceRentalPriceFormType
  onChange?: (values: SpaceRentalPriceFormType) => void
  disabled?: boolean
  info?: CustomPriceFormInfoProps
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

export const spaceRentalPriceFormSchema = z
  .object({
    price_model: z.array(optionSchema).min(1),
    fixed_price_form: fixedPriceFormSchema.optional(),
    flexible_price_form: flexiblePriceFormSchema.optional(),
    custom_price_form: customPriceFormSchema.optional(),
  })
  .refine((data) => {
    return (
      data.fixed_price_form ||
      data.flexible_price_form ||
      data.custom_price_form
    )
  })

type SpaceRentalPriceFormType = z.infer<typeof spaceRentalPriceFormSchema>

export default function SpaceRentalPriceForm({
  defaultValues,
  onChange,
  disabled = false,
  info,
}: SpaceRentalPriceFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid, errors },
  } = useForm<SpaceRentalPriceFormType>({
    resolver: zodResolver(spaceRentalPriceFormSchema),
    defaultValues,
  })

  const price_model = watch('price_model')
  const showFixed = price_model?.[0]?.value === 'fixed'
  const showFlexible = price_model?.[0]?.value === 'flexible'
  const showCustom = price_model?.[0]?.value === 'custom'

  const fixed_price_form = watch('fixed_price_form')
  const flexible_price_form = watch('flexible_price_form')
  const custom_price_form = watch('custom_price_form')

  useEffect(() => {
    if (isValid) {
      onChange?.(getValues())
    }
  }, [
    isValid,
    errors,
    price_model,
    fixed_price_form,
    flexible_price_form,
    custom_price_form,
  ])

  const handleSelectChange =
    (field: keyof SpaceRentalPriceFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
      if (field === 'fixed_price_form') {
        setValue('flexible_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('custom_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else if (field === 'flexible_price_form') {
        setValue('fixed_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('custom_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else if (field === 'custom_price_form') {
        setValue('fixed_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('flexible_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
      } else {
        setValue('fixed_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('flexible_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('custom_price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }

  return (
    <div className="w-full border-t border-utility-gray-300">
      <p className="text-base pt-4">
        {t('sections.onboarding.rental-form.price')}
      </p>
      <span className="font-light text-sm text-utility-gray-600">
        {t('sections.onboarding.rental-form.price-model-title')}
      </span>
      <div className="w-full pt-4">
        <SelectInput
          required
          data-testid="price_model"
          placeholder={t('sections.onboarding.rental-form.price-model')}
          options={PRICE_MODEL_OPTIONS}
          value={getValues().price_model}
          onSelect={handleSelectChange('price_model')}
          useTranslation
          disabled={disabled}
        />
        {showFixed && (
          <FixedPriceForm
            defaultValues={defaultValues?.fixed_price_form}
            onChange={(value) =>
              setValue('fixed_price_form', value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        )}
        {showFlexible && (
          <FlexiblePriceForm
            defaultValues={defaultValues?.flexible_price_form}
            onChange={(value) =>
              setValue('flexible_price_form', value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        )}
        {showCustom && (
          <CustomPriceForm
            defaultValues={defaultValues?.custom_price_form}
            info={info}
            onChange={(value) =>
              setValue('custom_price_form', value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        )}
      </div>
    </div>
  )
}

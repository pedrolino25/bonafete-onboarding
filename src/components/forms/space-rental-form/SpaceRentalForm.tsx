'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { BUSINESS_MODEL_OPTIONS } from '@/lib/utils/consts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import SpaceCancelationPolicyForm, {
  spaceCancelationPolicyFormSchema,
} from './space-cancelation-policy-form/SpaceCancelationPolicyForm'
import SpaceRentalCleaningFeeForm, {
  spaceRentalCleaningFeeFormSchema,
} from './space-cleaning-fee-form/SpaceRentalCleaningFeeForm'
import SpaceRentalLotationForm, {
  spaceRentalLotationFormSchema,
} from './space-rental-lotation-form/SpaceRentalLotationForm'
import SpaceRentalMinimumHoursForm, {
  spaceRentalMinimumHoursFormSchema,
} from './space-rental-min-hours-form/SpaceRentalMinimumHoursForm'
import SpaceRentalPriceForm, {
  spaceRentalPriceFormSchema,
} from './space-rental-price-form/SpaceRentalPriceForm'
import SpaceRentalScheduleForm, {
  spaceRentalScheduleFormSchema,
} from './space-rental-schedule-form/SpaceRentalScheduleForm'

interface SpaceRentalFormProps {
  defaultValues?: SpaceRentalFormType
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const spaceRentalFormSchema = z
  .object({
    business_model: z.array(optionSchema).min(1),
    lotation_form: spaceRentalLotationFormSchema,
    min_hours_form: spaceRentalMinimumHoursFormSchema.optional(),
    schedule_form: spaceRentalScheduleFormSchema.optional(),
    price_form: spaceRentalPriceFormSchema.optional(),
    cleaning_fee_form: spaceRentalCleaningFeeFormSchema.optional(),
    cancellation_policy_form: spaceCancelationPolicyFormSchema,
  })
  .refine((data) => {
    if (
      data.business_model &&
      data.business_model[0] &&
      data.business_model[0].value
    ) {
      if (data.business_model[0].value === 'packages') {
        return !!(
          data.lotation_form?.lotation &&
          data.min_hours_form?.min_hours &&
          data.price_form?.price_model &&
          (data.price_form?.fixed_price_form?.price ||
            data.price_form?.flexible_price_form?.base_price ||
            data.price_form?.custom_price_form?.price_1)
        )
      } else {
        return !!(
          data.lotation_form?.lotation &&
          data.min_hours_form?.min_hours &&
          data.schedule_form?.friday_from &&
          data.price_form?.price_model &&
          (data.price_form?.fixed_price_form?.price ||
            data.price_form?.flexible_price_form?.base_price ||
            data.price_form?.custom_price_form?.price_1)
        )
      }
    }
    return false
  })

type SpaceRentalFormType = z.infer<typeof spaceRentalFormSchema>

export default function SpaceRentalForm({
  defaultValues,
}: SpaceRentalFormProps) {
  const t = useTranslations()
  const [resetFormValues, setResetFormValues] = useState<boolean>(false)
  const {
    setValue,
    watch,
    formState: { isValid },
  } = useForm<SpaceRentalFormType>({
    resolver: zodResolver(spaceRentalFormSchema),
    defaultValues,
  })

  const business_model = watch('business_model')
  const lotation_form = watch('lotation_form')
  const min_hours_form = watch('min_hours_form')
  const schedule_form = watch('schedule_form')
  const price_form = watch('price_form')

  const requireFullConfiguration =
    business_model?.length > 0 && business_model?.[0]?.value !== 'packages'

  const disableLotationForm = !business_model || business_model?.length === 0

  const disableMinHoursForm = !lotation_form

  const disableScheduleForm = !min_hours_form

  const disablePriceForm =
    (!schedule_form && requireFullConfiguration) ||
    (!requireFullConfiguration && !lotation_form)

  const disableCleaningFeeForm = !price_form || !price_form?.price_model

  const handleSelectChange =
    (field: keyof SpaceRentalFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
      if (field === 'business_model' && option[0].value === 'packages') {
        setValue('schedule_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setValue('price_form', undefined, {
          shouldValidate: true,
          shouldDirty: true,
        })
        setResetFormValues(true)
      }
    }

  return (
    <OnboardingFormLayout.Root>
      <div className="w-full">
        <OnboardingFormLayout.Title>
          {t('columns.business_model')}
        </OnboardingFormLayout.Title>
        <OnboardingFormLayout.Subtitle>
          {t('sections.onboarding.rental-form.business-model-title')}
        </OnboardingFormLayout.Subtitle>
        <OnboardingFormLayout.Container>
          <SelectInput
            required
            data-testid="business_model"
            placeholder={t('table.select-from-list')}
            options={BUSINESS_MODEL_OPTIONS}
            value={business_model}
            onSelect={handleSelectChange('business_model')}
            useTranslation
          />
          {business_model && business_model[0]?.value && (
            <OnboardingFormLayout.Info>
              {t(
                `sections.onboarding.rental-form.explanation-messages.${business_model[0]?.value}`
              )}
            </OnboardingFormLayout.Info>
          )}
        </OnboardingFormLayout.Container>
      </div>
      <SpaceRentalLotationForm
        disabled={disableLotationForm}
        defaultValues={defaultValues?.lotation_form}
        onChange={(value) =>
          setValue('lotation_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <SpaceRentalMinimumHoursForm
        disabled={disableMinHoursForm}
        defaultValues={defaultValues?.min_hours_form}
        onChange={(value) =>
          setValue('min_hours_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      {requireFullConfiguration && (
        <SpaceRentalScheduleForm
          resetFormValues={resetFormValues}
          info={{
            minHours:
              min_hours_form && min_hours_form.min_hours
                ? parseInt(min_hours_form?.min_hours)
                : 1,
          }}
          disabled={disableScheduleForm}
          defaultValues={defaultValues?.schedule_form}
          onChange={(value) =>
            setValue('schedule_form', value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        />
      )}
      <SpaceRentalPriceForm
        resetFormValues={resetFormValues}
        info={{
          minHour: schedule_form?.min_hour || [],
          maxHour: schedule_form?.max_hour || [],
        }}
        disabled={disablePriceForm}
        defaultValues={defaultValues?.price_form}
        onChange={(value) =>
          setValue('price_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />

      <SpaceRentalCleaningFeeForm
        disabled={disableCleaningFeeForm}
        defaultValues={defaultValues?.cleaning_fee_form}
        onChange={(value) =>
          setValue('cleaning_fee_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <SpaceCancelationPolicyForm
        disabled={disableCleaningFeeForm}
        defaultValues={defaultValues?.cancellation_policy_form}
        onChange={(value) =>
          setValue('cancellation_policy_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <Button disabled={!isValid}>{t('button-actions.submit')}</Button>
    </OnboardingFormLayout.Root>
  )
}

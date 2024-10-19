'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { BUSINESS_MODEL_OPTIONS } from '@/lib/utils/consts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'
import SpaceRentalCleaningFeeForm, {
  spaceRentalCleaningFeeFormSchema,
} from './space-cleaning-fee-form/SpaceRentalCleaningFeeForm'
import SpaceRentalLotationForm, {
  spaceRentalLotationFormSchema,
} from './space-rental-lotation-form/SpaceRentalLotationForm'
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

const spaceRentalFormSchema = z.object({
  business_model: z.array(optionSchema).min(1),
  lotation_form: spaceRentalLotationFormSchema,
  schedule_form: spaceRentalScheduleFormSchema,
  price_form: spaceRentalPriceFormSchema,
  cleaning_fee_form: spaceRentalCleaningFeeFormSchema,
})

type SpaceRentalFormType = z.infer<typeof spaceRentalFormSchema>

export default function SpaceRentalForm({
  defaultValues,
}: SpaceRentalFormProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    watch,
    formState: { isValid },
  } = useForm<SpaceRentalFormType>({
    resolver: zodResolver(spaceRentalFormSchema),
    defaultValues,
  })

  console.log(getValues())

  const business_model = watch('business_model')
  const lotation_form = watch('lotation_form')
  const schedule_form = watch('schedule_form')
  const price_form = watch('price_form')

  const requireFullConfiguration =
    business_model?.length > 0 && business_model?.[0]?.value !== 'packages'

  const disableLotationForm = !business_model || business_model?.length === 0

  const disableScheduleForm = !lotation_form

  const disablePriceForm =
    (!schedule_form && requireFullConfiguration) ||
    (!requireFullConfiguration && !lotation_form)

  const disableCleaningFeeForm = !price_form || !price_form?.price_model

  const handleSelectChange =
    (field: keyof SpaceRentalFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="w-full">
        <p className="text-base">{t('columns.business_model')}</p>
        <span className="font-light text-sm text-utility-gray-600">
          {t('sections.onboarding.rental-form.business-model-title')}
        </span>
        <div className="w-full pt-4">
          <SelectInput
            required
            data-testid="business_model"
            placeholder={t('table.select-from-list')}
            options={BUSINESS_MODEL_OPTIONS}
            value={getValues().business_model}
            onSelect={handleSelectChange('business_model')}
            useTranslation
          />
        </div>
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
      {requireFullConfiguration && (
        <SpaceRentalScheduleForm
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
      <Button disabled={!isValid}>Submeter</Button>
    </div>
  )
}

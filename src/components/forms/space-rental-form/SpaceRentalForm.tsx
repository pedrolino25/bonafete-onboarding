'use client'

import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/lib/hooks/use-toast'
import { SpaceBusinessModel } from '@/lib/utils/consts'
import {
  CancelationPolicy,
  OnboardingSpaceInfo,
  SpacePrice,
  SpaceSchedule,
  updateSpaceOffersRental,
  UpdateSpaceOffersRentalParameters,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import CancelationPolicyForm, {
  cancelationPolicyFormSchema,
} from '../cancelation-policy-form/CancelationPolicyForm'
import CleaningFeeForm, {
  cleaningFeeFormSchema,
} from '../cleaning-fee-form/CleaningFeeForm'
import LotationForm, { lotationFormSchema } from '../lotation-form/LotationForm'
import MinimumHoursForm, {
  minimumHoursFormSchema,
} from '../minimum-hours-form/MinimumHoursForm'
import RentalPriceForm, {
  rentalPriceFormSchema,
} from '../rental-price-form/RentalPriceForm'
import ScheduleForm, { scheduleFormSchema } from '../schedule-form/ScheduleForm'

const spaceRentalFormSchema = z.object({
  business_model: z.string().min(1),
  lotation_form: lotationFormSchema,
  min_hours_form: minimumHoursFormSchema,
  schedule_form: scheduleFormSchema,
  price_form: rentalPriceFormSchema,
  cleaning_fee_form: cleaningFeeFormSchema.optional(),
  cancellation_policy_form: cancelationPolicyFormSchema,
})

export type SpaceRentalFormType = z.infer<typeof spaceRentalFormSchema>

interface SpaceRentalFormProps {
  onboardingId?: string
  defaultValues?: SpaceRentalFormType
  spaceInfo: OnboardingSpaceInfo
  completed?: boolean
  refetch: () => void
}

export default function SpaceRentalForm({
  onboardingId,
  spaceInfo,
  defaultValues,
  refetch,
}: SpaceRentalFormProps) {
  const t = useTranslations()
  const [resetFormValues, setResetFormValues] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm<SpaceRentalFormType>({
    resolver: zodResolver(spaceRentalFormSchema),
    defaultValues,
  })

  const business_model = watch('business_model')
  const lotation_form = watch('lotation_form')
  const min_hours_form = watch('min_hours_form')
  const schedule_form = watch('schedule_form')
  const price_form = watch('price_form')

  const disableMinHoursForm = !lotation_form

  const disableScheduleForm = !min_hours_form

  const disablePriceForm = !schedule_form

  const disableCleaningFeeForm = !price_form || !price_form?.price_model

  const updateSpaceOffersRentalMutation = useMutation({
    mutationFn: updateSpaceOffersRental,
    onSuccess: () => {
      refetch()
      setIsLoading(false)
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: (error) => {
      refetch()
      setIsLoading(false)
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const getCancelationPolicyObject = (
    values: SpaceRentalFormType
  ): CancelationPolicy => {
    return {
      afterConfimation:
        parseInt(values.cancellation_policy_form.base_refund) / 100,
      period: parseInt(values.cancellation_policy_form.late_cancellation_days),
      afterPeriod:
        parseInt(values.cancellation_policy_form.late_cancellation_refund) /
        100,
      space: { id: spaceInfo.space_id },
      createdAt: new Date(),
    } as CancelationPolicy
  }

  const getPricesObject = (values: SpaceRentalFormType): SpacePrice[] => {
    const prices: SpacePrice[] = []
    if (values.price_form.price_model[0].value === 'hourly-custom') {
      const custom_price = values.price_form.custom_price_form

      if (
        custom_price?.time_from_1 &&
        custom_price?.time_to_1 &&
        custom_price?.price_1
      ) {
        prices.push({
          type: 'hourly-custom',
          amount: parseInt(custom_price?.price_1 || '0'),
          timeStart: custom_price?.time_from_1[0]?.value,
          timeEnd: custom_price?.time_to_1[0]?.value,
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        } as SpacePrice)
      }
      if (
        custom_price?.time_from_2 &&
        custom_price?.time_to_2 &&
        custom_price?.price_2
      ) {
        prices.push({
          type: 'hourly-custom',
          amount: parseInt(custom_price?.price_2 || '0'),
          timeStart: custom_price?.time_from_2[0]?.value,
          timeEnd: custom_price?.time_to_2[0]?.value,
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        } as SpacePrice)
      }
      if (
        custom_price?.time_from_3 &&
        custom_price?.time_to_3 &&
        custom_price?.price_3
      ) {
        prices.push({
          type: 'hourly-custom',
          amount: parseInt(custom_price?.price_3 || '0'),
          timeStart: custom_price?.time_from_3[0]?.value,
          timeEnd: custom_price?.time_to_3[0]?.value,
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        } as SpacePrice)
      }
      if (
        custom_price?.time_from_4 &&
        custom_price?.time_to_4 &&
        custom_price?.price_4
      ) {
        prices.push({
          type: 'hourly-custom',
          amount: parseInt(custom_price?.price_4 || '0'),
          timeStart: custom_price?.time_from_4[0]?.value,
          timeEnd: custom_price?.time_to_4[0]?.value,
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        } as SpacePrice)
      }
      if (
        custom_price?.time_from_5 &&
        custom_price?.time_to_5 &&
        custom_price?.price_5
      ) {
        prices.push({
          type: 'hourly-custom',
          amount: parseInt(custom_price?.price_5 || '0'),
          timeStart: custom_price?.time_from_5[0]?.value,
          timeEnd: custom_price?.time_to_5[0]?.value,
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        } as SpacePrice)
      }
    } else if (values.price_form.price_model[0].value === 'hourly-flexible') {
      prices.push({
        type: 'hourly-flexible',
        amount: parseInt(
          values.price_form?.flexible_price_form?.base_price || '0'
        ),
        amountAfter: parseInt(
          values.price_form?.flexible_price_form?.price_after || '0'
        ),
        duration: parseInt(
          values.price_form?.flexible_price_form?.time_limit || '0'
        ),
        space: { id: spaceInfo.space_id },
        createdAt: new Date(),
      } as SpacePrice)
    } else if (values.price_form.price_model[0].value === 'hourly-fixed') {
      prices.push({
        type: 'hourly-fixed',
        amount: parseInt(values.price_form?.fixed_price_form?.price || '0'),
        space: { id: spaceInfo.space_id },
        createdAt: new Date(),
      } as SpacePrice)
    }

    if (values.cleaning_fee_form?.cleaning_fee) {
      prices.push({
        type: 'cleaning-fee',
        amount: parseInt(values.cleaning_fee_form?.cleaning_fee || '0'),
        space: { id: spaceInfo.space_id },
        createdAt: new Date(),
      } as SpacePrice)
    }

    return prices
  }

  const getSpaceScheduleObject = (
    values: SpaceRentalFormType
  ): SpaceSchedule[] => {
    let schedule: SpaceSchedule[] = []
    if (values.schedule_form) {
      schedule = [
        {
          weekDay: 'monday',
          timeStart:
            values.schedule_form.monday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.monday_from[0].value,
          timeEnd: values.schedule_form.monday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'tuesday',
          timeStart:
            values.schedule_form.tuesday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.tuesday_from[0].value,
          timeEnd: values.schedule_form.tuesday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'wednesday',
          timeStart:
            values.schedule_form.wednesday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.wednesday_from[0].value,
          timeEnd: values.schedule_form.wednesday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'thursday',
          timeStart:
            values.schedule_form.thursday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.thursday_from[0].value,
          timeEnd: values.schedule_form.thursday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'friday',
          timeStart:
            values.schedule_form.friday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.friday_from[0].value,
          timeEnd: values.schedule_form.friday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'saturday',
          timeStart:
            values.schedule_form.saturday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.saturday_from[0].value,
          timeEnd: values.schedule_form.saturday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
        {
          weekDay: 'sunday',
          timeStart:
            values.schedule_form.sunday_from[0].value === '--:--'
              ? 'Fechado'
              : values.schedule_form.sunday_from[0].value,
          timeEnd: values.schedule_form.sunday_to?.[0]?.value || '',
          space: { id: spaceInfo.space_id },
          createdAt: new Date(),
        },
      ]
    }
    return schedule
  }

  const onSubmit = (values: SpaceRentalFormType) => {
    setIsLoading(true)
    const data = {
      onboarding_id: onboardingId as string,
      space_id: spaceInfo.space_id as string,
      business_model: (business_model
        ? business_model
        : SpaceBusinessModel.RentalAndPackages) as SpaceBusinessModel,
      lotation: parseInt(values.lotation_form.lotation || '1'),
      min_hours:
        parseInt(values.min_hours_form.min_hours || '0') === 0
          ? 1
          : parseInt(values.min_hours_form?.min_hours),
      prices: getPricesObject(values),
      price_modality: values.price_form.price_model[0]?.value,
      cancellation_policy: getCancelationPolicyObject(values),
      schedule: getSpaceScheduleObject(values),
    } as UpdateSpaceOffersRentalParameters

    updateSpaceOffersRentalMutation.mutate(data)
  }

  return (
    <OnboardingFormLayout.Root>
      <ScheduleForm
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
      <LotationForm
        defaultValues={defaultValues?.lotation_form}
        onChange={(value) =>
          setValue('lotation_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <CleaningFeeForm
        disabled={disableCleaningFeeForm}
        defaultValues={defaultValues?.cleaning_fee_form}
        onChange={(value) =>
          setValue('cleaning_fee_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <CancelationPolicyForm
        disabled={disableCleaningFeeForm}
        defaultValues={defaultValues?.cancellation_policy_form}
        onChange={(value) =>
          setValue('cancellation_policy_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <OnboardingFormLayout.Main>
        <div className="flex gap-6 items-center justify-between">
          <div>
            <OnboardingFormLayout.Title>
              {t('sections.onboarding.rental-form.business-model-title')}
            </OnboardingFormLayout.Title>
            <OnboardingFormLayout.Subtitle>
              {t('sections.onboarding.rental-form.business-model-subtitle')}
            </OnboardingFormLayout.Subtitle>
          </div>
          <Switch
            onCheckedChange={(val) =>
              setValue(
                'business_model',
                val
                  ? SpaceBusinessModel.OnlyPackages
                  : SpaceBusinessModel.RentalAndPackages,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
            }
            checked={business_model === SpaceBusinessModel.OnlyPackages}
          />
        </div>
      </OnboardingFormLayout.Main>
      <MinimumHoursForm
        disabled={disableMinHoursForm}
        defaultValues={defaultValues?.min_hours_form}
        onChange={(value) =>
          setValue('min_hours_form', value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      <RentalPriceForm
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

      <div className="w-full flex justify-end pt-4">
        <Button
          className="px-10"
          disabled={!isValid || isLoading || !isDirty}
          loading={isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          {t('button-actions.submit')}
        </Button>
      </div>
    </OnboardingFormLayout.Root>
  )
}

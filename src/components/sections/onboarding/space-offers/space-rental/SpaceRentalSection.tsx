'use client'
import RentalPriceForm, {
  rentalPriceFormSchema,
} from '@/components/forms/rental-price-form/RentalPriceForm'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/hooks/use-toast'
import {
  OnboardingSpaceInfo,
  saveOnboardingSpaceRental,
  SpacePrice,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const spaceRentalFormSchema = z.object({
  price_form: rentalPriceFormSchema,
})

export type SpaceRentalFormType = z.infer<typeof spaceRentalFormSchema>

interface SpaceRentalSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  defaultValues?: SpaceRentalFormType
  completed?: boolean
  refetch: () => void
}

export default function SpaceRentalSection({
  spaceInfo,
  onboardingId,
  defaultValues,
  completed,
  refetch,
}: SpaceRentalSectionProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    formState: { isValid, isDirty },
    handleSubmit,
  } = useForm<SpaceRentalFormType>({
    resolver: zodResolver(spaceRentalFormSchema),
    defaultValues,
  })

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

    return prices
  }

  const saveOnboardingSpaceRentalMutation = useMutation({
    mutationFn: saveOnboardingSpaceRental,
    onSuccess: () => {
      refetch?.()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const onSubmit = (values: SpaceRentalFormType) => {
    saveOnboardingSpaceRentalMutation.mutate({
      space_id: spaceInfo.space_id,
      onboarding_id: onboardingId,
      prices: getPricesObject(values),
      price_modality: values.price_form.price_model?.[0]?.value,
    })
  }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b px-6 max-sm:px-4 pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <EditSpaceSectionLayout.HeaderTitle>
            {t('sections.onboarding.space-rental-title')}
          </EditSpaceSectionLayout.HeaderTitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            type="submit"
            disabled={
              !isValid ||
              !isDirty ||
              saveOnboardingSpaceRentalMutation.isPending
            }
            loading={saveOnboardingSpaceRentalMutation.isPending}
            startAdornment={<Send className="h-4 w-4" />}
          >
            {t('button-actions.submit')}
          </Button>
        </div>
      </div>
      <div className="w-full">
        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.rental-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.rental-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <RentalPriceForm
              info={{
                minHour: spaceInfo.schedule?.min_hour || [],
                maxHour: spaceInfo.schedule?.max_hour || [],
              }}
              defaultValues={defaultValues?.price_form}
              onChange={(value) =>
                setValue('price_form', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>
      </div>
    </form>
  )
}

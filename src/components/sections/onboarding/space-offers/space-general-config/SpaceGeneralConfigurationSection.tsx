'use client'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/lib/hooks/use-toast'
import { SpaceBusinessModel } from '@/lib/utils/consts'
import {
  OnboardingSpaceInfo,
  saveOnboardingSpaceGeneralConfiguration,
  SpacePrice,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Euro, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const spaceGeneralConfigurationFormSchema = z.object({
  business_model: z.string().min(1),
  min_hours: z.string().min(1, 'define-min-hours'),
  cleaning_fee: z.string().optional(),
})

export type SpaceGeneralConfigurationFormType = z.infer<
  typeof spaceGeneralConfigurationFormSchema
>

interface SpaceGeneralConfigurationSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  defaultValues?: SpaceGeneralConfigurationFormType
  completed?: boolean
  refetch: () => void
}

export default function SpaceGeneralConfigurationSection({
  spaceInfo,
  onboardingId,
  defaultValues,
  completed,
  refetch,
}: SpaceGeneralConfigurationSectionProps) {
  const t = useTranslations()

  const {
    setValue,
    watch,
    getValues,
    formState: { isValid, isDirty, errors },
    handleSubmit,
  } = useForm<SpaceGeneralConfigurationFormType>({
    resolver: zodResolver(spaceGeneralConfigurationFormSchema),
    defaultValues,
  })

  const business_model = watch('business_model')

  const saveOnboardingSpaceGeneralConfigurationMutation = useMutation({
    mutationFn: saveOnboardingSpaceGeneralConfiguration,
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

  const onSubmit = (values: SpaceGeneralConfigurationFormType) => {
    saveOnboardingSpaceGeneralConfigurationMutation.mutate({
      space_id: spaceInfo.space_id,
      onboarding_id: onboardingId,
      business_model: (business_model
        ? business_model
        : SpaceBusinessModel.RentalAndPackages) as SpaceBusinessModel,
      min_hours:
        parseInt(values.min_hours || '0') === 0
          ? 1
          : parseInt(values.min_hours),
      cleaning_fee: {
        type: 'cleaning-fee',
        amount: parseInt(values?.cleaning_fee || '0'),
        space: { id: spaceInfo.space_id },
        createdAt: new Date(),
      } as SpacePrice,
    })
  }

  const handleChange =
    (field: keyof SpaceGeneralConfigurationFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.replace(/[.,]/g, '')
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b px-6 max-sm:px-4 pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.general-configuration-title')}
          </OnboardingSectionLayout.Title>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            type="submit"
            disabled={
              !isValid ||
              !isDirty ||
              saveOnboardingSpaceGeneralConfigurationMutation.isPending
            }
            loading={saveOnboardingSpaceGeneralConfigurationMutation.isPending}
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
              {t('sections.onboarding.rental-form.min-hours')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.rental-form.define-min-hours')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <TextInput
              label={t('sections.onboarding.rental-form.min-hours')}
              labelSmall
              required
              data-testid="min_hours"
              placeholder={t('sections.onboarding.rental-form.min-hours')}
              value={getValues('min_hours')}
              onChange={handleChange('min_hours')}
              type="number"
              error={
                errors.min_hours?.message
                  ? t(`error-messages.${errors.min_hours?.message}`)
                  : undefined
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.rental-form.cleaning-fee')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.rental-form.define-cleaning-fee')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <TextInput
              labelSmall
              label={t('sections.onboarding.rental-form.cleaning-fee')}
              data-testid="cleaning_fee"
              placeholder={t('sections.onboarding.rental-form.cleaning-fee')}
              value={getValues('cleaning_fee')}
              onChange={handleChange('cleaning_fee')}
              type="number"
              fixedEndAdornment={
                <div className="px-3 pt-2.5 text-sm">
                  <Euro className="h-4 w-4" />
                </div>
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <div className="col-span-5 flex gap-6 items-center justify-between">
            <div>
              <p className="text-base text-utility-gray-700">
                {t('sections.onboarding.rental-form.business-model-title')}
              </p>
              <p className="font-light text-sm text-utility-gray-600">
                {t('sections.onboarding.rental-form.business-model-subtitle')}
              </p>
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
        </EditSpaceSectionLayout.Container>
      </div>
    </form>
  )
}

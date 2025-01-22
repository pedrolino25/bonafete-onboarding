'use client'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/hooks/use-toast'
import {
  CancelationPolicy,
  OnboardingSpaceInfo,
  saveOnboardingSpaceCancellationPolicy,
} from '@/services/api/onboardings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { CalendarClock, Info, Percent, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'

export const cancelationPolicyFormSchema = z.object({
  base_refund: z.string().min(1),
  late_cancellation_days: z.string().min(1),
  late_cancellation_refund: z.string().min(1),
})

export type CancellationPolicyFormType = z.infer<
  typeof cancelationPolicyFormSchema
>

interface SpaceCancellationPolicySectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  defaultValues?: CancellationPolicyFormType
  completed?: boolean
  showUpdateOnboardingStatus?: boolean
  onUpdateOnboardingStatus?: () => void
  refetch: () => void
}

export default function SpaceCancellationPolicySection({
  spaceInfo,
  onboardingId,
  defaultValues,
  completed,
  showUpdateOnboardingStatus,
  onUpdateOnboardingStatus,
  refetch,
}: SpaceCancellationPolicySectionProps) {
  const t = useTranslations()

  const {
    setValue,
    getValues,
    formState: { isValid, isDirty },
    handleSubmit,
  } = useForm<CancellationPolicyFormType>({
    resolver: zodResolver(cancelationPolicyFormSchema),
    defaultValues,
  })

  const getCancelationPolicyObject = (
    values: CancellationPolicyFormType
  ): CancelationPolicy => {
    return {
      afterConfimation: parseInt(values.base_refund) / 100,
      period: parseInt(values.late_cancellation_days) * 24,
      afterPeriod: parseInt(values.late_cancellation_refund) / 100,
      space: { id: spaceInfo.space_id },
      createdAt: new Date(),
    } as CancelationPolicy
  }

  const saveOnboardingSpaceCancellationPolicyMutation = useMutation({
    mutationFn: saveOnboardingSpaceCancellationPolicy,
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

  const onSubmit = (values: CancellationPolicyFormType) => {
    saveOnboardingSpaceCancellationPolicyMutation.mutate({
      space_id: spaceInfo.space_id,
      onboarding_id: onboardingId,
      cancellation_policy: getCancelationPolicyObject(values),
    })
  }

  const handleChange =
    (field: keyof CancellationPolicyFormType) =>
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
          <EditSpaceSectionLayout.HeaderTitle>
            {t('sections.onboarding.rental-form.cancellation-policy')}
          </EditSpaceSectionLayout.HeaderTitle>
          <EditSpaceSectionLayout.HeaderSubtitle>
            {t('sections.onboarding.rental-form.define-cancellation-policy')}
          </EditSpaceSectionLayout.HeaderSubtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          {showUpdateOnboardingStatus && (
            <Button
              startAdornment={<Info className="h-4 w-4" />}
              color="secondary"
              variant="fill"
              onClick={() => onUpdateOnboardingStatus?.()}
            >
              {t('button-actions.update-needed')}
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              !isValid ||
              (completed && !isDirty) ||
              saveOnboardingSpaceCancellationPolicyMutation.isPending
            }
            loading={saveOnboardingSpaceCancellationPolicyMutation.isPending}
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
              {t('sections.onboarding.base-refund-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.base-refund-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <TextInput
              data-testid="base_refund"
              placeholder={t('sections.onboarding.rental-form.base-refund')}
              value={getValues('base_refund')}
              onChange={handleChange('base_refund')}
              type="number"
              fixedEndAdornment={
                <div className="px-3 pt-2.5 text-sm">
                  <Percent className="h-4 w-4" />
                </div>
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>

        <EditSpaceSectionLayout.Container>
          <EditSpaceSectionLayout.Header>
            <EditSpaceSectionLayout.Title>
              {t('sections.onboarding.cancellation-days-title')}
            </EditSpaceSectionLayout.Title>
            <EditSpaceSectionLayout.Subtitle>
              {t('sections.onboarding.cancellation-days-subtitle')}
            </EditSpaceSectionLayout.Subtitle>
          </EditSpaceSectionLayout.Header>
          <EditSpaceSectionLayout.Content>
            <TextInput
              data-testid="late_cancellation_days"
              placeholder={t(
                'sections.onboarding.rental-form.late-cancellation-days'
              )}
              value={getValues('late_cancellation_days')}
              onChange={handleChange('late_cancellation_days')}
              type="number"
              fixedEndAdornment={
                <div className="px-3 pt-2.5 text-sm">
                  <CalendarClock className="h-4 w-4" />
                </div>
              }
            />
          </EditSpaceSectionLayout.Content>
        </EditSpaceSectionLayout.Container>
      </div>
    </form>
  )
}

'use client'

import SpaceRentalForm from '@/components/forms/space-rental-form/SpaceRentalForm'
import CustomAccordion from '@/components/ui/accordion'
import { OnboardingProcessItemResponse } from '@/services/api/onboarding-processes'
import { useTranslations } from 'next-intl'

interface SpaceRentalSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  completed?: boolean
  refetch: () => void
  disabled?: boolean
}

export default function SpaceRentalSection({
  onboardingInfo,
  refetch,
  disabled,
  completed = false,
}: SpaceRentalSectionProps) {
  const t = useTranslations()

  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title={t('sections.onboarding.general-config')}
        variant="add"
        complete={completed}
      >
        <SpaceRentalForm
          onboardingInfo={onboardingInfo}
          refetch={refetch}
          defaultValues={{
            business_model: onboardingInfo?.space?.business_model || [],
            lotation_form: onboardingInfo?.space?.lotation?.lotation
              ? onboardingInfo?.space?.lotation
              : undefined,
            min_hours_form: onboardingInfo?.space?.min_hours?.min_hours
              ? onboardingInfo?.space?.min_hours
              : undefined,
            schedule_form: onboardingInfo?.space?.schedule,
            cancellation_policy_form: onboardingInfo?.space
              ?.cancellation_policy || {
              base_refund: '50',
              late_cancellation_days: '2',
              late_cancellation_refund: '0',
            },
            price_form: {
              price_model: onboardingInfo?.space?.prices?.priceModel || [],
              fixed_price_form: onboardingInfo?.space?.prices?.fixed,
              flexible_price_form: onboardingInfo?.space?.prices?.flexible,
              custom_price_form: onboardingInfo?.space?.prices?.custom,
            },
          }}
        />
      </CustomAccordion>
    </>
  )
}

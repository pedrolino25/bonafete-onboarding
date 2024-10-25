'use client'

import SpaceExtraForm, {
  SpaceExtraFormType,
} from '@/components/forms/space-extra-form/SpaceExtraForm'
import CustomAccordion from '@/components/ui/accordion'
import { OnboardingProcessItemResponse } from '@/services/api/onboarding-processes'
import { useTranslations } from 'next-intl'

interface SpaceExtraSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  defaultValues?: SpaceExtraFormType
  completed?: boolean
  refetch: () => void
  disabled?: boolean
  title?: string
}
export default function SpaceExtraSection({
  onboardingInfo,
  defaultValues,
  completed,
  refetch,
  disabled,
  title,
}: SpaceExtraSectionProps) {
  const t = useTranslations()

  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title={
          title
            ? t('sections.onboarding.extra')?.replace('$1', title)
            : t('sections.onboarding.add-extra')
        }
        variant="add"
        complete={completed}
      >
        <SpaceExtraForm
          key={title}
          onboardingInfo={onboardingInfo}
          defaultValues={defaultValues}
          refetch={refetch}
        />
      </CustomAccordion>
    </>
  )
}

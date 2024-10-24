'use client'

import SpacePackageForm, {
  SpacePackageFormType,
} from '@/components/forms/space-package-form/SpacePackageForm'
import CustomAccordion from '@/components/ui/accordion'
import { OnboardingProcessItemResponse } from '@/services/api/onboarding-processes'
import { useTranslations } from 'next-intl'

interface SpacePackageSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  defaultValues?: SpacePackageFormType
  completed?: boolean
  refetch: () => void
  disabled?: boolean
  title?: string
}
export default function SpacePackageSection({
  onboardingInfo,
  defaultValues,
  completed,
  refetch,
  disabled,
  title,
}: SpacePackageSectionProps) {
  const t = useTranslations()

  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title={
          title
            ? t('sections.onboarding.package')?.replace('$1', title)
            : t('sections.onboarding.add-package')
        }
        variant="add"
        complete={completed}
      >
        <SpacePackageForm
          onboardingInfo={onboardingInfo}
          defaultValues={defaultValues}
          refetch={refetch}
        />
      </CustomAccordion>
    </>
  )
}

'use client'

import CustomAccordion from '@/components/ui/accordion'
import { useTranslations } from 'next-intl'

interface SpaceExtraSectionProps {
  disabled?: boolean
  open?: boolean
}
export default function SpaceExtraSection({
  disabled,
  open = false,
}: SpaceExtraSectionProps) {
  const t = useTranslations()

  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title={t('sections.onboarding.add-extra')}
        variant="add"
      >
        <div></div>
      </CustomAccordion>
    </>
  )
}

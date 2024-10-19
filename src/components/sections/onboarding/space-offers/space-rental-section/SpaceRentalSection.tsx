'use client'

import SpaceRentalForm from '@/components/forms/space-rental-form/SpaceRentalForm'
import CustomAccordion from '@/components/ui/accordion'
import { useTranslations } from 'next-intl'

interface SpaceRentalSectionProps {
  disabled?: boolean
}

export default function SpaceRentalSection({
  disabled,
}: SpaceRentalSectionProps) {
  const t = useTranslations()

  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title="Aluguer de Espaço"
        variant="add"
      >
        <SpaceRentalForm />
      </CustomAccordion>
    </>
  )
}

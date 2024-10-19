'use client'

import CustomAccordion from '@/components/ui/accordion'
import { useState } from 'react'

interface SpacePackageSectionProps {
  disabled?: boolean
  open?: boolean
}
export default function SpacePackageSection({
  disabled,
  open = false,
}: SpacePackageSectionProps) {
  const [opened, setOpened] = useState<boolean>(open)
  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title="Adicionar Pacote de Festa"
        variant="add"
      >
        <div></div>
      </CustomAccordion>
    </>
  )
}

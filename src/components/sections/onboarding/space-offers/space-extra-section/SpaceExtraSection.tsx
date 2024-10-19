'use client'

import CustomAccordion from '@/components/ui/accordion'
import { useState } from 'react'

interface SpaceExtraSectionProps {
  disabled?: boolean
  open?: boolean
}
export default function SpaceExtraSection({
  disabled,
  open = false,
}: SpaceExtraSectionProps) {
  const [opened, setOpened] = useState<boolean>(open)
  return (
    <>
      <CustomAccordion
        disabled={disabled}
        title="Adicionar Extra"
        variant="add"
      >
        <div></div>
      </CustomAccordion>
    </>
  )
}

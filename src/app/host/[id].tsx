'use client'

import { Navbar } from '@/components/navigation/Navbar'
import { useTranslations } from 'next-intl'

export default function Host() {
  const t = useTranslations()
  return (
    <main>
      <Navbar>
        <p>Host</p>
      </Navbar>
    </main>
  )
}

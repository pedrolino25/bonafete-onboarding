'use client'

import { Navbar } from '@/components/navbar/Navbar'
import { useTranslations } from 'next-intl'

export default function Space() {
  const t = useTranslations()
  return (
    <main>
      <Navbar>
        <p>space</p>
      </Navbar>
    </main>
  )
}

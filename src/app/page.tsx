'use client'

import { Navbar } from '@/components/navigation/Navbar'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations()
  return (
    <main>
      <Navbar></Navbar>
    </main>
  )
}

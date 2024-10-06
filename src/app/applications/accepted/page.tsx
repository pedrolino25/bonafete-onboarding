'use client'

import { Navbar } from '@/components/navbar/Navbar'
import { useTranslations } from 'next-intl'

export default function Applications() {
  const t = useTranslations()
  return (
    <main>
      <Navbar></Navbar>
    </main>
  )
}

'use client'

import { Tabs, TabsTrigger } from '@/components/ui/tabs'
import { TabsList } from '@radix-ui/react-tabs'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export interface TopbarLink {
  title: string
  path: string
}

export interface TopbarProps {
  links?: TopbarLink[]
  children?: ReactNode
}

export function Topbar({ links, children }: TopbarProps) {
  const path = usePathname()
  const t = useTranslations()

  return (
    <div className="w-full h-svh">
      <div className="w-full h-14 border-b-[1px] flex gap-6 justify-center items-center">
        {links && links.length > 0 && (
          <Tabs defaultValue={path} className="w-[400px]">
            <TabsList>
              {links.map((link) => {
                return (
                  <TabsTrigger key={link.path} value={link.path}>
                    <Link id={link.path} href={link.path}>
                      {t(link.title)}
                    </Link>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

'use client'

import { Tabs, TabsTrigger } from '@/components/ui/tabs'
import { TabsList } from '@radix-ui/react-tabs'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
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
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="w-full h-svh">
      <div className="w-full h-14 border-b-[1px] flex gap-6 justify-center items-center overflow-x-auto">
        {links && links.length > 0 && (
          <Tabs defaultValue={path} className="w-fit">
            <TabsList>
              {links.map((link) => {
                return (
                  <TabsTrigger
                    key={link.path}
                    value={link.path}
                    onClick={() => router.push(link.path)}
                  >
                    {t(link.title)}
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

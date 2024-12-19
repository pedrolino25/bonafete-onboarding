import logo from '@/assets/logo.png'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export interface TopbarLink {
  title: string
  path: string
}

export interface TopbarProps {
  links?: TopbarLink[]
  children?: ReactNode
  showIcon?: boolean
  topbarActions?: ReactNode
}

export function Topbar({
  links,
  children,
  showIcon,
  topbarActions,
}: TopbarProps) {
  const path = usePathname()
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="w-svw h-svh">
      <div className="w-full h-14 border-b-[1px] flex items-center">
        {showIcon && (
          <div className="pl-4 max-sm:pr-4 " onClick={() => router.push('/')}>
            <Image
              src={logo}
              alt={'logo-image'}
              priority
              height={40}
              width={40}
              quality={70}
            />
          </div>
        )}
        <div className="w-full h-14 flex items-center justify-center max-sm:justify-start overflow-x-auto">
          <div className="flex gap-6 justify-center items-center max-sm:justify-start">
            {links && links.length > 0 && (
              <Tabs defaultValue={path} className="w-fit">
                <TabsList className="bg-white">
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
        </div>
        {topbarActions && <div className="pr-4">{topbarActions}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

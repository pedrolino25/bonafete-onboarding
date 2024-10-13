import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { handleSignOut } from '@/services/auth'
import { LogOut, LucideIcon, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export interface SidebarLink {
  title: string
  icon: LucideIcon
  path: string
  alias: string
}

export interface SidebarProps {
  links: SidebarLink[]
}

export function Sidebar({ links }: SidebarProps) {
  const path = usePathname()
  const router = useRouter()
  const t = useTranslations()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  const signOut = async () => {
    await handleSignOut()
    router.push('/signin')
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="group justify-between flex flex-col gap-4 transition-all duration-200 ease-out w-[250px] data-[collapsed=true]:w-14 border-r border-1 h-[calc(100svh-3.5rem)]"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div>
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 pt-2">
          {links.map((link, index) =>
            isCollapsed ? (
              <Link
                key={`${link.path}-${index}`}
                href={link.path}
                className={cn(
                  buttonVariants({
                    variant: path.includes(link.alias) ? 'fill' : 'ghost',
                    size: 'md',
                  }),
                  !path.includes(link.alias)
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="sr-only">{t(link.title)}</span>
              </Link>
            ) : (
              <Link
                key={`${link.path}-${index}`}
                href={link.path}
                className={cn(
                  buttonVariants({
                    variant: path.includes(link.alias) ? 'fill' : 'ghost',
                    size: 'md',
                  }),
                  !path.includes(link.alias),
                  'justify-start text-sm font-medium'
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {t(link.title)}
              </Link>
            )
          )}
        </nav>
      </div>
      <div className="px-2 py-4">
        <Button
          className="text-sm font-medium w-full mb-2"
          color="secondary"
          size="xs"
          startAdornment={!isCollapsed && <Settings className="h-4 w-4" />}
        >
          {isCollapsed ? (
            <Settings className="h-4 w-4" />
          ) : (
            <>{t('navigation.manage-users')}</>
          )}
        </Button>
        <Button
          className="w-full text-sm font-medium"
          color="secondary"
          size="xs"
          onClick={signOut}
          startAdornment={!isCollapsed && <LogOut className="h-4 w-4" />}
        >
          {isCollapsed ? (
            <LogOut className="h-4 w-4" />
          ) : (
            <>{t('signin.logout')}</>
          )}
        </Button>
      </div>
    </div>
  )
}

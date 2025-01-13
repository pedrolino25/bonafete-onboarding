'use client'
import logo from '@/assets/logo.png'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { routes } from '@/routes'
import { handleSignOut } from '@/services/auth'

import { ChevronRight, ChevronsUpDown, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'

interface NavbarProps {
  children?: ReactNode
  topbarActions?: ReactNode
}
export function Navbar({ children, topbarActions }: NavbarProps) {
  const path = usePathname()
  const router = useRouter()
  const t = useTranslations()

  const signOut = async () => {
    await handleSignOut()
    router.push('/signin')
  }

  const getNavigationOptions = () => {
    const items = routes?.flatMap((route) => route.links)
    const alias = items
      ?.flatMap((route) => route.childrens)
      ?.find((item) => item?.path === path)?.alias
    if (alias) {
      const childrens = items?.find((item) => item.alias === alias)?.childrens
      if (childrens && childrens?.length > 0) {
        return {
          context: items.find((item) => item.alias === alias)?.title,
          list: childrens?.map((children) => {
            return {
              path: children.path,
              title: children.title,
              isActive: children.path === path,
            }
          }),
        }
      }
    }
    return undefined
  }

  const navigationOptions = getNavigationOptions()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <a href="/">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <Image
                  src={logo}
                  alt={'logo-image'}
                  priority
                  height={40}
                  width={40}
                  quality={70}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{t('company')}</span>
                <span className="truncate text-xs">{t('app-name')}</span>
              </div>
            </SidebarMenuButton>
          </a>
        </SidebarHeader>
        <SidebarContent>
          {routes.map((route) => (
            <SidebarGroup>
              {route.title && (
                <SidebarGroupLabel>{t(route.title)}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {route.links.map((item) => (
                    <>
                      {item.childrens && item.childrens.length > 0 ? (
                        <Collapsible
                          key={item.path}
                          asChild
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={t(item.title)}>
                                {item.icon && <item.icon />}
                                <span>{t(item.title)}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.childrens?.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.path}>
                                    <SidebarMenuSubButton asChild>
                                      <a href={subItem.path}>
                                        <span>{t(subItem.title)}</span>
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      ) : (
                        <SidebarMenuItem key={t(item.path)}>
                          <SidebarMenuButton asChild>
                            <a href={item.path}>
                              <item.icon />
                              <span>{t(item.title)}</span>
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuButton tooltip={t('signin.logout')} onClick={signOut}>
            <LogOut className="h-4 w-4" />
            <span>{t('signin.logout')}</span>
          </SidebarMenuButton>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <main className="w-full">
        <div
          className={cn(
            'w-full flex justify-between items-center border-b h-12'
          )}
        >
          <div className={cn('flex items-center w-full justify-between')}>
            <div className={cn('flex items-center')}>
              <SidebarTrigger />
              {navigationOptions && (
                <div className="flex items-center">
                  <span className="text-sm">
                    {t(navigationOptions.context)}
                  </span>
                  <Separator orientation="vertical" className="ml-2 h-[30px]" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                      >
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {t(
                              navigationOptions.list?.find(
                                (item) => item.isActive
                              )?.title
                            )}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                      align="start"
                      side={'bottom'}
                      sideOffset={4}
                    >
                      {navigationOptions.list.map((item) => {
                        return (
                          <a href={item.path}>
                            <DropdownMenuItem
                              key={item.path}
                              className="gap-2 p-2"
                            >
                              {t(item.title)}
                            </DropdownMenuItem>
                          </a>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            {topbarActions && <div className="pr-1">{topbarActions}</div>}
          </div>
        </div>
        <div className={cn('w-full overflow-auto')}>{children}</div>
      </main>
    </SidebarProvider>
  )
}

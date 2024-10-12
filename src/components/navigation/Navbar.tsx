'use client'
import { routes } from '@/routes'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Sidebar } from './sidebar/Sidebar'
import { Topbar } from './topbar/Topbar'

interface NavbarProps {
  children?: ReactNode
  showIcon?: boolean
  hideSideBar?: boolean
  topbarActions?: ReactNode
}

export function Navbar({
  children,
  showIcon = true,
  hideSideBar = false,
  topbarActions,
}: NavbarProps) {
  const path = usePathname()
  return (
    <Topbar
      showIcon={showIcon}
      topbarActions={topbarActions}
      links={
        path.includes('/applications')
          ? routes.applications
          : path.includes('/hosts')
          ? routes.hosts
          : path.includes('/processes')
          ? routes.processes
          : path.includes('/spaces')
          ? routes.spaces
          : undefined
      }
    >
      <div className="flex">
        {!hideSideBar && <Sidebar links={routes.sidebar} />}
        <div className="w-full">{children}</div>
      </div>
    </Topbar>
  )
}

'use client'
import { routes } from '@/routes'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Sidebar } from './sidebar/Sidebar'
import { Topbar } from './topbar/Topbar'

interface NavbarProps {
  children?: ReactNode
}

export function Navbar({ children }: NavbarProps) {
  const path = usePathname()
  return (
    <div className="w-svw h-svh flex">
      <Sidebar links={routes.sidebar} />
      <Topbar
        links={
          path.includes('applications')
            ? routes.applications
            : path.includes('hosts')
            ? routes.hosts
            : path.includes('processes')
            ? routes.processes
            : path.includes('spaces')
            ? routes.spaces
            : undefined
        }
      >
        {children}
      </Topbar>
    </div>
  )
}

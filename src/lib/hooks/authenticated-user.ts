'use client'

import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'
import { useEffect, useState } from 'react'

interface AuthenticatedUser {
  id: string
  email: string
  name: string
  locale?: string
}

export default function useAuthenticatedUser() {
  const [user, setUser] = useState<AuthenticatedUser>()

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      const currentUser = getCookie(Cookies.CURRENT_USER_COOKIE)
      if (currentUser) {
        setUser(JSON.parse(currentUser))
      }
    }
    getAuthenticatedUser()
  }, [])

  return user
}

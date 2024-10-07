'use client'

import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

interface AuthenticatedUser {
  id: string
  email: string
  name: string
  locale?: string
}

export default function useAuthenticatedUser() {
  const currentUser = getCookie(Cookies.CURRENT_USER_COOKIE)
  if (currentUser) {
    return JSON.parse(currentUser)
  }
}

'use client'

import { Cookies } from '@/services/auth'
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from 'aws-amplify/auth'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthenticatedUser {
  user: UserInfo
  jwt: string
}

interface UserInfo {
  id: string
  email: string
  name: string
  locale?: string
}

const fetchAuthenticatedUser = async (): Promise<
  AuthenticatedUser | undefined
> => {
  try {
    const [session, currentUser, userAttributes] = await Promise.all([
      fetchAuthSession({ forceRefresh: true }),
      getCurrentUser(),
      fetchUserAttributes(),
    ])

    if (
      !session.tokens?.accessToken ||
      !currentUser.userId ||
      !userAttributes.email_verified
    ) {
      return undefined
    }

    return {
      user: {
        id: currentUser.userId,
        email: userAttributes.email || '',
        name: userAttributes.name || '',
        locale: userAttributes.locale,
      },
      jwt: session.tokens.accessToken.toString(),
    }
  } catch (error) {
    console.error('Error fetching authenticated user:', error)
    return undefined
  }
}

const AuthenticatedUserContext = createContext<UserInfo>({} as UserInfo)

export const useAuthenticatedUser = (): UserInfo => {
  return useContext(AuthenticatedUserContext)
}

export const AuthenticatedUserProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserInfo>({} as UserInfo)

  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = getCookie(Cookies.CURRENT_USER_COOKIE)
      let currentUser: UserInfo | undefined
      if (storedUser) {
        currentUser = JSON.parse(storedUser as string) as UserInfo
        setUser(currentUser)
      } else {
        const authenticatedUser = await fetchAuthenticatedUser()

        if (authenticatedUser) {
          setCookie(Cookies.SESSION_COOKIE, authenticatedUser.jwt, {
            httpOnly: true,
            path: '/',
          })
          setCookie(
            Cookies.CURRENT_USER_COOKIE,
            JSON.stringify(authenticatedUser.user),
            {
              path: '/',
            }
          )
          setCookie(Cookies.NEXT_LOCALE, authenticatedUser.user.locale || '', {
            path: '/',
          })
          currentUser = authenticatedUser.user
          setUser(authenticatedUser.user)
        } else {
          deleteCookie(Cookies.SESSION_COOKIE)
          deleteCookie(Cookies.CURRENT_USER_COOKIE)
          setUser({} as UserInfo)
        }
      }

      const isProtectedPath = !pathname.startsWith('/signin')
      const isAdmin = currentUser?.email.includes('@bonafete.com')

      if (currentUser && isAdmin && pathname.startsWith('/signin')) {
        router.push('/')
        return
      }

      if (isProtectedPath && (!currentUser || !isAdmin)) {
        router.push('/signin')
      }
    }
    initializeUser()
  }, [router, pathname])

  return (
    <AuthenticatedUserContext.Provider value={user}>
      {((user && user.id) || pathname.startsWith('/signin')) && children}
    </AuthenticatedUserContext.Provider>
  )
}

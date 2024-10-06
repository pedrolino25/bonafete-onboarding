import { type NextRequest, NextResponse } from 'next/server'
import { AuthenticatedUser, getAuthenticatedUser } from './lib/amplify-server'

export enum Cookies {
  SESSION_COOKIE = 'session',
  NEXT_LOCALE = 'NEXT_LOCALE',
  CURRENT_USER_COOKIE = 'bonafete_user',
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const authenticatedUser = await getAuthenticatedUser({
    request,
    response,
  })

  if (authenticatedUser) {
    response.cookies.set({
      name: Cookies.SESSION_COOKIE,
      value: authenticatedUser.jwt,
      httpOnly: true,
      path: '/',
    })
    response.cookies.set({
      name: Cookies.CURRENT_USER_COOKIE,
      value: JSON.stringify(authenticatedUser.user as AuthenticatedUser),
      path: '/',
    })
    response.cookies.set({
      name: Cookies.NEXT_LOCALE,
      value: authenticatedUser.user.locale,
      path: '/',
    })
  } else {
    response.cookies.delete(Cookies.SESSION_COOKIE)
    response.cookies.delete(Cookies.CURRENT_USER_COOKIE)
  }

  const isProtectedPath = !request.nextUrl.pathname.startsWith('/signin')
  const isAdmin = authenticatedUser?.user.email.includes('@bonafete.com')

  if (
    authenticatedUser &&
    isAdmin &&
    request.nextUrl.pathname.startsWith('/signin')
  ) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (isProtectedPath && (!authenticatedUser || !isAdmin)) {
    return NextResponse.redirect(new URL('/signin', request.nextUrl))
  }

  return response
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { Cookies } from './middleware'

const LOCALES = ['pt', 'es', 'en']
const DEFAULT_LOCALE = 'pt'

export default getRequestConfig(async () => {
  let browserLanguage = headers().get('accept-language')?.substring(0, 2)

  browserLanguage = LOCALES.includes(browserLanguage as string)
    ? browserLanguage
    : undefined

  const locale =
    cookies().get(Cookies.NEXT_LOCALE)?.value ||
    browserLanguage ||
    DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  }
})

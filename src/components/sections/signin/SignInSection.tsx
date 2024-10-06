import logo from '@/assets/logo.png'
import img from '@/assets/signin-img.jpg'
import SignInForm from '@/components/forms/signin/SignInForm'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
export default function SignInSection() {
  const t = useTranslations()

  return (
    <main className="h-svh w-svw flex">
      <div className="hidden sm:block h-svh w-0 sm:w-1/2 relative">
        <Image src={img} alt={'signin-image'} fill objectFit="cover" />
        <div className="hidden sm:block h-svh w-0 sm:w-full absolute top-0 bg-black opacity-40"></div>
        <div className="hidden sm:block h-svh w-0 sm:w-full absolute top-0">
          <div className="h-svh w-full flex items-center justify-center px-6">
            <h1 className="text-utility-gray-100 font-extrabold text-5xl text-center pb-2 m-auto">
              {t('signin.title')}
            </h1>
          </div>
        </div>
      </div>
      <div className="h-svh sm:min-w-[400px] w-full sm:w-1/2 flex items-center justify-center">
        <div className="w-full sm:w-96">
          <Image
            src={logo}
            alt={'logo-image'}
            height={70}
            width={70}
            className="m-auto pb-4"
          />
          <p className="text-utility-gray-500 font-light text-sm text-center pb-4">
            {t('signin.subtitle')}
          </p>
          <SignInForm />
        </div>
      </div>
    </main>
  )
}

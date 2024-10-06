import SignInSection from '@/components/sections/signin/SignInSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar',
}

export default function SignIn() {
  return <SignInSection />
}

'use client'

import { ErrorMessage } from '@/components/alerts/ErrorMessage'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { Button } from '@/components/ui/button'
import { handleSignInWithEmailPassword } from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function SignInForm() {
  const t = useTranslations()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string>()

  const signInFormSchema = z.object({
    email: z
      .string()
      .email({ message: t('signin.errors.invalid-email-format') })
      .min(1, { message: t('signin.errors.empty-email') }),
    password: z.string().min(1, { message: t('signin.errors.empty-password') }),
  })

  type SignInFormType = z.infer<typeof signInFormSchema>

  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInFormSchema),
  })

  const handleChange =
    (field: keyof SignInFormType) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
    }

  const onSubmit = async (values: SignInFormType) => {
    setErrorMessage(undefined)

    const { error } = await handleSignInWithEmailPassword(
      values.email,
      values.password
    )
    if (error) {
      setErrorMessage(t('signin.errors.invalid-email-passord'))
    } else {
      router.push('/')
    }
  }

  return (
    <div className="w-full py-5 px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-rows-1 gap-y-5"
      >
        <TextInput
          placeholder={t('signin.email')}
          value={getValues('email')}
          onChange={handleChange('email')}
          error={errors.email?.message}
        />
        <TextInput
          placeholder={t('signin.password')}
          type="password"
          value={getValues('password')}
          onChange={handleChange('password')}
          error={errors.password?.message}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Button type="submit">{t('signin.submit')}</Button>
      </form>
    </div>
  )
}

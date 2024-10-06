import {
  ConfirmSignUpOutput,
  ResendSignUpCodeOutput,
  ResetPasswordOutput,
  SignInOutput,
  SignUpOutput,
  confirmResetPassword,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
  updateUserAttribute,
} from 'aws-amplify/auth'

interface AuthResponse {
  ok: boolean
  data?: unknown
  error?: unknown
}

export enum Attributes {
  NAME = 'name',
  LOCALE = 'locale',
  CURRENCY = 'zoneinfo',
}

export const handleSignUpWithEmailPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { userId }: SignUpOutput = await signUp({
      username: email.toLowerCase(),
      password,
    })
    return { ok: !!userId, data: { userId } }
  } catch (error) {
    return { ok: false, error }
  }
}

export const handleConfirmSignUp = async (
  email: string,
  confirmationCode: string
): Promise<AuthResponse> => {
  try {
    const { isSignUpComplete, userId }: ConfirmSignUpOutput =
      await confirmSignUp({
        username: email.toLowerCase(),
        confirmationCode,
      })
    return { ok: isSignUpComplete, data: { userId } }
  } catch (error) {
    return { ok: false, error }
  }
}

export const handleResendConfirmationCode = async (
  email: string
): Promise<AuthResponse> => {
  try {
    const { destination }: ResendSignUpCodeOutput = await resendSignUpCode({
      username: email.toLowerCase(),
    })
    return { ok: !!destination, data: { destination } }
  } catch (error) {
    return { ok: false, error }
  }
}

export const handleResetPassword = async (
  email: string
): Promise<AuthResponse> => {
  try {
    const { isPasswordReset }: ResetPasswordOutput = await resetPassword({
      username: email.toLowerCase(),
    })
    return { ok: isPasswordReset }
  } catch (error) {
    return { ok: false, error }
  }
}

export const handleConfirmResetPassword = async (
  email: string,
  newPassword: string,
  confirmationCode: string
): Promise<AuthResponse> => {
  try {
    await confirmResetPassword({
      username: email.toLowerCase(),
      newPassword,
      confirmationCode,
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

export const handleSignInWithEmailPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { isSignedIn }: SignInOutput = await signIn({
      username: email.toLowerCase(),
      password,
    })
    return { ok: isSignedIn }
  } catch (error) {
    return { ok: false, error }
  }
}

export const handleSignOut = async (): Promise<AuthResponse> => {
  try {
    await signOut()
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

interface UserAtributes {
  name?: string
  locale?: string
  currency?: string
}
export const handleUpdateUserAttributes = async ({
  name,
  locale,
  currency,
}: UserAtributes): Promise<AuthResponse> => {
  try {
    await Promise.all([
      name &&
        updateUserAttribute({
          userAttribute: {
            attributeKey: Attributes.NAME,
            value: name,
          },
        }),
      locale &&
        updateUserAttribute({
          userAttribute: {
            attributeKey: Attributes.LOCALE,
            value: locale,
          },
        }),
      currency &&
        updateUserAttribute({
          userAttribute: {
            attributeKey: Attributes.CURRENCY,
            value: currency,
          },
        }),
    ])
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

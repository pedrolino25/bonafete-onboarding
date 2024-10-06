import { NextServer, createServerRunner } from '@aws-amplify/adapter-nextjs'
import { AmplifyServer } from 'aws-amplify/adapter-core'
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from 'aws-amplify/auth/server'
import { authConfig } from './amplify-config'

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: authConfig,
  },
})

export interface AuthenticatedUser {
  id: string
  email: string
  locale: string
  currency: string
  name?: string
}

export interface ServerAuthenticatedUser {
  user: AuthenticatedUser
  jwt: string
}

export const getAuthenticatedUser = async (context: NextServer.Context) => {
  let userSession: ServerAuthenticatedUser | undefined
  await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec: AmplifyServer.ContextSpec) => {
      try {
        const data = await Promise.all([
          fetchAuthSession(contextSpec, {
            forceRefresh: true,
          }),
          getCurrentUser(contextSpec),
          fetchUserAttributes(contextSpec),
        ])
        const session = data[0]
        const currentUser = data[1]
        const userAttributes = data[2]

        if (
          !session.tokens ||
          !session.tokens.accessToken ||
          !currentUser.userId ||
          !userAttributes.email_verified
        ) {
          return
        }

        userSession = {
          user: {
            id: currentUser.userId as string,
            email: userAttributes.email as string,
            name: userAttributes.name,
            locale: userAttributes.locale,
            currency: userAttributes.zoneinfo || 'EUR',
          } as AuthenticatedUser,
          jwt: session.tokens.accessToken.toString(),
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
  })
  return userSession
}

'use client'

import { Amplify, type ResourcesConfig } from 'aws-amplify'

export const authConfig: ResourcesConfig['Auth'] = {
  Cognito: {
    identityPoolId: String(process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID),
    userPoolId: String(process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID),
    userPoolClientId: String(
      process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID
    ),
  },
}

export const storageConfig: ResourcesConfig['Storage'] = {
  S3: {
    bucket: String(process.env.NEXT_PUBLIC_AWS_STORAGE_BUCKET), // Your S3 bucket name
    region: String(process.env.NEXT_PUBLIC_AWS_REGION), // Your S3 bucket region
  },
}

Amplify.configure(
  {
    Auth: authConfig,
    Storage: storageConfig,
  },
  { ssr: true }
)

export default function ConfigureAmplifyClientSide() {
  return null
}

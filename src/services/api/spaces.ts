import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface SpaceListItemResponse {
  id: string
  name: string
  business_model: string
  targets: string[]
  created_at: string
  type: string
  host_name: string
  host_id: string
  locality: string
}

export enum SpaceStatus {
  Pending = 'pending',
  Active = 'published',
  Archived = 'archived',
}

const getSpacesListByStatus = async (
  status: SpaceStatus
): Promise<SpaceListItemResponse[]> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/spaces-list?status=${status}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
      },
    }
  )
  return response.json()
}

const verifySpaceTitle = async (title: string, id: string): Promise<string> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/verify-space-title?url=${title}&id=${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
      },
    }
  )
  return response.json()
}

export { getSpacesListByStatus, verifySpaceTitle }

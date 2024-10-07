import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface ApplicationsListItemResponse {
  id: string
  name: string
  phone: string
  email: string
  locality: string
  type: string
  targets: string[]
  status: ApplicationStatus.New
  max_of_persons: string
  business_model: string
  photos: string[]
  createdAt: string
}

export enum ApplicationStatus {
  New = 'new',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

const getApplicationsListByStatus = async (
  status: ApplicationStatus
): Promise<ApplicationsListItemResponse[]> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/applications-list?status=${status}`,
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

export { getApplicationsListByStatus }

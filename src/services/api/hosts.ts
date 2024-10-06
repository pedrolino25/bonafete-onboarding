import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface HostsListItemResponse {
  id: string
  account_id: string
  name: string
  email: string
  phone: string
  locality: string
  business_type: string
  created_at: string
}

export enum HostsStatus {
  Pending = 'pending',
  Active = 'completed',
  Archived = 'archived',
  Suspended = 'suspended',
}

const getHostsListByStatus = async (
  status: HostsStatus
): Promise<HostsListItemResponse[]> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/hosts-list?status=${status}`,
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

export { getHostsListByStatus }

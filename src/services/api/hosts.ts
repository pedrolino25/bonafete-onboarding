import { getCookie } from 'cookies-next'
import { Cookies } from '../auth'
import { HostStatus } from './onboardings'
import { SpaceStatus } from './spaces'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface HostsListItemResponse {
  id: string
  account_id: string
  name: string
  email: string
  phone: string
  locality: string
  business_type: string
  onboarding_id: string
  status: HostStatus
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

export interface SpaceInfoResponse {
  id: string
  title?: string
  url?: string
  max_persons?: number
  status?: SpaceStatus
  business_model?: string
  photos?: string[]
}

interface HostInfoResponse {
  id: string
  account_id: string
  type: string
  name: string
  email: string
  phone: string
  picture: string
  status: HostStatus
  spaces: SpaceInfoResponse[]
}

const getHostInfo = async (id: string): Promise<HostInfoResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/host-info?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

export { getHostInfo, getHostsListByStatus }

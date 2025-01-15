import { getCookie } from 'cookies-next'
import { Cookies } from '../auth'

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
  Draft = 'draft',
}

const getSpacesListByStatus = async (
  status: SpaceStatus
): Promise<SpaceListItemResponse[]> => {
  const response = await fetch(`${ROOT}/api/space/list?status=${status}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

const verifySpaceTitle = async (title: string, id: string): Promise<string> => {
  const response = await fetch(
    `${ROOT}/api/space/verify-title?url=${title}&id=${id}`,
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

interface CreateSpaceProps {
  host_id: string
}

const createSpace = async (
  data: CreateSpaceProps
): Promise<SpaceListItemResponse> => {
  const response = await fetch(`${ROOT}/api/space/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface UpdateSpaceStatusProps {
  id: string
  status: SpaceStatus
}

const updateSpaceStatus = async (
  data: UpdateSpaceStatusProps
): Promise<SpaceListItemResponse> => {
  const response = await fetch(`${ROOT}/api/space/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export {
  createSpace,
  getSpacesListByStatus,
  updateSpaceStatus,
  verifySpaceTitle,
}

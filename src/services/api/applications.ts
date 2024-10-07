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
  assigned_user_name: string
  assigned_user_email: string
  assigned_user_id: string
  schedule_date: string
  createdAt: string
}

export enum ApplicationStatus {
  New = 'new',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Scheduled = 'scheduled',
  Completed = 'completed',
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

interface AcceptApplicationProps {
  id: string
  userId?: string
}

const acceptApplication = async (
  data: AcceptApplicationProps
): Promise<ApplicationsListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/application/accept`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface RejectApplicationProps {
  id: string
}

const rejectApplication = async (
  data: RejectApplicationProps
): Promise<ApplicationsListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/application/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface ReasignApplicationProps {
  id: string
  userId: string
}

const reasignApplication = async (
  data: ReasignApplicationProps
): Promise<ApplicationsListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/application/reasign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface ScheduleApplicationProps {
  id: string
  scheduleDate: Date
}

const scheduleApplication = async (
  data: ScheduleApplicationProps
): Promise<ApplicationsListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/application/schedule`, {
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
  acceptApplication,
  getApplicationsListByStatus,
  reasignApplication,
  rejectApplication,
  scheduleApplication,
}

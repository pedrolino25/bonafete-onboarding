import { getCookie } from 'cookies-next'
import { Cookies } from '../auth'
import { OnboardingProcessListItemResponse } from './onboardings'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface ApplicationsListItemResponse {
  id: string
  lead_id: string
  name: string
  phone: string
  email: string
  locality: string
  type: string
  targets: string[]
  status: ApplicationStatus
  application_type: string
  max_of_persons: string
  business_model: string
  photos: string[]
  offers: string[]
  kyc: string[]
  assigned_user_name: string
  assigned_user_email: string
  assigned_user_id: string
  schedule_date: string
  createdAt: string
}

export enum ApplicationStatus {
  Spontaneous = 'spontaneous',
  Sent = 'sent',
  Ready = 'ready',
  Onboarding = 'onboarding',
  Scheduled = 'scheduled',
  Completed = 'completed',
}

const getApplicationsListByStatus = async (
  status: ApplicationStatus
): Promise<ApplicationsListItemResponse[]> => {
  const response = await fetch(
    `${ROOT}/api/application/list?status=${status}`,
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
  const response = await fetch(`${ROOT}/api/application/accept`, {
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
  const response = await fetch(`${ROOT}/api/application/reject`, {
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
  const response = await fetch(`${ROOT}/api/application/reasign`, {
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
  const response = await fetch(`${ROOT}/api/application/schedule`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface StartOnboardingProcessProps {
  applicationId: string
  userId: string
}
const startOnboardingProcess = async (
  data: StartOnboardingProcessProps
): Promise<OnboardingProcessListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface UserApplicationsResponse {
  id: string
  lead_id: string
  email: string
  locality: string
  maxOfPersons: string
  businessModel: string
  targets: string
  type: string
  status: string
  photos?: string
  offers?: string
}

const getUserApplications = async (
  email: string
): Promise<UserApplicationsResponse> => {
  const response = await fetch(
    `${ROOT}/api/application/user-applications?email=${email}`,
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

interface CreateApplicationParams {
  id?: string
  lead_id: string
  email: string
  locality: string
  maxOfPersons: string
  businessModel: string
  targets: string
  type: string
  status?: string
  photos?: string
  offers?: string
}

const submitApplication = async (
  data: CreateApplicationParams
): Promise<UserApplicationsResponse> => {
  const response = await fetch(`${ROOT}/api/application/submit`, {
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
  getUserApplications,
  reasignApplication,
  rejectApplication,
  scheduleApplication,
  startOnboardingProcess,
  submitApplication,
}

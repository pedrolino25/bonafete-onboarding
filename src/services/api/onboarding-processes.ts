import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface OnboardingProcessListItemResponse {
  id: string
  name: string
  phone: string
  email: string
  status: string
  fase1: string
  fase2: string
  fase3: string
  fase4: string
  assigned_user_name: string
  assigned_user_email: string
  assigned_user_id: string
  schedule_date: string
  created_at: string
}

export enum ApplicationOnboardingStatus {
  InProgress = 'progress',
  Completed = 'completed',
  Scheduled = 'scheduled',
  Archived = 'archived',
}

const getOnboardingsProcessesListByStatus = async (
  status: ApplicationOnboardingStatus
): Promise<OnboardingProcessListItemResponse[]> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/processes-list?status=${status}`,
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

interface ArchiveOnboardingProcessProps {
  id: string
}

const archiveOnboardingProcess = async (
  data: ArchiveOnboardingProcessProps
): Promise<OnboardingProcessListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/archive`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface ReasignOnboardingProcessProps {
  id: string
  userId: string
}

const reasignOnboardingProcess = async (
  data: ReasignOnboardingProcessProps
): Promise<OnboardingProcessListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/reasign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface ScheduleOnboardingProcessProps {
  id: string
  scheduleDate: Date
}

const scheduleOnboardingProcess = async (
  data: ScheduleOnboardingProcessProps
): Promise<OnboardingProcessListItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/schedule`, {
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
  archiveOnboardingProcess,
  getOnboardingsProcessesListByStatus,
  reasignOnboardingProcess,
  scheduleOnboardingProcess,
}

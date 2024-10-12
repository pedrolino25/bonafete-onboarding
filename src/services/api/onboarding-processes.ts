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
  fase5: string
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

export interface ApplicationSpaceType {
  id: string
  label: string
}

export interface ApplicationSpaceTarget {
  id: string
  label: string
  url: string
}

export interface OnboardingSpaceConveniences {
  id: string
  label: string
}

export interface OnboardingSpaceInfo {
  space_id: string
  max_of_persons?: number
  photos?: string[]
  targets?: ApplicationSpaceTarget[]
  type?: ApplicationSpaceType
  conveniences?: OnboardingSpaceConveniences[]
  title?: string
  tour?: string
  description?: string
  allow_pets?: string
  allow_alcool?: string
  allow_smoking?: string
  allow_high_sound?: string
  has_security_cameras?: string
  rules?: string
  street?: string
  postal?: string
  locality?: string
  city?: string
  latitude?: number
  longitude?: number
}

export interface ApplicationSpaceInfo {
  max_of_persons: number
  photos: string[]
  targets: ApplicationSpaceTarget[]
  type: ApplicationSpaceType
}

export interface OnboardingProcessItemResponse {
  id: string
  status: string
  fase1: string
  fase2: string
  fase3: string
  fase4: string
  fase5: string
  schedule_date: string
  created_at: string
  application: ApplicationSpaceInfo
  space: OnboardingSpaceInfo
}

const getOnboardingProcessesById = async (
  id: string
): Promise<OnboardingProcessItemResponse> => {
  const response = await fetch(`${ROOT}/api/onboarding/process?id=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

interface SaveOnboardingIntroProps {
  id: string
}

const saveOnboardingIntro = async (
  data: SaveOnboardingIntroProps
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/intro`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface ListItem {
  id: string
  label: string
}

export interface SaveOnboardingSpaceInfoProps {
  onboarding_id: string
  type?: ListItem
  targets?: ListItem[]
  conveniences?: ListItem[]
  title?: string
  tour?: string
  description?: string
  allow_pets?: string
  allow_alcool?: string
  allow_smoking?: string
  allow_high_sound?: string
  has_security_cameras?: string
  rules?: string
  street?: string
  postal?: string
  locality?: string
  city_id?: string
  city?: string
  latitude?: number
  longitude?: number
}

const saveOnboardingSpaceInfo = async (
  data: SaveOnboardingSpaceInfoProps
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface SaveOnboardingSpacePhotosProps {
  onboarding_id: string
  photos?: string[]
}

const saveOnboardingSpacePhotos = async (
  data: SaveOnboardingSpacePhotosProps
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-photos`, {
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
  getOnboardingProcessesById,
  getOnboardingsProcessesListByStatus,
  reasignOnboardingProcess,
  saveOnboardingIntro,
  saveOnboardingSpaceInfo,
  saveOnboardingSpacePhotos,
  scheduleOnboardingProcess,
}

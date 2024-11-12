import { CancelationPolicyFormType } from '@/components/forms/cancelation-policy-form/CancelationPolicyForm'
import { CleaningFeeFormType } from '@/components/forms/cleaning-fee-form/CleaningFeeForm'
import { LotationFormType } from '@/components/forms/lotation-form/LotationForm'
import { MinimumHoursFormType } from '@/components/forms/minimum-hours-form/MinimumHoursForm'
import { CustomPriceFormType } from '@/components/forms/rental-price-form/custom-price-form/CustomPriceForm'
import { FixedPriceFormType } from '@/components/forms/rental-price-form/fixed-price-form/FixedPriceForm'
import { FlexiblePriceFormType } from '@/components/forms/rental-price-form/flexible-price-form/FlexiblePriceForm'
import { ScheduleFormType } from '@/components/forms/schedule-form/ScheduleForm'
import { SpacePackageFormType } from '@/components/forms/space-package-form/SpacePackageForm'
import { SpaceServiceFormType } from '@/components/forms/space-service-form/SpaceServiceForm'
import {
  OnboardingFaseStatus,
  OnboardingSections,
} from '@/components/sections/onboarding/OnboardingSection'
import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface OnboardingProcessListItemResponse {
  id: string
  name: string
  phone: string
  email: string
  status: string
  fase_order: string
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
  host_id: string
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
  lotation?: LotationFormType
  min_hours?: MinimumHoursFormType
  business_model?: { value: string; label: string }[]
  cancellation_policy?: CancelationPolicyFormType
  schedule?: ScheduleFormType
  prices?: {
    priceModel?: { value: string; label: string }[]
    cleaningFee?: CleaningFeeFormType
    fixed?: FixedPriceFormType
    flexible?: FlexiblePriceFormType
    custom?: CustomPriceFormType
  }
  packages?: SpacePackageFormType[]
  services?: SpaceServiceFormType[]
}

export interface ApplicationSpaceInfo {
  max_of_persons: number
  photos: string[]
  targets: ApplicationSpaceTarget[]
  type: ApplicationSpaceType
}

interface OnboardingHostInfo {
  first_name: string
  last_name: string
  birth_date: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  nif: string
  company_type: { value: string; label: string }[]
  company_name?: string
  company_phone?: string
  company_email?: string
  company_address?: string
  company_city?: string
  company_postal_code?: string
  account_owner: string
  account_token: string
  iban: string
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
  host?: OnboardingHostInfo
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

export interface UpdateOnboardingStatusProps {
  onboarding_id: string
  flow: OnboardingSections
  status: OnboardingFaseStatus
}

const updateOnboardingStatus = async (
  data: UpdateOnboardingStatusProps
): Promise<unknown> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/process/update-onboarding-status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
      },
      body: JSON.stringify(data),
    }
  )
  return response.json()
}

export interface SpacePrice {
  type: string
  amount: number
  amountAfter?: number
  duration?: number
  timeStart?: string
  timeEnd?: string
  space: { id: string }
  createdAt: Date
}

export interface SpaceSchedule {
  weekDay: string
  timeStart: string
  timeEnd: string
  space: { id: string }
  createdAt: Date
}

export interface CancelationPolicy {
  afterConfimation: number
  period: number
  afterPeriod: number
  space: { id: string }
  createdAt: Date
}

export interface UpdateSpaceOffersRentalParameters {
  onboarding_id: string
  business_model: string
  prices: SpacePrice[]
  price_modality: string
  cancellation_policy: CancelationPolicy
  lotation?: number
  min_hours?: number
  schedule?: SpaceSchedule[]
}

const updateSpaceOffersRental = async (
  data: UpdateSpaceOffersRentalParameters
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-rental`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface ServiceListItemResponse {
  id: string
  key: string
  value: string
  serviceCategory: {
    id: string
    key: string
    value: string
  }
}

const getServicesList = async (): Promise<ServiceListItemResponse[]> => {
  const response = await fetch(`${ROOT}/static/services-list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

export function getServicesCategories(
  items: ServiceListItemResponse[]
): { value: string; label: string }[] {
  if (!items || items.length === 0) return []
  const uniqueCategories = new Map<string, { value: string; label: string }>()

  items.forEach((item) => {
    const { id, value } = item.serviceCategory
    if (!uniqueCategories.has(id)) {
      uniqueCategories.set(id, { value: id, label: value })
    }
  })

  return Array.from(uniqueCategories.values())
}

interface ServiceListItemProps {
  key: string
  value: string
  serviceCategory: {
    id: string
  }
}

const addService = async (
  data: ServiceListItemProps
): Promise<OnboardingProcessListItemResponse> => {
  const response = await fetch(`${ROOT}/static/services-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

interface ExtraListItemProps {
  extra: string
}

const addExtra = async (
  data: ExtraListItemProps
): Promise<OnboardingProcessListItemResponse> => {
  const response = await fetch(`${ROOT}/static/extras-list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface UpdateSpacePackageParameters {
  onboarding_id: string
  id?: string
  services: string[]
  description: string
  schedule: SpaceSchedule[]
  min_hours: string
  min_persons: string
  max_persons: string
  price_modality: string
  base_price: string
  extra_hour_price?: string
  extra_person_price?: string
}

const updateSpacePackage = async (
  data: UpdateSpacePackageParameters
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-package`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface DeleteSpacePackageParameters {
  id: string
}

const deleteSpacePackage = async (
  data: DeleteSpacePackageParameters
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-package`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface UpdateOffersOnboardingStatusParameters {
  space_id: string
  onboarding_id: string
}

const updateOffersOnboardingStatus = async (
  data: UpdateOffersOnboardingStatusParameters
): Promise<unknown> => {
  const response = await fetch(
    `${ROOT}/api/onboarding/process/offers-onboarding-status`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
      },
      body: JSON.stringify(data),
    }
  )
  return response.json()
}

export interface UpdateSpaceServiceParameters {
  onboarding_id: string
  id?: string
  name: string
  description?: string
  photos: string
  price_modality: string
  price: string
  units?: string
  packages_only: string
  service_id: string
}

const updateSpaceService = async (
  data: UpdateSpaceServiceParameters
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-service`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface DeleteSpaceServiceParameters {
  id: string
}

const deleteSpaceService = async (
  data: DeleteSpaceServiceParameters
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/space-service`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export interface UpdateHostInfoParameters {
  id: string
  onboarding_id: string
  first_name: string
  last_name: string
  birth_date: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  nif: string
  company_type: string
  company_name?: string
  company_phone?: string
  company_email?: string
  company_address?: string
  company_city?: string
  company_postal_code?: string
  account_owner: string
  account_token: string
  iban: string
}

const updateHostInfo = async (
  data: UpdateHostInfoParameters
): Promise<unknown> => {
  const response = await fetch(`${ROOT}/api/onboarding/process/host-info`, {
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
  addExtra,
  addService,
  archiveOnboardingProcess,
  deleteSpacePackage,
  deleteSpaceService,
  getOnboardingProcessesById,
  getOnboardingsProcessesListByStatus,
  getServicesList,
  reasignOnboardingProcess,
  saveOnboardingIntro,
  saveOnboardingSpaceInfo,
  saveOnboardingSpacePhotos,
  scheduleOnboardingProcess,
  updateHostInfo,
  updateOffersOnboardingStatus,
  updateOnboardingStatus,
  updateSpaceOffersRental,
  updateSpacePackage,
  updateSpaceService,
}

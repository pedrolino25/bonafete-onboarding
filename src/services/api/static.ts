import { Cookies } from '@/middleware'
import { getCookie } from 'cookies-next'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface LocalityListItemResponse {
  value: string
  label: string
  latitude: number
  longitude: number
  radius: number
  url: string
}
const getLocalitiesList = async (): Promise<LocalityListItemResponse[]> => {
  const response = await fetch(`${ROOT}/static/localities`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

interface SpaceConvenienceListItem {
  id: string
  label: string
}

export interface SpaceConvenienceResponse {
  conveniences: SpaceConvenienceListItem[]
  equipement: SpaceConvenienceListItem[]
  accessibility: SpaceConvenienceListItem[]
}

const getSpaceConveniencesList =
  async (): Promise<SpaceConvenienceResponse> => {
    const response = await fetch(`${ROOT}/static/conveniences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
      },
    })
    return response.json()
  }

export interface SpaceTypeListItemResponse {
  id: string
  label: string
  image?: string
}
const getSpaceTypesList = async (): Promise<SpaceTypeListItemResponse[]> => {
  const response = await fetch(`${ROOT}/static/types`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

export interface SpaceTargetListItemResponse {
  id: string
  label: string
  description?: string
  url: string
}
const getSpaceTargetsList = async (): Promise<
  SpaceTargetListItemResponse[]
> => {
  const response = await fetch(`${ROOT}/static/targets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

export interface PostalCodesListItemResponse {
  id: string
  city: string
  locality: string
  postal_code: string
  latitude: number
  longitude: number
}
const getPostalCodesList = async (): Promise<PostalCodesListItemResponse[]> => {
  const response = await fetch(`${ROOT}/static/postal-codes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

export {
  getLocalitiesList,
  getPostalCodesList,
  getSpaceConveniencesList,
  getSpaceTargetsList,
  getSpaceTypesList,
}

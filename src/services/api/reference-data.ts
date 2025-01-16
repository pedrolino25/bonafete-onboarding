import { getCookie } from 'cookies-next'
import { Cookies } from '../auth'

const ROOT = process.env.NEXT_PUBLIC_API_URL

export interface LocalityListItemResponse {
  id: string
  title: string
  latitude: number
  longitude: number
  radius: number
  url: string
}

const getLocalitiesList = async (): Promise<LocalityListItemResponse[]> => {
  const response = await fetch(`${ROOT}/api/reference-data/localities`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Autorization: getCookie(Cookies.SESSION_COOKIE) as string,
    },
  })
  return response.json()
}

export interface SpaceConvenienceListItem {
  id: string
  label: string
  type: string
  image: string
}

const getSpaceConveniencesList = async (): Promise<
  SpaceConvenienceListItem[]
> => {
  const response = await fetch(`${ROOT}/api/reference-data/conveniences`, {
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
  const response = await fetch(`${ROOT}/api/reference-data/space-types`, {
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
  const response = await fetch(`${ROOT}/api/reference-data/events-types`, {
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
  const response = await fetch(`${ROOT}/api/reference-data/postal-codes`, {
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

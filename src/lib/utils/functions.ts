import { Option } from '@/components/ui/select'
import { OnboardingSpaceInfo } from '@/services/api/onboardings'
import { SpaceBusinessModel } from './consts'

interface AvailableHourOptionsProps {
  fromDeviation?: number
  toDeviation?: number
  returnEmptyForUnavailable?: boolean
}

export const getAvailableHourOptions = (
  hoursList: Option[],
  from: Option[],
  to?: Option[],
  options?: AvailableHourOptionsProps
): Option[] => {
  if (
    options?.returnEmptyForUnavailable &&
    (from.length === 0 || from[0].value === '--:--')
  ) {
    return []
  }

  if (from.length > 0 && hoursList.length > 0) {
    const fromIndex = hoursList.findIndex(
      (option) => option.label === from[0].label
    )

    const toIndex =
      to && to[0]?.label
        ? hoursList.findIndex((option) => option.label === to[0].label) + 1
        : 0

    if (fromIndex >= 0 && toIndex > 0) {
      const updatedOptions = hoursList.slice(
        fromIndex + (options?.fromDeviation || 0),
        toIndex + (options?.toDeviation || 0)
      )
      return updatedOptions
    } else if (fromIndex >= 0) {
      const updatedOptions = hoursList.slice(
        fromIndex + (options?.fromDeviation || 0)
      )
      return updatedOptions
    }
    return hoursList
  } else {
    return []
  }
}

export const isSpaceRentalConfigurationComplete = (
  space: OnboardingSpaceInfo
): boolean => {
  if (
    space?.business_model?.[0]?.value === SpaceBusinessModel.OnlyRental &&
    space?.cancellation_policy?.base_refund &&
    (space?.prices?.fixed?.price ||
      space?.prices?.flexible?.base_price ||
      space?.prices?.custom?.price_1) &&
    space?.lotation?.lotation &&
    space?.min_hours?.min_hours
  ) {
    return true
  } else if (
    space?.business_model?.[0]?.value ===
      SpaceBusinessModel.RentalAndPackages &&
    space?.cancellation_policy?.base_refund &&
    (space?.prices?.fixed?.price ||
      space?.prices?.flexible?.base_price ||
      space?.prices?.custom?.price_1) &&
    space?.lotation?.lotation &&
    space?.min_hours?.min_hours
  ) {
    return true
  } else if (
    space?.business_model?.[0]?.value === SpaceBusinessModel.OnlyPackages &&
    space?.cancellation_policy?.base_refund &&
    (space?.prices?.fixed?.price ||
      space?.prices?.flexible?.base_price ||
      space?.prices?.custom?.price_1)
  ) {
    return true
  }
  return false
}

export const allowPackagesConfiguration = (
  space: OnboardingSpaceInfo
): boolean => {
  return (
    space?.business_model?.[0]?.value ===
      SpaceBusinessModel.RentalAndPackages ||
    space?.business_model?.[0]?.value === SpaceBusinessModel.OnlyPackages
  )
}

export const stringToUrl = (data: string) => {
  const text = data
    ?.toLowerCase()
    ?.replace(/ /g, '-')
    ?.replace(/\?/g, '')
    ?.replace(/\!/g, '')
    ?.normalize('NFD')
    ?.replace(/[\u0300-\u036f]/g, '')
  return text.substring(text?.length - 1, text.length) === '-'
    ? text.substring(0, text.length - 1)
    : text
}

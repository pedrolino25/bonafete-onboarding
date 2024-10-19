import { Option } from '@/components/ui/select'

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

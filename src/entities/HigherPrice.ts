export enum HigherPriceTypes {
  WEEK_DAY = 'week_day',
  SPECIFIC_DATE = 'specific_date',
}

export default interface HigherPrice {
  id: string
  type: HigherPriceTypes
  value: string
  percentage: number
  createdAt: Date
  updatedAt: Date
}

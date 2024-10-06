export enum DiscountTypes {
  WEEK_DAY = 'week_day',
  SPECIFIC_DATE = 'specific_date',
  NUMBER_OF_HOURS = 'number_of_hours',
  FAST_RESERVATION = 'fast_reservation',
}

export default interface Discount {
  id: string
  type: DiscountTypes
  value: string
  percentage: number
  createdAt?: Date
  updatedAt?: Date
}

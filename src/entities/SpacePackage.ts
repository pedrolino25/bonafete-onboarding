export default interface SpacePackage {
  id: string
  name: string
  services: string
  description: string
  minHours: number
  minPersons: number
  maxPersons: number
  priceModel: string
  price: number
  extraHourPrice: number
  extraPersonPrice: number
  cleaningFee: number
  createdAt?: Date
  updatedAt?: Date
}

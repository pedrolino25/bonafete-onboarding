export default interface Address {
  id: string
  country: string
  city: string
  locality: string
  street: string
  postalCode: string
  latitude: number
  longitude: number
  createdAt?: Date
  updatedAt?: Date
}

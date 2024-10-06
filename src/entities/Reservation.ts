export default interface Reservation {
  id: string
  reservationId: string
  date: Date
  timeInit: string
  timeEnd: string
  attendance: string
  status: string
  info: string
  expireAt: Date
  createdAt: Date
  updatedAt: Date
}

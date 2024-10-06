export default interface CancelationPolicy {
  id: string
  afterConfimation: number
  period: number
  afterPeriod: number
  createdAt: Date
  updatedAt: Date
}

import { Option } from '@/components/ui/select'

export enum SpaceBusinessModel {
  OnlyRental = 'only-space',
  RentalAndPackages = 'space-and-packages',
  OnlyPackages = 'packages',
}

export const BUSINESS_MODEL_OPTIONS: Option[] = [
  {
    value: SpaceBusinessModel.OnlyRental,
    label: 'business-model-options.only-space',
  },
  {
    value: SpaceBusinessModel.RentalAndPackages,
    label: 'business-model-options.space-and-packages',
  },
  {
    value: SpaceBusinessModel.OnlyPackages,
    label: 'business-model-options.packages',
  },
]

export const PRICE_MODEL_OPTIONS: Option[] = [
  {
    value: 'hourly-fixed',
    label: 'price-model-options.hourly-fixed',
  },
  {
    value: 'hourly-flexible',
    label: 'price-model-options.hourly-flexible',
  },
  {
    value: 'hourly-custom',
    label: 'price-model-options.hourly-custom',
  },
]

export const PRICING_MODEL_PACKAGES_OPTIONS: Option[] = [
  {
    value: 'person',
    label: 'price-model-options.person',
  },
  {
    value: 'hourly',
    label: 'price-model-options.hourly',
  },
]

export const PRICING_MODEL_SERVICES_OPTIONS: Option[] = [
  {
    value: 'person',
    label: 'price-model-options.person',
  },
  {
    value: 'hourly',
    label: 'price-model-options.hourly',
  },
  {
    value: 'fixed',
    label: 'price-model-options.fixed',
  },
  /*
  {
    value: 'unit',
    label: 'price-model-options.unit',
  },
  */
]

export const PACKAGES_AVAILABLE_OPTIONS: Option[] = [
  {
    value: 'true',
    label: 'packages-available-options.true',
  },
  {
    value: 'false',
    label: 'packages-available-options.false',
  },
]

export const HOURS: Option[] = [
  { value: '--:--', label: 'Indisponível', disabled: false },
  { value: '00:00', label: '00:00', disabled: false },
  { value: '01:00', label: '01:00', disabled: false },
  { value: '02:00', label: '02:00', disabled: false },
  { value: '03:00', label: '03:00', disabled: false },
  { value: '04:00', label: '04:00', disabled: false },
  { value: '05:00', label: '05:00', disabled: false },
  { value: '06:00', label: '06:00', disabled: false },
  { value: '07:00', label: '07:00', disabled: false },
  { value: '08:00', label: '08:00', disabled: false },
  { value: '09:00', label: '09:00', disabled: false },
  { value: '10:00', label: '10:00', disabled: false },
  { value: '11:00', label: '11:00', disabled: false },
  { value: '12:00', label: '12:00', disabled: false },
  { value: '13:00', label: '13:00', disabled: false },
  { value: '14:00', label: '14:00', disabled: false },
  { value: '15:00', label: '15:00', disabled: false },
  { value: '16:00', label: '16:00', disabled: false },
  { value: '17:00', label: '17:00', disabled: false },
  { value: '18:00', label: '18:00', disabled: false },
  { value: '19:00', label: '19:00', disabled: false },
  { value: '20:00', label: '20:00', disabled: false },
  { value: '21:00', label: '21:00', disabled: false },
  { value: '22:00', label: '22:00', disabled: false },
  { value: '23:00', label: '23:00', disabled: false },
  { value: '00:00+1', label: '00:00+1', disabled: false },
  { value: '01:00+1', label: '01:00+1', disabled: false },
  { value: '02:00+1', label: '02:00+1', disabled: false },
  { value: '03:00+1', label: '03:00+1', disabled: false },
  { value: '04:00+1', label: '04:00+1', disabled: false },
  { value: '05:00+1', label: '05:00+1', disabled: false },
  { value: '06:00+1', label: '06:00+1', disabled: false },
  { value: '07:00+1', label: '07:00+1', disabled: false },
  { value: '08:00+1', label: '08:00+1', disabled: false },
  { value: '09:00+1', label: '09:00+1', disabled: false },
  { value: '10:00+1', label: '10:00+1', disabled: false },
  { value: '11:00+1', label: '11:00+1', disabled: false },
  { value: '12:00+1', label: '12:00+1', disabled: false },
  { value: '13:00+1', label: '13:00+1', disabled: false },
  { value: '14:00+1', label: '14:00+1', disabled: false },
  { value: '15:00+1', label: '15:00+1', disabled: false },
  { value: '16:00+1', label: '16:00+1', disabled: false },
  { value: '17:00+1', label: '17:00+1', disabled: false },
  { value: '18:00+1', label: '18:00+1', disabled: false },
  { value: '19:00+1', label: '19:00+1', disabled: false },
  { value: '20:00+1', label: '20:00+1', disabled: false },
  { value: '21:00+1', label: '21:00+1', disabled: false },
  { value: '22:00+1', label: '22:00+1', disabled: false },
  { value: '23:00+1', label: '23:00+1', disabled: false },
]

export enum CompanyType {
  Individual = 'individual',
  Company = 'company',
}

export const COMPANY_TYPE_OPTIONS = [
  { value: CompanyType.Individual, label: 'company-type-options.individual' },
  {
    value: CompanyType.Company,
    label: 'company-type-options.company',
  },
]

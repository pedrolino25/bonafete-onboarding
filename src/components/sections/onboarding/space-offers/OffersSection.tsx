import { Option } from '@/components/ui/select'
import { OnboardingProcessItemResponse } from '@/services/api/onboarding-processes'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import z from 'zod'
import SpaceExtraSection from './space-extra-section/SpaceExtraSection'
import SpacePackageSection from './space-package-section/SpacePackageSection'
import SpaceRentalSection from './space-rental-section/SpaceRentalSection'

interface SpaceOffersSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  completed?: boolean
  refetch: () => void
}

const optionSchema = z.object({
  value: z.string().min(1, 'Value is required'),
  label: z.string().min(1, 'Label is required'),
  info: z.string().optional(),
  node: z.any().optional(),
  disabled: z.any().optional(),
})

const onboardingSpaceOffersFormSchema = z.object({
  business_model: z.array(optionSchema).min(1),
})

type OnboardingSpaceOffersFormType = z.infer<
  typeof onboardingSpaceOffersFormSchema
>

export default function SpaceOffersSection({
  onboardingInfo,
  completed,
  refetch,
}: SpaceOffersSectionProps) {
  const t = useTranslations()
  const {
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<OnboardingSpaceOffersFormType>({
    resolver: zodResolver(onboardingSpaceOffersFormSchema),
    defaultValues: {},
  })

  const onSubmit = (values: OnboardingSpaceOffersFormType) => {}

  const handleSelectChange =
    (field: keyof OnboardingSpaceOffersFormType) => (option: Option[]) => {
      setValue(field, option, { shouldValidate: true, shouldDirty: true })
    }

  return (
    <form
      className="w-full max-sm:border-t max-sm:px-1 py-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full border-b pb-4 flex items-center">
        <div>
          <h3 className="text-lg font-semibold text-utility-brand-600">
            {t('sections.onboarding.space-offers-title')}
          </h3>
          <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
            {t('sections.onboarding.space-offers-subtitle')}
          </p>
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-4 pt-8 pl-6 max-sm:pl-0 pb-12">
        <SpaceRentalSection />
        {getValues().business_model?.[0]?.value !== 'only-space' && (
          <SpacePackageSection disabled />
        )}
        <SpaceExtraSection disabled />
      </div>
    </form>
  )
}

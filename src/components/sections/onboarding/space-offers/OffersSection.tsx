import { Button } from '@/components/ui/button'
import { toast } from '@/lib/hooks/use-toast'
import {
  allowPackagesConfiguration,
  isSpaceRentalConfigurationComplete,
} from '@/lib/utils/functions'
import {
  OnboardingProcessItemResponse,
  updateOffersOnboardingStatus,
  updateOnboardingStatus,
} from '@/services/api/onboarding-processes'
import { useMutation } from '@tanstack/react-query'
import { Info, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { OnboardingFaseStatus, OnboardingSections } from '../OnboardingSection'
import SpaceExtraSection from './space-extra-section/SpaceExtraSection'
import SpacePackageSection from './space-package-section/SpacePackageSection'
import SpaceRentalSection from './space-rental-section/SpaceRentalSection'

interface SpaceOffersSectionProps {
  onboardingInfo: OnboardingProcessItemResponse
  completed?: boolean
  refetch: () => void
}

export default function SpaceOffersSection({
  onboardingInfo,
  completed,
  refetch,
}: SpaceOffersSectionProps) {
  const t = useTranslations()
  const isRentalConfigurationComplete = isSpaceRentalConfigurationComplete(
    onboardingInfo.space
  )
  const allowPackageConfig = allowPackagesConfiguration(onboardingInfo.space)

  const updateOnboardingStatusMutation = useMutation({
    mutationFn: updateOnboardingStatus,
    onSuccess: () => {
      refetch?.()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  const updateOffersOnboardingStatusMutation = useMutation({
    mutationFn: updateOffersOnboardingStatus,
    onSuccess: () => {
      refetch?.()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.submit'),
      })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.submit'),
      })
    },
  })

  return (
    <div className="w-full max-sm:border-t max-sm:px-1 py-4">
      <div className="w-full border-b pb-4 flex justify-between items-center max-sm:flex-col">
        <div>
          <h3 className="text-lg font-semibold text-utility-brand-600">
            {t('sections.onboarding.space-offers-title')}
          </h3>
          <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
            {t('sections.onboarding.space-offers-subtitle')}
          </p>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          <Button
            startAdornment={<Info className="h-4 w-4" />}
            color="secondary"
            variant="fill"
            loading={updateOnboardingStatusMutation.isPending}
            onClick={() =>
              updateOnboardingStatusMutation.mutate({
                onboarding_id: onboardingInfo.id,
                flow: OnboardingSections.Offers,
                status: OnboardingFaseStatus.Incomplete,
              })
            }
          >
            {t('button-actions.update-needed')}
          </Button>
          <Button
            type="submit"
            loading={updateOffersOnboardingStatusMutation.isPending}
            startAdornment={<Send className="h-4 w-4" />}
            onClick={() =>
              updateOffersOnboardingStatusMutation.mutate({
                onboarding_id: onboardingInfo.id,
                space_id: onboardingInfo?.space?.space_id,
              })
            }
          >
            {t('button-actions.submit')}
          </Button>
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-4 pt-8 pl-6 max-sm:pl-0 pb-12">
        <SpaceRentalSection
          onboardingInfo={onboardingInfo}
          refetch={refetch}
          completed={isRentalConfigurationComplete}
        />
        {onboardingInfo?.space?.packages?.map((spacePackage, index) => {
          return (
            <SpacePackageSection
              title={
                spacePackage.name
                  ? t('sections.onboarding.package-title').replace(
                      '$1',
                      spacePackage.name
                    )
                  : undefined
              }
              key={index}
              defaultValues={spacePackage}
              disabled={!isRentalConfigurationComplete || !allowPackageConfig}
              onboardingInfo={onboardingInfo}
              refetch={refetch}
              completed
            />
          )
        })}
        <SpacePackageSection
          disabled={!isRentalConfigurationComplete || !allowPackageConfig}
          onboardingInfo={onboardingInfo}
          refetch={refetch}
        />
        <SpaceExtraSection disabled={!isRentalConfigurationComplete} />
      </div>
    </div>
  )
}

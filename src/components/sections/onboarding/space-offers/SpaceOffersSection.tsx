import PackageCard from '@/components/cards/package-card'
import SpaceServiceCard from '@/components/cards/space-service-card'
import SpaceRentalForm, {
  SpaceRentalFormType,
} from '@/components/forms/space-rental-form/SpaceRentalForm'
import { OnboardingFormLayout } from '@/components/layouts/onboarding-form'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/hooks/use-toast'
import {
  allowPackagesConfiguration,
  isSpaceRentalConfigurationComplete,
} from '@/lib/utils/functions'
import {
  OnboardingSpaceInfo,
  updateOffersOnboardingStatus,
  updateOnboardingStatus,
} from '@/services/api/onboarding-processes'
import { useMutation } from '@tanstack/react-query'
import { Info, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface SpaceOffersSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  defaultValues?: SpaceRentalFormType
  showUpdateOnboardingStatus?: boolean
  completed?: boolean
  refetch: () => void
  onUpdateOnboardingStatus?: () => void
}

export default function SpaceOffersSection({
  spaceInfo,
  onboardingId,
  defaultValues,
  showUpdateOnboardingStatus,
  onUpdateOnboardingStatus,
  refetch,
}: SpaceOffersSectionProps) {
  const router = useRouter()
  const t = useTranslations()
  const isRentalConfigurationComplete =
    isSpaceRentalConfigurationComplete(spaceInfo)
  const allowPackageConfig = allowPackagesConfiguration(spaceInfo)

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
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.space-offers-title')}
          </OnboardingSectionLayout.Title>
          <OnboardingSectionLayout.Subtitle>
            {t('sections.onboarding.space-offers-subtitle')}
          </OnboardingSectionLayout.Subtitle>
        </div>
        <div className="flex justify-between items-center gap-4 max-sm:justify-end max-sm:items-start max-sm:pt-4 max-sm:w-full">
          {showUpdateOnboardingStatus && (
            <Button
              startAdornment={<Info className="h-4 w-4" />}
              color="secondary"
              variant="fill"
              loading={updateOnboardingStatusMutation.isPending}
              onClick={() => onUpdateOnboardingStatus?.()}
            >
              {t('button-actions.update-needed')}
            </Button>
          )}
          {onboardingId && (
            <Button
              type="submit"
              loading={updateOffersOnboardingStatusMutation.isPending}
              startAdornment={<Send className="h-4 w-4" />}
              onClick={() =>
                updateOffersOnboardingStatusMutation.mutate({
                  onboarding_id: onboardingId,
                  space_id: spaceInfo?.space_id,
                })
              }
            >
              {t('button-actions.submit')}
            </Button>
          )}
        </div>
      </div>
      <div className="w-9/12 max-w-[700px] max-sm:w-full flex flex-col gap-2 pt-4 pl-6 max-sm:pl-0 pb-12">
        <div className="w-full pb-6">
          <SpaceRentalForm
            spaceInfo={spaceInfo}
            refetch={refetch}
            defaultValues={defaultValues}
          />
        </div>

        <div className="w-full pt-4 pb-6 border-t">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.space-service-title2')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.space-service-subtitle2')}
          </OnboardingFormLayout.Subtitle>
          <div className="w-full grid grid-cols-2 max-sm:grid-cols-1 gap-4 pt-6">
            {spaceInfo?.services?.map((spaceService, index) => {
              return (
                <SpaceServiceCard
                  key={index}
                  complete
                  onClick={() =>
                    router.push(
                      `/manage-process/space-service?space_id=${spaceInfo.space_id}&service_id=${spaceService.id}`
                    )
                  }
                  title={spaceService.services_form?.services?.[0]?.label}
                />
              )
            })}

            {(!spaceInfo?.services || spaceInfo?.services?.length <= 10) && (
              <SpaceServiceCard
                onClick={() =>
                  router.push(
                    `/manage-process/space-service?space_id=${spaceInfo.space_id}`
                  )
                }
                title={t('sections.onboarding.add-service')}
                disabled={!isRentalConfigurationComplete}
              />
            )}
          </div>
        </div>

        <div className="w-full pt-4 pb-6 border-t">
          <OnboardingFormLayout.Title>
            {t('sections.onboarding.space-package-title2')}
          </OnboardingFormLayout.Title>
          <OnboardingFormLayout.Subtitle>
            {t('sections.onboarding.space-package-subtitle2')}
          </OnboardingFormLayout.Subtitle>
          <div className="w-full grid grid-cols-2 max-sm:grid-cols-1 gap-4 pt-6">
            {spaceInfo?.packages?.map((spacePackage, index) => {
              return (
                <PackageCard
                  key={index}
                  complete
                  onClick={() =>
                    router.push(
                      `/manage-process/space-package?space_id=${spaceInfo.space_id}&package_id=${spacePackage.id}`
                    )
                  }
                  title={spacePackage.name}
                />
              )
            })}
            {(!spaceInfo?.packages || spaceInfo?.packages?.length <= 5) && (
              <PackageCard
                onClick={() =>
                  router.push(
                    `/manage-process/space-package?space_id=${spaceInfo.space_id}`
                  )
                }
                title={t('sections.onboarding.add-package')}
                disabled={!isRentalConfigurationComplete || !allowPackageConfig}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

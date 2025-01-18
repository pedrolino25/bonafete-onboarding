'use client'

import { SidebarLayout, SidebarLink } from '@/components/layouts/sidebar'
import { OnboardingSpaceInfo } from '@/services/api/onboardings'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OnboardingSections } from '../OnboardingSection'
import SpaceGeneralConfigurationSection, {
  SpaceGeneralConfigurationFormType,
} from './space-general-config/SpaceGeneralConfigurationSection'
import SpacePackagesSection from './space-packages/SpacePackagesSection'
import SpaceRentalSection, {
  SpaceRentalFormType,
} from './space-rental/SpaceRentalSection'
import SpaceServicesSection from './space-services/SpaceServicesSection'

export enum SpaceOffersFaseStatus {
  Init = 'init',
  Incomplete = 'incomplete',
  Completed = 'completed',
}

export enum SpaceOffersSections {
  GeneralConfiguration = 'general-config',
  Rental = 'rental',
  Services = 'services',
  Packages = 'packages',
}

interface SpaceOffersSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  completed?: boolean
  refetch: () => void
}

export default function SpaceOffersSection({
  spaceInfo,
  onboardingId,
  completed,
  refetch,
}: SpaceOffersSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()

  const [section, setSection] = useState<SidebarLink>()
  const [sections] = useState<SidebarLink[]>([
    {
      value: SpaceOffersSections.GeneralConfiguration,
      label: t('sections.onboarding.offers.navigation.general-config'),
      disabled: false,
      complete: false,
    },
    {
      value: SpaceOffersSections.Rental,
      label: t('sections.onboarding.offers.navigation.rental'),
      disabled: false,
      complete: false,
    },
    {
      value: SpaceOffersSections.Services,
      label: t('sections.onboarding.offers.navigation.services'),
      disabled: false,
      complete: false,
    },
    {
      value: SpaceOffersSections.Packages,
      label: t('sections.onboarding.offers.navigation.packages'),
      disabled: (spaceInfo?.services?.length || 0) < 2,
      complete: false,
    },
  ])

  useEffect(() => {
    const searchParams = new URLSearchParams(params.toString())
    const link = {
      value:
        searchParams.get('sub-section') ||
        SpaceOffersSections.GeneralConfiguration,
      label: t(
        `sections.onboarding.offers.navigation.${
          searchParams.get('sub-section') ||
          SpaceOffersSections.GeneralConfiguration
        }`
      ),
      disabled: false,
      complete: false,
      incomplete: false,
    }
    setSection(link)
    searchParams.set('section', OnboardingSections.Offers)
    searchParams.set('sub-section', link.value)
    router.replace(`?${searchParams.toString()}`)
  }, [])

  const handlePageChange = (link: SidebarLink) => {
    setSection(link)
    const searchParams = new URLSearchParams(params.toString())
    searchParams.set('sub-section', link.value)
    router.replace(`?${searchParams.toString()}`)
  }

  return (
    <SidebarLayout.Root>
      {spaceInfo && sections.length > 0 && section && (
        <SidebarLayout.Main>
          <SidebarLayout.Sidebar
            onChange={handlePageChange}
            value={section}
            items={sections}
          />
          <SidebarLayout.Container>
            {section.value === SpaceOffersSections.GeneralConfiguration && (
              <SpaceGeneralConfigurationSection
                spaceInfo={spaceInfo}
                onboardingId={onboardingId}
                defaultValues={
                  {
                    business_model: spaceInfo?.business_model
                      ? spaceInfo?.business_model
                      : [],
                    min_hours: spaceInfo?.min_hours
                      ? spaceInfo?.min_hours?.toString()
                      : undefined,
                    cleaning_fee: spaceInfo?.cleaning_fee?.toString(),
                  } as SpaceGeneralConfigurationFormType
                }
                completed={completed}
                refetch={refetch}
              />
            )}
            {section.value === SpaceOffersSections.Rental && (
              <SpaceRentalSection
                spaceInfo={spaceInfo}
                onboardingId={onboardingId}
                defaultValues={
                  {
                    price_form: {
                      price_model: spaceInfo?.prices?.priceModel || [],
                      fixed_price_form: spaceInfo?.prices?.fixed,
                      flexible_price_form: spaceInfo?.prices?.flexible,
                      custom_price_form: spaceInfo?.prices?.custom,
                    },
                  } as SpaceRentalFormType
                }
                completed={completed}
                refetch={refetch}
              />
            )}
            {section.value === SpaceOffersSections.Services && (
              <SpaceServicesSection
                spaceInfo={spaceInfo}
                onboardingId={onboardingId}
                refetch={refetch}
              />
            )}
            {section.value === SpaceOffersSections.Packages && (
              <SpacePackagesSection
                spaceInfo={spaceInfo}
                onboardingId={onboardingId}
                refetch={refetch}
              />
            )}
          </SidebarLayout.Container>
        </SidebarLayout.Main>
      )}
    </SidebarLayout.Root>
  )
}

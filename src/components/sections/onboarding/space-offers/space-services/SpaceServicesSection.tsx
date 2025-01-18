'use client'
import SpaceServiceCard from '@/components/cards/space-service-card'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { OnboardingSectionLayout } from '@/components/layouts/onboarding-section'

import { SpaceServiceFormType } from '@/components/forms/space-service-form/SpaceServiceForm'
import { OnboardingSpaceInfo } from '@/services/api/onboardings'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'
import SpaceServiceSection from '../space-service/SpaceServiceSection'

interface SpaceServicesSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  refetch: () => void
}

export default function SpaceServicesSection({
  spaceInfo,
  onboardingId,
  refetch,
}: SpaceServicesSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<SpaceServiceFormType>()

  return (
    <div className="w-full max-sm:border-t max-sm:px-1 py-4">
      <div className="w-full border-b px-6 max-sm:px-4 pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <OnboardingSectionLayout.Title>
            {t('sections.onboarding.space-service-title2')}
          </OnboardingSectionLayout.Title>
        </div>
      </div>
      <div className="w-full">
        <EditSpaceSectionLayout.Container>
          <div className="col-span-5 w-full grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            {spaceInfo?.services?.map((spaceService, index) => {
              return (
                <SpaceServiceCard
                  key={index}
                  complete
                  onClick={() => {
                    setSelected(spaceService)
                    setOpenDrawer(true)
                  }}
                  title={spaceService.services_form?.services?.[0]?.label}
                />
              )
            })}
            {(!spaceInfo?.services || spaceInfo?.services?.length <= 10) && (
              <SpaceServiceCard
                key="add-service-card"
                onClick={() => {
                  setSelected(undefined)
                  setOpenDrawer(true)
                }}
                title={t('sections.onboarding.add-service')}
              />
            )}
          </div>
          <SpaceServiceSection
            onboardingId={onboardingId}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            spaceInfo={spaceInfo}
            data={selected}
            refetch={refetch}
          />
        </EditSpaceSectionLayout.Container>
      </div>
    </div>
  )
}

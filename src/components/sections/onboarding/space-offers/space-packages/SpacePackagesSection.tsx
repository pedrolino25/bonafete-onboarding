'use client'
import PackageCard from '@/components/cards/package-card'
import { SpacePackageFormType } from '@/components/forms/space-package-form/SpacePackageForm'
import { EditSpaceSectionLayout } from '@/components/layouts/edit-space-section'
import { SpacePackageStatus } from '@/lib/utils/consts'
import { OnboardingSpaceInfo } from '@/services/api/onboardings'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'
import SpacePackageSection from '../space-package/SpacePackageSection'

interface SpacePackagesSectionProps {
  spaceInfo: OnboardingSpaceInfo
  onboardingId?: string
  completed?: boolean
  refetch: () => void
}

export default function SpacePackagesSection({
  spaceInfo,
  onboardingId,
  completed,
  refetch,
}: SpacePackagesSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<SpacePackageFormType>()

  return (
    <div className="w-full max-sm:border-t max-sm:px-1 py-4">
      <div className="w-full border-b px-6 max-sm:px-4 pb-4 flex justify-between items-center max-sm:flex-col">
        <div className="w-full">
          <EditSpaceSectionLayout.HeaderTitle>
            {t('sections.onboarding.space-package-title2')}
          </EditSpaceSectionLayout.HeaderTitle>
        </div>
      </div>
      <div className="w-full">
        <EditSpaceSectionLayout.Container>
          <div className="col-span-5 w-full grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            {spaceInfo?.packages
              ?.filter((item) => item.status === SpacePackageStatus.Published)
              ?.map((spacePackage, index) => {
                return (
                  <PackageCard
                    key={index}
                    complete
                    onClick={() => {
                      setSelected(spacePackage)
                      setOpenDrawer(true)
                    }}
                    title={spacePackage.name}
                  />
                )
              })}
            {(!spaceInfo?.packages ||
              spaceInfo?.packages?.filter(
                (item) => item.status === SpacePackageStatus.Published
              )?.length <= 5) && (
              <PackageCard
                onClick={() => {
                  setSelected(undefined)
                  setOpenDrawer(true)
                }}
                title={t('sections.onboarding.add-package')}
                disabled={!spaceInfo?.services}
              />
            )}
          </div>
          <SpacePackageSection
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

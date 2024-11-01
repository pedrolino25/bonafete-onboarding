'use client'
import SpacePackageForm from '@/components/forms/space-package-form/SpacePackageForm'
import { Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { getOnboardingProcessesById } from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SpacePackageSection() {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const onboarding_id = params.get('onboarding_id') as string
  const package_id = params.get('package_id') as string

  const { data } = useQuery({
    queryKey: ['onboarding-process', onboarding_id],
    queryFn: async () => {
      return await getOnboardingProcessesById(onboarding_id)
    },
  })

  const spacePackage = data?.space?.packages?.find(
    (item) => item.id === package_id
  )

  return (
    <main>
      <Navbar
        showIcon
        hideSideBar
        topbarActions={
          <Button
            color="secondary"
            startAdornment={<ChevronLeft className="h-4 w-4" />}
            onClick={() => router.back()}
          >
            {t('navigation.back')}
          </Button>
        }
      >
        {data && (
          <div className="w-full max-sm:px-2 py-4">
            <div className="w-full border-b pb-4 px-4 max-sm:px-0">
              <div>
                <h3 className="text-lg font-semibold text-utility-brand-600">
                  {spacePackage?.name
                    ? t('sections.onboarding.package-title').replace(
                        '$1',
                        spacePackage.name
                      )
                    : t('sections.onboarding.space-package-title')}
                </h3>
                <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
                  {t('sections.onboarding.space-package-subtitle')}
                </p>
              </div>
            </div>
            <div className="m-auto max-w-[800px] max-sm:w-full flex flex-col gap-4 pt-8 pb-12">
              <SpacePackageForm
                onboardingInfo={data}
                defaultValues={spacePackage}
                refetch={() => router.back()}
              />
            </div>
          </div>
        )}
      </Navbar>
    </main>
  )
}

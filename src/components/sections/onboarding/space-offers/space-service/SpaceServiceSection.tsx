'use client'
import SpaceServiceForm from '@/components/forms/space-service-form/SpaceServiceForm'
import { Navbar } from '@/components/navigation/Navbar'
import { EditSpaceSections } from '@/components/sections/space/EditSpaceSection'
import { Button } from '@/components/ui/button'
import { getOnboardingSpaceById } from '@/services/api/onboardings'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SpaceServiceSection() {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const space_id = params.get('space_id') as string
  const service_id = params.get('service_id') as string

  const { data } = useQuery({
    queryKey: ['space', space_id],
    queryFn: async () => {
      return await getOnboardingSpaceById(space_id)
    },
  })

  const spaceService = data?.services?.find((item) => item.id === service_id)

  return (
    <main>
      <Navbar
        topbarActions={
          <Button
            color="secondary"
            startAdornment={<ChevronLeft className="h-4 w-4" />}
            onClick={() => router.back()}
            variant="ghost"
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
                  {spaceService?.services_form?.services?.[0]?.label
                    ? spaceService.services_form.services[0].label
                    : t('sections.onboarding.space-service-title')}
                </h3>
                <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
                  {t('sections.onboarding.space-service-subtitle')}
                </p>
              </div>
            </div>
            <div className="m-auto max-w-[800px] max-sm:w-full flex flex-col gap-4 pt-8 pb-12">
              <SpaceServiceForm
                spaceInfo={data}
                defaultValues={spaceService}
                refetch={() => {
                  const previousUrl = document.referrer
                  if (previousUrl) {
                    const url = new URL(previousUrl, window.location.origin)
                    url.searchParams.set('section', EditSpaceSections.Offers)
                    router.push(url.toString())
                  } else {
                    router.back()
                  }
                }}
              />
            </div>
          </div>
        )}
      </Navbar>
    </main>
  )
}

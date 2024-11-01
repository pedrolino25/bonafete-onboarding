'use client'
import SpaceExtraForm from '@/components/forms/space-extra-form/SpaceExtraForm'
import { Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { getOnboardingProcessesById } from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SpaceExtraSection() {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const onboarding_id = params.get('onboarding_id') as string
  const extra_id = params.get('extra_id') as string

  const { data } = useQuery({
    queryKey: ['onboarding-process', onboarding_id],
    queryFn: async () => {
      return await getOnboardingProcessesById(onboarding_id)
    },
  })

  const spaceExtra = data?.space?.extras?.find((item) => item.id === extra_id)

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
                  {spaceExtra?.extras_form?.extras?.[0]?.label
                    ? spaceExtra.extras_form.extras[0].label
                    : t('sections.onboarding.space-extra-title')}
                </h3>
                <p className="text-sm font-light text-utility-gray-500 pt-1 pr-4">
                  {t('sections.onboarding.space-extra-subtitle')}
                </p>
              </div>
            </div>
            <div className="m-auto max-w-[800px] max-sm:w-full flex flex-col gap-4 pt-8 pb-12">
              <SpaceExtraForm
                onboardingInfo={data}
                defaultValues={spaceExtra}
                refetch={() => router.back()}
              />
            </div>
          </div>
        )}
      </Navbar>
    </main>
  )
}

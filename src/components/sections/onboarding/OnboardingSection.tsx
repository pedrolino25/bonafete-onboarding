'use client'

import { SidebarLayout, SidebarLink } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/navigation/Navbar'
import OnboardingIntro from '@/components/sections/onboarding/intro/IntroSection'
import { Button } from '@/components/ui/button'
import { getOnboardingProcessesById } from '@/services/api/onboarding-processes'
import {
  LocalityListItemResponse,
  PostalCodesListItemResponse,
  SpaceConvenienceResponse,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/static'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SpaceInfoSection from './space-info/SpaceInfoSection'
import SpaceOffersSection from './space-offers/OffersSection'
import SpacePhotosSection from './space-photos/SpacePhotosSection'

export enum OnboardingFaseStatus {
  Init = 'init',
  Incomplete = 'incomplete',
  Completed = 'completed',
}

export enum OnboardingSections {
  Intro = 'intro',
  SpaceInfo = 'space-info',
  Photos = 'photos',
  Offers = 'offers',
  HostInfo = 'host-info',
}

interface OnboardingSectionProps {
  localitiesList: LocalityListItemResponse[]
  conveniencesList: SpaceConvenienceResponse
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
  postalCodesList: PostalCodesListItemResponse[]
}

export default function OnboardingSection({
  localitiesList,
  conveniencesList,
  spaceTypesList,
  spaceTargetsList,
  postalCodesList,
}: OnboardingSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id') as string
  const [section, setSection] = useState<SidebarLink>()
  const [sections, setSections] = useState<SidebarLink[]>([])

  const { data, refetch } = useQuery({
    queryKey: ['onboarding-process', id],
    queryFn: async () => {
      return await getOnboardingProcessesById(id)
    },
  })

  useEffect(() => {
    if (data) {
      setSections([
        {
          value: OnboardingSections.Intro,
          label: t('sections.onboarding.navigation.intro'),
          disabled: false,
          complete: data && data.fase1 === OnboardingFaseStatus.Completed,
        },
        {
          value: OnboardingSections.SpaceInfo,
          label: t('sections.onboarding.navigation.space-info'),
          disabled: data && data.fase1 !== OnboardingFaseStatus.Completed,
          complete: data && data.fase2 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase2 === OnboardingFaseStatus.Incomplete,
        },
        {
          value: OnboardingSections.Photos,
          label: t('sections.onboarding.navigation.photos'),
          disabled: data && data.fase2 !== OnboardingFaseStatus.Completed,
          complete: data && data.fase3 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase3 === OnboardingFaseStatus.Incomplete,
        },
        {
          value: OnboardingSections.Offers,
          label: t('sections.onboarding.navigation.offers'),
          disabled:
            data &&
            data.fase3 !== OnboardingFaseStatus.Completed &&
            data.fase3 !== OnboardingFaseStatus.Incomplete,
          complete: data && data.fase4 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase4 === OnboardingFaseStatus.Incomplete,
        },
        {
          value: OnboardingSections.HostInfo,
          label: t('sections.onboarding.navigation.host-info'),
          disabled: data && data.fase5 !== OnboardingFaseStatus.Completed,
          complete: data && data.fase5 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase5 === OnboardingFaseStatus.Incomplete,
        },
      ])
      setSection(
        data && data.fase5 === OnboardingFaseStatus.Completed
          ? {
              value: OnboardingSections.HostInfo,
              label: t(
                `sections.onboarding.navigation.${OnboardingSections.HostInfo}`
              ),
              disabled: false,
              complete: true,
            }
          : data && data.fase4 === OnboardingFaseStatus.Completed
          ? {
              value: OnboardingSections.HostInfo,
              label: t(
                `sections.onboarding.navigation.${OnboardingSections.HostInfo}`
              ),
              disabled: false,
              complete: true,
              incomplete:
                data && data.fase5 === OnboardingFaseStatus.Incomplete,
            }
          : data && data.fase3 === OnboardingFaseStatus.Completed
          ? {
              value: OnboardingSections.Offers,
              label: t(
                `sections.onboarding.navigation.${OnboardingSections.Offers}`
              ),
              disabled: false,
              complete: false,
              incomplete:
                data && data.fase4 === OnboardingFaseStatus.Incomplete,
            }
          : data && data.fase2 === OnboardingFaseStatus.Completed
          ? {
              value: OnboardingSections.Photos,
              label: t(
                `sections.onboarding.navigation.${OnboardingSections.Photos}`
              ),
              disabled: false,
              complete: false,
              incomplete:
                data && data.fase3 === OnboardingFaseStatus.Incomplete,
            }
          : data && data.fase1 === OnboardingFaseStatus.Completed
          ? {
              value: OnboardingSections.SpaceInfo,
              label: t(
                `sections.onboarding.navigation.${OnboardingSections.SpaceInfo}`
              ),
              disabled: false,
              complete: false,
              incomplete:
                data && data.fase2 === OnboardingFaseStatus.Incomplete,
            }
          : {
              value: OnboardingSections.Intro,
              label: t('sections.onboarding.navigation.intro'),
              disabled: false,
              complete: false,
              incomplete:
                data && data.fase1 === OnboardingFaseStatus.Incomplete,
            }
      )
    }
  }, [data])

  const handlePageChange = (link: SidebarLink) => {
    setSection(link)
  }

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
        <SidebarLayout.Root>
          <SidebarLayout.Header>
            <SidebarLayout.Title>
              {t('sections.onboarding.title')}
            </SidebarLayout.Title>
            <SidebarLayout.Subtitle>
              {t('sections.onboarding.subtitle')}
            </SidebarLayout.Subtitle>
          </SidebarLayout.Header>
          {data && sections.length > 0 && section && (
            <SidebarLayout.Main>
              <SidebarLayout.Sidebar
                onChange={handlePageChange}
                value={section}
                items={sections}
              />
              <SidebarLayout.Container>
                {section.value === OnboardingSections.Intro && (
                  <OnboardingIntro
                    onboardingInfo={data}
                    completed={
                      data && data.fase1 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.SpaceInfo && (
                  <SpaceInfoSection
                    onboardingInfo={data}
                    localitiesList={localitiesList}
                    conveniencesList={conveniencesList}
                    spaceTypesList={spaceTypesList}
                    spaceTargetsList={spaceTargetsList}
                    postalCodesList={postalCodesList}
                    completed={
                      data && data.fase2 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.Photos && (
                  <SpacePhotosSection
                    onboardingInfo={data}
                    completed={
                      data && data.fase3 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.Offers && (
                  <SpaceOffersSection
                    onboardingInfo={data}
                    completed={
                      data && data.fase4 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.HostInfo && <div />}
              </SidebarLayout.Container>
            </SidebarLayout.Main>
          )}
        </SidebarLayout.Root>
      </Navbar>
    </main>
  )
}

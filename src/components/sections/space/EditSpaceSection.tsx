'use client'

import { SidebarLayout, SidebarLink } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { getOnboardingSpaceById } from '@/services/api/onboardings'
import {
  LocalityListItemResponse,
  PostalCodesListItemResponse,
  SpaceConvenienceListItem,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/reference-data'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import SpaceCancellationPolicySection, {
  CancellationPolicyFormType,
} from '../onboarding/space-cancellation-policy/SpaceCancellationPolicySection'
import SpaceInfoSection, {
  SpaceInfoFormType,
} from '../onboarding/space-info/SpaceInfoSection'
import SpaceOffersSection from '../onboarding/space-offers/SpaceOffersSection'
import SpacePhotosSection, {
  SpacePhotosFormType,
} from '../onboarding/space-photos/SpacePhotosSection'
import SpaceRulesSection, {
  SpaceRulesFormType,
} from '../onboarding/space-rules/SpaceRulesSection'

export enum EditSpaceSections {
  SpaceInfo = 'space-info',
  Photos = 'photos',
  Offers = 'offers',
  Rules = 'rules',
  CancellationPolicy = 'cancellation-policy',
}

interface EditSpaceSectionProps {
  localitiesList: LocalityListItemResponse[]
  conveniencesList: SpaceConvenienceListItem[]
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
  postalCodesList: PostalCodesListItemResponse[]
}

export default function EditSpaceSection({
  localitiesList,
  conveniencesList,
  spaceTypesList,
  spaceTargetsList,
  postalCodesList,
}: EditSpaceSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id') as string
  const section_id = params.get('section') as string
  const [section, setSection] = useState<SidebarLink>({
    value: section_id || EditSpaceSections.SpaceInfo,
    label: t(
      `sections.onboarding.navigation.${
        section_id || EditSpaceSections.SpaceInfo
      }`
    ),
    disabled: false,
    complete: false,
    incomplete: false,
  })
  const [sections] = useState<SidebarLink[]>([
    {
      value: EditSpaceSections.SpaceInfo,
      label: t('sections.onboarding.navigation.space-info'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
    {
      value: EditSpaceSections.Photos,
      label: t('sections.onboarding.navigation.photos'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
    {
      value: EditSpaceSections.Offers,
      label: t('sections.onboarding.navigation.offers'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
    {
      value: EditSpaceSections.Rules,
      label: t('sections.onboarding.navigation.rules'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
    {
      value: EditSpaceSections.CancellationPolicy,
      label: t('sections.onboarding.navigation.cancellation-policy'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
  ])

  const { data, refetch } = useQuery({
    queryKey: ['space', id],
    queryFn: async () => {
      return await getOnboardingSpaceById(id)
    },
  })

  const [conveniencesOptions] = useState<Option[]>(
    conveniencesList?.map((option) => {
      return {
        label: option.label,
        value: option.id,
        disabled: option.id === '17',
      }
    }) as Option[]
  )

  const handlePageChange = (link: SidebarLink) => {
    setSection(link)
    const searchParams = new URLSearchParams(params.toString())
    searchParams.set('section', link.value)
    searchParams.delete('sub-section')
    router.replace(`?${searchParams.toString()}`)
  }

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
        <SidebarLayout.Root>
          <SidebarLayout.Header>
            <SidebarLayout.Title>
              {t('sections.onboarding.update-space-title')}
            </SidebarLayout.Title>
            <SidebarLayout.Subtitle>
              {t('sections.onboarding.update-space-subtitle')}
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
                {section.value === EditSpaceSections.SpaceInfo && (
                  <SpaceInfoSection
                    spaceInfo={data}
                    localitiesList={localitiesList}
                    conveniencesList={conveniencesList}
                    spaceTypesList={spaceTypesList}
                    spaceTargetsList={spaceTargetsList}
                    postalCodesList={postalCodesList}
                    defaultValues={
                      {
                        type: data?.type
                          ? [
                              {
                                label: data.type.label,
                                value: data.type.id,
                              },
                            ]
                          : [],
                        targets:
                          data?.targets && data.targets.length > 0
                            ? data?.targets?.map((item) => {
                                return {
                                  label: item.label,
                                  value: item.id,
                                }
                              })
                            : [],
                        conveniences:
                          data?.conveniences && data.conveniences.length > 0
                            ? data?.conveniences?.map((item) => {
                                return {
                                  label: item.label,
                                  value: item.id,
                                  disabled: item.id === '17',
                                }
                              })
                            : conveniencesOptions?.filter(
                                (item) => item.value === '17'
                              ),
                        title: data?.title,
                        tour: data?.tour,
                        description: data?.description,
                        valid_url: data.title ? 'unique' : '',
                        street: data?.street,
                        postal: data?.postal,
                        locality: data?.locality,
                        city: data?.city,
                        latitude: data?.latitude?.toString(),
                        longitude: data?.longitude?.toString(),
                        schedule_form: data?.schedule,
                        lotation_form: data?.lotation?.lotation
                          ? data?.lotation
                          : {
                              lotation: undefined,
                            },
                      } as SpaceInfoFormType
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === EditSpaceSections.Photos && (
                  <SpacePhotosSection
                    spaceInfo={data}
                    defaultValues={
                      {
                        photos:
                          (data?.photos || []).length > 0
                            ? data?.photos?.map((item) => {
                                return {
                                  path: item,
                                  file: undefined,
                                }
                              })
                            : [],
                      } as SpacePhotosFormType
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === EditSpaceSections.Offers && (
                  <SpaceOffersSection spaceInfo={data} refetch={refetch} />
                )}
                {section.value === EditSpaceSections.Rules && (
                  <SpaceRulesSection
                    spaceInfo={data}
                    defaultValues={
                      {
                        allow_pets: data?.allow_pets,
                        allow_alcool: data?.allow_alcool,
                        allow_smoking: data?.allow_smoking,
                        allow_high_sound: data?.allow_high_sound,
                        has_security_cameras: 'false',
                        rules: data?.rules,
                      } as SpaceRulesFormType
                    }
                    refetch={refetch}
                  />
                )}

                {section.value === EditSpaceSections.CancellationPolicy && (
                  <SpaceCancellationPolicySection
                    spaceInfo={data}
                    defaultValues={
                      {
                        base_refund: data.cancellation_policy?.base_refund,
                        late_cancellation_days:
                          data.cancellation_policy?.late_cancellation_days,
                        late_cancellation_refund:
                          data.cancellation_policy?.late_cancellation_refund,
                      } as CancellationPolicyFormType
                    }
                    refetch={refetch}
                  />
                )}
              </SidebarLayout.Container>
            </SidebarLayout.Main>
          )}
        </SidebarLayout.Root>
      </Navbar>
    </main>
  )
}

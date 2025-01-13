'use client'

import { SpaceRentalFormType } from '@/components/forms/space-rental-form/SpaceRentalForm'
import { SidebarLayout, SidebarLink } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { getOnboardingSpaceById } from '@/services/api/onboardings'
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
import { useState } from 'react'
import SpaceInfoSection, {
  SpaceInfoFormType,
} from '../onboarding/space-info/SpaceInfoSection'
import SpaceOffersSection from '../onboarding/space-offers/SpaceOffersSection'
import SpacePhotosSection, {
  SpacePhotosFormType,
} from '../onboarding/space-photos/SpacePhotosSection'

export enum CreateSpaceSections {
  SpaceInfo = 'space-info',
  Photos = 'photos',
  Offers = 'offers',
}

interface CreateSpaceSectionProps {
  localitiesList: LocalityListItemResponse[]
  conveniencesList: SpaceConvenienceResponse
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
  postalCodesList: PostalCodesListItemResponse[]
}

export default function CreateSpaceSection({
  localitiesList,
  conveniencesList,
  spaceTypesList,
  spaceTargetsList,
  postalCodesList,
}: CreateSpaceSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id') as string
  const [section, setSection] = useState<SidebarLink>({
    value: CreateSpaceSections.SpaceInfo,
    label: t(`sections.onboarding.navigation.${CreateSpaceSections.SpaceInfo}`),
    disabled: false,
    complete: false,
    incomplete: false,
  })
  const [sections] = useState<SidebarLink[]>([
    {
      value: CreateSpaceSections.SpaceInfo,
      label: t('sections.onboarding.navigation.space-info'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
    {
      value: CreateSpaceSections.Photos,
      label: t('sections.onboarding.navigation.photos'),
      disabled: false,
      complete: false,
      incomplete: false,
    },
    {
      value: CreateSpaceSections.Offers,
      label: t('sections.onboarding.navigation.offers'),
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
    conveniencesList.conveniences
      .concat(conveniencesList.equipement)
      .concat(conveniencesList.accessibility)
      ?.map((option) => {
        return {
          label: option.label,
          value: option.id,
          disabled: option.id === '17',
        }
      }) as Option[]
  )

  const handlePageChange = (link: SidebarLink) => {
    setSection(link)
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
              {t('sections.onboarding.create-space-title')}
            </SidebarLayout.Title>
            <SidebarLayout.Subtitle>
              {t('sections.onboarding.create-space-subtitle')}
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
                {section.value === CreateSpaceSections.SpaceInfo && (
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
                        allow_pets: data?.allow_pets,
                        allow_alcool: data?.allow_alcool,
                        allow_smoking: data?.allow_smoking,
                        allow_high_sound: data?.allow_high_sound,
                        has_security_cameras: 'false',
                        rules: data?.rules,
                        valid_url: data.title ? 'unique' : '',
                        street: data?.street,
                        postal: data?.postal,
                        locality: data?.locality,
                        city: data?.city,
                        latitude: data?.latitude?.toString(),
                        longitude: data?.longitude?.toString(),
                      } as SpaceInfoFormType
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === CreateSpaceSections.Photos && (
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
                {section.value === CreateSpaceSections.Offers && (
                  <SpaceOffersSection
                    spaceInfo={data}
                    defaultValues={
                      {
                        business_model: data?.business_model
                          ? data?.business_model
                          : [],
                        lotation_form: data?.lotation?.lotation
                          ? data?.lotation
                          : {
                              lotation: undefined,
                            },
                        min_hours_form: data?.min_hours?.min_hours
                          ? data?.min_hours
                          : undefined,
                        schedule_form: data?.schedule,
                        cancellation_policy_form: data?.cancellation_policy || {
                          base_refund: '50',
                          late_cancellation_days: '2',
                          late_cancellation_refund: '0',
                        },
                        price_form: {
                          price_model: data?.prices?.priceModel || [],
                          fixed_price_form: data?.prices?.fixed,
                          flexible_price_form: data?.prices?.flexible,
                          custom_price_form: data?.prices?.custom,
                        },
                        cleaning_fee_form: data?.cleaning_fee,
                      } as SpaceRentalFormType
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

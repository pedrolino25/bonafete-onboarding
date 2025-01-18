'use client'

import { SidebarLayout, SidebarLink } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Option } from '@/components/ui/select'
import { toast } from '@/lib/hooks/use-toast'
import {
  getOnboardingProcessesById,
  OnboardingProcessItemResponse,
  updateOnboardingStatus,
} from '@/services/api/onboardings'
import {
  LocalityListItemResponse,
  PostalCodesListItemResponse,
  SpaceConvenienceListItem,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/reference-data'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import HostInfoSection from './host-info/HostInfoSection'
import SpaceCancellationPolicySection, {
  CancellationPolicyFormType,
} from './space-cancellation-policy/SpaceCancellationPolicySection'
import SpaceInfoSection, {
  SpaceInfoFormType,
} from './space-info/SpaceInfoSection'
import SpaceOffersSection from './space-offers/SpaceOffersSection'
import SpacePhotosSection, {
  SpacePhotosFormType,
} from './space-photos/SpacePhotosSection'
import SpaceRulesSection, {
  SpaceRulesFormType,
} from './space-rules/SpaceRulesSection'

export enum OnboardingFaseStatus {
  Init = 'init',
  Incomplete = 'incomplete',
  Completed = 'completed',
}

export enum OnboardingSections {
  SpaceInfo = 'space-info',
  Photos = 'photos',
  Offers = 'offers',
  Rules = 'rules',
  CancellationPolicy = 'cancellation-policy',
  HostInfo = 'host-info',
}

interface OnboardingSectionProps {
  localitiesList: LocalityListItemResponse[]
  conveniencesList: SpaceConvenienceListItem[]
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
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY as string
  )
  const t = useTranslations()
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id') as string
  const sectionParameter = params.get('section') as string
  const [section, setSection] = useState<SidebarLink>()
  const [sections, setSections] = useState<SidebarLink[]>([])

  const { data, refetch } = useQuery({
    queryKey: ['onboarding-process', id],
    queryFn: async () => {
      return await getOnboardingProcessesById(id)
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

  const isAnyPendingSection = (values: OnboardingProcessItemResponse) => {
    if (
      (values.fase1 !== OnboardingFaseStatus.Completed &&
        values.fase1 !== OnboardingFaseStatus.Incomplete) ||
      (values.fase2 !== OnboardingFaseStatus.Completed &&
        values.fase2 !== OnboardingFaseStatus.Incomplete) ||
      (values.fase3 !== OnboardingFaseStatus.Completed &&
        values.fase3 !== OnboardingFaseStatus.Incomplete) ||
      (values.fase4 !== OnboardingFaseStatus.Completed &&
        values.fase4 !== OnboardingFaseStatus.Incomplete) ||
      (values.fase5 !== OnboardingFaseStatus.Completed &&
        values.fase5 !== OnboardingFaseStatus.Incomplete) ||
      (values.fase6 !== OnboardingFaseStatus.Completed &&
        values.fase6 !== OnboardingFaseStatus.Incomplete)
    ) {
      return true
    }
    return false
  }

  const getSection = (values: OnboardingProcessItemResponse) => {
    if (sectionParameter === OnboardingSections.Offers) {
      return {
        value: OnboardingSections.Offers,
        label: t(`sections.onboarding.navigation.${OnboardingSections.Offers}`),
        disabled: false,
        complete: false,
        incomplete: data && data.fase3 === OnboardingFaseStatus.Incomplete,
      }
    }
    if (
      values.fase1 === OnboardingFaseStatus.Completed ||
      (values.fase1 === OnboardingFaseStatus.Incomplete &&
        isAnyPendingSection(values))
    ) {
      if (
        values.fase2 === OnboardingFaseStatus.Completed ||
        (values.fase2 === OnboardingFaseStatus.Incomplete &&
          isAnyPendingSection(values))
      ) {
        if (
          values.fase3 === OnboardingFaseStatus.Completed ||
          (values.fase3 === OnboardingFaseStatus.Incomplete &&
            isAnyPendingSection(values))
        ) {
          if (
            values.fase4 === OnboardingFaseStatus.Completed ||
            (values.fase4 === OnboardingFaseStatus.Incomplete &&
              isAnyPendingSection(values))
          ) {
            if (
              values.fase5 === OnboardingFaseStatus.Completed ||
              (values.fase5 === OnboardingFaseStatus.Incomplete &&
                isAnyPendingSection(values))
            ) {
              if (
                values.fase6 === OnboardingFaseStatus.Completed ||
                (values.fase6 === OnboardingFaseStatus.Incomplete &&
                  isAnyPendingSection(values))
              ) {
                return {
                  value: OnboardingSections.HostInfo,
                  label: t(
                    `sections.onboarding.navigation.${OnboardingSections.HostInfo}`
                  ),
                  disabled: false,
                  complete: true,
                }
              } else {
                return {
                  value: OnboardingSections.HostInfo,
                  label: t(
                    `sections.onboarding.navigation.${OnboardingSections.HostInfo}`
                  ),
                  disabled: false,
                  complete: false,
                }
              }
            } else {
              return {
                value: OnboardingSections.CancellationPolicy,
                label: t(
                  `sections.onboarding.navigation.${OnboardingSections.CancellationPolicy}`
                ),
                disabled: false,
                complete: false,
                incomplete:
                  data && data.fase5 === OnboardingFaseStatus.Incomplete,
              }
            }
          } else {
            return {
              value: OnboardingSections.Rules,
              label: t(
                `sections.onboarding.navigation.${OnboardingSections.Rules}`
              ),
              disabled: false,
              complete: false,
              incomplete:
                data && data.fase4 === OnboardingFaseStatus.Incomplete,
            }
          }
        } else {
          return {
            value: OnboardingSections.Offers,
            label: t(
              `sections.onboarding.navigation.${OnboardingSections.Offers}`
            ),
            disabled: false,
            complete: false,
            incomplete: data && data.fase3 === OnboardingFaseStatus.Incomplete,
          }
        }
      } else {
        return {
          value: OnboardingSections.Photos,
          label: t(
            `sections.onboarding.navigation.${OnboardingSections.Photos}`
          ),
          disabled: false,
          complete: false,
          incomplete: data && data.fase2 === OnboardingFaseStatus.Incomplete,
        }
      }
    } else {
      return {
        value: OnboardingSections.SpaceInfo,
        label: t('sections.onboarding.navigation.intro'),
        disabled: false,
        complete: false,
        incomplete: data && data.fase1 === OnboardingFaseStatus.Incomplete,
      }
    }
  }

  useEffect(() => {
    if (data) {
      setSections([
        {
          value: OnboardingSections.SpaceInfo,
          label: t('sections.onboarding.navigation.space-info'),
          disabled: false,
          complete: data && data.fase1 === OnboardingFaseStatus.Completed,
        },
        {
          value: OnboardingSections.Photos,
          label: t('sections.onboarding.navigation.photos'),
          disabled: data && data.fase1 !== OnboardingFaseStatus.Completed,
          complete: data && data.fase2 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase2 === OnboardingFaseStatus.Incomplete,
        },
        {
          value: OnboardingSections.Offers,
          label: t('sections.onboarding.navigation.offers'),
          disabled:
            data &&
            data.fase2 !== OnboardingFaseStatus.Completed &&
            data.fase2 !== OnboardingFaseStatus.Incomplete,
          complete: data && data.fase3 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase3 === OnboardingFaseStatus.Incomplete,
        },
        {
          value: OnboardingSections.Rules,
          label: t('sections.onboarding.navigation.rules'),
          disabled:
            data &&
            data.fase3 !== OnboardingFaseStatus.Completed &&
            data.fase3 !== OnboardingFaseStatus.Incomplete,
          complete: data && data.fase4 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase4 === OnboardingFaseStatus.Incomplete,
        },

        {
          value: OnboardingSections.CancellationPolicy,
          label: t('sections.onboarding.navigation.cancellation-policy'),
          disabled:
            data &&
            data.fase4 !== OnboardingFaseStatus.Completed &&
            data.fase4 !== OnboardingFaseStatus.Incomplete,
          complete: data && data.fase5 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase5 === OnboardingFaseStatus.Incomplete,
        },
        {
          value: OnboardingSections.HostInfo,
          label: t('sections.onboarding.navigation.host-info'),
          disabled:
            data &&
            data.fase5 !== OnboardingFaseStatus.Completed &&
            data.fase5 !== OnboardingFaseStatus.Incomplete,
          complete: data && data.fase6 === OnboardingFaseStatus.Completed,
          incomplete: data && data.fase6 === OnboardingFaseStatus.Incomplete,
        },
      ])
      const link = getSection(data)
      setSection(link)
      const searchParams = new URLSearchParams(params.toString())
      searchParams.set('section', link.value)
      router.replace(`?${searchParams.toString()}`)
    }
  }, [data])

  const handlePageChange = (link: SidebarLink) => {
    setSection(link)
    const searchParams = new URLSearchParams(params.toString())
    searchParams.set('section', link.value)
    searchParams.delete('sub-section')
    router.replace(`?${searchParams.toString()}`)
  }

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
              {t('sections.onboarding.title')}
            </SidebarLayout.Title>
            <SidebarLayout.Subtitle>
              {t('sections.onboarding.subtitle')}
            </SidebarLayout.Subtitle>
          </SidebarLayout.Header>
          {data && data.id && sections.length > 0 && section && (
            <SidebarLayout.Main>
              <SidebarLayout.Sidebar
                onChange={handlePageChange}
                value={section}
                items={sections}
              />
              <SidebarLayout.Container>
                {section.value === OnboardingSections.SpaceInfo && (
                  <SpaceInfoSection
                    onboardingId={data.id}
                    spaceInfo={data.space}
                    localitiesList={localitiesList}
                    conveniencesList={conveniencesList}
                    spaceTypesList={spaceTypesList}
                    spaceTargetsList={spaceTargetsList}
                    postalCodesList={postalCodesList}
                    defaultValues={
                      {
                        type: data.space?.type
                          ? [
                              {
                                label: data.space.type.label,
                                value: data.space.type.id,
                              },
                            ]
                          : [
                              {
                                label: data.application?.type.label,
                                value: data.application?.type.id,
                              },
                            ],
                        targets:
                          data.space?.targets && data.space.targets.length > 0
                            ? data.space?.targets?.map((item) => {
                                return {
                                  label: item.label,
                                  value: item.id,
                                }
                              })
                            : data.application?.targets?.map((item) => {
                                return {
                                  label: item.label,
                                  value: item.id,
                                }
                              }),
                        conveniences:
                          data.space?.conveniences &&
                          data.space.conveniences.length > 0
                            ? data.space?.conveniences?.map((item) => {
                                return {
                                  label: item.label,
                                  value: item.id,
                                  disabled: item.id === '17',
                                }
                              })
                            : conveniencesOptions?.filter(
                                (item) => item.value === '17'
                              ),
                        title: data.space?.title,
                        tour: data.space?.tour || '',
                        description: data.space?.description,
                        allow_pets: data.space?.allow_pets,
                        allow_alcool: data.space?.allow_alcool,
                        allow_smoking: data.space?.allow_smoking,
                        allow_high_sound: data.space?.allow_high_sound,
                        has_security_cameras: 'false',
                        rules: data.space?.rules,
                        valid_url: data.space.title ? 'unique' : '',
                        street: data.space?.street,
                        postal: data.space?.postal,
                        locality: data.space?.locality,
                        city: data.space?.city,
                        latitude: data.space?.latitude?.toString(),
                        longitude: data.space?.longitude?.toString(),
                        schedule_form: data?.space?.schedule,
                        lotation_form: data?.space?.lotation?.lotation
                          ? data?.space?.lotation
                          : {
                              lotation:
                                data?.application.max_of_persons?.toString(),
                            },
                      } as SpaceInfoFormType
                    }
                    completed={
                      data && data.fase1 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                    showUpdateOnboardingStatus={
                      data.fase1 === OnboardingFaseStatus.Completed
                    }
                    onUpdateOnboardingStatus={() => {
                      updateOnboardingStatusMutation.mutate({
                        onboarding_id: data.id,
                        flow: OnboardingSections.SpaceInfo,
                        status: OnboardingFaseStatus.Incomplete,
                      })
                    }}
                  />
                )}
                {section.value === OnboardingSections.Photos && (
                  <SpacePhotosSection
                    onboardingId={data.id}
                    spaceInfo={data.space}
                    showUpdateOnboardingStatus={
                      data.fase3 !== OnboardingFaseStatus.Incomplete
                    }
                    onUpdateOnboardingStatus={() => {
                      updateOnboardingStatusMutation.mutate({
                        onboarding_id: data.id,
                        flow: OnboardingSections.Photos,
                        status: OnboardingFaseStatus.Incomplete,
                      })
                    }}
                    defaultValues={
                      {
                        photos:
                          (data.space?.photos || []).length > 0
                            ? data.space?.photos?.map((item) => {
                                return {
                                  path: item,
                                  file: undefined,
                                }
                              })
                            : (data.application.photos || [])?.map((item) => {
                                return {
                                  path: item,
                                  file: undefined,
                                }
                              }),
                      } as SpacePhotosFormType
                    }
                    completed={
                      data && data.fase2 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.Offers && (
                  <SpaceOffersSection
                    onboardingId={data.id}
                    spaceInfo={data.space}
                    completed={
                      data && data.fase3 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.Rules && (
                  <SpaceRulesSection
                    onboardingId={data.id}
                    spaceInfo={data.space}
                    defaultValues={
                      {
                        allow_pets: data.space?.allow_pets,
                        allow_alcool: data.space?.allow_alcool,
                        allow_smoking: data.space?.allow_smoking,
                        allow_high_sound: data.space?.allow_high_sound,
                        has_security_cameras: 'false',
                        rules: data.space?.rules,
                      } as SpaceRulesFormType
                    }
                    completed={
                      data && data.fase4 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}

                {section.value === OnboardingSections.CancellationPolicy && (
                  <SpaceCancellationPolicySection
                    onboardingId={data.id}
                    spaceInfo={data.space}
                    defaultValues={
                      {
                        base_refund:
                          data.space.cancellation_policy?.base_refund,
                        late_cancellation_days:
                          data.space.cancellation_policy
                            ?.late_cancellation_days,
                        late_cancellation_refund:
                          data.space.cancellation_policy
                            ?.late_cancellation_refund,
                      } as CancellationPolicyFormType
                    }
                    completed={
                      data && data.fase5 === OnboardingFaseStatus.Completed
                    }
                    refetch={refetch}
                  />
                )}
                {section.value === OnboardingSections.HostInfo && (
                  <Elements stripe={stripePromise}>
                    <HostInfoSection
                      onboardingInfo={data}
                      completed={
                        data && data.fase6 === OnboardingFaseStatus.Completed
                      }
                      refetch={refetch}
                    />
                  </Elements>
                )}
              </SidebarLayout.Container>
            </SidebarLayout.Main>
          )}
        </SidebarLayout.Root>
      </Navbar>
    </main>
  )
}

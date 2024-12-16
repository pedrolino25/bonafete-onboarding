'use client'

import { SidebarLayout, SidebarLink } from '@/components/layouts/sidebar'
import { Navbar } from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/hooks/use-toast'
import {
  ApplicationStatus,
  submitApplication,
  UserApplicationsResponse,
} from '@/services/api/applications'
import {
  LocalityListItemResponse,
  SpaceTargetListItemResponse,
  SpaceTypeListItemResponse,
} from '@/services/api/static'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SubmitApplicationInfoSection, {
  SubmitApplicationInfoFormType,
} from './submit-application-info/SubmitApplicationInfoSection'
import SubmitApplicationOffersSection from './submit-application-offers/SubmitApplicationOffersSection'
import SubmitApplicationPhotosSection from './submit-application-photos/SubmitApplicationPhotosSection'

export enum SubmitApplicationSections {
  SpaceInfo = 'space-info',
  Photos = 'photos',
  Offers = 'offers',
}

interface SubmitApplicationSectionProps {
  localitiesList: LocalityListItemResponse[]
  spaceTypesList: SpaceTypeListItemResponse[]
  spaceTargetsList: SpaceTargetListItemResponse[]
}

export default function SubmitApplicationSection({
  localitiesList,
  spaceTypesList,
  spaceTargetsList,
}: SubmitApplicationSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const [userApplication, setUserApplication] =
    useState<UserApplicationsResponse>()

  const [section, setSection] = useState<SidebarLink>({
    value: SubmitApplicationSections.SpaceInfo,
    label: t(
      `sections.onboarding.navigation.${SubmitApplicationSections.SpaceInfo}`
    ),
    disabled: false,
    complete: false,
    incomplete: false,
  })

  const [sections, setSections] = useState<SidebarLink[]>([
    {
      value: SubmitApplicationSections.SpaceInfo,
      label: t('sections.onboarding.navigation.space-info'),
      disabled: section.value !== SubmitApplicationSections.SpaceInfo,
      complete: false,
      incomplete: false,
    },
    {
      value: SubmitApplicationSections.Photos,
      label: t('sections.onboarding.navigation.photos'),
      disabled: section.value !== SubmitApplicationSections.Photos,
      complete: false,
      incomplete: false,
    },
    {
      value: SubmitApplicationSections.Offers,
      label: t('sections.onboarding.navigation.offers'),
      disabled: section.value !== SubmitApplicationSections.Offers,
      complete: false,
      incomplete: false,
    },
  ])

  const handleChangePage = (link: SubmitApplicationSections) => {
    const page = sections.filter((item) => item.value === link)[0]
    setSection(page)
    setSections([
      {
        value: SubmitApplicationSections.SpaceInfo,
        label: t('sections.onboarding.navigation.space-info'),
        disabled: false,
        complete: page.value !== SubmitApplicationSections.SpaceInfo,
        incomplete: false,
      },
      {
        value: SubmitApplicationSections.Photos,
        label: t('sections.onboarding.navigation.photos'),
        disabled: page.value === SubmitApplicationSections.SpaceInfo,
        complete: page.value === SubmitApplicationSections.Offers,
        incomplete: false,
      },
      {
        value: SubmitApplicationSections.Offers,
        label: t('sections.onboarding.navigation.offers'),
        disabled: page.value !== SubmitApplicationSections.Offers,
        complete: false,
        incomplete: false,
      },
    ])
  }

  const submitApplicationInfo = (values: SubmitApplicationInfoFormType) => {
    submitApplicationMutation.mutate({
      id: values?.id,
      lead_id: values?.lead_id,
      email: values.email,
      locality: JSON.stringify(values.locality?.[0]),
      maxOfPersons: values.max_of_persons,
      businessModel: values.business_model?.[0]?.value,
      targets: JSON.stringify(
        values.targets?.map((item) => {
          return {
            id: item.value,
            label: item.label,
          }
        })
      ),
      type: JSON.stringify(
        values.type?.map((item) => {
          return {
            id: item.value,
            label: item.label,
          }
        })[0]
      ),
      status: userApplication?.status,
      photos: userApplication?.photos,
      offers: userApplication?.offers,
    })
  }

  const submitApplicationPhotos = (values: string[]) => {
    submitApplicationMutation.mutate({
      id: userApplication?.id,
      lead_id: userApplication?.lead_id as string,
      email: userApplication?.email as string,
      locality: userApplication?.locality as string,
      maxOfPersons: userApplication?.maxOfPersons as string,
      businessModel: userApplication?.businessModel as string,
      targets: userApplication?.targets as string,
      type: userApplication?.type as string,
      status: userApplication?.status,
      photos: JSON.stringify(values),
      offers: userApplication?.offers,
    })
  }

  const submitApplicationOffers = (values: string[]) => {
    submitApplicationMutation.mutate({
      id: userApplication?.id,
      lead_id: userApplication?.lead_id as string,
      email: userApplication?.email as string,
      locality: userApplication?.locality as string,
      maxOfPersons: userApplication?.maxOfPersons as string,
      businessModel: userApplication?.businessModel as string,
      targets: userApplication?.targets as string,
      type: userApplication?.type as string,
      status: ApplicationStatus.Sent,
      photos: userApplication?.photos,
      offers: JSON.stringify(values),
    })
  }

  const submitApplicationMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: (data) => {
      setUserApplication(data)
      if (section.value === SubmitApplicationSections.SpaceInfo) {
        handleChangePage(SubmitApplicationSections.Photos)
      } else if (section.value === SubmitApplicationSections.Photos) {
        handleChangePage(SubmitApplicationSections.Offers)
      } else if (section.value === SubmitApplicationSections.Offers) {
        toast({
          variant: 'success',
          title: t('success'),
          description: t('success-messages.submit'),
        })
        router.push('/applications/sent')
      }
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
              {t('sections.onboarding.submit-application-title')}
            </SidebarLayout.Title>
            <SidebarLayout.Subtitle>
              {t('sections.onboarding.submit-application-subtitle')}
            </SidebarLayout.Subtitle>
          </SidebarLayout.Header>
          <SidebarLayout.Main>
            <SidebarLayout.Sidebar
              onChange={(link) =>
                handleChangePage(link.value as SubmitApplicationSections)
              }
              value={section}
              items={sections}
            />
            <SidebarLayout.Container>
              {section.value === SubmitApplicationSections.SpaceInfo && (
                <SubmitApplicationInfoSection
                  localitiesList={localitiesList}
                  spaceTypesList={spaceTypesList}
                  spaceTargetsList={spaceTargetsList}
                  defaultValues={{
                    id: userApplication?.id,
                    lead_id: userApplication?.id || '',
                    email: userApplication?.email || '',
                    type: userApplication?.type
                      ? [
                          {
                            value: JSON.parse(userApplication?.type)?.id,
                            label: JSON.parse(userApplication?.type)?.label,
                          },
                        ]
                      : [],
                    targets: userApplication?.targets
                      ? JSON.parse(userApplication?.targets)?.map(
                          (item: { id: string; label: string }) => {
                            return {
                              value: item.id,
                              label: item.label,
                            }
                          }
                        )
                      : [],
                    locality: userApplication?.locality
                      ? [
                          {
                            value: JSON.parse(userApplication?.locality)?.value,
                            label: JSON.parse(userApplication?.locality)?.label,
                          },
                        ]
                      : [],
                    max_of_persons: userApplication?.maxOfPersons || '',
                    business_model: userApplication?.businessModel
                      ? [
                          {
                            value: userApplication?.businessModel,
                            label: `business-model-options.${userApplication.businessModel}`,
                          },
                        ]
                      : [],
                    email_validated: 'true',
                  }}
                  onGetUserApplication={(values) => setUserApplication(values)}
                  onChange={submitApplicationInfo}
                />
              )}
              {section.value === SubmitApplicationSections.Photos &&
                userApplication?.id && (
                  <SubmitApplicationPhotosSection
                    applicationId={userApplication?.id}
                    defaultValues={{
                      photos: userApplication?.photos
                        ? JSON.parse(userApplication?.photos)?.map(
                            (item: string) => {
                              return {
                                path: item,
                                file: undefined,
                              }
                            }
                          )
                        : [],
                    }}
                    onChange={submitApplicationPhotos}
                  />
                )}
              {section.value === SubmitApplicationSections.Offers &&
                userApplication?.id && (
                  <SubmitApplicationOffersSection
                    defaultValues={
                      userApplication?.offers
                        ? {
                            files: JSON.parse(userApplication?.offers)?.map(
                              (item: string[]) => {
                                return {
                                  file: undefined,
                                  path: item,
                                }
                              }
                            ),
                          }
                        : { files: [] }
                    }
                    applicationId={userApplication?.id}
                    onChange={submitApplicationOffers}
                  />
                )}
            </SidebarLayout.Container>
          </SidebarLayout.Main>
        </SidebarLayout.Root>
      </Navbar>
    </main>
  )
}

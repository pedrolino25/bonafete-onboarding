'use client'

import { Layout, SidebarLink } from '@/components/layout/layout'
import { Navbar } from '@/components/navigation/Navbar'
import OnboardingIntro from '@/components/sections/onboarding/intro'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

enum OnboardingSection {
  Intro = 'intro',
  SpaceInfo = 'space-info',
  Offers = 'offers',
  HostInfo = 'host-info',
}
export default function EditProcess() {
  const t = useTranslations()
  const router = useRouter()

  const [section, setSection] = useState<SidebarLink>({
    value: OnboardingSection.Intro,
    label: t('sections.onboarding.navigation.intro'),
    disabled: false,
    complete: false,
  })

  const [sections] = useState<SidebarLink[]>([
    {
      value: OnboardingSection.Intro,
      label: t('sections.onboarding.navigation.intro'),
      disabled: false,
      complete: false,
    },
    {
      value: OnboardingSection.SpaceInfo,
      label: t('sections.onboarding.navigation.space-info'),
      disabled: true,
      complete: false,
    },
    {
      value: OnboardingSection.Offers,
      label: t('sections.onboarding.navigation.offers'),
      disabled: true,
      complete: false,
    },
    {
      value: OnboardingSection.HostInfo,
      label: t('sections.onboarding.navigation.host-info'),
      disabled: true,
      complete: false,
    },
  ])

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
        <Layout.Root>
          <Layout.Header>
            <Layout.Title>{t('sections.onboarding.title')}</Layout.Title>
            <Layout.Subtitle>
              {t('sections.onboarding.subtitle')}
            </Layout.Subtitle>
          </Layout.Header>
          <Layout.Main>
            <Layout.Sidebar
              onChange={handlePageChange}
              value={section}
              items={sections}
            />
            <Layout.Container>
              {section.value === OnboardingSection.Intro && <OnboardingIntro />}
              {section.value === OnboardingSection.SpaceInfo && (
                <OnboardingIntro />
              )}
              {section.value === OnboardingSection.Offers && (
                <OnboardingIntro />
              )}
              {section.value === OnboardingSection.HostInfo && (
                <OnboardingIntro />
              )}
            </Layout.Container>
          </Layout.Main>
        </Layout.Root>
      </Navbar>
    </main>
  )
}

'use client'

import {
  ApplicationOnboardingStatus,
  getOnboardingsProcessesListByStatus,
} from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'

const OnboardingsListSection = dynamic(
  () => import('@/components/sections/onboardings-list/OnboardingsListSection'),
  { ssr: false }
)

export default function Processes() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['onboarding-processes', ApplicationOnboardingStatus.Scheduled],
    queryFn: async () => {
      return await getOnboardingsProcessesListByStatus(
        ApplicationOnboardingStatus.Scheduled
      )
    },
  })
  return (
    <OnboardingsListSection
      data={data}
      isPending={isPending}
      type={ApplicationOnboardingStatus.Scheduled}
      refresh={refetch}
    />
  )
}

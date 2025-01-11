'use client'

import {
  ApplicationOnboardingStatus,
  getOnboardingsProcessesListByStatus,
} from '@/services/api/onboardings'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'

const OnboardingsListSection = dynamic(
  () => import('@/components/sections/onboardings-list/OnboardingsListSection'),
  { ssr: false }
)

export default function Processes() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['onboarding-processes', ApplicationOnboardingStatus.Archived],
    queryFn: async () => {
      return await getOnboardingsProcessesListByStatus(
        ApplicationOnboardingStatus.Archived
      )
    },
  })
  return (
    <OnboardingsListSection
      data={data}
      isPending={isPending}
      type={ApplicationOnboardingStatus.Archived}
      refresh={refetch}
    />
  )
}

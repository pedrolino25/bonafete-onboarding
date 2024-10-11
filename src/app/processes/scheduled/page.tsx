'use client'

import OnboardingsListSection from '@/components/sections/onboardings-list/OnboardingsListSection'
import {
  ApplicationOnboardingStatus,
  getOnboardingsProcessesListByStatus,
} from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'

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

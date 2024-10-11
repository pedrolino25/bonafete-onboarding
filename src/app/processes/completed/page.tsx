'use client'

import OnboardingsListSection from '@/components/sections/onboardings-list/OnboardingsListSection'
import {
  ApplicationOnboardingStatus,
  getOnboardingsProcessesListByStatus,
} from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'

export default function Processes() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['onboarding-processes', ApplicationOnboardingStatus.Completed],
    queryFn: async () => {
      return await getOnboardingsProcessesListByStatus(
        ApplicationOnboardingStatus.Completed
      )
    },
  })
  return (
    <OnboardingsListSection
      data={data}
      isPending={isPending}
      type={ApplicationOnboardingStatus.Completed}
      refresh={refetch}
    />
  )
}

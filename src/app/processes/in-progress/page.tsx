'use client'

import OnboardingsListSection from '@/components/sections/onboardings-list/OnboardingsListSection'
import {
  ApplicationOnboardingStatus,
  getOnboardingsProcessesListByStatus,
} from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'

export default function Processes() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['applications', ApplicationOnboardingStatus.InProgress],
    queryFn: async () => {
      return await getOnboardingsProcessesListByStatus(
        ApplicationOnboardingStatus.InProgress
      )
    },
  })
  return (
    <OnboardingsListSection
      data={data}
      isPending={isPending}
      type={ApplicationOnboardingStatus.InProgress}
      refresh={refetch}
    />
  )
}

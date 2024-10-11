'use client'

import OnboardingsListSection from '@/components/sections/onboardings-list/OnboardingsListSection'
import {
  ApplicationOnboardingStatus,
  getOnboardingsProcessesListByStatus,
} from '@/services/api/onboarding-processes'
import { useQuery } from '@tanstack/react-query'

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

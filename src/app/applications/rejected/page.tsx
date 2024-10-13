'use client'

import ApplicationsListSection from '@/components/sections/applications-list/ApplicationsListSection'
import {
  ApplicationStatus,
  getApplicationsListByStatus,
} from '@/services/api/applications'
import { useQuery } from '@tanstack/react-query'

export default function Applications() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['applications', ApplicationStatus.Rejected],
    queryFn: async () => {
      return await getApplicationsListByStatus(ApplicationStatus.Rejected)
    },
  })
  return (
    <ApplicationsListSection
      data={data}
      isPending={isPending}
      type={ApplicationStatus.Rejected}
      refresh={refetch}
    />
  )
}

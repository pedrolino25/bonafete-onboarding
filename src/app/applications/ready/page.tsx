'use client'

import {
  ApplicationStatus,
  getApplicationsListByStatus,
} from '@/services/api/applications'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
const ApplicationsListSection = dynamic(
  () =>
    import('@/components/sections/applications-list/ApplicationsListSection'),
  { ssr: false }
)

export default function Applications() {
  const { isPending, data, refetch } = useQuery({
    queryKey: ['applications', ApplicationStatus.Ready],
    queryFn: async () => {
      return await getApplicationsListByStatus(ApplicationStatus.Ready)
    },
  })
  return (
    <ApplicationsListSection
      data={data}
      isPending={isPending}
      type={ApplicationStatus.Ready}
      refresh={refetch}
    />
  )
}

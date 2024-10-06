'use client'

import HostsListSection from '@/components/sections/hosts-list/HostsListSection'
import { getHostsListByStatus, HostsStatus } from '@/services/api/hosts'
import { useQuery } from '@tanstack/react-query'

export default function Hosts() {
  const { isPending, data } = useQuery({
    queryKey: ['hosts', HostsStatus.Active],
    queryFn: async () => {
      return await getHostsListByStatus(HostsStatus.Active)
    },
  })

  return <HostsListSection data={data} isPending={isPending} />
}

'use client'

import SpacesListSection from '@/components/sections/spaces-list/SpacesListSection'
import { getSpacesListByStatus, SpaceStatus } from '@/services/api/spaces'
import { useQuery } from '@tanstack/react-query'

export default function Spaces() {
  const { isPending, data } = useQuery({
    queryKey: ['spaces', SpaceStatus.Pending],
    queryFn: async () => {
      return await getSpacesListByStatus(SpaceStatus.Pending)
    },
  })

  return <SpacesListSection data={data} isPending={isPending} />
}

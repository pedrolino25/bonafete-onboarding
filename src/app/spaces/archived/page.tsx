'use client'

import SpacesListSection from '@/components/sections/spaces-list/SpacesListSection'
import { getSpacesListByStatus, SpaceStatus } from '@/services/api/spaces'
import { useQuery } from '@tanstack/react-query'

export default function Spaces() {
  const { isPending, data } = useQuery({
    queryKey: ['spaces', SpaceStatus.Archived],
    queryFn: async () => {
      return await getSpacesListByStatus(SpaceStatus.Archived)
    },
  })

  return <SpacesListSection data={data} isPending={isPending} />
}

'use client'
import { ApplicationsChart } from '@/components/charts/applications-chart'
import HostsChart from '@/components/charts/hosts-chart'
import { OnboardingsChart } from '@/components/charts/onboardings-chart'
import SpacesChart from '@/components/charts/spaces-chart'
import { Navbar } from '@/components/navigation/Navbar'
import { getStatistics } from '@/services/api/onboardings'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const { data } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      return await getStatistics()
    },
  })

  return (
    <Navbar>
      <main>
        <div className="p-4">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 max-sm:w-full gap-6">
            {data?.hosts && <HostsChart data={data?.hosts} />}
            {data?.spaces && <SpacesChart data={data?.spaces} />}
            {data?.applications && (
              <ApplicationsChart data={data?.applications} />
            )}
            {data?.onboardings && <OnboardingsChart data={data?.onboardings} />}
          </div>
        </div>
      </main>
    </Navbar>
  )
}

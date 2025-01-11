'use client'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { HostStatus, StatisticItem } from '@/services/api/onboardings'
import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface HostsChartProps {
  data: StatisticItem[]
}

export default function HostsChart({ data }: HostsChartProps) {
  const t = useTranslations()
  const chartData = [
    {
      status: HostStatus.Completed,
      count:
        data?.filter((item) => item.status === HostStatus.Completed)?.[0]
          ?.count || 0,
      fill: 'var(--color-completed)',
    },
    {
      status: HostStatus.Pending,
      count:
        data?.filter((item) => item.status === HostStatus.Pending)?.[0]
          ?.count || 0,
      fill: 'var(--color-pending)',
    },
    {
      status: HostStatus.Archived,
      count:
        data?.filter((item) => item.status === HostStatus.Archived)?.[0]
          ?.count || 0,
      fill: 'var(--color-archived)',
    },
    {
      status: HostStatus.Suspended,
      count:
        data?.filter((item) => item.status === HostStatus.Suspended)?.[0]
          ?.count || 0,
      fill: 'var(--color-suspended)',
    },
  ]

  const chartConfig = {
    [HostStatus.Completed]: {
      label: t('charts.active-hosts'),
      color: 'hsl(var(--chart-2))',
    },
    [HostStatus.Pending]: {
      label: t('charts.pending-hosts'),
      color: 'hsl(var(--chart-3))',
    },
    [HostStatus.Archived]: {
      label: t('charts.archived-hosts'),
      color: 'hsl(var(--chart-4))',
    },
    [HostStatus.Suspended]: {
      label: t('charts.suspended-hosts'),
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>{t('charts.hosts')}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[350px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={80}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData
                            ?.filter(
                              (item) => item.status === HostStatus.Completed
                            )?.[0]
                            ?.count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t('charts.hosts-active')}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground text-sm leading-none">
          {t('charts.hosts-total')?.replace('$1', total.toLocaleString())}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

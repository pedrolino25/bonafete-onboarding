'use client'

import { Label, Pie, PieChart } from 'recharts'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { ApplicationStatus } from '@/services/api/applications'
import { StatisticItem } from '@/services/api/onboardings'
import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface ApplicationsChartProps {
  data: StatisticItem[]
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
  const t = useTranslations()
  const chartData = [
    {
      status: ApplicationStatus.Spontaneous,
      count:
        data?.filter(
          (item) => item.status === ApplicationStatus.Spontaneous
        )?.[0]?.count || 0,
      fill: 'var(--color-spontaneous)',
    },
    {
      status: ApplicationStatus.Sent,
      count:
        data?.filter((item) => item.status === ApplicationStatus.Sent)?.[0]
          ?.count || 0,
      fill: 'var(--color-sent)',
    },
    {
      status: ApplicationStatus.Ready,
      count:
        data?.filter((item) => item.status === ApplicationStatus.Ready)?.[0]
          ?.count || 0,
      fill: 'var(--color-ready)',
    },
    {
      status: ApplicationStatus.Onboarding,
      count:
        data?.filter(
          (item) => item.status === ApplicationStatus.Onboarding
        )?.[0]?.count || 0,
      fill: 'var(--color-onboarding)',
    },
    {
      status: ApplicationStatus.Completed,
      count:
        data?.filter((item) => item.status === ApplicationStatus.Completed)?.[0]
          ?.count || 0,
      fill: 'var(--color-completed)',
    },
  ]

  const chartConfig = {
    [ApplicationStatus.Spontaneous]: {
      label: t('charts.spontaneous-applications'),
      color: 'hsl(var(--chart-4))',
    },
    [ApplicationStatus.Sent]: {
      label: t('charts.sent-applications'),
      color: 'hsl(var(--chart-5))',
    },
    [ApplicationStatus.Ready]: {
      label: t('charts.ready-applications'),
      color: 'hsl(var(--chart-1))',
    },
    [ApplicationStatus.Onboarding]: {
      label: t('charts.onboarding-applications'),
      color: 'hsl(var(--chart-3))',
    },
    [ApplicationStatus.Completed]: {
      label: t('charts.completed-applications'),
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>{t('charts.applications')}</CardTitle>
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
                              (item) =>
                                item.status === ApplicationStatus.Completed
                            )?.[0]
                            ?.count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t('charts.applications-complete')}
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
          {t('charts.applications-total')?.replace(
            '$1',
            total.toLocaleString()
          )}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

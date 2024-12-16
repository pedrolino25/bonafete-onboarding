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
import {
  ApplicationOnboardingStatus,
  StatisticItem,
} from '@/services/api/onboardings'
import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface OnboardingsChartProps {
  data: StatisticItem[]
}

export function OnboardingsChart({ data }: OnboardingsChartProps) {
  const t = useTranslations()
  const chartData = [
    {
      status: ApplicationOnboardingStatus.InProgress,
      count:
        data?.filter(
          (item) => item.status === ApplicationOnboardingStatus.InProgress
        )?.[0]?.count || 0,
      fill: 'var(--color-progress)',
    },
    {
      status: ApplicationOnboardingStatus.Archived,
      count:
        data?.filter(
          (item) => item.status === ApplicationOnboardingStatus.Archived
        )?.[0]?.count || 0,
      fill: 'var(--color-archived)',
    },
    {
      status: ApplicationOnboardingStatus.Scheduled,
      count:
        data?.filter(
          (item) => item.status === ApplicationOnboardingStatus.Scheduled
        )?.[0]?.count || 0,
      fill: 'var(--color-scheduled)',
    },
    {
      status: ApplicationOnboardingStatus.Completed,
      count:
        data?.filter(
          (item) => item.status === ApplicationOnboardingStatus.Completed
        )?.[0]?.count || 0,
      fill: 'var(--color-completed)',
    },
  ]

  const chartConfig = {
    [ApplicationOnboardingStatus.InProgress]: {
      label: t('charts.in-progress-onboardings'),
      color: 'hsl(var(--chart-4))',
    },
    [ApplicationOnboardingStatus.Archived]: {
      label: t('charts.archived-onboardings'),
      color: 'hsl(var(--chart-1))',
    },
    [ApplicationOnboardingStatus.Scheduled]: {
      label: t('charts.scheduled-onboardings'),
      color: 'hsl(var(--chart-3))',
    },
    [ApplicationOnboardingStatus.Completed]: {
      label: t('charts.completed-onboardings'),
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>{t('charts.onboardings')}</CardTitle>
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
                                item.status ===
                                ApplicationOnboardingStatus.Completed
                            )?.[0]
                            ?.count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t('charts.onboardings-complete')}
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
          {t('charts.onboardings-total')?.replace('$1', total.toLocaleString())}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

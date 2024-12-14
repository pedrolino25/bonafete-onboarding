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
import { useMemo } from 'react'

interface ApplicationsChartProps {
  data: StatisticItem[]
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
  const chartData = [
    {
      status: ApplicationStatus.New,
      count:
        data?.filter((item) => item.status === ApplicationStatus.New)?.[0]
          ?.count || 0,
      fill: 'var(--color-new)',
    },
    {
      status: ApplicationStatus.Accepted,
      count:
        data?.filter((item) => item.status === ApplicationStatus.Accepted)?.[0]
          ?.count || 0,
      fill: 'var(--color-accepted)',
    },
    {
      status: ApplicationStatus.Rejected,
      count:
        data?.filter((item) => item.status === ApplicationStatus.Rejected)?.[0]
          ?.count || 0,
      fill: 'var(--color-rejected)',
    },
    {
      status: ApplicationStatus.Scheduled,
      count:
        data?.filter((item) => item.status === ApplicationStatus.Scheduled)?.[0]
          ?.count || 0,
      fill: 'var(--color-scheduled)',
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
    [ApplicationStatus.New]: {
      label: 'Novas',
      color: 'hsl(var(--chart-4))',
    },
    [ApplicationStatus.Accepted]: {
      label: 'Aceites',
      color: 'hsl(var(--chart-5))',
    },
    [ApplicationStatus.Rejected]: {
      label: 'Rejeitadas',
      color: 'hsl(var(--chart-1))',
    },
    [ApplicationStatus.Scheduled]: {
      label: 'Agendadas',
      color: 'hsl(var(--chart-3))',
    },
    [ApplicationStatus.Completed]: {
      label: 'Concluídas',
      color: 'hsl(var(--chart-2))',
    },
  } satisfies ChartConfig

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>Inscrições</CardTitle>
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
                          Inscriçoes completas
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
          Total de {total.toLocaleString()} inscrições{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

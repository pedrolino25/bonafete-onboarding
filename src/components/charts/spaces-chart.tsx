'use client'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { StatisticItem } from '@/services/api/onboardings'
import { SpaceStatus } from '@/services/api/spaces'
import { TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'

interface SpacesChartProps {
  data: StatisticItem[]
}

export default function SpacesChart({ data }: SpacesChartProps) {
  const chartData = [
    {
      status: SpaceStatus.Active,
      count:
        data?.filter((item) => item.status === SpaceStatus.Active)?.[0]
          ?.count || 0,
      fill: 'var(--color-published)',
    },
    {
      status: SpaceStatus.Pending,
      count:
        data?.filter((item) => item.status === SpaceStatus.Pending)?.[0]
          ?.count || 0,
      fill: 'var(--color-pending)',
    },
    {
      status: SpaceStatus.Archived,
      count:
        data?.filter((item) => item.status === SpaceStatus.Archived)?.[0]
          ?.count || 0,
      fill: 'var(--color-archived)',
    },
    {
      status: SpaceStatus.Draft,
      count:
        data?.filter((item) => item.status === SpaceStatus.Draft)?.[0]?.count ||
        0,
      fill: 'var(--color-draft)',
    },
  ]

  const chartConfig = {
    [SpaceStatus.Active]: {
      label: 'Ativos',
      color: 'hsl(var(--chart-2))',
    },
    [SpaceStatus.Pending]: {
      label: 'Pendentes',
      color: 'hsl(var(--chart-4))',
    },
    [SpaceStatus.Archived]: {
      label: 'Arquivados',
      color: 'hsl(var(--chart-1))',
    },
    [SpaceStatus.Draft]: {
      label: 'Rascunhos',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig

  const total = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>Espaços</CardTitle>
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
                            ?.filter((item) => item.status === 'published')?.[0]
                            ?.count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Espaços publicados
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
          Total de {total.toLocaleString()} espaços{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  )
}

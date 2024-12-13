'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { OnboardingsListFilterMenu } from '@/components/menus/OnboardingsListFilterMenu'
import { DataTable } from '@/components/table/table'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuthenticatedUser } from '@/lib/hooks/authenticated-user'
import { useToast } from '@/lib/hooks/use-toast'
import {
  ApplicationOnboardingStatus,
  archiveOnboardingProcess,
  OnboardingProcessListItemResponse,
  reasignOnboardingProcess,
  scheduleOnboardingProcess,
} from '@/services/api/onboardings'
import { useMutation } from '@tanstack/react-query'
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import {
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleX,
  Filter,
  Search,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { OnboardingFaseStatus } from '../onboarding/OnboardingSection'

interface OnboardingsListSectionProps {
  data: OnboardingProcessListItemResponse[] | undefined
  isPending: boolean
  type: ApplicationOnboardingStatus
  refresh: () => void
}

export default function OnboardingsListSection({
  data,
  isPending,
  type,
  refresh,
}: OnboardingsListSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const user = useAuthenticatedUser()
  const { toast } = useToast()

  const columns: ColumnDef<OnboardingProcessListItemResponse>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      header: () => {
        return (
          <div className="px-3.5 text-sm font-extrabold text-utility-gray-900">
            {t('columns.id')}
          </div>
        )
      },
    },
    ...(type === ApplicationOnboardingStatus.Scheduled
      ? [
          {
            accessorKey: 'schedule_date',
            id: 'schedule_date',
            header: ({ column }: any) => {
              return (
                <Button
                  variant="link"
                  color="secondary"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                  }
                >
                  {t('columns.schedule_date')}
                  {column.getIsSorted() === 'desc' ? (
                    <ChevronUp className="ml-2 h-3 w-3" />
                  ) : column.getIsSorted() === 'asc' ? (
                    <ChevronDown className="ml-2 h-3 w-3" />
                  ) : null}
                </Button>
              )
            },
            cell: ({ row }: any) => {
              return format(
                new Date(row.getValue('schedule_date')),
                'dd/MM/yyyy HH:mm'
              )
            },
          },
        ]
      : []),
    {
      accessorKey: 'assigned_user_name',
      id: 'assigned_user_name',
      header: ({ column }: any) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.assigned_user_name')}
            {column.getIsSorted() === 'desc' ? (
              <ChevronUp className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronDown className="ml-2 h-3 w-3" />
            ) : null}
          </Button>
        )
      },
    },
    {
      accessorKey: 'name',
      id: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.name')}
            {column.getIsSorted() === 'desc' ? (
              <ChevronUp className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronDown className="ml-2 h-3 w-3" />
            ) : null}
          </Button>
        )
      },
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.email')}
            {column.getIsSorted() === 'desc' ? (
              <ChevronUp className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronDown className="ml-2 h-3 w-3" />
            ) : null}
          </Button>
        )
      },
    },
    {
      accessorKey: 'phone',
      id: 'phone',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.phone')}
            {column.getIsSorted() === 'desc' ? (
              <ChevronUp className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronDown className="ml-2 h-3 w-3" />
            ) : null}
          </Button>
        )
      },
    },
    {
      accessorKey: 'fase_order',
      id: 'fase_order',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.fase_order')}
            {column.getIsSorted() === 'desc' ? (
              <ChevronUp className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronDown className="ml-2 h-3 w-3" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div className="flex gap-1">
            {/*<span>{getFaseOrderKey(row.original)}</span>*/}
            {row.original.fase1 === OnboardingFaseStatus.Incomplete ? (
              <CircleAlert className="h-4 w-4 text-utility-warning-400" />
            ) : row.original.fase1 === OnboardingFaseStatus.Completed ? (
              <CircleCheck className="h-4 w-4 text-utility-success-500" />
            ) : (
              <CircleX className="h-4 w-4 text-utility-gray-300" />
            )}
            {row.original.fase2 === OnboardingFaseStatus.Incomplete ? (
              <CircleAlert className="h-4 w-4 text-utility-warning-400" />
            ) : row.original.fase2 === OnboardingFaseStatus.Completed ? (
              <CircleCheck className="h-4 w-4 text-utility-success-500" />
            ) : (
              <CircleX className="h-4 w-4 text-utility-gray-300" />
            )}
            {row.original.fase3 === OnboardingFaseStatus.Incomplete ? (
              <CircleAlert className="h-4 w-4 text-utility-warning-400" />
            ) : row.original.fase3 === OnboardingFaseStatus.Completed ? (
              <CircleCheck className="h-4 w-4 text-utility-success-500" />
            ) : (
              <CircleX className="h-4 w-4 text-utility-gray-300" />
            )}
            {row.original.fase4 === OnboardingFaseStatus.Incomplete ? (
              <CircleAlert className="h-4 w-4 text-utility-warning-400" />
            ) : row.original.fase4 === OnboardingFaseStatus.Completed ? (
              <CircleCheck className="h-4 w-4 text-utility-success-500" />
            ) : (
              <CircleX className="h-4 w-4 text-utility-gray-300" />
            )}
            {row.original.fase5 === OnboardingFaseStatus.Incomplete ? (
              <CircleAlert className="h-4 w-4 text-utility-warning-400" />
            ) : row.original.fase5 === OnboardingFaseStatus.Completed ? (
              <CircleCheck className="h-4 w-4 text-utility-success-500" />
            ) : (
              <CircleX className="h-4 w-4 text-utility-gray-300" />
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'created_at',
      id: 'created_at',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.created_at')}
            {column.getIsSorted() === 'desc' ? (
              <ChevronUp className="ml-2 h-3 w-3" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronDown className="ml-2 h-3 w-3" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue('created_at')), 'dd/MM/yyyy HH:mm')
      },
    },
    ...(type !== ApplicationOnboardingStatus.Completed
      ? [
          {
            accessorKey: 'actions',
            header: () => {
              return <></>
            },
            cell: ({ row, table }: any) => {
              const handleClick = (action: string) => {
                if (table.options.meta?.continue && action === 'continue') {
                  table.options.meta.continue(row.original.id)
                }
                if (table.options.meta?.archive && action === 'archive') {
                  table.options.meta.archive(row.original.id)
                }
                if (table.options.meta?.schedule && action === 'reschedule') {
                  table.options.meta.schedule(row.original.id)
                }
                if (table.options.meta?.reasign && action === 'reasign') {
                  table.options.meta.reasign(row.original.id)
                }
              }

              return (
                <div className="inline-flex gap-x-[4px] items-center justify-end w-[100%]">
                  <DataTable.ActionsDropdown
                    actions={
                      type === ApplicationOnboardingStatus.InProgress
                        ? ['continue', 'reschedule', 'reasign', 'archive']
                        : type === ApplicationOnboardingStatus.Archived
                        ? ['continue', 'reschedule']
                        : type === ApplicationOnboardingStatus.Scheduled
                        ? ['continue', 'reschedule', 'reasign', 'archive']
                        : []
                    }
                    onClick={handleClick}
                  />
                </div>
              )
            },
            enableSorting: false,
            enableHiding: false,
          },
        ]
      : []),
  ]

  const [openFilters, setOpenFilters] = useState<boolean>(false)
  const [openReasign, setOpenReasign] = useState<boolean>(false)
  const [openSchedule, setOpenSchedule] = useState<boolean>(false)
  const [openArchive, setOpenArchive] = useState<boolean>(false)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    targets: false,
    email: false,
    created_at: type === ApplicationOnboardingStatus.InProgress,
  })
  const [search, setSearch] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [applicationId, setApplicationId] = useState<string>()
  const [responsableUser, setResponsableUser] = useState<string>(user?.id)
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [scheduleHour, setScheduleHour] = useState<string>()

  const archiveOnboardingProcessMutation = useMutation({
    mutationFn: archiveOnboardingProcess,
    onSuccess: () => {
      refresh()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.archive'),
      })
    },
    onError: () => {
      refresh()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.archive'),
      })
    },
  })

  const scheduleOnboardingProcessMutation = useMutation({
    mutationFn: scheduleOnboardingProcess,
    onSuccess: () => {
      refresh()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.schedule'),
      })
    },
    onError: () => {
      refresh()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.schedule'),
      })
    },
  })

  const reasignOnboardingProcessMutation = useMutation({
    mutationFn: reasignOnboardingProcess,
    onSuccess: () => {
      refresh()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.reasign'),
      })
    },
    onError: () => {
      refresh()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.reasign'),
      })
    },
  })

  const handleArchiveApplication = (id: string) => {
    setApplicationId(id)
    setOpenArchive(true)
  }

  const handleScheduleApplication = (id: string) => {
    setScheduleDate(undefined)
    setScheduleHour(undefined)
    setApplicationId(id)
    setOpenSchedule(true)
  }

  const handleReasignApplication = (id: string) => {
    setApplicationId(id)
    setOpenReasign(true)
  }

  const table = useReactTable({
    data: data || [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    manualSorting: false,
    globalFilterFn: 'includesString',
    state: {
      columnFilters: columnFilters,
      globalFilter: search,
      columnVisibility,
    },
    meta: {
      archive: handleArchiveApplication,
      schedule: handleScheduleApplication,
      reasign: handleReasignApplication,
      unarchive: (id) => router.push(`/manage-process?id=${id}`),
      continue: (id) => router.push(`/manage-process?id=${id}`),
    },
  })

  const handleFilters = (filters: ColumnFiltersState) => {
    setColumnFilters(filters)
    setOpenFilters(false)
  }

  const handleChangeHour = (value: string) => {
    const d = value.split(':')
    if (scheduleDate) {
      setScheduleHour(value)
      scheduleDate.setHours(parseInt(d[0]))
      scheduleDate.setMinutes(parseInt(d[1]))
      setScheduleDate(scheduleDate)
    }
  }

  return (
    <main>
      <DataTable.HeaderContainer>
        <div className="flex items-end h-16 max-sm:hidden">
          <DataTable.Title
            rowCount={table.getRowCount()}
            data-testid="title"
            className="pl-4 font-normal text-sm"
          >
            {t('table.results')}
          </DataTable.Title>
        </div>
        <DataTable.HeaderActionsContainer className="pl-4">
          <div className="flex items-center gap-3">
            <TextInput
              startAdornment={
                <Search className="h-4 w-4 text-utility-gray-600" />
              }
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('table.search')}
              data-testid="search-input"
              className="w-[320px] max-sm:w-full"
            />
            <Button
              color="secondary"
              startAdornment={<Filter className="h-4 w-4" />}
              data-testid="filters-button"
              onClick={() => setOpenFilters(true)}
              disabled={!data || data.length === 0}
            >
              {t('table.filters')}
            </Button>
            <DataTable.ColumnVisibilityDropdown table={table} />
          </div>
        </DataTable.HeaderActionsContainer>
      </DataTable.HeaderContainer>
      <DataTable.Table table={table} columns={columns} isLoading={isPending} />
      {data && data.length > 0 && (
        <OnboardingsListFilterMenu
          open={openFilters}
          onOpenChange={setOpenFilters}
          submit={handleFilters}
          data={data || []}
        />
      )}

      <Dialog open={openArchive} onOpenChange={setOpenArchive}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('titles.archive')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.archive')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button color="secondary" onClick={() => setOpenArchive(false)}>
              {t('button-actions.cancel')}
            </Button>
            <Button
              color="destructive"
              onClick={() => {
                archiveOnboardingProcessMutation.mutate({
                  id: applicationId as string,
                })
                setOpenArchive(false)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openReasign} onOpenChange={setOpenReasign}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('titles.reasign')}</DialogTitle>
            <DialogDescription className="pt-2">
              {t('subtitles.reasign')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <SelectInput
              options={[
                {
                  value: user?.id,
                  label: user?.name,
                  info: user?.email,
                },
              ]}
              value={[
                {
                  value: user?.id,
                  label: user?.name,
                  info: user?.email,
                },
              ]}
              onSelect={(option) => setResponsableUser(option[0]?.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenReasign(false)} color="secondary">
              {t('button-actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                reasignOnboardingProcessMutation.mutate({
                  id: applicationId as string,
                  userId: responsableUser,
                })
                setOpenReasign(false)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={openSchedule} onOpenChange={setOpenSchedule}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>{t('titles.schedule')}</DialogTitle>
            <DialogDescription className="pt-2">
              {t('subtitles.schedule')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 m-auto">
            <Calendar
              className="!pt-0"
              mode="single"
              selected={scheduleDate}
              onSelect={(val) => setScheduleDate(val as Date)}
              initialFocus
            />
            <TextInput
              label={t('calendar.hour')}
              type="time"
              onChange={(e) => handleChangeHour(e.target.value)}
              disabled={!scheduleDate}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenSchedule(false)} color="secondary">
              {t('button-actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                scheduleOnboardingProcessMutation.mutate({
                  id: applicationId as string,
                  scheduleDate: scheduleDate as Date,
                })
                setOpenSchedule(false)
              }}
              disabled={!scheduleDate || !scheduleHour}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

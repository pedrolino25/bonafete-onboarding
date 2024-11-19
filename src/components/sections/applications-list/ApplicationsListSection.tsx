'use client'

import { SelectInput } from '@/components/inputs/select-input/select-input'
import { TextInput } from '@/components/inputs/text-input/text-input'
import { ApplicationsListFilterMenu } from '@/components/menus/ApplicationsListFilterMenu'
import { DataTable } from '@/components/table/table'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
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
import useAuthenticatedUser from '@/lib/hooks/authenticated-user'
import { useToast } from '@/lib/hooks/use-toast'
import {
  acceptApplication,
  ApplicationsListItemResponse,
  ApplicationStatus,
  reasignApplication,
  rejectApplication,
  scheduleApplication,
  startOnboardingProcess,
} from '@/services/api/applications'
import { OnboardingProcessListItemResponse } from '@/services/api/onboardings'
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
import { ChevronDown, ChevronUp, Filter, Images, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ApplicationsListSectionProps {
  data: ApplicationsListItemResponse[] | undefined
  isPending: boolean
  type: ApplicationStatus
  refresh: () => void
}

export default function ApplicationsListSection({
  data,
  isPending,
  type,
  refresh,
}: ApplicationsListSectionProps) {
  const t = useTranslations()
  const router = useRouter()
  const user = useAuthenticatedUser()
  const { toast } = useToast()

  const columns: ColumnDef<ApplicationsListItemResponse>[] = [
    ...(type === ApplicationStatus.Scheduled
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
    ...(type === ApplicationStatus.Scheduled ||
    type === ApplicationStatus.Accepted ||
    type === ApplicationStatus.Completed
      ? [
          {
            accessorKey: 'assigned_user_name',
            id: 'assigned_user_name',
            header: ({ column }: any) => {
              return (
                <Button
                  variant="link"
                  color="secondary"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                  }
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
        ]
      : []),
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
      accessorKey: 'locality',
      id: 'locality',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.locality')}
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
      accessorKey: 'type',
      id: 'type',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.type')}
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
      accessorKey: 'max_of_persons',
      id: 'max_of_persons',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.max_of_persons')}
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
      accessorKey: 'business_model',
      id: 'business_model',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.business_model')}
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
          <Badge shape="square">
            {t(`business_model.${row.getValue('business_model')}`)}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'targets',
      id: 'targets',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.targets')}
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
          <div className="flex flex-wrap gap-1">
            {(row.getValue('targets') as string[])?.map((item: string) => {
              return <Badge shape="square">{item}</Badge>
            })}
          </div>
        )
      },
    },
    {
      accessorKey: 'photos',
      id: 'photos',
      header: () => {
        return (
          <Button variant="link" color="secondary">
            {t('columns.photos')}
          </Button>
        )
      },
      cell: ({ row, table }) => {
        const handleClick = () => {
          if (table.options.meta?.viewPhotos) {
            table.options.meta.viewPhotos(row.original.photos)
          }
        }

        return (
          <Button variant="ghost" onClick={handleClick}>
            <Images className="w-5 h-5" />
          </Button>
        )
      },
      enableSorting: false,
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
    ...(type !== ApplicationStatus.Completed
      ? [
          {
            accessorKey: 'actions',
            header: () => {
              return <></>
            },
            cell: ({ row, table }: any) => {
              const handleClick = (action: string) => {
                if (
                  table.options.meta?.accept &&
                  action === 'application_accept'
                ) {
                  table.options.meta.accept(row.original.id)
                }
                if (
                  table.options.meta?.reject &&
                  action === 'application_reject'
                ) {
                  table.options.meta.reject(row.original.id)
                }
                if (table.options.meta?.schedule && action === 'schedule') {
                  table.options.meta.schedule(row.original.id)
                }
                if (table.options.meta?.schedule && action === 'reschedule') {
                  table.options.meta.schedule(row.original.id)
                }
                if (table.options.meta?.reasign && action === 'reasign') {
                  table.options.meta.reasign(row.original.id)
                }
                if (
                  table.options.meta?.register &&
                  action === 'space_register'
                ) {
                  table.options.meta.register(row.original.id)
                }
              }

              return (
                <div className="inline-flex gap-x-[4px] items-center justify-end w-[100%]">
                  <DataTable.ActionsDropdown
                    actions={
                      type === ApplicationStatus.New
                        ? ['application_accept', 'application_reject']
                        : type === ApplicationStatus.Accepted
                        ? [
                            'schedule',
                            'space_register',
                            'reasign',
                            'application_reject',
                          ]
                        : type === ApplicationStatus.Rejected
                        ? ['application_accept', 'schedule']
                        : type === ApplicationStatus.Scheduled
                        ? [
                            'space_register',
                            'reschedule',
                            'reasign',
                            'application_reject',
                          ]
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
  const [openPhotos, setOpenPhotos] = useState<boolean>(false)
  const [openReasign, setOpenReasign] = useState<boolean>(false)
  const [openAccept, setOpenAccept] = useState<boolean>(false)
  const [openSchedule, setOpenSchedule] = useState<boolean>(false)
  const [openReject, setOpenReject] = useState<boolean>(false)
  const [openStartOnboarding, setOpenStartOnboarding] = useState<boolean>(false)

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    targets: false,
    email: false,
    created_at: type === ApplicationStatus.New,
  })
  const [search, setSearch] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [applicationId, setApplicationId] = useState<string>()
  const [responsableUser, setResponsableUser] = useState<string>(user?.id)
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [scheduleHour, setScheduleHour] = useState<string>()

  const acceptApplicationMutation = useMutation({
    mutationFn: acceptApplication,
    onSuccess: () => {
      refresh()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.accept'),
      })
    },
    onError: () => {
      refresh()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.accept'),
      })
    },
  })

  const rejectApplicationMutation = useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      refresh()
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.reject'),
      })
    },
    onError: () => {
      refresh()
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.reject'),
      })
    },
  })

  const scheduleApplicationMutation = useMutation({
    mutationFn: scheduleApplication,
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

  const reasignApplicationMutation = useMutation({
    mutationFn: reasignApplication,
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

  const startOnboardingProcessMutation = useMutation({
    mutationFn: startOnboardingProcess,
    onSuccess: (response: OnboardingProcessListItemResponse) => {
      toast({
        variant: 'success',
        title: t('success'),
        description: t('success-messages.init-process'),
      })
      if (response.id) {
        router.push(`/manage-process?id=${response.id}`)
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t('error-messages.init-process'),
      })
    },
  })

  const handleAcceptApplication = (id: string) => {
    setApplicationId(id)
    setOpenAccept(true)
  }

  const handleRejectApplication = (id: string) => {
    setApplicationId(id)
    setOpenReject(true)
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

  const handleStartOnboarding = (id: string) => {
    setApplicationId(id)
    setOpenStartOnboarding(true)
  }

  const handleViewPhotos = (photos: string[]) => {
    setPhotos(photos)
    setOpenPhotos(true)
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
      accept: handleAcceptApplication,
      reject: handleRejectApplication,
      schedule: handleScheduleApplication,
      reasign: handleReasignApplication,
      register: handleStartOnboarding,
      viewPhotos: handleViewPhotos,
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
        <ApplicationsListFilterMenu
          open={openFilters}
          onOpenChange={setOpenFilters}
          submit={handleFilters}
          data={data || []}
        />
      )}
      <Dialog open={openPhotos} onOpenChange={setOpenPhotos}>
        <DialogContent className="max-w-[1024px] max-h-svh">
          <DialogHeader>
            <DialogTitle>{t('titles.photos')}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(100svh-100px)] w-full overflow-y-auto">
            <div className="flex flex-col gap-8 py-8 px-1 w-full">
              {openPhotos && photos && photos.length > 0 && (
                <>
                  {photos.map((photo, index) => {
                    return (
                      <div
                        key={`space_image_${index}`}
                        className="relative w-full"
                      >
                        <AspectRatio ratio={16 / 9}>
                          <Image
                            src={photo}
                            alt={`space_image_${index}`}
                            fill
                            objectFit="cover"
                          />
                        </AspectRatio>
                      </div>
                    )
                  })}
                </>
              )}
              {!photos && (
                <p className="text-md">{t('error-messages.empty-photos')}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openAccept} onOpenChange={setOpenAccept}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('titles.accept-application')}</DialogTitle>
            <DialogDescription className="pt-2">
              {t('subtitles.reasign')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <SelectInput
              options={[
                {
                  value: user.id,
                  label: user.name,
                  info: user.email,
                },
              ]}
              value={[
                {
                  value: user.id,
                  label: user.name,
                  info: user.email,
                },
              ]}
              onSelect={(option) => setResponsableUser(option[0]?.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenAccept(false)} color="secondary">
              {t('button-actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                acceptApplicationMutation.mutate({
                  id: applicationId as string,
                  userId: responsableUser,
                })
                setOpenAccept(false)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('titles.reject')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.reject')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button color="secondary" onClick={() => setOpenReject(false)}>
              {t('button-actions.cancel')}
            </Button>
            <Button
              color="destructive"
              onClick={() => {
                rejectApplicationMutation.mutate({
                  id: applicationId as string,
                })
                setOpenReject(false)
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
                reasignApplicationMutation.mutate({
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
                scheduleApplicationMutation.mutate({
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

      <Dialog open={openStartOnboarding} onOpenChange={setOpenStartOnboarding}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('titles.init-process')}</DialogTitle>
            <DialogDescription className="pt-2 pb-6">
              {t('subtitles.init-process')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              color="secondary"
              onClick={() => setOpenStartOnboarding(false)}
            >
              {t('button-actions.cancel')}
            </Button>
            <Button
              onClick={() => {
                startOnboardingProcessMutation.mutate({
                  applicationId: applicationId as string,
                  userId: user.id,
                })
                setOpenStartOnboarding(false)
              }}
            >
              {t('button-actions.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

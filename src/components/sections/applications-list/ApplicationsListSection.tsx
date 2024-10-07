'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { ApplicationsListFilterMenu } from '@/components/menus/ApplicationsListFilterMenu'
import { Navbar } from '@/components/navbar/Navbar'
import { DataTable } from '@/components/table/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ApplicationsListItemResponse } from '@/services/api/applications'
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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
interface ApplicationsListSectionProps {
  data: ApplicationsListItemResponse[] | undefined
  isPending: boolean
}
export default function ApplicationsListSection({
  data,
  isPending,
}: ApplicationsListSectionProps) {
  const t = useTranslations()
  const router = useRouter()

  const columns: ColumnDef<ApplicationsListItemResponse>[] = [
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
      header: ({ column }) => {
        return (
          <Button variant="link" color="secondary">
            {t('columns.photos')}
          </Button>
        )
      },
      cell: ({ row, table }) => {
        const handleClick = () => {
          if (table.options.meta?.viewPhotos) {
            table.options.meta.viewPhotos(row.original.id)
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
        return format(new Date(row.getValue('created_at')), 'dd/MM/yyyy hh:mm')
      },
    },
    {
      accessorKey: 'actions',
      header: () => {
        return <></>
      },
      cell: ({ row, table }) => {
        const handleClick = (action: string) => {
          if (table.options.meta?.viewPhotos && action === 'view_photos') {
            table.options.meta.viewPhotos(row.original.id)
          }
        }

        return (
          <div className="inline-flex gap-x-[4px] items-center justify-end w-[100%]">
            <DataTable.ActionsDropdown
              actions={['view_photos']}
              onClick={handleClick}
            />
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const [openFilters, setOpenFilters] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    targets: false,
    email: false,
  })
  const [search, setSearch] = useState<string>('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
      viewPhotos: (id: string) => console.log(id),
    },
  })

  const handleFilters = (filters: ColumnFiltersState) => {
    setColumnFilters(filters)
    setOpenFilters(false)
  }

  return (
    <main>
      <Navbar>
        <DataTable.HeaderContainer>
          <div className="flex items-end h-16">
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
                className="w-[320px]"
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
        <DataTable.Table
          table={table}
          columns={columns}
          isLoading={isPending}
        />
        {data && data.length > 0 && (
          <ApplicationsListFilterMenu
            open={openFilters}
            onOpenChange={setOpenFilters}
            submit={handleFilters}
            data={data || []}
          />
        )}
      </Navbar>
    </main>
  )
}

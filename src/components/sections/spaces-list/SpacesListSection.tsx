'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { SpacesListFilterMenu } from '@/components/menus/SpacesListFilterMenu'
import { Navbar } from '@/components/navigation/Navbar'
import { DataTable } from '@/components/table/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpaceListItemResponse } from '@/services/api/spaces'
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
import { ChevronDown, ChevronUp, Filter, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
interface SpacesListSectionProps {
  data: SpaceListItemResponse[] | undefined
  isPending: boolean
}
export default function SpacesListSection({
  data,
  isPending,
}: SpacesListSectionProps) {
  const t = useTranslations()
  const router = useRouter()

  const columns: ColumnDef<SpaceListItemResponse>[] = [
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
      cell: ({ row }) => {
        return (
          <Link href={`/space/${row.getValue('id')}`} target="_blank">
            <span className="text-sm font-medium text-utility-gray-900">
              {row.getValue('name')}
            </span>
          </Link>
        )
      },
    },
    {
      accessorKey: 'host_name',
      id: 'host_name',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.host_name')}
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
          <Link href={`/host/${row.original.host_id}`} target="_blank">
            <span className="text-sm font-medium text-utility-gray-900">
              {row.getValue('host_name')}
            </span>
          </Link>
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
      cell: ({ row }) => {
        return <Badge shape="square">{row.getValue('type')}</Badge>
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
    {
      accessorKey: 'actions',
      header: () => {
        return <></>
      },
      cell: ({ row, table }) => {
        const handleClick = (action: string) => {
          if (table.options.meta?.viewSpace && action === 'view_space') {
            table.options.meta.viewSpace(row.original.id)
          }
          if (table.options.meta?.viewHost && action === 'view_host') {
            table.options.meta.viewHost(row.original.host_id)
          }
        }

        return (
          <div className="inline-flex gap-x-[4px] items-center justify-end w-[100%]">
            <DataTable.ActionsDropdown
              actions={['view_space', 'view_host']}
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
    business_model: false,
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
      viewHost: (id: string) => router.push(`/host/${id}`),
      viewSpace: (id: string) => router.push(`/space/${id}`),
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
                className="max-sm:hidden"
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
          <SpacesListFilterMenu
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

'use client'

import { TextInput } from '@/components/inputs/text-input/text-input'
import { HostsListFilterMenu } from '@/components/menus/HostsListFilterMenu'
import { Navbar } from '@/components/navbar/Navbar'
import { DataTable } from '@/components/table/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HostsListItemResponse } from '@/services/api/hosts'
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
interface HostsListSectionProps {
  data: HostsListItemResponse[] | undefined
  isPending: boolean
}
export default function HostsListSection({
  data,
  isPending,
}: HostsListSectionProps) {
  const t = useTranslations()
  const router = useRouter()

  const columns: ColumnDef<HostsListItemResponse>[] = [
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
          <Link href={`/host/${row.original.id}`} target="_blank">
            <span className="text-sm font-medium text-utility-gray-900">
              {row.getValue('name')}
            </span>
          </Link>
        )
      },
    },
    {
      accessorKey: 'account_id',
      id: 'account_id',
      header: () => {
        return (
          <div className="px-3.5 text-sm font-extrabold text-utility-gray-900">
            {t('columns.account_id')}
          </div>
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
      accessorKey: 'business_type',
      id: 'business_type',
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            color="secondary"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('columns.business_type')}
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
            {t(`business_type.${row.getValue('business_type')}`)}
          </Badge>
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
          if (table.options.meta?.viewHost && action === 'view_host') {
            table.options.meta.viewHost(row.original.id)
          }
        }

        return (
          <div className="inline-flex gap-x-[4px] items-center justify-end w-[100%]">
            <DataTable.ActionsDropdown
              actions={['view_host']}
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
    account_id: false,
    business_type: false,
    locality: false,
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
          <HostsListFilterMenu
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

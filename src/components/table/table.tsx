import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  ColumnDef,
  Table as ReactTable,
  flexRender,
} from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef } from 'react'

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    deleteData?: (data: TData) => void
    editData?: (data: TData) => void
    viewData?: (data: TData) => void
    archiveData?: (data: TData) => void
    assign?: (data: TData) => void
    viewHost?: (id: string) => void
    viewSpace?: (id: string) => void
    viewPhotos?: (photos: string[]) => void
    accept?: (id: string) => void
    reject?: (id: string) => void
    reasign?: (id: string) => void
    schedule?: (id: string) => void
    register?: (id: string) => void
    continue?: (id: string) => void
    archive?: (data: string) => void
    unarchive?: (data: string) => void
    suspend?: (data: string) => void
    activate?: (data: string) => void
    viewOnboarding?: (data: string) => void
  }
}

interface TableProps<TData, TValue> {
  table: ReactTable<TData>
  columns: ColumnDef<TData, TValue>[]
  isLoading: boolean
  hasMore?: boolean
  getMore?: () => void
  scrollToTop?: boolean
}

function Table<TData, TValue>({
  table,
  columns,
  isLoading,
  hasMore,
  getMore,
  scrollToTop,
}: TableProps<TData, TValue>) {
  const t = useTranslations()
  const scrollableContainerRef = useRef(null)
  const observer = useRef<IntersectionObserver | null>()
  const lastRowElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !table.getRowModel().rows) {
        return
      }
      if (observer.current) {
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          table.getRowModel().rows.length > 0
        ) {
          getMore?.()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, table, getMore]
  )

  useEffect(() => {
    if (scrollableContainerRef.current && scrollToTop) {
      ;(scrollableContainerRef.current as HTMLTableElement).scrollTo({
        top: 0,
      })
    }
  }, [scrollToTop])

  return (
    <div
      ref={scrollableContainerRef}
      className="max-h-[calc(100vh-160px)] overflow-auto bg-white border-t-0"
    >
      <ShadcnTable data-testid="table">
        <TableHeader data-testid="table-header">
          {table.getHeaderGroups().map((headerGroup, rowIndex) => (
            <TableRow
              key={headerGroup.id}
              data-testid={`table-header-row-${rowIndex}`}
            >
              {headerGroup.headers.map((header, headIndex) => {
                return (
                  <TableHead
                    key={header.id}
                    data-testid={`table-header-row-${rowIndex}-head-${headIndex}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody data-testid="table-body">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                data-testid={`table-body-row-${rowIndex}`}
              >
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell
                    key={cell.id}
                    data-testid={`table-body-row-${rowIndex}-cell-${cellIndex}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isLoading ? (
            <TableRow>
              <TableCell
                data-testid="table-loading"
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {t('table.loading')}
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                data-testid="table-no-results"
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {t('table.no-results')}
              </TableCell>
            </TableRow>
          )}
          {isLoading && table.getRowModel().rows?.length > 0 && (
            <TableRow>
              <TableCell
                data-testid="table-loading"
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {t('table.loading')}
              </TableCell>
            </TableRow>
          )}
          {table.getRowModel().rows?.length > 0 && (
            <TableRow ref={lastRowElementRef}></TableRow>
          )}
        </TableBody>
      </ShadcnTable>
    </div>
  )
}

interface ColumnVisibilityDropdownProps<TData> {
  table: ReactTable<TData>
}

function ColumnVisibilityDropdown<TData>({
  table,
}: ColumnVisibilityDropdownProps<TData>) {
  const t = useTranslations()
  const formatId = (id: string) => {
    return t(`columns.${id}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="mr-2"
        asChild
        data-testid="table-column-visibility-trigger"
      >
        <Button
          variant="ghost"
          color="secondary"
          data-testid="table-column-visibility-button"
        >
          <EllipsisVertical className="text-utility-gray-400 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        data-testid="table-column-visibility-content"
      >
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column, index) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                data-testid={`table-column-visibility-checkbox-item-${index}`}
              >
                {formatId(column.id)}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderContainer({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white border-b-[1px] border-utility-gray-200',
        className
      )}
    >
      <div className="flex max-sm:flex-col items-center justify-between">
        {children}
      </div>
    </div>
  )
}

function HeaderActionsContainer({
  children,
  className,
}: React.InputHTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('w-full flex items-center gap-3 pt-5 pb-8', className)}>
      {children}
    </div>
  )
}

interface TitleProps extends React.InputHTMLAttributes<HTMLHeadingElement> {
  children?: string
  rowCount: string | number
}

function Title({ children, rowCount, className, ...props }: TitleProps) {
  return (
    <h2
      className={cn(
        'font-extrabold text-lg text-utility-gray-900 pl-[24px] inline-flex gap-x-2 items-center justify-center gap-x-2',
        className
      )}
      {...props}
    >
      {children}
      <Badge color="gray" size="sm">
        {rowCount}
      </Badge>
    </h2>
  )
}

interface ActionsDropdownProps {
  actions: string[]
  onClick: (action: string) => void
}

function ActionsDropdown({ actions, onClick }: ActionsDropdownProps) {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="mr-2"
        asChild
        data-testid="actions-dropdown-trigger"
      >
        <Button
          variant="ghost"
          color="secondary"
          data-testid="actions-dropdown-button"
        >
          <EllipsisVertical className="text-utility-gray-400 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-testid="actions-dropdown-content">
        <DropdownMenuLabel className="py-1">
          {t('actions.title')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => {
          return (
            <DropdownMenuItem
              key={action}
              data-testid={`actions-dropdown-item-${action}`}
              onClick={() => onClick(action)}
              className="cursor-pointer font-normal text-sm py-2"
            >
              {t(`actions.${action}`)}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const DataTable = {
  ActionsDropdown: ActionsDropdown,
  ColumnVisibilityDropdown: ColumnVisibilityDropdown,
  HeaderContainer: HeaderContainer,
  HeaderActionsContainer: HeaderActionsContainer,
  Title: Title,
  Table: Table,
}

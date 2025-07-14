// Componente tabla

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, type LucideIcon, SearchIcon } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import FilterDropdown from "../select/FilterDropdown"
import Checkbox from "../button/checkbox/Checkbox"
import LineSeparator from "../lineSeparator/LineSeparator"
import useMediaQueries from "../../../hooks/useMediaQueries"
import OptionsInventory from "./optionsInventory"

// Props de table
interface ReusableTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  title: string
  icon: LucideIcon
  iconButton?: LucideIcon
  paragraph?: string
  buttonText?: string
  enabledButton?: boolean
  onButtonClick?: () => void
  enabledActions?: boolean
  enabledOperations?: boolean
  enabledFormat?: boolean
  enableSelection?: boolean
  onSelectionChange?: (selectedRows: TData[]) => void
  onOperationSelected?: (operationId: string, selectedRows: TData[]) => Promise<void>
  isLoadingOperation?: boolean
  onDownloadDocuments?: (selectedRows: TData[]) => Promise<void>
  onExportData?: (format: string, selectedRows: TData[]) => void,
  onButtonOptions?: boolean
}

function Table<TData>({
  data,
  columns,
  title,
  icon: Icon,
  iconButton: IconButton,
  paragraph,
  buttonText,
  enabledButton = false,
  onButtonClick,
  enableSelection = false,
  onSelectionChange,
  onButtonOptions = false
}: ReusableTableProps<TData>) {
  // Hooks
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  // Estados
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [rowSelection, setRowSelection] = useState({})

  // Orden de las columnas
  const COLUMN_ORDER = [
    'consecutiveNumber',
    'iccid',
    'imsi',
    'msisdn',
    'fabricante',
    'fechaCarga',
    'almacen',
    'tipoAlmacen',
    'estadoLinea'
  ]

  // Configuración de columnas por breakpoint
  const RESPONSIVE_CONFIG = {
    mobile: ['consecutiveNumber', 'iccid', 'estadoLinea'],
    tablet: ['consecutiveNumber', 'iccid', 'imsi', 'fabricante', 'estadoLinea'],
    desktop: COLUMN_ORDER
  }

  // Función para obtener columnas responsivas ordenadas
  const getResponsiveColumns = useMemo(() => {
    // Columna de selección si está habilitada
    const selectionColumn: ColumnDef<TData, any> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onChange={e => table.toggleAllPageRowsSelected(!!e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={e => row.toggleSelected(!!e.target.checked)}
          aria-label="Select row"
        />
      ),
    }

    // Aquí determinamos qué columnas mostrar según el breakpoint
    let visibleColumns: string[]
    if (isMobile) {
      visibleColumns = RESPONSIVE_CONFIG.mobile
    } else if (isTablet) {
      visibleColumns = RESPONSIVE_CONFIG.tablet
    } else {
      visibleColumns = RESPONSIVE_CONFIG.desktop
    }

    // Filtrar y ordenar las columnas según la configuración
    const orderedColumns = visibleColumns
      .map(accessorKey => {
        return columns.find(col =>
          (col as any).accessorKey === accessorKey ||
          col.id === accessorKey
        )
      })
      .filter(Boolean) as ColumnDef<TData, any>[]

    // Buscar columna de acciones si existe
    const actionColumn = columns.find((col) => col.id === "actions")

    // Construir array final de columnas
    const finalColumns = [
      ...(enableSelection ? [selectionColumn] : []),
      ...orderedColumns,
      ...(actionColumn ? [actionColumn] : [])
    ]

    return finalColumns
  }, [columns, enableSelection, isMobile, isTablet, isDesktop])

  const table = useReactTable({
    data,
    columns: getResponsiveColumns,
    state: {
      globalFilter,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // Notificar cambios en la selección
  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map((row) => row.original)
      onSelectionChange(selectedRows)
    }
  }, [table.getFilteredSelectedRowModel().rows, onSelectionChange])

  return (
    <div className="mx-3">
      <div className="flex justify-between mb-6 items-center mt-5 bg-white p-5 rounded-lg flex-col md:flex-row gap-4 md:gap-0 shadow">
        <div className="flex items-center">
          <div className="flex-col">
            <div className="flex text-center md:text-start">
              <Icon className="md:w-12 md:h-12 text-gray-700" />
              <div className="flex flex-col">
                <h1 className="font-semibold text-gray-700 sm:text-4xl text-xl ml-4">{title}</h1>
                <p className="mt-4 text-gray-600 ml-4">{paragraph}</p>
              </div>
            </div>
          </div>
        </div>
        {enabledButton && (
          <div className="bg-gray-700 p-2 hover:bg-gray-800 duration-300 rounded-md w-full justify-center flex sm:w-auto">
            <button className="flex gap-2 items-center cursor-pointer" type="button" onClick={onButtonClick}>
              {IconButton && <IconButton className="text-white" />}
              <span className="text-white font-base">{buttonText}</span>
            </button>
          </div>
        )}
      </div>

      <div className="w-full bg-white rounded-lg shadow">
        {/* Acción de botones */}
        {onButtonOptions && (
          <OptionsInventory />
        )}

        {/* Filtros */}
        <div className="p-3 md:p-6 flex flex-col">
          <div className="mb-6 text-gray-600 flex gap-2 items-center">
            <SearchIcon />
            <h1 className="text-2xl font-semibold"> Filtros de búsqueda </h1>
          </div>

          <div className="flex flex-wrap gap-8">
            {table.getHeaderGroups().map(headerGroup =>
              headerGroup.headers.map((header: any) =>
                header.column.getCanFilter() ? (
                  <div key={header.id} className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{header?.column?.columnDef?.header}:</span>
                    <FilterDropdown
                      column={header.column}
                      onFilterChange={values => header.column.setFilterValue(values)}
                    />
                  </div>
                ) : null,
              ),
            )}
          </div>
        </div>

        <LineSeparator />

        <div className="p-3 md:p-6 border-b border-gray-200">
          <div className="md:flex md:flex-row md:items-center md:justify-between flex flex-col gap-3 items-center">
            <div className="flex items-center space-x-2">
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="block rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {[7, 10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-500">Entradas</span>
            </div>
            <div className="relative">
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar..."
                className="px-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-gray-500 duration-200 focus:shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-100 duration-200">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-6 py-4 text-sm text-slate-600 font-normal ${row.getIsSelected() ? "bg-sky-500/10" : ""}`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getResponsiveColumns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {`${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                data.length,
              )} de ${data.length} resultados`}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-2 bg-slate-100 border-none rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed duration-300 mr-3"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => table.setPageIndex(0)}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${table.getState().pagination.pageIndex === 0
                  ? "bg-gray-100 text-gray-700"
                  : "bg-slate-100 text-gray-700 hover:bg-gray-50 hover:text-gray-500"
                  }`}
              >
                1
              </button>

              {table.getPageCount() > 7 && table.getState().pagination.pageIndex > 3 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {Array.from({ length: table.getPageCount() }, (_, i) => i)
                .filter(pageIndex => {
                  const current = table.getState().pagination.pageIndex
                  return (
                    (pageIndex > 0 && pageIndex < 4) ||
                    (pageIndex >= current - 1 && pageIndex <= current + 1) ||
                    pageIndex > table.getPageCount() - 2
                  )
                })
                .filter(pageIndex => pageIndex !== 0 && pageIndex !== table.getPageCount() - 1)
                .map(pageIndex => (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${pageIndex === table.getState().pagination.pageIndex
                      ? "bg-gray-100 text-gray-700 duration-300"
                      : "bg-slate-100 text-gray-700 hover:bg-gray-50 hover:text-gray-500 duration-300"
                      }`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}

              {table.getPageCount() > 7 && table.getState().pagination.pageIndex < table.getPageCount() - 4 && (
                <span className="px-2 text-gray-500">...</span>
              )}

              {table.getPageCount() > 1 && (
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${table.getState().pagination.pageIndex === table.getPageCount() - 1
                    ? "bg-gray-100 text-gray-700"
                    : "bg-slate-100 text-gray-700 hover:bg-gray-50 hover:text-gray-500"
                    }`}
                >
                  {table.getPageCount()}
                </button>
              )}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-2 bg-slate-100 border-none rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed duration-300 ml-3"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
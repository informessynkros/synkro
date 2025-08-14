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
import { ChevronLeft, ChevronRight, type LucideIcon, Search, User, Shield, Tag, Building } from "lucide-react"
import { useState, useEffect, useMemo, useRef } from "react"
import { gsap } from "gsap"
import FilterDropdown2 from "../select/FilterDropdown2"
import Checkbox from "../button/checkbox/Checkbox"
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

// Mapeo de configuración de filtros
const getFilterConfig = (columnId: string) => {
  const filterConfigs: Record<string, { title: string; icon: any }> = {
    'be_id': { title: 'Be ID', icon: Tag },
    'status': { title: 'Estado', icon: Shield },
    'role': { title: 'Rol', icon: User },
    'checkpoint': { title: 'Checkpoint', icon: Building },
    'fabricante': { title: 'Fabricante', icon: Building },
    'almacen': { title: 'Almacén', icon: Building },
    'estadoLinea': { title: 'Estado Línea', icon: Shield },
    'tipo_inventario': { title: 'Tipo Inventario', icon: Tag },
    'operador_logistico': { title: 'Operador Logístico', icon: Building },
    'mfa_enabled': { title: 'MFA', icon: Shield },
    'name': { title: 'Nombre', icon: User },
    'tipoAlmacen': { title: 'Tipo Almacén', icon: Building },
  }

  return filterConfigs[columnId] || { title: 'Filtro', icon: Tag }
}

function Table<TData>({
  data,
  columns,
  iconButton: IconButton,
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

  // Referencias para animaciones
  const filtersRef = useRef<HTMLDivElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

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
    'estadoLinea',
    // Usuarios
    'name',
    'checkpoint',
    'be_id',
    'mfa_enabled',
    'status',
    // Almacén
    'info.nombre',
    'info.direccion.calle',
    'info.direccion.ciudad',
    'info.operador_logistico',
    'info.tipo_inventario'
  ]

  // Configuración de columnas por breakpoint
  const RESPONSIVE_CONFIG = {
    mobile: ['consecutiveNumber', 'iccid', 'estadoLinea', 'name', 'mfa_enabled', 'info.nombre'],
    tablet: ['consecutiveNumber', 'iccid', 'imsi', 'fabricante', 'estadoLinea', 'checkpoint', 'status', 'id_user', 'name', 'be_id', 'info.nombre', 'info.operador_logistico', 'info.tipo_inventario'],
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

  // Animación inicial de entrada
  useEffect(() => {
    if (filtersRef.current && searchBarRef.current && tableRef.current) {
      const tl = gsap.timeline({ delay: 0.1 })

      // Animación escalonada de entrada
      tl.fromTo([filtersRef.current, searchBarRef.current, tableRef.current],
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out"
        }
      )
    }
  }, [])

  // Animación cuando cambian los filtros (búsqueda en tiempo real)
  useEffect(() => {
    if (tableRef.current) {
      gsap.fromTo(tableRef.current.querySelectorAll('tbody tr'),
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out"
        }
      )
    }
  }, [table.getRowModel().rows.length, globalFilter, columnFilters])

  // Obtener filtros disponibles
  const availableFilters = table.getHeaderGroups()[0]?.headers.filter(header =>
    header.column.getCanFilter()
  ) || []

  return (
    <div className="mx-3">
      <div className="w-full bg-white rounded-lg shadow">
        {/* Acción de botones */}
        {onButtonOptions && (
          <OptionsInventory />
        )}

        {/* Filtros modernos */}
        <div ref={filtersRef} className="p-6 border-b border-gray-100">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-50 rounded-lg">
                <Search className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex items-center justify-between w-full">
                <h2 className="text-2xl font-semibold text-gray-800">Filtros de búsqueda</h2>
                {enabledButton && (
                  <div className="bg-teal-700 p-2 hover:bg-teal-800 duration-300 rounded-md w-full justify-center flex sm:w-auto">
                    <button className="flex gap-2 items-center cursor-pointer" type="button" onClick={onButtonClick}>
                      {IconButton && <IconButton className="text-white" />}
                      <span className="text-white font-base">{buttonText}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm">Filtra los resultados usando los criterios disponibles</p>
          </div>

          {/* Contenedor de filtros */}
          {availableFilters.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {availableFilters.map((header: any) => {
                const config = getFilterConfig(header.column.id)
                return (
                  <FilterDropdown2
                    key={header.id}
                    column={header.column}
                    title={config.title}
                    icon={config.icon}
                    onFilterChange={values => header.column.setFilterValue(values)}
                  />
                )
              })}
            </div>
          )}

          {availableFilters.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500">No hay filtros disponibles para esta tabla</p>
            </div>
          )}
        </div>

        {/* Barra de búsqueda y controles */}
        <div ref={searchBarRef} className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Selector de entradas */}
            <div className="flex items-center gap-3">
              <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
                Mostrar:
              </label>
              <select
                id="pageSize"
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="block rounded-lg border border-gray-200 px-3 py-2 text-sm 
                         focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
                         transition-all duration-200 bg-white"
              >
                {[7, 10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} entradas
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda global */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Buscar en toda la tabla..."
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full md:w-80 
                         focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 
                         transition-all duration-200 text-sm"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Indicadores de filtros activos */}
          {(columnFilters.length > 0 || globalFilter) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {globalFilter && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                  Búsqueda: "{globalFilter}"
                  <button
                    onClick={() => setGlobalFilter("")}
                    className="hover:bg-teal-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {columnFilters.map((filter, index) => (
                <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {filter.id}: {Array.isArray(filter.value) ? filter.value.length : 1} filtro(s)
                  <button
                    onClick={() => {
                      const newFilters = columnFilters.filter((_, i) => i !== index)
                      setColumnFilters(newFilters)
                    }}
                    className="hover:bg-green-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabla */}
        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
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
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-6 py-4 text-sm text-slate-600 font-normal transition-colors duration-200 ${row.getIsSelected() ? "bg-teal-50" : ""
                          }`}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={getResponsiveColumns.length} className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-500 font-medium">No se encontraron resultados</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Intenta ajustar tus filtros o términos de búsqueda
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination mejorada */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {`Mostrando ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a ${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )} de ${table.getFilteredRowModel().rows.length} resultados`}
              {table.getFilteredRowModel().rows.length !== data.length && (
                <span className="text-gray-400"> (filtrados de {data.length} total)</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(table.getPageCount(), 5) }, (_, i) => {
                  const pageIndex = i
                  return (
                    <button
                      key={pageIndex}
                      onClick={() => table.setPageIndex(pageIndex)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${pageIndex === table.getState().pagination.pageIndex
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {pageIndex + 1}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 
                         hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
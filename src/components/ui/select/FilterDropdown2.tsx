import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { gsap } from "gsap"
import { Check, ChevronDown, Search, X, Filter } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Column {
  getFilterValue: () => any
  getFacetedUniqueValues: () => Map<any, number>
  id: string
}

interface FilterDropdownProps {
  column: Column
  onFilterChange: (selectedValues: any[]) => void
  title: string
  icon?: LucideIcon
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ column, onFilterChange, title, icon }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedValues, setSelectedValues] = useState<Set<any>>(new Set())
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const chevronRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Usar el icono pasado como prop o uno por defecto
  const Icon = icon || Filter

  useEffect(() => {
    const columnFilterValue = column.getFilterValue()
    if (Array.isArray(columnFilterValue)) {
      setSelectedValues(new Set(columnFilterValue))
    }
  }, [column])

  // Calcular posición del dropdown
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX

    // Posición debajo del botón, alineado a la izquierda
    setDropdownPosition({
      top: buttonRect.bottom + scrollY + 4, // 4px de separación
      left: buttonRect.left + scrollX,
      width: Math.max(buttonRect.width, 280) // Mínimo 280px o el ancho del botón
    })
  }

  // Abrir dropdown
  const handleOpen = () => {
    calculateDropdownPosition()
    setIsOpen(true)
  }

  // Animación de apertura mejorada
  useEffect(() => {
    if (isOpen && dropdownRef.current && backdropRef.current && contentRef.current) {
      const tl = gsap.timeline()

      // Backdrop con fade suave
      tl.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.15, ease: "power2.out" }
      )

      // Dropdown con efecto más fluido
      tl.fromTo(dropdownRef.current,
        {
          opacity: 0,
          y: -8,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.25,
          ease: "back.out(1.4)"
        }, "-=0.1"
      )

      // Animación del contenido interno
      tl.fromTo(contentRef.current.children,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          stagger: 0.03,
          ease: "power2.out"
        }, "-=0.15"
      )

      // Rotación del chevron
      if (chevronRef.current) {
        gsap.to(chevronRef.current, {
          rotation: 180,
          duration: 0.25,
          ease: "power2.out"
        })
      }
    }
  }, [isOpen])

  // Función para cerrar con animación mejorada
  const handleClose = () => {
    if (dropdownRef.current && backdropRef.current) {
      const tl = gsap.timeline()

      // Rotar chevron de vuelta
      if (chevronRef.current) {
        tl.to(chevronRef.current, {
          rotation: 0,
          duration: 0.2,
          ease: "power2.in"
        })
      }

      // Animar contenido
      tl.to(contentRef.current?.children || [], {
        opacity: 0,
        y: -5,
        duration: 0.1,
        stagger: 0.02,
        ease: "power2.in"
      }, "-=0.15")

      // Dropdown
      tl.to(dropdownRef.current, {
        opacity: 0,
        y: -8,
        scale: 0.96,
        duration: 0.15,
        ease: "power2.in"
      }, "-=0.1")

      // Backdrop
      tl.to(backdropRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false)
        }
      }, "-=0.1")
    } else {
      setIsOpen(false)
    }
  }

  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys())
    .filter(value => value !== null && value !== undefined && value !== "")
    .sort((a, b) => {
      // Convertir a string para comparación
      const aStr = String(a).toLowerCase()
      const bStr = String(b).toLowerCase()
      return aStr.localeCompare(bStr)
    })

  const handleValueClick = (value: any) => {
    const newSelected = new Set(selectedValues)
    if (newSelected.has(value)) {
      newSelected.delete(value)
    } else {
      newSelected.add(value)
    }
    setSelectedValues(newSelected)
    onFilterChange(Array.from(newSelected))

    // Animación de feedback al seleccionar
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.97,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }
  }

  const handleClearAll = () => {
    setSelectedValues(new Set())
    onFilterChange([])
    setSearchTerm("")

    // Animación de feedback al limpiar
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      })
    }
  }

  const filteredValues = uniqueValues.filter((value) =>
    value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const hasSelection = selectedValues.size > 0

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className={`
          group relative flex items-center gap-3 px-4 py-2.5 
          bg-white border border-gray-200 rounded-xl
          hover:border-gray-300 hover:shadow-sm
          focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400
          transition-all duration-200 ease-out
          ${hasSelection ? 'border-teal-300 bg-teal-50/50' : ''}
          ${isOpen ? 'border-teal-400 shadow-sm' : ''}
        `}
      >
        {/* Icono */}
        <Icon className={`
          w-4 h-4 transition-colors duration-200
          ${hasSelection ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}
        `} />

        {/* Texto */}
        <span className={`
          text-sm font-medium transition-colors duration-200 select-none
          ${hasSelection ? 'text-teal-700' : 'text-gray-600 group-hover:text-gray-700'}
        `}>
          {title}
        </span>

        {/* Badge de contador */}
        {hasSelection && (
          <div className="bg-teal-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {selectedValues.size}
          </div>
        )}

        {/* Chevron */}
        <div ref={chevronRef} className="ml-auto">
          <ChevronDown className={`
            w-4 h-4 transition-colors duration-200
            ${hasSelection ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}
          `} />
        </div>
      </button>

      {/* Portal para el dropdown */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="fixed inset-0 z-[9998] bg-black/5"
            onClick={handleClose}
            style={{ opacity: 0 }}
          />

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
            style={{
              opacity: 0,
              transform: 'translateY(-8px) scale(0.96)',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              minWidth: dropdownPosition.width
            }}
          >
            <div ref={contentRef}>
              {/* Header con búsqueda */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={`Buscar en ${title.toLowerCase()}...`}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 
                             transition-all duration-200 bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Contador de resultados */}
                <div className="mt-2 text-xs text-gray-500">
                  {filteredValues.length} {filteredValues.length === 1 ? 'resultado' : 'resultados'}
                  {hasSelection && ` • ${selectedValues.size} seleccionado${selectedValues.size === 1 ? '' : 's'}`}
                </div>
              </div>

              {/* Lista de opciones */}
              <div className="max-h-64 overflow-y-auto">
                {filteredValues.map((value, index) => {
                  const isSelected = selectedValues.has(value)
                  return (
                    <div
                      key={index}
                      onClick={() => handleValueClick(value)}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer 
                               transition-colors duration-150 group"
                      onMouseEnter={e => {
                        gsap.to(e.currentTarget, {
                          x: 3,
                          duration: 0.2,
                          ease: "power2.out"
                        })
                      }}
                      onMouseLeave={e => {
                        gsap.to(e.currentTarget, {
                          x: 0,
                          duration: 0.2,
                          ease: "power2.out"
                        })
                      }}
                    >
                      {/* Checkbox personalizado */}
                      <div
                        className={`
                          w-4 h-4 border-2 rounded mr-3 flex items-center justify-center 
                          transition-all duration-200 relative overflow-hidden
                          ${isSelected
                            ? "bg-teal-600 border-teal-600"
                            : "border-gray-300 group-hover:border-gray-400"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check className="text-white w-3 h-3 transform scale-0 animate-[checkAppear_0.2s_ease-out_forwards]" />
                        )}
                      </div>

                      {/* Texto */}
                      <span className={`
                        text-sm transition-colors duration-200 flex-1
                        ${isSelected ? 'text-teal-700 font-medium' : 'text-gray-700 group-hover:text-gray-900'}
                      `}>
                        {value?.toString() || "N/A"}
                      </span>
                    </div>
                  )
                })}

                {filteredValues.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <Search className="w-8 h-8 mx-auto" />
                    </div>
                    <div className="text-sm text-gray-500">
                      No se encontraron resultados
                    </div>
                    {searchTerm && (
                      <div className="text-xs text-gray-400 mt-1">
                        para "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer con acciones */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between gap-2">
                  <button
                    onClick={handleClearAll}
                    disabled={!hasSelection}
                    className="text-sm text-gray-600 hover:text-gray-800 disabled:text-gray-400
                             transition-colors duration-200 px-3 py-1.5 rounded-lg 
                             hover:bg-gray-200 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  >
                    Limpiar todo
                  </button>
                  <button
                    onClick={handleClose}
                    className="text-sm bg-teal-600 text-white px-4 py-1.5 rounded-lg 
                             hover:bg-teal-700 transition-all duration-200 font-medium
                             hover:shadow-sm active:scale-95"
                    onMouseEnter={e => {
                      gsap.to(e.currentTarget, {
                        scale: 1.02,
                        duration: 0.2,
                        ease: "power2.out"
                      })
                    }}
                    onMouseLeave={e => {
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                      })
                    }}
                  >
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}

export default FilterDropdown
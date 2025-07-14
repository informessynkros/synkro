// Componente de filtrar en el select 

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Check, Filter, Search } from "lucide-react"


interface Column {
  getFilterValue: () => any
  getFacetedUniqueValues: () => Map<any, number>
}

interface FilterDropdownProps {
  column: Column
  onFilterChange: (selectedValues: any[]) => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ column, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedValues, setSelectedValues] = useState<Set<any>>(new Set())

  const dropdownRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const columnFilterValue = column.getFilterValue()
    if (Array.isArray(columnFilterValue)) {
      setSelectedValues(new Set(columnFilterValue))
    }
  }, [column])

  useEffect(() => {
    if (isOpen && dropdownRef.current && backdropRef.current) {
      // Animación del backdrop
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      )

      // Animación del dropdown
      gsap.fromTo(dropdownRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "back.out(1.7)"
        }
      )
    }
  }, [isOpen])

  // Función para cerrar con animación
  const handleClose = () => {
    if (dropdownRef.current && backdropRef.current) {
      // Animar salida del dropdown
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.15,
        ease: "power2.in"
      })

      // Animar salida del backdrop
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false)
        }
      })
    } else {
      setIsOpen(false)
    }
  }

  const uniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort((a, b) => {
    if (a === null) return 1
    if (b === null) return -1
    return a < b ? -1 : 1
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

    // Pequeña animación en el botón cuando se selecciona algo
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
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

    // Animación de feedback al limpiar
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
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

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center gap-2 transition-colors duration-200"
      >
        <div className="flex justify-center px-2">
          <Filter className={`h-5 w-5 text-gray-400 transition-colors duration-300 ${selectedValues.size > 0 ? "text-gray-500" : ""}`} />
          <span className={`text-sm transition-colors duration-300 ${selectedValues.size > 0 ? "text-gray-500 font-medium" : "text-gray-500"}`}>
            {selectedValues.size ? `${selectedValues.size}` : ""}
          </span>
        </div>
      </button>

      {isOpen && (
        <>
          <div
            ref={backdropRef}
            className="fixed inset-0 z-40"
            onClick={handleClose}
            style={{ opacity: 0 }}
          />

          <div
            ref={dropdownRef}
            className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[250px] right-0 left-2/4"
            style={{ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }}
          >
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-shadow duration-200"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredValues.map((value, index) => (
                <div
                  key={index}
                  onClick={() => handleValueClick(value)}
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onMouseEnter={e => {
                    gsap.to(e.currentTarget, {
                      x: 2,
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
                  <div
                    className={`w-4 h-4 border rounded mr-3 flex items-center justify-center transition-all duration-200
                               ${selectedValues.has(value) ? "bg-gray-600 border-gray-600" : "border-gray-300"}`}
                  >
                    {selectedValues.has(value) && (
                      <Check
                        className="text-white text-xs"
                        style={{
                          transform: 'scale(0)',
                          animation: selectedValues.has(value) ? 'checkAppear 0.2s ease-out forwards' : 'none'
                        }}
                      />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{value?.toString() || "N/A"}</span>
                </div>
              ))}

              {filteredValues.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No se encontraron resultados
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between gap-2">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleClose}
                  className="text-sm bg-gray-600 text-white px-4 py-1 rounded-md hover:bg-gray-700 transition-colors duration-200"
                  onMouseEnter={e => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
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
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FilterDropdown
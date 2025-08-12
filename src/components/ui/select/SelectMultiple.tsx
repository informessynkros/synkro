// Componente enfocado en el select multiple con GSAP

import { type ReactNode, useEffect, useRef, useState } from "react"
import { Check, ChevronDown, Search, CircleX } from "lucide-react"
import gsap from "gsap"
import "./style.css"

interface Option {
  [key: string]: any
}

interface FilterSelectProps<T extends Option> {
  options: T[]
  onSelect: (selected: T | T[] | null) => void
  initialValue?: T | T[] | null
  disabled?: boolean
  required?: boolean
  placeholder?: string
  labelKey?: keyof T
  label?: string
  valueKey?: keyof T
  searchPlaceholder?: string
  extraInfo?: (option: T) => ReactNode
  error?: string
  multiple?: boolean
  value?: T | T[] | null
}

function SelectMultiple<T extends Option>({
  options,
  onSelect,
  initialValue = null,
  disabled = false,
  required = false,
  placeholder = "Seleccionar",
  labelKey = "name" as keyof T,
  label,
  valueKey = "id" as keyof T,
  searchPlaceholder = "Buscar...",
  error,
  multiple = false,
}: FilterSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<T[]>(
    multiple && Array.isArray(initialValue) ? initialValue : initialValue ? [initialValue as T] : [],
  )
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [dropdownDirection, setDropdownDirection] = useState<"down" | "up">("down")
  const [showError, setShowError] = useState(false)

  // Refs para GSAP
  const selectRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Calcular la dirección del dropdown cuando se abre
  useEffect(() => {
    if (isOpen && selectRef.current) {
      const selectRect = selectRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const spaceBelow = windowHeight - selectRect.bottom
      const spaceAbove = selectRect.top
      const dropdownHeight = 320

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownDirection("up")
      } else {
        setDropdownDirection("down")
      }
    }
  }, [isOpen])

  // Manejar animación de error
  useEffect(() => {
    if (error && errorRef.current) {
      setShowError(true)
      gsap.fromTo(errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      )
    } else if (!error && showError && errorRef.current) {
      gsap.to(errorRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setShowError(false)
      })
    }
  }, [error, showError])

  // Animación de apertura del dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current && backdropRef.current) {
      // Animar backdrop
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      )

      // Animar dropdown
      const yStart = dropdownDirection === "down" ? -10 : 10
      gsap.fromTo(dropdownRef.current,
        {
          opacity: 0,
          y: yStart,
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
  }, [isOpen, dropdownDirection])

  useEffect(() => {
    if (multiple && Array.isArray(initialValue)) {
      setSelectedOptions(initialValue)
    } else if (!multiple && initialValue) {
      setSelectedOptions([initialValue as T])
    } else {
      setSelectedOptions([])
    }
  }, [initialValue, multiple])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const closeDropdown = () => {
    if (dropdownRef.current && backdropRef.current) {
      // Animar cierre del dropdown
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: dropdownDirection === "down" ? -10 : 10,
        scale: 0.95,
        duration: 0.15,
        ease: "power2.in"
      })

      // Animar cierre del backdrop
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false)
          setSearchTerm("")
        }
      })
    } else {
      setIsOpen(false)
      setSearchTerm("")
    }
  }

  const handleToggle = () => {
    if (!disabled) {
      if (isOpen) {
        closeDropdown()
      } else {
        setIsOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
    }
  }

  const handleSelect = (option: T) => {
    let newSelectedOptions: T[]
    if (multiple) {
      newSelectedOptions = selectedOptions.some((selected) => selected[valueKey] === option[valueKey])
        ? selectedOptions.filter((selected) => selected[valueKey] !== option[valueKey])
        : [...selectedOptions, option]
    } else {
      newSelectedOptions = [option]
      closeDropdown()
    }
    setSelectedOptions(newSelectedOptions)
    onSelect(multiple ? newSelectedOptions : newSelectedOptions[0])

    // Pequeña animación en el botón principal cuando se selecciona
    if (selectRef.current) {
      const button = selectRef.current.querySelector('button')
      if (button) {
        gsap.to(button, {
          scale: 0.98,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        })
      }
    }

    if (!multiple) {
      setSearchTerm("")
    }
  }

  const filteredOptions = options.filter((option) =>
    String(option[labelKey]).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        break
      case "Enter":
        e.preventDefault()
        if (focusedIndex !== -1) {
          handleSelect(filteredOptions[focusedIndex])
        }
        break
      case "Escape":
        closeDropdown()
        break
      default:
        break
    }
  }

  const isSelected = (option: T) => selectedOptions.some((selected) => selected[valueKey] === option[valueKey])

  return (
    <div className="relative w-full mb-4" ref={selectRef}>

      {/* Error message */}
      {showError && (
        <div
          ref={errorRef}
          className="flex justify-center items-center text-red-700 text-sm mt-1 bg-red-100 font-semibold rounded-md p-1 mb-2 gap-2"
          style={{ opacity: 0, transform: 'translateY(-10px)' }}
        >
          <CircleX className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Label */}
      <div>
        <label htmlFor={String(labelKey)} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {/* Main button */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-slate-700 transition-colors duration-200"
        disabled={disabled}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`${selectedOptions.length > 0 ? "text-gray-900" : "text-gray-500"}`}>
          {selectedOptions.length > 0
            ? multiple
              ? `${selectedOptions.length} seleccionado${selectedOptions.length !== 1 ? "s" : ""}`
              : String(selectedOptions[0][labelKey])
            : placeholder}
        </span>
        <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="fixed inset-0 z-[60]"
            onClick={closeDropdown}
            style={{ opacity: 0 }}
          />

          {/* Dropdown container */}
          <div
            ref={dropdownRef}
            className={`absolute z-[70] bg-white rounded-lg shadow-lg border border-gray-200 w-full ${dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
              }`}
            style={{
              minWidth: "250px",
              maxHeight: "320px",
              display: "flex",
              flexDirection: "column",
              opacity: 0,
              transform: 'translateY(-10px) scale(0.95)'
            }}
            role="listbox"
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700 transition-shadow duration-200"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="overflow-y-auto" style={{ maxHeight: "240px" }}>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No se encontraron resultados
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={String(option[valueKey])}
                    onClick={() => handleSelect(option)}
                    className={`flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${index === focusedIndex ? "bg-gray-100" : ""
                      }`}
                    role="option"
                    aria-selected={isSelected(option)}
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      // Micro-animación en hover
                      gsap.to(e.currentTarget, {
                        x: 2,
                        duration: 0.2,
                        ease: "power2.out"
                      })
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        x: 0,
                        duration: 0.2,
                        ease: "power2.out"
                      })
                    }}
                  >
                    <div
                      className={`w-4 h-4 border rounded mr-3 flex items-center justify-center transition-all duration-200
                        ${isSelected(option) ? "bg-slate-700 border-slate-700" : "border-gray-300"}`}
                    >
                      {isSelected(option) && (
                        <Check
                          className="text-white"
                          size={12}
                          style={{
                            transform: 'scale(0)',
                            animation: isSelected(option) ? 'checkAppear 0.2s ease-out forwards' : 'none'
                          }}
                        />
                      )}
                    </div>
                    <span className="text-sm text-gray-700">{String(option[labelKey])}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SelectMultiple
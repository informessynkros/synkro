// Componente de búsqueda

import { Search } from "lucide-react"
import { Hits, InstantSearch, PoweredBy, SearchBox } from "react-instantsearch"
import { searchClient, ALGOLIA_INDEX_NAME } from "../../../lib/algolia"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

interface AlgoliaSearchProps {
  placeholder?: string
  className?: string
  onClose?: () => void
}

const ComponentSearchBox = ({ placeholder = 'Buscar...' }: { placeholder?: string }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <SearchBox
        placeholder={placeholder}
        classNames={{
          root: 'w-full',
          form: 'w-full',
          input: 'w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-700 placeholder-gray-400 duration-200 ',
          submit: 'hidden',
          reset: 'hidden'
        }}
      />
    </div>
  )
}

// Componente para mostrar cada resultado
const Hit = ({ hit, onNavigate }: { hit: any; onNavigate: (url: string) => void }) => {
  const handleClick = () => {
    if (hit.url) {
      onNavigate(hit.url)
    }
  }

  return (
    <div
      className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-700 group-hover:text-sky-600 truncate">
            {hit.title}
          </h3>
          {hit.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {hit.description}
            </p>
          )}
          {hit.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 mt-2">
              {hit.category}
            </span>
          )}
          {hit.available === false && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-2 ml-2">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const AlgoliaSearch = ({
  className = "",
  onClose,
  placeholder = "Buscar módulos, acciones..."
}: AlgoliaSearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Función para manejar navegación
  const handleNavigate = (url: string) => {
    navigate(url)
    handleClose()
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      <div className={`relative ${className}`} ref={searchRef}>
        <InstantSearch
          searchClient={searchClient}
          indexName={ALGOLIA_INDEX_NAME}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          <div
            className="flex items-center space-x-4 px-4 py-2 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <Search className="w-5 h-5 text-gray-400" />
            {/* <span className="text-gray-500 flex-1 text-left text-sm">
              {placeholder}
            </span> */}
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 text-xs font-medium border-gray-300 text-gray-500 bg-gray-100 rounded border">
                ⌘
              </kbd>
              <kbd className="px-2 py-1 text-xs font-medium border-gray-300 text-gray-500 bg-gray-100 rounded border">
                K
              </kbd>
            </div>
          </div>

          {isOpen && (
            <>
              <div
                className="fixed inset-0"
                onClick={handleClose}
              />

              <div
                className="fixed inset-0 flex items-start justify-center pt-20 px-4 pointer-events-none"
              >
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl max-h-96 flex flex-col pointer-events-auto">
                  {/* Header con SearchBox */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center border-gray-200">
                      <div className="flex-1">
                        <ComponentSearchBox placeholder={placeholder} />
                      </div>
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="flex-1 overflow-y-auto">
                    <Hits
                      hitComponent={({ hit }) => (
                        <Hit hit={hit} onNavigate={handleNavigate} />
                      )}
                      classNames={{
                        root: 'h-full',
                        list: 'divide-y divide-gray-100',
                        item: ''
                      }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">↵</kbd>
                        <span>Seleccionar</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <kbd className="px-2 py-1 bg-gray-100 rounded">ESC</kbd>
                        <span>Cerrar</span>
                      </span>
                    </div>
                    <PoweredBy className="text-xs" />
                  </div>
                </div>
              </div>
            </>
          )}
        </InstantSearch>
      </div>
    </>
  )
}

export default AlgoliaSearch
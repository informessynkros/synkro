// Componente de lista de extensiones
import { useState } from 'react'
import { Check, Search, Settings, Zap, Hash, Building } from 'lucide-react'

interface Extension {
  id: string
  name: string
  description: string
  active: boolean
}

interface ExtensionsListProps {
  extensions: Extension[]
  selectedExtensions: string[]
  onExtensionToggle: (extensionId: string) => void
  className?: string
}

const ExtensionsList = ({
  extensions,
  selectedExtensions,
  onExtensionToggle,
  className = ""
}: ExtensionsListProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Filtrar extensiones por búsqueda
  const filteredExtensions = extensions.filter(ext =>
    ext.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ext.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Función para obtener icono según el tipo de extensión
  const getExtensionIcon = (name: string) => {
    switch (name) {
      case 'CCID':
        return <Hash className="w-4 h-4" />
      case '11IM':
        return <Zap className="w-4 h-4" />
      case 'M555N':
        return <Settings className="w-4 h-4" />
      case 'FABRICANTE':
        return <Building className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar extensión..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-shadow duration-200"
        />
      </div>

      {/* Lista de extensiones */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredExtensions.map((extension) => {
          const isSelected = selectedExtensions.includes(extension.id)

          return (
            <div
              key={extension.id}
              onClick={() => extension.active && onExtensionToggle(extension.id)}
              className={`
                relative p-3 rounded-lg border cursor-pointer transition-all duration-200
                ${extension.active
                  ? isSelected
                    ? 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
            >
              <div className="flex items-start gap-3">

                {/* Checkbox personalizado */}
                <div
                  className={`
                    w-5 h-5 border-2 rounded flex items-center justify-center mt-0.5 flex-shrink-0 transition-all duration-200
                    ${extension.active
                      ? isSelected
                        ? 'border-gray-500 bg-gray-500'
                        : 'border-gray-300 bg-white'
                      : 'border-gray-200 bg-gray-100'
                    }
                  `}
                >
                  {isSelected && extension.active && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Icono de la extensión */}
                <div className={`
                  p-2 rounded-lg flex-shrink-0
                  ${extension.active
                    ? isSelected
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-100 text-gray-600'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {getExtensionIcon(extension.name)}
                </div>

                {/* Información de la extensión */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium text-sm ${extension.active ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      {extension.name}
                    </h4>

                    {!extension.active && (
                      <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mt-1 ${extension.active ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                    {extension.description}
                  </p>
                </div>
              </div>

              {/* Indicador de selección */}
              {isSelected && extension.active && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Estado vacío */}
      {filteredExtensions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No se encontraron extensiones</p>
          <p className="text-xs text-gray-400 mt-1">
            Intenta con otro término de búsqueda
          </p>
        </div>
      )}

      {/* Resumen de selección */}
      {selectedExtensions.length > 0 && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-800">
            {selectedExtensions.length} extensión{selectedExtensions.length !== 1 ? 'es' : ''} seleccionada{selectedExtensions.length !== 1 ? 's' : ''}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedExtensions.map(id => {
              const ext = extensions.find(e => e.id === id)
              return ext ? (
                <span
                  key={id}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {ext.name}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExtensionsList
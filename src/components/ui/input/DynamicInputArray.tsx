// Componente que ayuda con el input dinamico presente en inventario

import { CircleX, Plus, type LucideIcon } from "lucide-react"
import { useState } from "react"


interface DynamicInputArrayProps {
  label: string
  placeholder: string
  values: string[],
  onChange: (values: string[]) => void
  icon?: LucideIcon
  error?: string
  required?: boolean
  maxItems?: number
}

const DynamicInputArray = ({
  label,
  placeholder,
  values,
  onChange,
  error,
  required = false,
  maxItems = 5,
  icon: Icon,
}: DynamicInputArrayProps) => {

  const [inputValues, setInputValues] = useState<Array<{ id: string, value: string }>>(
    (values || []).length > 0
      ? (values || []).map((val, idx) => ({ id: `input-${Date.now()}-${idx}`, value: val }))
      : [{ id: `input-${Date.now()}-0`, value: '' }]
  )

  const handleInputChange = (id: string, value: string) => {
    const newValues = inputValues.map(item =>
      item.id === id ? { ...item, value } : item
    )
    setInputValues(newValues)

    // Filtrar valores vacíos antes de enviar al parent
    const filteredValues = newValues
      .filter(item => item.value.trim() !== '')
      .map(item => item.value)
    onChange(filteredValues)
  }

  const addNewInput = () => {
    if (inputValues.length < maxItems) {
      const newId = `input-${Date.now()}-${Math.random()}`
      const newValues = [...inputValues, { id: newId, value: '' }]
      setInputValues(newValues)
    }
  }

  const removeInput = (id: string) => {
    if (inputValues.length > 1) {
      const newValues = inputValues.filter(item => item.id !== id)
      setInputValues(newValues)

      // Actualizar parent con valores filtrados
      const filteredValues = newValues
        .filter(item => item.value.trim() !== '')
        .map(item => item.value)
      onChange(filteredValues)
    }
  }

  const inputClasses = `w-full px-4 py-2 ${Icon ? "pl-10" : "pl-4"
    } border rounded-lg focus:outline-none focus:ring-2 duration-200 focus:shadow-md ${error
      ? "border-red-500 focus:ring-red-500 text-red-600"
      : "border-gray-200 focus:ring-slate-700 text-slate-600"
    }`

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-[5px]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* inputs dinamicos */}
      <div className="space-y-2">
        {inputValues.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {Icon && (
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Icon className={`w-5 h-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                )}
              </div>
              <input
                type="text"
                onChange={e => handleInputChange(item.id, e.target.value)}
                value={item.value}
                placeholder={`${placeholder} ${index + 1}`}
                className={inputClasses}
              />
            </div>

            {/* Botón de eliminar - solo mostrar si hay más de 1 input */}
            {inputValues.length > 1 && (
              <button
                type="button"
                onClick={() => removeInput(item.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <CircleX className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botón agregar */}
      {inputValues.length < maxItems && (
        <button
          type="button"
          onClick={addNewInput}
          className="mt-2 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 transiiton-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar otro atributo
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-500"> Máximo {maxItems} ubicaciones. Ej: "Piso 1", "Zona A", "Estante 5" </p>
    </div>
  )
}

export default DynamicInputArray

// Componente de zona de carga de archivos
import { useState, useRef, type DragEvent } from 'react'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void
  uploadedFile?: File | null
  acceptedTypes?: string[]
  maxSize?: number
  className?: string
}

const FileUploadZone = ({
  onFileUpload,
  uploadedFile,
  acceptedTypes = ['.csv', '.txt'],
  maxSize = 10,
  className = ""
}: FileUploadZoneProps) => {

  // Estados
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función que valida el archivo
  const validateFile = (file: File): boolean => {
    setError('')

    // Validar tamaño
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`El archivo es demasiado grande. Máximo ${maxSize}MB permitido.`)
      return false
    }

    // Validar tipo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(fileExtension)) {
      setError(`Tipo de archivo no permitido. Solo se aceptan: ${acceptedTypes.join(', ')}`)
      return false
    }

    return true
  }

  // Esto nos ayuda a pintar el archivo seleccionado
  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onFileUpload(file)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Llamar onFileUpload con null para limpiar
    onFileUpload(null as any)
  }

  return (
    <div className={`space-y-3 ${className}`}>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer
          ${isDragOver
            ? 'border-blue-400 bg-blue-50'
            : uploadedFile
              ? 'border-green-300 bg-green-50'
              : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="text-center">
          {uploadedFile ? (
            <div className="space-y-3">
              <div className="flex justify-center">
                <FileText className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  Archivo cargado exitosamente
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {uploadedFile.name} • {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
              >
                <X className="w-3 h-3" />
                Remover
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Upload className={`w-12 h-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  o haz click para seleccionar
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                <span>Tipos permitidos:</span>
                {acceptedTypes.map((type, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 rounded">
                    {type.toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Máximo {maxSize}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Recuerda que tu archivo debe:</p>
        <ul className="space-y-1 ml-4">
          <li>• Estar separado por "," (comas)</li>
          <li>• Debe de estar separado por " ↩ " (salto de línea)</li>
          <li>• Cada línea debe tener la misma cantidad de elementos</li>
        </ul>
      </div>
    </div>
  )
}

export default FileUploadZone
// Componente input de TextArea

import { forwardRef } from "react"

export interface CustomTextareaProps {
  label: string
  error?: string
  className?: string
  type?: string
  placeholder?: string
}

const CustomTextarea = forwardRef<HTMLTextAreaElement | HTMLTextAreaElement, CustomTextareaProps>(({ 
  label, 
  className = "", 
  error,
  placeholder,
  ...props 
}, ref) => {
  const textareaClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 duration-200 focus:shadow-md ${
    error 
      ? "border-red-500 focus:ring-red-500 text-red-600" 
      : "border-gray-200 focus:ring-slate-700 text-slate-600"
  } ${className}`

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        className={textareaClasses}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
    </div>
  )
})

CustomTextarea.displayName = 'CustomTextarea'

export default CustomTextarea
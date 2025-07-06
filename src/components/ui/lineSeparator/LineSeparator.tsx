// Componente de linea separadora

interface LineSeparatorProps {
  borderColor?: string
  className?: string
}

const LineSeparator = ({
  borderColor = "border-gray-200",
  className = ""
}: LineSeparatorProps) => {
  return (
    <hr className={`my-1 ${borderColor} ${className}`} />
  )
}

export default LineSeparator

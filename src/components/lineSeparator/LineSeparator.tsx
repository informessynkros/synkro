// Componente de linea separadora

interface LineSeparatorProps {
  borderColor?: string
}

const LineSeparator = ({
  borderColor = "border-gray-200",
}: LineSeparatorProps) => {
  return (
    <hr className={`my-1 ${borderColor}`} />
  )
}

export default LineSeparator

// Hook que me retorna funciones auxiliares para abrir, cerrar, y mostrar información

import { useState } from "react"


export function useDrawerManager<T>() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<T | null>(null)

  // Explicación de valores:
  // 1. T: es el tipo genérico que se define cuando usas el hook
  // 2. es genérico, se convierte en el tipo que especifiques

  const handleOpenDrawer = () => {
    setSelectedItem(null)
    setIsDrawerOpen(true)
  }

  const handleClick = (item: T) => {
    if (item) {
      setSelectedItem(item)
      setIsDrawerOpen(true)
    }
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedItem(null)
  }

  return {
    isDrawerOpen,
    selectedItem,
    setIsDrawerOpen,
    handleOpenDrawer,
    handleClick,
    handleCloseDrawer
  }
}

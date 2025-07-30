// Hook de algolia

import { useEffect } from "react"


interface UseSearchShortcutProps {
  onOpen: () => void
  isOpen: boolean
}

const useSearchShortcut = ({ onOpen, isOpen }: UseSearchShortcutProps) => {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Donde Cmd+K en Mac, Ctrl+K en Windows/Linux
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        if (!isOpen) {
          onOpen()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onOpen, isOpen])
}

export default useSearchShortcut

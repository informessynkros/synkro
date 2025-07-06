// Componente de input de búsqueda

import { Search } from "lucide-react"
import { useState } from "react"
import useMediaQueries from "../../../hooks/useMediaQueries"


const InputSearch = () => {

  // Estados
  const [searchValue, setSearchValue] = useState('')

  // Hook
  const { isMobile, isTablet } = useMediaQueries()

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}text-gray-400`} />
      </div>
      <input
        type="text"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder={`${isMobile ? 'Buscar...' : 'Buscar'}`}
        className={`
          block w-full pr-3 rounded-full bg-gray-50 text-sm placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-[#333] focus:border-transparent 
          transition-all duration-200
          ${isMobile
            ? 'pl-9 py-2.5'
            : isTablet
              ? 'pl-10 py-2'
              : 'pl-10 py-2'
          }
        `}
      />
    </div>
  )
}

export default InputSearch

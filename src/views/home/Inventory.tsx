// Vista de inventario

import { Calendar } from "lucide-react"
import CardInventory from "../../components/ui/card/CardInventory"
import useMediaQueries from "../../hooks/useMediaQueries"


const Inventory = () => {

  // Hook
  const { isDesktop, isTablet, isMobile } = useMediaQueries()

  return (
    <div>
      <div className={`grid ${isDesktop ? 'grid-cols-3' : isTablet ? 'grid-cols-2' : isMobile ? 'grid-cols-1' : ''} gap-5`}>
        <CardInventory
          icon={Calendar}
          title="Crear almacén"
          paragraph="Para poder cargar tu inventario inicial debes de crear tu primer almacén, da click aqui y configuralo"
          background="#202123"
          href="/create-inventory"
        />

        <CardInventory
          icon={Calendar}
          title="Cargar inventario"
          paragraph='Una vez creado tu almacén, carga tu primer inventario con el "input file" que te da tu proveedor de sims'
          background="#666"
          href="/charge-inventory"
        />
      </div>
    </div>
  )
}

export default Inventory

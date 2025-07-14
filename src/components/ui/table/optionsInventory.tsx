// Pequeño componente que contiene las diferentes opciones que se pueden realizar en almacén

import { Box, Boxes, Inbox, ListRestart, SlidersHorizontal } from 'lucide-react'
import ButtonCustom from '../button/ButtonCustom'
import useNavigation from '../../../hooks/useNavigation'

const OptionsInventory = () => {

  // Hook
  const { goView } = useNavigation()

  return (
    <div className="p-3 md:p-6 flex flex-col">
      <div className="mb-6 text-gray-600 flex gap-2 items-center">
        <SlidersHorizontal />
        <h1 className="text-2xl font-semibold"> Otras acciones de inventario </h1>
      </div>
      <div className="flex justify-start gap-x-6">
        <ButtonCustom
          text="Lista de cargas"
          icon={ListRestart}
          onClick={() => console.log('Lista de cargas')}
          className="bg-sky-600 hover:bg-sky-700"
        />
        <ButtonCustom
          text="Cargar inventario"
          icon={Boxes}
          onClick={() => goView('/charge-inventory')}
          className="bg-amber-500 hover:bg-amber-600"
        />
        <ButtonCustom
          text="Lista de almacenes"
          icon={Box}
          onClick={() => console.log('Lista de cargas')}
          className="bg-purple-500 hover:bg-purple-600"
        />
        <ButtonCustom
          text="Crear almacén"
          icon={Inbox}
          onClick={() => goView('/create-inventory')}
        />
      </div>
    </div>
  )
}

export default OptionsInventory

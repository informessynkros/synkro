// Hook que nos ayuda como funcion auxiliar para navegar a ota vista

import { useNavigate } from "react-router-dom"


const useNavigation = () => {

  const navigate = useNavigate()

  // Regresar una vista anterior
  const goBack = () => {
    navigate(-1)
  }

  const goView = (url: string) => {
    navigate(url)
  }

  return {
    goBack,
    goView
  }
}

export default useNavigation

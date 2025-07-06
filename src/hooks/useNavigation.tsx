// Hook que nos ayuda como funcion auxiliar para navegar a ota vista

import { useNavigate } from "react-router-dom"



const useNavigation = () => {

  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1)
  }

  return {
    goBack
  }
}

export default useNavigation

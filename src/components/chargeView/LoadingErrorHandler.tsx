// Componente que muestra el error si es que lo hay, pinta el loading, o si salió bien todo, la información



import type { ReactNode } from "react"
import { XCircle } from "lucide-react"
import LottieAnimation from "../../components/ui/animations/LottieAnimation"
import error404 from "../../components/lottie/error404.json"
import CubeGrid from "../ui/spinner/CubeGrid"

interface LoadingErrorHandlerProps {
  isLoading?: boolean
  isError?: boolean
  loadingMessage?: string
  children?: ReactNode
  error?: Error | null
}

const LoadingErrorHandler = ({
  isLoading,
  isError,
  children,
  error
}: LoadingErrorHandlerProps) => {

  // Mostramos el error que recibamos de la api
  const errorJSON = error?.message ? JSON.parse(error.message) : null

  if (isLoading) { // Es pantalla de carga
    return (
      <div className="flex items-center justify-center">
        <CubeGrid text="Cargando información..." />
      </div>
    )
  }

  if (isError) { // Es un error
    return (
      <div className="bg-white w-full rounded-md shadow p-3">
        <div className="text-center text-red-700 mt-4">
          <div className="flex items-center justify-center gap-2">
            <XCircle />
            <h2 className="text-2xl font-bold mb-2"> Ocurrio un error </h2>
          </div>
          <div className="flex flex-col items-center">
            <p>{errorJSON.message}</p>
            <LottieAnimation
              width={400}
              height={400}
              animationData={error404}
              className="w-[200px] sm:w-[300px] md:w-[400px]"
            />
          </div>
          {/* <p> Ocurrio un error </p> */}
        </div>
      </div>
    )
  }

  return children
}

export default LoadingErrorHandler
// Vista de un error que no encontro información

import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ArrowLeft } from "lucide-react"
import SlotMachineNumber from "../../components/ui/animations/SlotMachineNumber"
import ButtonCustom from "../../components/ui/button/ButtonCustom"


const NotFound = () => {

  const navigate = useNavigate()

  // Refs para animaciones en los elementos
  const logoRef = useRef<HTMLDivElement>(null)
  const numbersRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Efectos
  useEffect(() => {
    // Timeline principal de entrada
    const tl = gsap.timeline()

    // Animación del logo
    tl.fromTo(logoRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
    )

      // Los números se animan automáticamente con sus delays

      // Animación de la imagen (después de que terminen los números con la animación de las tragamonedas)
      .fromTo(imageRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.7)' },
        "+=1.5" // Espera a que terminen los números
      )

      // Animación de texto
      .fromTo(contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        "-=0.3"
      )

      // Animación del botón
      .fromTo(buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        "-=0.3"
      )

    return () => {
      tl.kill()
    }
  }, [])

  // Regresamos a la vista anterior (En la que estabamos antes de)
  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">

      <div ref={logoRef} className="mb-8">
        <div className="flex justify-center items-center my-8 text-2xl font-bold">
          <div className="flex gap-3 items-center text-4xl">
            <span className="bg-[#333] text-white px-2 py-1 rounded-full shadow-md">@</span>
            <span>Synkros</span>
          </div>
        </div>
      </div>

      {/* Números animados 404 */}
      <div ref={numbersRef} className="flex items-center justify-center mb-12 space-x-2">
        <SlotMachineNumber finalNumber={4} delay={0} duration={2} />
        <SlotMachineNumber finalNumber={0} delay={0.3} duration={2.2} />
        <SlotMachineNumber finalNumber={4} delay={0.6} duration={2.4} />
      </div>

      <div ref={imageRef} className="mb-8">
        <div className="w-64 h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <img src='https://images-synkros.s3.us-east-1.amazonaws.com/404.svg' alt="Imagen que muestra un not found" />
            <div className="w-32 h-32 bg-gradient-to-br from-slate-300 to-slate-500 rounded-full mx-auto mb-4 flex items-center justify-center" />
          </div>
        </div>
      </div>

      <div ref={contentRef} className="text-center mb-8 max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          ¡Oops! Página no encontrada
        </h1>
        <p className="text-gray-600 leading-relaxed">
          La página que buscas no existe o ha sido movida.
          No te preocupes, puedes regresar a donde estabas y continuar navegando.
        </p>
      </div>

      <div ref={buttonRef}>
        <ButtonCustom
          icon={ArrowLeft}
          text="Volver atrás"
          onClick={handleGoBack}
          bgColor="primary"
          className="px-8"
        />
      </div>
    </div>
  )
}

export default NotFound

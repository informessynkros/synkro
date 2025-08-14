import { ShieldUser, type LucideIcon, Crown, Shield, TrendingUp, Headphones, Settings, LifeBuoy, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react"
import Card2 from "../ui/card/Card2"
import { useRoles } from "../../hooks/useUsers"
import CubeGrid from "../ui/spinner/CubeGrid"
import { useState, useRef } from "react"
import { gsap } from "gsap"
import useMediaQueries from "../../hooks/useMediaQueries"

interface RolesProps {
  enabledButton?: boolean
  onButtonClick?: () => void
  iconButton?: LucideIcon
  buttonText?: string
}

// Mapeo de iconos por nombre de string
const getIconComponent = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    'Crown': Crown,
    'Shield': Shield,
    'TrendingUp': TrendingUp,
    'Headphones': Headphones,
    'Settings': Settings,
    'LifeBuoy': LifeBuoy,
    'ShieldCheck': ShieldCheck,
    'ShieldUser': ShieldUser,
  }

  return iconMap[iconName] || Shield // Shield como fallback
}

// Función para calcular usuarios totales (mock por ahora)
const calculateTotalUsers = (roleId: string): number => {
  // Genera un número basado en el ID del rol para consistencia
  const hash = roleId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)

  return Math.abs(hash % 20) + 1 // Entre 1 y 20 usuarios
}

const Roles = ({
  enabledButton,
  onButtonClick,
  iconButton: IconButton,
  buttonText
}: RolesProps) => {

  // Hooks
  const { isDesktop, isLaptop, isTablet, isMobile } = useMediaQueries()
  const {
    roles,
    isLoadingRoles,
    isErrorRoles,
    errorRoles
  } = useRoles()

  // Estados para mostrar más
  const [showAll, setShowAll] = useState(false)

  // Referencias para animaciones
  const gridRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Lógica para cantidad inicial según pantalla
  const getInitialCount = () => {
    if (isMobile) return 2      // 1 columna = 4 roles (4 filas)
    if (isTablet) return 3      // 2 columnas = 6 roles (3 filas)  
    if (isLaptop) return 4      // 3 columnas = 9 roles (3 filas)
    return 4                    // 4 columnas = 8 roles (2 filas)
  }

  const initialCount = getInitialCount()
  const visibleRoles = showAll ? roles : roles?.slice(0, initialCount) || []
  const hasMoreRoles = (roles?.length || 0) > initialCount

  // Función para mostrar más con animación
  const handleShowMore = () => {
    if (!gridRef.current) return

    setShowAll(true)

    // Usar setTimeout para esperar que React renderice los nuevos elementos
    setTimeout(() => {
      if (gridRef.current) {
        const newCards = gridRef.current.querySelectorAll('[data-new-role="true"]')

        // Animar entrada de las nuevas cartas
        gsap.fromTo(newCards,
          {
            opacity: 0,
            y: 30,
            scale: 0.9
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.2)",
            onComplete: () => {
              // Limpiar el atributo data después de la animación
              newCards.forEach(card => card.removeAttribute('data-new-role'))
            }
          }
        )

        // Animar el botón "Mostrar menos"
        if (buttonRef.current) {
          gsap.fromTo(buttonRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, delay: 0.2 }
          )
        }

        // Scroll suave para mostrar las nuevas cartas
        const lastCard = newCards[newCards.length - 1] as HTMLElement
        if (lastCard) {
          lastCard.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }
    }, 50)
  }

  // Función para mostrar menos con animación
  const handleShowLess = () => {
    if (!gridRef.current) return

    const allCards = gridRef.current.querySelectorAll('[data-role-card="true"]')
    const cardsToHide = Array.from(allCards).slice(initialCount)

    // Animar salida de las cartas que se van a ocultar
    gsap.to(cardsToHide, {
      opacity: 0,
      y: -20,
      scale: 0.9,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setShowAll(false)

        // Scroll de vuelta al inicio de los roles
        if (gridRef.current) {
          gridRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    })
  }

  return (
    <div className="mx-3 mb-3">
      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-100">
          <div className="mb-6">
            <div className={`flex items-center ${isMobile ? 'flex-col mb-4' : 'justify-between'} w-full`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-50 rounded-lg">
                  <ShieldUser className="w-5 h-5 text-teal-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Roles</h2>
              </div>
              {enabledButton && (
                <div className="bg-teal-700 p-2 hover:bg-teal-800 duration-300 rounded-md w-full justify-center flex sm:w-auto">
                  <button className="flex gap-2 items-center cursor-pointer" type="button" onClick={onButtonClick}>
                    {IconButton && <IconButton className="text-white" />}
                    <span className="text-white font-base">{buttonText}</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              Roles disponibles para asignar • {roles?.length || 0} roles configurados
              {hasMoreRoles && !showAll && (
                <span className="text-teal-600 ml-1">
                  • Mostrando {initialCount} de {roles?.length}
                </span>
              )}
            </p>
          </div>

          {isLoadingRoles ? (
            <div className="flex justify-center py-12">
              <CubeGrid />
            </div>
          ) : (
            isErrorRoles ? (
              <div className="bg-red-50 border border-red-200 p-4 text-center rounded-lg">
                <div className="text-red-600 font-semibold mb-2">Error al cargar roles</div>
                <div className="text-red-500 text-sm">{errorRoles?.message}</div>
              </div>
            ) : (
              <div className="space-y-8">
                <div
                  ref={gridRef}
                  className={`grid ${isDesktop ? 'grid-cols-4' : isLaptop ? 'grid-cols-3' : isTablet ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}
                >
                  {visibleRoles && visibleRoles.length > 0 ? (
                    visibleRoles.map((role: any, index: number) => {
                      // Marcar roles nuevos para animación
                      const isNewRole = showAll && index >= initialCount

                      return (
                        <div
                          key={role.id_role}
                          data-role-card="true"
                          data-new-role={isNewRole ? "true" : undefined}
                        >
                          <Card2
                            title={role.name}
                            subtitle={role.description || "Sin descripción disponible"}
                            icon={getIconComponent(role.icon)}
                            updateDate={role.high_date ? `Creado ${new Date(role.high_date).toLocaleDateString()}` : "Recently created"}
                            totalUsers={calculateTotalUsers(role.id_role)}
                            enabledButton={true}
                            titleButton="Detalles"
                            onButton={() => {
                              // Lógica para ver detalles del rol
                              console.log('Ver detalles del rol:', role.name)
                            }}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-400 mb-2">
                        <ShieldUser className="w-12 h-12 mx-auto" />
                      </div>
                      <div className="text-gray-500 font-medium">No hay roles configurados</div>
                      <div className="text-gray-400 text-sm mt-1">
                        Crea tu primer rol para comenzar
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón Mostrar más / Mostrar menos */}
                {hasMoreRoles && (
                  <div className="flex justify-center">
                    {!showAll ? (
                      <button
                        onClick={handleShowMore}
                        className="group flex items-center gap-3 bg-teal-600 hover:bg-teal-700 
                                 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 
                                 hover:shadow-lg"
                      >
                        <span>
                          Ver todos los roles
                          <span className="text-teal-200 ml-1">
                            ({(roles?.length || 0) - initialCount} más)
                          </span>
                        </span>
                        <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      </button>
                    ) : (
                      <button
                        ref={buttonRef}
                        onClick={handleShowLess}
                        className="group flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 
                                 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 
                                 hover:shadow-lg"
                      >
                        <span>Mostrar menos</span>
                        <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Roles
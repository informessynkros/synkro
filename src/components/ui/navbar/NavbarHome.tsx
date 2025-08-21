// Navbar correspondiente al inicio

import { useEffect, useState, useRef } from "react"
import useMediaQueries from "../../../hooks/useMediaQueries"
import gsap from "gsap"
import ButtonCustom from "../button/ButtonCustom"
import { LogIn } from "lucide-react"

const NavbarHome = () => {
  // Hook con todos los breakpoints
  const { isDesktop, isLaptop, isTablet, isMobile } = useMediaQueries()

  // Estados
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Refs para GSAP con tipos correctos
  const navbarRef = useRef<HTMLElement>(null)
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const ctaButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Timeline de GSAP para animaciones de entrada
  useEffect(() => {
    const tl = gsap.timeline()

    // Animación inicial del navbar
    tl.fromTo(navbarRef.current,
      {
        y: -100,
        opacity: 0,
        scale: 0.8
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    )

    // Animación escalonada de los menu items
    const validMenuItems = menuItemsRef.current.filter(item => item !== null)
    if (validMenuItems.length > 0) {
      tl.fromTo(validMenuItems,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        },
        "-=0.3"
      )
    }

    // Animación del botón CTA
    tl.fromTo(ctaButtonRef.current,
      {
        scale: 0,
        rotation: 180
      },
      {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      },
      "-=0.2"
    )
  }, [])

  // Efecto de scroll con GSAP
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20

      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled)

        // Animación suave cuando cambia el estado de scroll
        gsap.to(navbarRef.current, {
          scale: scrolled ? 0.95 : 1,
          y: scrolled ? 2 : 0,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolled])

  // Animación del menú móvil con GSAP
  useEffect(() => {
    if ((isMobile || isTablet) && mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        // Abrir menú
        gsap.to(mobileMenuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        })

        // Animar items del menú móvil
        const menuContainer = mobileMenuRef.current?.children[0] as HTMLElement
        if (menuContainer && menuContainer.children) {
          gsap.fromTo(Array.from(menuContainer.children),
            {
              x: 20,
              opacity: 0
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.3,
              stagger: 0.1,
              ease: "power2.out"
            }
          )
        }
      } else {
        // Cerrar menú
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        })
      }
    }
  }, [isMobileMenuOpen, isMobile, isTablet])

  const menuItems = [
    { name: 'Inicio', href: '#' },
    { name: 'Servicios', href: '#' },
    { name: 'Precios', href: '#' },
    { name: 'Help', href: '#' }
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)

    // Animación juguetona del botón hamburguesa
    if (!isMobileMenuOpen) {
      gsap.to(".hamburger-button", {
        rotation: 90,
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
    } else {
      gsap.to(".hamburger-button", {
        rotation: 0,
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
    }
  }

  // Hover animations con GSAP
  const handleMouseEnter = (index: number) => {
    setHoveredItem(index)

    const menuItem = menuItemsRef.current[index]
    if (menuItem) {
      gsap.to(menuItem, {
        y: -2,
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = (index: number) => {
    setHoveredItem(null)

    const menuItem = menuItemsRef.current[index]
    if (menuItem) {
      gsap.to(menuItem, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  return (
    <>
      <div className="h-20"></div>

      <nav
        ref={navbarRef}
        className={`fixed top-4 z-50 transition-all duration-500 ease-out ${isMobile ? 'left-4 right-4' :
          isTablet ? 'left-8 right-8' :
            isLaptop ? 'left-12 right-12' :
              'left-16 right-16'
          }`}
      >
        <div
          className={`backdrop-blur-md bg-white/80 rounded-3xl border border-white/20 shadow-lg transition-all duration-500 ease-out w-full ${isScrolled ? 'bg-white/90 shadow-xl' : ''
            }`}
        >
          <div className={`${isMobile || isTablet ? 'hidden' : 'flex'} items-center justify-between w-full ${isDesktop ? 'px-8 py-3' : 'px-6 py-3'
            }`}>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Synkro
              </h1>
            </div>

            <div className={`flex items-center ${isDesktop ? 'space-x-10' :
              isLaptop ? 'space-x-8' :
                'space-x-6'
              }`}>
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  ref={el => {
                    menuItemsRef.current[index] = el
                  }}
                  href={item.href}
                  className={`relative transition-all duration-300 ease-out hover:text-gray-700 group ${isDesktop ? 'py-3 px-5 text-base' :
                    isLaptop ? 'py-2 px-4 text-base' :
                      'py-2 px-3 text-sm'
                    } text-gray-600 font-medium`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                >
                  {item.name}

                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ease-out -z-10 ${hoveredItem === index
                      ? 'opacity-100'
                      : 'opacity-0'
                      }`}
                  />

                  <div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-teal-500 transition-all duration-300 ease-out ${hoveredItem === index ? 'w-3/4' : 'w-0'
                      }`}
                  />
                </a>
              ))}
              <ButtonCustom
                ref={ctaButtonRef}
                className={`bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-all duration-300 ease-out hover:shadow-lg ${isDesktop ? 'px-8 py-3 text-base' :
                  isLaptop ? 'px-6 py-2 text-base' :
                    'px-5 py-2 text-sm'
                  }`}
                icon={LogIn}
                text="Iniciar sesión"
              />
            </div>
          </div>

          <div className={`${isMobile || isTablet ? 'flex' : 'hidden'} items-center justify-between w-full ${isTablet ? 'px-6 py-4' : 'px-5 py-3'
            }`}>
            <h1 className={`font-bold text-gray-800 ${isTablet ? 'text-2xl' : 'text-xl'
              }`}>Synkro</h1>

            <button
              onClick={toggleMobileMenu}
              className={`hamburger-button flex flex-col justify-center items-center space-y-1 transition-all duration-300 ease-out ${isTablet ? 'w-10 h-10' : 'w-8 h-8'
                }`}
            >
              <span className={`bg-gray-700 transition-all duration-300 ${isTablet ? 'w-7 h-0.5' : 'w-6 h-0.5'
                } ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
              <span className={`bg-gray-700 transition-all duration-300 ${isTablet ? 'w-7 h-0.5' : 'w-6 h-0.5'
                } ${isMobileMenuOpen ? 'opacity-0' : ''
                }`}></span>
              <span className={`bg-gray-700 transition-all duration-300 ${isTablet ? 'w-7 h-0.5' : 'w-6 h-0.5'
                } ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
            </button>
          </div>

          <div
            ref={mobileMenuRef}
            className={`${isMobile || isTablet ? 'block' : 'hidden'} overflow-hidden`}
            style={{ height: 0, opacity: 0 }}
          >
            <div className={`pt-2 space-y-2 ${isTablet ? 'px-10 pb-8' : 'px-8 pb-6'
              }`}>
              {menuItems.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`block font-medium hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300 ease-out ${isTablet ? 'py-4 px-6 text-lg' : 'py-4 px-5 text-base'
                    } text-gray-700`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <ButtonCustom
                className={`w-full mt-6 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all duration-300 ease-out ${isTablet ? 'py-5 px-6 text-lg' : 'py-4 px-5 text-base'
                  }`}
                icon={LogIn}
                text="Iniciar sesión"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavbarHome
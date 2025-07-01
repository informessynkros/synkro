import { useMediaQuery } from "react-responsive"


const useMediaQueries = () => {

  const isMobile = useMediaQuery({ maxWidth: 767 }) // Escritorio
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 }) // Tablet
  const isDesktop = useMediaQuery({ minWidth: 1024 }) // Escritorio

  return {
    isDesktop,
    isTablet,
    isMobile
  }
}

export default useMediaQueries
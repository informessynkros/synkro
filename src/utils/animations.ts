// Animaciones

import gsap from "gsap"

// Animaciones de los errores en inputs
export const errorAnimations = {
  // Mostramos el error
  showError: (element: HTMLElement) => {
    return gsap.fromTo(element,
      { opacity: 0, y: -10, height: 0, marginTop: 0 },
      { opacity: 1, y: 0, height: 'auto', marginTop: 4, duration: 0.3, ease: "power2.out" }
    )
  },

  // Ocultar error
  hideError: (element: HTMLElement, onComplete?: () => void) => {
    return gsap.to(element,
      { opacity: 0, y: -10, height: 0, marginTop: 0, duration: 0.2, ease: "power2.out", onComplete },
    )
  },
}

// Animaciones para inputs
export const inputAnimations = {
  // Focus effect
  focusIn: (element: HTMLElement) => {
    return gsap.to(element, {
      scale: 1.01,
      duration: 0.2,
      ease: "power2.out"
    })
  },

  focusOut: (element: HTMLElement) => {
    return gsap.to(element, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    })
  },

  // Shake effect para errores
  shake: (element: HTMLElement) => {
    return gsap.to(element, {
      x: "5px",
      duration: 0.1,
      ease: "power2.out",
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        gsap.set(element, { x: 0 })
      }
    })
  }
}


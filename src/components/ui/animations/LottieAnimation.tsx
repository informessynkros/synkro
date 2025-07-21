// Componente que ejecuta el lottie

import Lottie from "lottie-react"
import type { LottieComponentProps } from "lottie-react"


interface LottieAnimationProps {
  width?: number | string
  height?: number | string
  animationData?: LottieComponentProps['animationData']
  className?: string
}

const LottieAnimation = ({ width, height, animationData, className, ...props }: LottieAnimationProps) => {
  return (
    <div className={`w-full max-w-[400px] mx-auto ${className}`}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="w-full h-auto"
        style={{
          maxWidth: width,
          maxHeight: height,
        }}
        {...props}
      />
    </div>
  )
}

export default LottieAnimation
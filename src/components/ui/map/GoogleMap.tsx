// Mapa de google maps

import { useCallback, useEffect, useRef, useState } from "react"
import { Wrapper } from '@googlemaps/react-wrapper'
import CubeGrid from "../spinner/CubeGrid"


interface GoogleMapProps {
  center: [number, number]
  markerPosition: [number, number]
  onMarkerDragEnd: (lat: number, lng: number) => void
  onMapClick: (lat: number, lng: number) => void
}

const MapComponent = ({
  center,
  markerPosition,
  onMarkerDragEnd,
  onMapClick
}: GoogleMapProps) => {

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  // Inicializamos el mapa
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const mapOptions: google.maps.MapOptions = {
      center: { lat: center[0], lng: center[1] },
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      gestureHandling: 'greedy',
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'on' }] }
      ]
    }

    mapInstanceRef.current = new google.maps.Map(mapRef.current, mapOptions)

    // Creamos el marcador
    markerRef.current = new google.maps.Marker({
      position:{  lat: markerPosition[0], lng: markerPosition[1] },
      map: mapInstanceRef.current,
      draggable: true,
      title: 'Ubicación del almacén',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#ef4444"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32)
      } 
    })

    // Evet listener para arrastrar marcador
    markerRef.current.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onMarkerDragEnd(lat, lng)
      }
    })

    // Event listener para click en el mapa
    mapInstanceRef.current.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        onMapClick(lat, lng)
      }
    })
  }, [])

  // Actualizamos el centro del mapa cuando cambie
  useEffect(() => {
    if (mapInstanceRef.current) {
      const newCenter = { lat: center[0], lng: center[1] }
      mapInstanceRef.current.setCenter(newCenter)
    }
  }, [center])

  // Actualizamos la posicion del marcador cuando cambie
  useEffect(() => {
    if (markerRef.current) {
      const newPosition = { lat: markerPosition[0], lng: markerPosition[1] }
      markerRef.current.setPosition(newPosition)
    }
  }, [markerPosition])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-80 rounded-lg border border-gray-200 shadow-sm"
      style={{ minHeight: '320px' }}
    />
  )
}


const GoogleMap = ({ ...props }: GoogleMapProps) => {

  const [isLoading, setIsLoading] = useState(true)
  console.log(isLoading)

  const renderMap = useCallback((status: string) => {
    if (status === 'LOADING') {
      return (
        <div className="w-full h-80 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <CubeGrid text="Cargando mapa..." />
          </div>
        </div>
      )
    }

    if (status === 'FAILURE') {
      return (
        <div className="w-full h-80 rounded-lg border border-red-200 shadow-sm flex items-center justify-center bg-red-50">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error al cargar el mapa</p>
            <p className="text-red-500 text-sm mt-1">
              Verifica tu conexión a internet y la API Key
            </p>
          </div>
        </div>
      )
    }

    setIsLoading(false)
    return <MapComponent {...props} />
  }, [props])

  return (
    <div className="relative">
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        render={renderMap}
        libraries={['places', 'geometry']}
        language="es"
        region="MX"
      />
    </div>
  )
}


export default GoogleMap

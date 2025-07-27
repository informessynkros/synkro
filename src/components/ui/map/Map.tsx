// Mapa

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import { useEffect } from 'react'

// Imagenes del icono
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png'

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapProps {
  center: [number, number]
  markerPosition: [number, number]
  onMarkerDragEnd: (lat: number, lng: number) => void
  onMapClick: (lat: number, lng: number) => void
}

function MapEvents({ onMapClick, onMarkerDragEnd, markerPosition }: {
  onMapClick: (lat: number, lng: number) => void
  onMarkerDragEnd: (lat: number, lng: number) => void
  markerPosition: [number, number]
}) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onMapClick(lat, lng)
    }
  })

  // Actualizar vista del mapa cuando cambien las coordenadas
  useEffect(() => {
    map.setView(markerPosition, map.getZoom())
  }, [map, markerPosition])

  return (
    <Marker
      position={markerPosition}
      icon={defaultIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target
          const position = marker.getLatLng()
          onMarkerDragEnd(position.lat, position.lng)
        }
      }}
    />
  )
}

const Map = ({
  center,
  markerPosition,
  onMarkerDragEnd,
  onMapClick
}: MapProps) => {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEvents
          onMapClick={onMapClick}
          onMarkerDragEnd={onMarkerDragEnd}
          markerPosition={markerPosition}
        />
      </MapContainer>
    </div>
  )
}

export default Map

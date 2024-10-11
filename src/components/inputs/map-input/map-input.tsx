import { LocateFixed } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useEffect, useRef, useState } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
// import styles from './MapInput.module.scss'

interface MapInputOnMove {
  latitude: number
  longitude: number
}

export interface MapInputProps {
  latitude?: number
  longitude?: number
  zoom?: number
  fixed?: boolean
  onMove?: ({ latitude, longitude }: MapInputOnMove) => void
}

export function MapInput({
  latitude = 38.7437396,
  longitude = -9.2302435,
  zoom = 10,
  fixed,
  onMove,
}: MapInputProps) {
  const mapRef: any = useRef()

  const [viewState, setViewState] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: zoom,
  })

  function move(e: any) {
    if (!fixed) {
      setViewState(e.viewState)
      onMove?.({
        latitude: e.target._markers[0]._lngLat.lat,
        longitude: e.target._markers[0]._lngLat.lng,
      })
    }
  }

  useEffect(() => {
    viewState.latitude = latitude
    viewState.longitude = longitude
    setViewState(viewState)
  }, [latitude, longitude])

  return (
    <div data-testid="map-input">
      <ReactMapGL
        ref={mapRef}
        style={{
          width: '100%',
          height: '384px',
        }}
        mapStyle="mapbox://styles/pedrolino25/cl16oh34m00d614pcx05li2mg"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_KEY}
        {...viewState}
        onMove={move}
        boxZoom={!fixed}
        scrollZoom={!fixed}
      >
        <Marker
          style={{ zIndex: '1 !important' }}
          longitude={viewState?.longitude}
          latitude={viewState?.latitude}
          anchor="center"
        >
          <LocateFixed size={28} strokeWidth={3} />
        </Marker>
      </ReactMapGL>
    </div>
  )
}

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Property } from '../types'

function makeIcon(price: number, active: boolean) {
  return new L.DivIcon({
    className: `map-price-marker${active ? ' is-active' : ''}`,
    html: `<div class="map-price-pill">$${price}</div>`,
    iconSize: [72, 32],
    iconAnchor: [36, 32],
    popupAnchor: [0, -28],
  })
}

function FitBounds({ properties, focusId }: { properties: Property[]; focusId?: string | null }) {
  const map = useMap()

  useEffect(() => {
    if (!properties.length) return
    if (focusId) {
      const p = properties.find((x) => x.id === focusId)
      if (p) {
        map.flyTo([p.lat, p.lng], 12, { duration: 0.85 })
        return
      }
    }
    const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 6 })
  }, [map, properties, focusId])

  return null
}

interface Props {
  properties: Property[]
  focusId?: string | null
  onSelect?: (id: string) => void
  className?: string
}

export function PropertyMap({ properties, focusId = null, onSelect, className = '' }: Props) {
  const center: [number, number] = properties.length
    ? [properties[0].lat, properties[0].lng]
    : [20, 0]

  return (
    <div className={`property-map ${className}`.trim()}>
      <MapContainer center={center} zoom={3} scrollWheelZoom className="leaflet-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FitBounds properties={properties} focusId={focusId} />
        {properties.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={makeIcon(p.price, focusId === p.id)}
            eventHandlers={{
              click: () => onSelect?.(p.id),
            }}
            zIndexOffset={focusId === p.id ? 1000 : 0}
          >
            <Popup>
              <div className="map-popup">
                <img src={p.images[0]} alt="" />
                <strong>{p.title}</strong>
                <span>
                  {p.city} · ${p.price}/night
                </span>
                <Link to={`/property/${p.id}`} className="map-popup-link">
                  View stay →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search, Star } from 'lucide-react'
import { PropertyMap } from '../components/PropertyMap'
import { properties } from '../data/mock'
import type { PropertyType } from '../types'

const types: Array<PropertyType | 'all'> = ['all', 'villa', 'house', 'apartment', 'cabin', 'loft']

export function MapPage() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<PropertyType | 'all'>('all')

  const active = useMemo(() => {
    const q = query.trim().toLowerCase()
    return properties.filter((p) => {
      if (p.status !== 'active') return false
      if (type !== 'all' && p.type !== type) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      )
    })
  }, [query, type])

  const [focusId, setFocusId] = useState<string | null>(null)
  const selectedId = focusId && active.some((p) => p.id === focusId) ? focusId : null

  return (
    <div className="map-page">
      <div className="map-stage">
        <PropertyMap
          properties={active}
          focusId={selectedId}
          onSelect={setFocusId}
          className="map-canvas"
        />
        <div className="map-float-meta">
          <MapPin size={14} strokeWidth={2.25} />
          <span>
            {active.length} stay{active.length === 1 ? '' : 's'} on the map
          </span>
        </div>
      </div>

      <aside className="map-sidebar">
        <div className="map-sidebar-head">
          <p className="eyebrow">Discover</p>
          <h2>Map search</h2>
          <p>Tap a stay to fly the map, or open a pin for details.</p>

          <label className="map-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search city or stay…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>

          <div className="map-type-row" role="group" aria-label="Property type">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                className={`map-type-chip${type === t ? ' active' : ''}`}
                onClick={() => setType(t)}
              >
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="map-list">
          {active.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`map-list-item${selectedId === p.id ? ' active' : ''}`}
              onClick={() => setFocusId(p.id)}
            >
              <div className="map-list-thumb">
                <img src={p.images[0]} alt="" />
                <span className="map-list-type">{p.type}</span>
              </div>
              <div className="map-list-body">
                <div className="map-list-top">
                  <h3>{p.title}</h3>
                  <span className="map-list-rating">
                    <Star size={12} fill="currentColor" />
                    {p.rating.toFixed(2)}
                  </span>
                </div>
                <p>
                  {p.city}, {p.country}
                </p>
                <div className="map-list-foot">
                  <strong>
                    ${p.price}
                    <span> / night</span>
                  </strong>
                  <Link
                    to={`/property/${p.id}`}
                    className="map-list-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </button>
          ))}

          {!active.length && (
            <p className="map-empty">No stays match that search. Try another city or type.</p>
          )}
        </div>
      </aside>
    </div>
  )
}

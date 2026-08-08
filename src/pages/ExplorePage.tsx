import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { PropertyCard } from '../components/PropertyCard'
import { PropertyMap } from '../components/PropertyMap'
import { properties } from '../data/mock'
import type { PropertyType } from '../types'

const types: Array<PropertyType | 'all'> = ['all', 'villa', 'house', 'apartment', 'cabin', 'loft']

function isValidType(value: string | null): value is PropertyType | 'all' {
  return value !== null && (types as string[]).includes(value)
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get('q') ?? ''
  const rawType = params.get('type')
  const type: PropertyType | 'all' = isValidType(rawType) ? rawType : 'all'

  // Keep typing local so URL updates (and scroll-to-top) only happen for type / link navigation.
  const [query, setQuery] = useState(urlQuery)

  useEffect(() => {
    setQuery(urlQuery)
  }, [urlQuery])

  const setType = (value: PropertyType | 'all') => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === 'all') next.delete('type')
      else next.set('type', value)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return properties.filter((p) => {
      if (p.status !== 'active' && p.status !== 'pending') return false
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

  return (
    <div className="container-wide" style={{ paddingTop: '1rem' }}>
      <header className="page-header">
        <p className="eyebrow">Explore</p>
        <h1>Find your next stay</h1>
        <p>Browse curated listings with live map pins. Filter by type or search a city.</p>
      </header>

      <div className="filters">
        <label className="search-field">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search city, country, or stay name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {types.map((t) => (
          <button
            key={t}
            type="button"
            className={`filter-chip${type === t ? ' active' : ''}`}
            onClick={() => setType(t)}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="explore-layout">
        <div>
          <p className="text-muted mb-2">
            {filtered.length} stay{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="property-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          {!filtered.length && (
            <p className="text-muted" style={{ padding: '3rem 0', textAlign: 'center' }}>
              No stays match that filter. Try another city or type.
            </p>
          )}
        </div>
        <aside className="explore-map">
          <PropertyMap properties={filtered.filter((p) => p.status === 'active')} />
        </aside>
      </div>
    </div>
  )
}

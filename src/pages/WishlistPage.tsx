import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import { PropertyCard } from '../components/PropertyCard'
import { useWishlist } from '../context/WishlistContext'
import { properties } from '../data/mock'

export function WishlistPage() {
  const { ids, clear } = useWishlist()
  const saved = properties.filter((p) => ids.includes(p.id) && p.status === 'active')

  return (
    <div className="wishlist-page">
      <div className="wishlist-hero">
        <div className="container">
          <p className="eyebrow">Saved stays</p>
          <h1>Wishlist</h1>
          <p>
            Keep the places that caught your eye — compare later, share with travel partners, or book
            when the dates line up.
          </p>
        </div>
      </div>

      <div className="container section" style={{ paddingTop: '2.5rem' }}>
        <div className="wishlist-toolbar">
          <p className="text-muted">
            {saved.length} stay{saved.length === 1 ? '' : 's'} saved
          </p>
          {saved.length > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={clear}>
              Clear wishlist
            </button>
          )}
        </div>

        {saved.length > 0 ? (
          <div className="property-grid">
            {saved.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <Heart size={28} strokeWidth={1.6} />
            <h2>Nothing saved yet</h2>
            <p>Browse listings and tap the heart to build your shortlist.</p>
            <div className="wishlist-empty-actions">
              <Link to="/explore" className="btn btn-sage">
                Explore stays
              </Link>
              <Link to="/map" className="btn btn-ghost">
                <MapPin size={16} />
                Open map
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

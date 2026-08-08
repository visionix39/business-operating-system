import type { CSSProperties, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import type { Property } from '../types'

interface Props {
  property: Property
  style?: CSSProperties
}

export function PropertyCard({ property, style }: Props) {
  const { isGuest, isHost, isAdmin } = useAuth()
  const { isSaved, toggle } = useWishlist()
  const navigate = useNavigate()
  const saved = isGuest && isSaved(property.id)
  const canWishlist = !isHost && !isAdmin

  const onToggle = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canWishlist) return
    if (!isGuest) {
      navigate('/guest/signin', { state: { from: '/wishlist' } })
      return
    }
    toggle(property.id)
  }

  return (
    <Link to={`/property/${property.id}`} className="property-card" style={style}>
      <div className="property-card-media">
        <img src={property.images[0]} alt={property.title} loading="lazy" />
        {property.featured && <span className="property-card-badge">Featured</span>}
        {canWishlist && (
          <button
            type="button"
            className={`wishlist-toggle${saved ? ' saved' : ''}`}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-pressed={saved}
            onClick={onToggle}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="property-card-body">
        <div className="property-card-top">
          <h3>{property.title}</h3>
          <span className="rating-pill">
            <Star size={14} fill="currentColor" />
            {property.rating.toFixed(2)}
          </span>
        </div>
        <p className="meta">
          {property.city}, {property.country} · {property.bedrooms} bed · {property.guests} guests
        </p>
        <p className="price">
          ${property.price} <span>/ night</span>
        </p>
      </div>
    </Link>
  )
}

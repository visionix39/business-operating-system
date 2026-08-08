import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { Bath, BedDouble, Heart, MessageCircle, Users, Wifi, X } from 'lucide-react'
import { BookingCalendar } from '../components/BookingCalendar'
import { ReviewsSection } from '../components/ReviewsSection'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { properties, reviews } from '../data/mock'

export function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const property = properties.find((p) => p.id === id)
  const { isGuest, isHost, isAdmin, user } = useAuth()
  const { isSaved, toggle } = useWishlist()
  const propertyReviews = useMemo(
    () => reviews.filter((r) => r.propertyId === id),
    [id],
  )

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [booked, setBooked] = useState(false)
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!property) {
    return (
      <div className="container section">
        <h1 className="display">Stay not found</h1>
        <p className="text-muted mt-1">That listing may have been removed.</p>
        <Link to="/explore" className="btn btn-primary mt-2">
          Back to explore
        </Link>
      </div>
    )
  }

  const nights =
    checkIn && checkOut ? Math.max(0, differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))) : 0
  const subtotal = nights * property.price
  const cleaning = nights ? 65 : 0
  const service = nights ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + cleaning + service
  const saved = isGuest && isSaved(property.id)
  const canMessage = isGuest || isHost
  const showWishlist = !isHost && !isAdmin

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nights) return
    if (!isGuest) {
      navigate('/guest/signin', { state: { from: `/property/${property.id}` } })
      return
    }
    setBooked(true)
  }

  const handleSave = () => {
    if (!showWishlist) return
    if (!isGuest) {
      navigate('/guest/signin', { state: { from: `/property/${property.id}` } })
      return
    }
    toggle(property.id)
  }

  const handleMessage = () => {
    if (!canMessage) {
      navigate('/guest/signin', { state: { from: '/chat' } })
      return
    }
    navigate('/chat')
  }

  const gallery = property.images.slice(0, 3)

  return (
    <>
      <div className="container" style={{ paddingTop: '1.25rem' }}>
        <div className="detail-gallery">
          {gallery.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${property.title} photo ${i + 1}`}
              onClick={() => setLightbox(src)}
            />
          ))}
        </div>

        <div className="detail-layout">
          <div>
            <div className="detail-title">
              <div className="detail-title-row">
                <div>
                  <p className="eyebrow">
                    {property.type} · {property.location}
                  </p>
                  <h1>{property.title}</h1>
                </div>
                {showWishlist && (
                  <button
                    type="button"
                    className={`btn btn-ghost btn-sm detail-save${saved ? ' saved' : ''}`}
                    onClick={handleSave}
                    aria-pressed={saved}
                  >
                    <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>
              <div className="detail-meta">
                <span>
                  <strong>{property.rating.toFixed(2)}</strong> · {property.reviewCount} reviews
                </span>
                <span>
                  {property.city}, {property.country}
                </span>
                <span className="rating-pill">
                  <BedDouble size={14} /> {property.bedrooms} beds
                </span>
                <span className="rating-pill">
                  <Bath size={14} /> {property.bathrooms} baths
                </span>
                <span className="rating-pill">
                  <Users size={14} /> {property.guests} guests
                </span>
              </div>
            </div>

            <div className="detail-section" style={{ borderTop: 'none', paddingTop: 0 }}>
              <p style={{ fontSize: '1.05rem', maxWidth: '58ch' }}>{property.description}</p>
            </div>

            <div className="detail-section">
              <h2>Amenities</h2>
              <ul className="amenities">
                {property.amenities.map((a) => (
                  <li key={a}>
                    <Wifi size={16} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h2>Availability</h2>
              <BookingCalendar
                propertyId={property.id}
                checkIn={checkIn}
                checkOut={checkOut}
                onSelectRange={(cin, cout) => {
                  setCheckIn(cin)
                  setCheckOut(cout)
                  setBooked(false)
                }}
              />
            </div>

            <div className="detail-section">
              <h2>Host</h2>
              <div className="host-row">
                <img src={property.host.avatar} alt="" />
                <div>
                  <h3>{property.host.name}</h3>
                  <p>
                    Joined {property.host.joinedYear} · {property.host.responseRate}% response rate
                  </p>
                  {property.host.isSuperhost && <span className="superhost">Superhost</span>}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ marginLeft: 'auto' }}
                  onClick={handleMessage}
                >
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>

            <div className="detail-section">
              <h2>Reviews</h2>
              <ReviewsSection
                reviews={propertyReviews}
                average={property.rating}
                count={property.reviewCount}
              />
            </div>
          </div>

          <aside>
            <form className="booking-panel" onSubmit={handleBook}>
              <div className="price-line">
                ${property.price} <span>/ night</span>
              </div>
              <div className="date-row">
                <div className="field">
                  <label htmlFor="checkin">Check-in</label>
                  <input
                    id="checkin"
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value)
                      setBooked(false)
                    }}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="checkout">Check-out</label>
                  <input
                    id="checkout"
                    type="date"
                    value={checkOut}
                    min={checkIn || undefined}
                    onChange={(e) => {
                      setCheckOut(e.target.value)
                      setBooked(false)
                    }}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="guests">Guests</label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {Array.from({ length: property.guests }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              {nights > 0 && (
                <div className="booking-summary">
                  <div>
                    <span>
                      ${property.price} × {nights} nights
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div>
                    <span>Cleaning fee</span>
                    <span>${cleaning}</span>
                  </div>
                  <div>
                    <span>Service fee</span>
                    <span>${service}</span>
                  </div>
                  <div className="total">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-block" disabled={!nights}>
                {nights ? (isGuest ? 'Request to book' : user ? 'Guests only' : 'Sign in to book') : 'Select dates'}
              </button>
              {booked && (
                <p className="booking-success">
                  Booking requested for {nights} night{nights > 1 ? 's' : ''} — host will confirm in
                  Messages.
                </p>
              )}
              <p className="text-muted mt-1" style={{ fontSize: '0.8rem', textAlign: 'center' }}>
                Demo only — no payment processed.
              </p>
            </form>
          </aside>
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal onClick={() => setLightbox(null)}>
          <button type="button" className="lightbox-close" aria-label="Close" onClick={() => setLightbox(null)}>
            <X size={20} />
          </button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}

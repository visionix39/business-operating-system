import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  CalendarDays,
  Check,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { bookings, conversations, properties, reviews } from '../data/mock'
import { useAuth } from '../context/AuthContext'

type Tab = 'overview' | 'listings' | 'bookings' | 'reviews' | 'messages'

export function AdminPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [listingStatus, setListingStatus] = useState(
    Object.fromEntries(properties.map((p) => [p.id, p.status])),
  )
  const [bookingStatus, setBookingStatus] = useState(
    Object.fromEntries(bookings.map((b) => [b.id, b.status])),
  )

  const handleSignOut = () => {
    signOut()
    navigate('/admin/signin')
  }

  const stats = useMemo(() => {
    const active = Object.values(listingStatus).filter((s) => s === 'active').length
    const confirmed = Object.values(bookingStatus).filter((s) => s === 'confirmed').length
    const revenue = bookings
      .filter((b) => bookingStatus[b.id] === 'confirmed' || bookingStatus[b.id] === 'completed')
      .reduce((sum, b) => sum + b.total, 0)
    return { active, confirmed, revenue, guests: 1284 }
  }, [listingStatus, bookingStatus])

  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <h2>Platform Admin</h2>
        <p className="admin-side-user">{user?.name}</p>
        <nav className="admin-nav" aria-label="Admin">
          <button type="button" className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
            <LayoutDashboard size={16} /> Overview
          </button>
          <button type="button" className={tab === 'listings' ? 'active' : ''} onClick={() => setTab('listings')}>
            <Building2 size={16} /> Listings
          </button>
          <button type="button" className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
            <CalendarDays size={16} /> Bookings
          </button>
          <button type="button" className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>
            <Star size={16} /> Reviews
          </button>
          <button type="button" className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>
            <MessageSquare size={16} /> Messages
          </button>
        </nav>
        <button type="button" className="admin-signout" onClick={handleSignOut}>
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <div className="admin-main">
        {tab === 'overview' && (
          <>
            <h1>Platform dashboard</h1>
            <p className="sub">
              Admin-only console for Portico operators — not the host listing workspace. Mock metrics
              for this portfolio demo.
            </p>
            <div className="stat-grid">
              <div className="stat">
                <div className="label">Active listings</div>
                <div className="value">{stats.active}</div>
                <div className="delta">+2 this week</div>
              </div>
              <div className="stat">
                <div className="label">Confirmed bookings</div>
                <div className="value">{stats.confirmed}</div>
                <div className="delta">Pipeline healthy</div>
              </div>
              <div className="stat">
                <div className="label">Revenue (demo)</div>
                <div className="value">${stats.revenue.toLocaleString()}</div>
                <div className="delta">Confirmed + completed</div>
              </div>
              <div className="stat">
                <div className="label">Platform guests</div>
                <div className="value">{stats.guests}</div>
                <div className="delta">
                  <Users size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Growing
                </div>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Recent booking</th>
                    <th>Property</th>
                    <th>Dates</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 4).map((b) => {
                    const prop = properties.find((p) => p.id === b.propertyId)
                    return (
                      <tr key={b.id}>
                        <td>{b.guestName}</td>
                        <td>{prop?.title ?? '—'}</td>
                        <td>
                          {b.checkIn} → {b.checkOut}
                        </td>
                        <td>${b.total}</td>
                        <td>
                          <span className={`status ${bookingStatus[b.id]}`}>{bookingStatus[b.id]}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'listings' && (
          <>
            <h1>Listings</h1>
            <p className="sub">Approve, pause, or remove property listings.</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Host</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.title}</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                          {p.city}, {p.country}
                        </div>
                      </td>
                      <td>{p.host.name}</td>
                      <td>${p.price}</td>
                      <td>
                        <span className={`status ${listingStatus[p.id]}`}>{listingStatus[p.id]}</span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            title="Activate"
                            onClick={() =>
                              setListingStatus((s) => ({ ...s, [p.id]: 'active' }))
                            }
                          >
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title="Set pending"
                            onClick={() =>
                              setListingStatus((s) => ({ ...s, [p.id]: 'pending' }))
                            }
                          >
                            <X size={14} />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title="Deactivate"
                            onClick={() =>
                              setListingStatus((s) => ({ ...s, [p.id]: 'inactive' }))
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'bookings' && (
          <>
            <h1>Bookings</h1>
            <p className="sub">Confirm or cancel guest reservations.</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Guests</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const prop = properties.find((p) => p.id === b.propertyId)
                    return (
                      <tr key={b.id}>
                        <td>{b.guestName}</td>
                        <td>{prop?.title}</td>
                        <td>{b.guests}</td>
                        <td>${b.total}</td>
                        <td>
                          <span className={`status ${bookingStatus[b.id]}`}>{bookingStatus[b.id]}</span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <button
                              type="button"
                              className="icon-btn"
                              title="Confirm"
                              onClick={() =>
                                setBookingStatus((s) => ({ ...s, [b.id]: 'confirmed' }))
                              }
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn"
                              title="Cancel"
                              onClick={() =>
                                setBookingStatus((s) => ({ ...s, [b.id]: 'cancelled' }))
                              }
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'reviews' && (
          <>
            <h1>Reviews</h1>
            <p className="sub">Moderate guest feedback across listings.</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Author</th>
                    <th>Property</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r) => {
                    const prop = properties.find((p) => p.id === r.propertyId)
                    return (
                      <tr key={r.id}>
                        <td>{r.author}</td>
                        <td>{prop?.title}</td>
                        <td>{r.rating}.0</td>
                        <td style={{ maxWidth: 320 }}>{r.comment}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'messages' && (
          <>
            <h1>Messages</h1>
            <p className="sub">Open threads between guests and hosts.</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Property</th>
                    <th>Last message</th>
                    <th>Unread</th>
                  </tr>
                </thead>
                <tbody>
                  {conversations.map((c) => (
                    <tr key={c.id}>
                      <td>{c.participantName}</td>
                      <td>{c.propertyTitle}</td>
                      <td>{c.lastMessage}</td>
                      <td>{c.unread}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

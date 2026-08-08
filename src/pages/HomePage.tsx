import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from '../components/PropertyCard'
import { properties } from '../data/mock'

const destinations = [
  {
    name: 'Positano',
    img: 'https://images.unsplash.com/photo-1534113414509-0eec2cb641d0?w=800&q=80',
  },
  {
    name: 'Whistler',
    img: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&q=80',
  },
  {
    name: 'Barcelona',
    img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
  },
  {
    name: 'Zurich',
    img: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800&q=80',
  },
]

export function HomePage() {
  const featured = properties.filter((p) => p.featured)

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80"
            alt=""
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <p className="hero-brand">
            Portico<span>.</span>
          </p>
          <h1>Stays composed for people who notice the details.</h1>
          <p className="lead">
            A curated rental platform for villas, lofts, and cabins — map-first discovery, effortless
            booking, and hosts who answer.
          </p>
          <div className="hero-ctas">
            <Link to="/explore" className="btn btn-light">
              Browse listings
              <ArrowRight size={16} />
            </Link>
            <Link to="/map" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
              Open map
            </Link>
          </div>
        </div>
        <span className="hero-scroll">Scroll</span>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Featured stays</p>
              <h2>Places that photograph themselves</h2>
            </div>
            <p>Handpicked homes with strong light, considered interiors, and hosts rated above 4.8.</p>
          </div>
          <div className="property-grid">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/explore" className="btn btn-ghost">
              View all properties
            </Link>
          </div>
        </div>
      </section>

      <section className="destinations">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow" style={{ color: 'var(--sage-light)' }}>
                Destinations
              </p>
              <h2>Where Portico guests land next</h2>
            </div>
            <p>From cliffside coasts to alpine quiet — search by place, then pin it on the map.</p>
          </div>
          <div className="dest-row">
            {destinations.map((d) => (
              <Link key={d.name} to={`/explore?q=${encodeURIComponent(d.name)}`} className="dest-item">
                <img src={d.img} alt="" loading="lazy" />
                <span>{d.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>From pin to keys in three steps</h2>
            </div>
          </div>
          <div className="steps">
            <article className="step">
              <div className="step-num">01</div>
              <h3>Explore on the map</h3>
              <p>Filter by type, price, and destination. Hover pins to preview each stay before you open it.</p>
            </article>
            <article className="step">
              <div className="step-num">02</div>
              <h3>Book with the calendar</h3>
              <p>See real availability, choose dates, and confirm — guests and hosts stay aligned in chat.</p>
            </article>
            <article className="step">
              <div className="step-num">03</div>
              <h3>Arrive & review</h3>
              <p>Message your host, settle in, and leave a review that helps the next traveler choose well.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <p className="eyebrow" style={{ color: 'var(--brass-soft)' }}>
              For travelers
            </p>
            <h2>Save stays and message hosts with a guest account.</h2>
            <p>
              Browse curated properties, build a wishlist, and chat with hosts — separate from hosting
              and the platform admin console.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/guest/signup" className="btn btn-sage">
                Join as guest
              </Link>
              <Link to="/guest/signin" className="btn btn-ghost">
                Guest sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <p className="eyebrow" style={{ color: 'var(--brass-soft)' }}>
              For hosts
            </p>
            <h2>List a property that deserves better than a scroll past.</h2>
            <p>
              Create a host account, upload photos, and publish a listing — separate from the platform
              admin console used by Portico operators.
            </p>
            <div>
              <Link to="/host/signup" className="btn btn-sage">
                Start hosting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

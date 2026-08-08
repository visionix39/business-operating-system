import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const gallery = [
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    alt: 'Sunlit living room with floor-to-ceiling windows',
  },
  {
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80',
    alt: 'Minimal kitchen with warm wood and stone',
  },
  {
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80',
    alt: 'Quiet bedroom overlooking trees',
  },
]

export function AboutPage() {
  return (
    <>
      <section className="company-hero about-hero">
        <div className="company-hero-media" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=2000&q=80"
            alt=""
          />
          <div className="company-hero-overlay" />
        </div>
        <div className="container company-hero-content">
          <p className="eyebrow" style={{ color: 'var(--sage-light)' }}>
            Company
          </p>
          <h1>About Portico</h1>
          <p className="lead">
            Portico is a curated property rental platform for travelers who notice light, material,
            and quiet — and for hosts who want their homes presented with care.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-story">
          <div className="about-copy">
            <p className="eyebrow">Our story</p>
            <h2>Built for stays that feel considered</h2>
            <p>
              We started Portico because most rental listings bury the feeling of a place under noise
              — endless filters, generic photos, and hosts who vanish after booking. We designed a
              quieter path: map-first discovery, honest photography, and tools that keep guests and
              hosts aligned from inquiry to checkout.
            </p>
            <p>
              Every featured stay is chosen for atmosphere as much as amenities. Cliffside villas,
              alpine cabins, and city lofts share one bar — they should feel like somewhere you would
              actually want to linger.
            </p>
            <Link to="/explore" className="btn btn-sage">
              Browse listings
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="about-gallery">
            {gallery.map((img) => (
              <figure key={img.src} className="about-gallery-item">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-values-band">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">What we stand for</p>
              <h2>Place first. Clarity always.</h2>
            </div>
          </div>
          <div className="about-values">
            <article>
              <h3>Curated, not crowded</h3>
              <p>
                We favor fewer, stronger homes over endless inventory. If a stay does not photograph
                itself and host well, it does not belong on Portico.
              </p>
            </article>
            <article>
              <h3>Map before scroll</h3>
              <p>
                Location is part of the experience. Guests explore pins, light, and neighborhood
                context before they commit to dates.
              </p>
            </article>
            <article>
              <h3>Hosts who answer</h3>
              <p>
                Messaging, calendars, and reviews stay in one clear flow so arrivals feel planned —
                not improvised at the door.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}

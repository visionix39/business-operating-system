import { Link } from 'react-router-dom'
import { Check, Shield, Sparkles, HeartHandshake, Leaf } from 'lucide-react'

const standards = [
  {
    icon: Sparkles,
    title: 'Cleanliness you can trust',
    body: 'Homes are prepared with a documented turnover checklist — linens, kitchens, baths, and high-touch surfaces — before every arrival.',
  },
  {
    icon: Shield,
    title: 'Honest listing details',
    body: 'Photos, amenities, and house rules must match the space. Misleading descriptions are removed; verified hosts stay visible.',
  },
  {
    icon: HeartHandshake,
    title: 'Responsive hosting',
    body: 'Hosts commit to reply within a clear window for pre-arrival questions, lockbox issues, and mid-stay support.',
  },
  {
    icon: Leaf,
    title: 'Respect for place',
    body: 'Quiet hours, occupancy limits, and neighborhood norms are spelled out up front so guests leave homes — and streets — as they found them.',
  },
]

const checklist = [
  'Fresh linens and towels for every guest',
  'Working smoke & carbon monoxide detectors',
  'Clear check-in instructions before arrival day',
  'Accurate Wi-Fi, parking, and access details',
  'Emergency contact shared in the booking thread',
  'Post-stay review invitation for both sides',
]

export function CareStandardsPage() {
  return (
    <>
      <section className="company-hero care-hero">
        <div className="company-hero-media" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=2000&q=80"
            alt=""
          />
          <div className="company-hero-overlay" />
        </div>
        <div className="container company-hero-content">
          <p className="eyebrow" style={{ color: 'var(--sage-light)' }}>
            Company
          </p>
          <h1>Care standards</h1>
          <p className="lead">
            The bar every Portico stay is measured against — so guests arrive calm, and hosts know
            exactly what “ready” means.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our promise</p>
              <h2>Four pillars of a Portico stay</h2>
            </div>
            <p>
              These standards apply to featured homes and are reviewed when hosts publish or update a
              listing.
            </p>
          </div>
          <div className="care-grid">
            {standards.map((item) => (
              <article key={item.title} className="care-card">
                <div className="care-icon">
                  <item.icon size={22} strokeWidth={1.75} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container care-checklist-layout">
          <div>
            <p className="eyebrow">Before every check-in</p>
            <h2>Host readiness checklist</h2>
            <p className="text-muted" style={{ maxWidth: '42ch', marginTop: '0.75rem' }}>
              A short list we expect hosts to complete so the first hour in a Portico home feels
              intentional — not improvised.
            </p>
            <Link to="/host/signup" className="btn btn-sage" style={{ marginTop: '1.5rem' }}>
              List a property
            </Link>
          </div>
          <ul className="care-checklist">
            {checklist.map((item) => (
              <li key={item}>
                <Check size={18} strokeWidth={2.25} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

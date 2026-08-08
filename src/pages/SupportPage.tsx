import { useState, type FormEvent } from 'react'
import { Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'

/** Sample support inbox for this portfolio demo */
export const SUPPORT_EMAIL = 'support@portico.demo'

export function SupportPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('booking')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`[Portico Support] ${topic} — ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nReply-to: ${email}\nTopic: ${topic}\n\n${message}`,
    )

    // Opens the user's mail client addressed to the sample support inbox
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <section className="company-hero support-hero">
        <div className="company-hero-media" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=80"
            alt=""
          />
          <div className="company-hero-overlay" />
        </div>
        <div className="container company-hero-content">
          <p className="eyebrow" style={{ color: 'var(--sage-light)' }}>
            Company
          </p>
          <h1>Support</h1>
          <p className="lead">
            Questions about a booking, a listing, or how Portico works? Send a note — we read every
            message.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container support-layout">
          <aside className="support-aside">
            <h2>Contact</h2>
            <p className="text-muted">
              This is a portfolio demo. Submitting the form opens your email app with a draft to our
              sample inbox.
            </p>
            <ul className="support-meta">
              <li>
                <Mail size={18} strokeWidth={1.75} />
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                </div>
              </li>
              <li>
                <Clock size={18} strokeWidth={1.75} />
                <div>
                  <strong>Hours</strong>
                  <span>Mon–Fri, 9:00–18:00 (CET)</span>
                </div>
              </li>
              <li>
                <MapPin size={18} strokeWidth={1.75} />
                <div>
                  <strong>Office</strong>
                  <span>Portico Studio · Via della Luce 12, Milan</span>
                </div>
              </li>
            </ul>
          </aside>

          <form className="support-form" onSubmit={submit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="support-name">Name</label>
                <input
                  id="support-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="support-email">Your email</label>
                <input
                  id="support-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="field full">
                <label htmlFor="support-topic">Topic</label>
                <select
                  id="support-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  <option value="booking">Booking help</option>
                  <option value="listing">Listing / host question</option>
                  <option value="payment">Payments & refunds</option>
                  <option value="other">Something else</option>
                </select>
              </div>
              <div className="field full">
                <label htmlFor="support-message">Message</label>
                <textarea
                  id="support-message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need help with…"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-sage">
              Send message
              <Send size={16} />
            </button>

            {sent && (
              <p className="support-sent" role="status">
                <CheckCircle2 size={18} />
                Draft opened for {SUPPORT_EMAIL}. Send it from your mail app to complete.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

import { Star } from 'lucide-react'
import { useState } from 'react'
import type { Review } from '../types'
import { format, parseISO } from 'date-fns'

interface Props {
  reviews: Review[]
  average: number
  count: number
}

export function ReviewsSection({ reviews, average, count }: Props) {
  const [list, setList] = useState(reviews)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !name.trim()) return
    const next: Review = {
      id: `local-${Date.now()}`,
      propertyId: reviews[0]?.propertyId ?? '',
      author: name.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      rating,
      date: new Date().toISOString().slice(0, 10),
      comment: comment.trim(),
    }
    setList((prev) => [next, ...prev])
    setComment('')
    setName('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2500)
  }

  return (
    <div>
      <div className="reviews-summary">
        <span className="big">{average.toFixed(2)}</span>
        <span className="stars" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(average) ? 'currentColor' : 'none'} />
          ))}
        </span>
        <span className="text-muted">· {count + (list.length - reviews.length)} reviews</span>
      </div>

      <div className="review-list">
        {list.map((r) => (
          <article key={r.id} className="review-item">
            <img src={r.avatar} alt="" />
            <div>
              <header>
                <div>
                  <strong>{r.author}</strong>
                  <span className="when">{format(parseISO(r.date), 'MMM d, yyyy')}</span>
                </div>
                <span className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />
                  ))}
                </span>
              </header>
              <p>{r.comment}</p>
            </div>
          </article>
        ))}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Leave a review</h3>
        <div className="star-picker" role="group" aria-label="Rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={i < rating ? 'on' : ''}
              aria-label={`${i + 1} stars`}
              onClick={() => setRating(i + 1)}
            >
              <Star size={22} fill={i < rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="review-name">Your name</label>
          <input id="review-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="review-comment">Your experience</label>
          <textarea
            id="review-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-sage">
          Submit review
        </button>
        {submitted && <p className="booking-success">Thanks — your review was added.</p>}
      </form>
    </div>
  )
}

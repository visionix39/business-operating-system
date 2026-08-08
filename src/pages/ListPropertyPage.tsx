import { useRef, useState, type FormEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface Preview {
  id: string
  url: string
  name: string
}

export function ListPropertyPage() {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [price, setPrice] = useState('220')
  const [type, setType] = useState('house')
  const [bedrooms, setBedrooms] = useState('2')
  const [description, setDescription] = useState('')
  const [previews, setPreviews] = useState<Preview[]>([])
  const [dragging, setDragging] = useState(false)
  const [published, setPublished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: FileList | null) => {
    if (!files) return
    const next: Preview[] = []
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 6 - previews.length)
      .forEach((file) => {
        next.push({
          id: `${file.name}-${file.lastModified}`,
          url: URL.createObjectURL(file),
          name: file.name,
        })
      })
    setPreviews((p) => [...p, ...next].slice(0, 6))
  }

  const removePreview = (id: string) => {
    setPreviews((p) => {
      const item = p.find((x) => x.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return p.filter((x) => x.id !== id)
    })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setPublished(true)
  }

  return (
    <div className="container">
      <header className="page-header">
        <p className="eyebrow">Host workspace</p>
        <h1>List your property</h1>
        <p>
          Signed in as {user?.name}. Upload photos, set pricing, and publish a listing — demo stores
          everything in this session only. This is separate from the platform Admin console.
        </p>
      </header>

      <div className="upload-layout">
        <form className="upload-form" onSubmit={submit}>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunlit loft with garden terrace"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="country">Country</label>
              <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="type">Type</label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabin</option>
                <option value="loft">Loft</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="price">Price / night (USD)</label>
              <input
                id="price"
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="beds">Bedrooms</label>
              <input
                id="beds"
                type="number"
                min={0}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
            <div className="field full">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Light, layout, neighborhood, and what makes this stay special…"
                required
              />
            </div>
            <div className="field full">
              <label>Photos</label>
              <div
                className={`dropzone${dragging ? ' dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragging(false)
                  addFiles(e.dataTransfer.files)
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
                }}
              >
                <ImagePlus size={28} />
                <strong>Drop images here or click to upload</strong>
                <p>Up to 6 photos · JPG or PNG</p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>
              {previews.length > 0 && (
                <div className="preview-grid">
                  {previews.map((p) => (
                    <div key={p.id} className="preview">
                      <img src={p.url} alt={p.name} />
                      <button type="button" aria-label="Remove" onClick={() => removePreview(p.id)}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-2">
            Publish listing
          </button>
          {published && (
            <p className="booking-success">
              Listing published (demo). Preview updates on the right — wire this to your API next.
            </p>
          )}
        </form>

        <aside className="upload-preview-card">
          <div className="media">
            {previews[0] ? (
              <img src={previews[0].url} alt="" />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--ink-muted)',
                  minHeight: 200,
                }}
              >
                Photo preview
              </div>
            )}
          </div>
          <div className="body">
            <p className="eyebrow">{type}</p>
            <h3>{title || 'Your stay title'}</h3>
            <p className="text-muted">
              {city || 'City'}
              {country ? `, ${country}` : ''} · {bedrooms} bed
            </p>
            <p className="price" style={{ marginTop: '0.75rem', fontWeight: 700 }}>
              ${price || '—'} <span style={{ fontWeight: 500, color: 'var(--ink-muted)' }}>/ night</span>
            </p>
            <p className="mt-1" style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
              {description || 'Your description will appear here as guests see it.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

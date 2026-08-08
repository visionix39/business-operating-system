import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'portico-wishlist'

interface WishlistContextValue {
  ids: string[]
  isSaved: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readIds())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [ids])

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      isSaved: (id) => ids.includes(id),
      toggle: (id) => {
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      },
      clear: () => setIds([]),
    }),
    [ids],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

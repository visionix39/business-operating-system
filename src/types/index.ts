export type PropertyType = 'apartment' | 'house' | 'villa' | 'cabin' | 'loft'

export interface Host {
  id: string
  name: string
  avatar: string
  joinedYear: number
  responseRate: number
  isSuperhost: boolean
}

export interface Property {
  id: string
  title: string
  location: string
  city: string
  country: string
  price: number
  rating: number
  reviewCount: number
  type: PropertyType
  bedrooms: number
  bathrooms: number
  guests: number
  description: string
  amenities: string[]
  images: string[]
  lat: number
  lng: number
  host: Host
  featured?: boolean
  status: 'active' | 'pending' | 'inactive'
}

export interface Review {
  id: string
  propertyId: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
}

export interface Booking {
  id: string
  propertyId: string
  guestName: string
  checkIn: string
  checkOut: string
  guests: number
  total: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  text: string
  timestamp: string
  isMine: boolean
}

export interface Conversation {
  id: string
  participantName: string
  participantAvatar: string
  propertyTitle: string
  lastMessage: string
  lastTime: string
  unread: number
}

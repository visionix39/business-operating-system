import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { MapPage } from './pages/MapPage'
import { PropertyDetailPage } from './pages/PropertyDetailPage'
import { ChatPage } from './pages/ChatPage'
import { WishlistPage } from './pages/WishlistPage'
import { ListPropertyPage } from './pages/ListPropertyPage'
import { AdminPage } from './pages/AdminPage'
import { AboutPage } from './pages/AboutPage'
import { CareStandardsPage } from './pages/CareStandardsPage'
import { SupportPage } from './pages/SupportPage'
import { HostSignInPage } from './pages/HostSignInPage'
import { HostSignUpPage } from './pages/HostSignUpPage'
import { GuestSignInPage } from './pages/GuestSignInPage'
import { GuestSignUpPage } from './pages/GuestSignUpPage'
import { AdminSignInPage } from './pages/AdminSignInPage'

function Shell() {
  const { pathname, search } = useLocation()
  const hideFooter =
    pathname === '/chat' || pathname === '/map' || pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute role={['guest', 'host']}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute role="guest">
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="/guest/signin" element={<GuestSignInPage />} />
          <Route path="/guest/signup" element={<GuestSignUpPage />} />
          <Route path="/host/signin" element={<HostSignInPage />} />
          <Route path="/host/signup" element={<HostSignUpPage />} />
          <Route path="/admin/signin" element={<AdminSignInPage />} />
          <Route
            path="/list-property"
            element={
              <ProtectedRoute role="host">
                <ListPropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/care" element={<CareStandardsPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <Shell />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

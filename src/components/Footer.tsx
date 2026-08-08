import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">Portico</div>
          <p>Curated property rentals for travelers who care about place, light, and quiet luxury.</p>
        </div>
        <div>
          <h4>Discover</h4>
          <ul>
            <li>
              <Link to="/map">Map search</Link>
            </li>
            <li>
              <Link to="/about">About Portico</Link>
            </li>
            <li>
              <Link to="/care">Care standards</Link>
            </li>
            <li>
              <Link to="/support">Support</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Guest</h4>
          <ul>
            <li>
              <Link to="/guest/signup">Create guest account</Link>
            </li>
            <li>
              <Link to="/guest/signin">Guest sign in</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/chat">Messages</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Host</h4>
          <ul>
            <li>
              <Link to="/host/signup">Become a host</Link>
            </li>
            <li>
              <Link to="/host/signin">Host sign in</Link>
            </li>
            <li>
              <Link to="/list-property">List your property</Link>
            </li>
            <li>
              <Link to="/admin/signin">Admin sign in</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} </span>
        <span>Built for real estate clients</span>
      </div>
    </footer>
  )
}

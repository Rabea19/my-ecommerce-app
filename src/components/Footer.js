import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';
import './Footer.css';
export default function Footer() {
 return <footer className="market-footer">
  <div className="wrap">
   <div className="market-footer-grid">
    <section className="market-footer-brand" aria-label="About Simple Market">
     <Link to="/" className="market-footer-logo" aria-label="Simple Market home"><span className="market-footer-monogram" aria-hidden="true">m.</span><span>simple market<span className="market-footer-tagline">THE EVERYDAY COLLECTION</span></span></Link>
     <p>Discover the pieces that fit your life. From technology and home favourites to personal style and handmade finds, explore the everyday collection at Simple Market.</p>
     <div className="market-footer-follow"><h2>Follow us</h2><SocialLinks /></div>
    </section>
    <nav aria-label="Footer collections"><h2>Explore<br/>the collection</h2><Link to="/collection">All collections</Link><Link to="/collection?category=mobiles">Mobiles</Link><Link to="/collection?category=computers">Computers</Link><Link to="/collection?category=home">For your home</Link><Link to="/collection?category=clothes">Clothing</Link><Link to="/collection?category=furniture">Furniture</Link><Link to="/collection?category=crochet">Crochet by Hager</Link></nav>
    <nav aria-label="Customer services"><h2>Customer<br/>services</h2><Link to="/profile">My account</Link><Link to="/orders">My orders</Link><Link to="/cart">Shopping bag</Link><Link to="/contact">Contact us</Link></nav>
   </div>
   <div className="market-footer-bottom"><p>© {new Date().getFullYear()} Simple Market. All rights reserved.</p><p>All prices in EGP</p></div>
  </div>
 </footer>;
}

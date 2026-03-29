import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import "../pages/Navbar.css";

export default function Navbar({ searchTerm, setSearchTerm, onMenuClick }) {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* زرار المنيو */}
      <IconButton onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>

      <h2 className="navbar-logo">ShopZone</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="navbar-search"
      />

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          Home
        </Link>

        <Link to="/cart" className="navbar-link">
          Cart ({cartItems.length})
        </Link>
        <Link to="/signin">Sign In</Link>
        <button className="navbar-link" onClick={() => navigate("/collection")}>
          Collection
        </button>
      </div>
    </nav>
  );
}

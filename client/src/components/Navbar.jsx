import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
          Shop<span className="text-gray-800">Ease</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <Link to="/products" className="hover:text-indigo-600 transition-colors">
            Products
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-indigo-600 transition-colors">
              Admin
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-indigo-600 transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Hi, {user.name?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full text-sm transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-6 pb-4 text-gray-600 font-medium">
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left">
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
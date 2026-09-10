import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };

  const categories = [
    { label: "Beauty", value: "beauty" },
    { label: "Kitchen", value: "kitchen" },
    { label: "School", value: "school" },
    { label: "Laptop Accessories", value: "laptop-accessories" },
  ];

  return (
    <div className="sticky top-0 z-30">
      {/* Top bar */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            ShopEase
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white text-black text-sm px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-amber-400 px-4 rounded-r-md">
              <svg width="18" height="18" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
              </svg>
            </button>
          </form>

          <div className="hidden md:flex items-center gap-5 text-sm font-medium">
            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-amber-400 transition-colors">
                Admin
              </Link>
            )}

            {user && (
              <Link to="/my-orders" className="hover:text-amber-400 transition-colors">
                My Orders
              </Link>
            )}

            <Link to="/cart" className="relative hover:text-amber-400 transition-colors flex items-center gap-1">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-9 5a1 1 0 102 0 1 1 0 00-2 0zm9 0a1 1 0 102 0 1 1 0 00-2 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-amber-400 text-black text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <button onClick={handleLogout} className="hover:text-amber-400 transition-colors">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-amber-400 transition-colors">
                Login
              </Link>
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category bar */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-11 text-sm font-medium text-gray-700">
          <Link to="/products" className="hover:text-amber-500 transition-colors">
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              className="hover:text-amber-500 transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white flex flex-col gap-1 px-6 pb-4">
          <form onSubmit={handleSearch} className="flex py-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white text-black text-sm px-4 py-2 rounded-l-md focus:outline-none"
            />
            <button type="submit" className="bg-amber-400 px-4 rounded-r-md text-black">
              Go
            </button>
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="py-2.5">
            All Products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.value}
              to={`/products?category=${c.value}`}
              onClick={() => setMenuOpen(false)}
              className="py-2.5"
            >
              {c.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-2.5">
              Admin
            </Link>
          )}
          {user && (
            <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="py-2.5">
              My Orders
            </Link>
          )}
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="py-2.5">
            Cart {itemCount > 0 && `(${itemCount})`}
          </Link>
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="py-2.5 text-left text-red-400"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="py-2.5 text-amber-400">
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const categoryBanners = [
  {
    key: "beauty",
    label: "Beauty",
    tagline: "Glow up your routine",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    color: "from-pink-500 to-rose-400",
  },
  {
    key: "kitchen",
    label: "Kitchen",
    tagline: "Cook like a pro",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600",
    color: "from-orange-500 to-amber-400",
  },
  {
    key: "school",
    label: "School",
    tagline: "Back to school essentials",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
    color: "from-blue-500 to-indigo-400",
  },
  {
    key: "laptop-accessories",
    label: "Laptop Accessories",
    tagline: "Upgrade your setup",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    color: "from-slate-700 to-slate-500",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", { params: { limit: 12 } });
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <p className="text-amber-400 font-semibold text-sm tracking-wide uppercase mb-3">
            New arrivals every week
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 max-w-xl leading-tight">
            Everything you need, delivered to your door.
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-lg">
            Beauty, kitchen, school & tech essentials — all in one place.
          </p>
          <Link
            to="/products"
            className="inline-block bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Shop Now
          </Link>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,white,transparent_50%)]" />
      </div>

      {/* Category banners */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryBanners.map((cat) => (
            <Link
              key={cat.key}
              to={`/products?category=${cat.key}`}
              className={`relative rounded-xl overflow-hidden h-36 sm:h-44 group shadow-md`}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70`} />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="font-bold text-lg">{cat.label}</h3>
                <p className="text-xs text-white/90">{cat.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-amber-600 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Promo strip */}
      <div className="bg-amber-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-slate-900 font-bold text-xl">Free delivery on orders over Rs 2000</h3>
            <p className="text-slate-800 text-sm">Shop now and save on shipping.</p>
          </div>
          <Link
            to="/products"
            className="bg-slate-900 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-slate-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
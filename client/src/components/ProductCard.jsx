import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500";

export default function ProductCard({ product }) {
  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <Link
      to={`/products/${product._id}`}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 overflow-hidden group flex flex-col"
    >
      <div className="w-full aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.images?.[0] || FALLBACK_IMAGE}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        <StarRating rating={product.rating} />
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xl font-bold text-slate-900">Rs {finalPrice.toFixed(0)}</p>
        </div>
        {product.discount > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-400 line-through">Rs {product.price}</p>
            <span className="text-xs text-green-600 font-semibold">{product.discount}% off</span>
          </div>
        )}
      </div>
    </Link>
  );
}
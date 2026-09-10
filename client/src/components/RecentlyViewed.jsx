import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const ids = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      if (ids.length === 0) return;

      const results = await Promise.all(
        ids.map((id) => api.get(`/products/${id}`).then((res) => res.data).catch(() => null))
      );
      setProducts(results.filter(Boolean));
    };
    fetchRecent();
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
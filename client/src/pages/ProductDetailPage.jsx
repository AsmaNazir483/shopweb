import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import StarRating from "../components/StarRating";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        await fetchReviews();
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  useEffect(() => {
  if (product) {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const updated = [product._id, ...viewed.filter((id) => id !== product._id)].slice(0, 8);
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }
}, [product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/reviews",
        { productId: id, rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={product.images?.[0]} alt={product.name} className="w-full rounded-lg shadow-md" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <StarRating rating={product.rating} />
          <p className="text-gray-500 my-2">{product.category}</p>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-xl font-semibold">Rs {finalPrice.toFixed(0)}</p>
            {product.discount > 0 && (
              <p className="text-sm text-gray-400 line-through">Rs {product.price}</p>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button
            onClick={() => addToCart(product)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-6 py-2 rounded-md transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 mb-6">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.userId?.name || "User"}</span>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-gray-600 mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-lg shadow-md border border-gray-100 flex flex-col gap-3 max-w-md">
            <h3 className="font-semibold">Write a review</h3>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Stars
                </option>
              ))}
            </select>
            <textarea
              placeholder="Your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <button type="submit" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold py-2 rounded-md transition-colors">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-gray-500">
            Please login to write a review.
          </p>
        )}
      </div>
    </div>
  );
}
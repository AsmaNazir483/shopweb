import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Please login to view your orders.</p>
        <Link to="/login" className="text-amber-600 underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-amber-600 underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</p>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
                {order.products.map((item, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    Qty {item.quantity} × Rs {item.price}
                  </p>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">{order.shippingAddress}</span>
                <span className="font-bold text-gray-900">Total: Rs {order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
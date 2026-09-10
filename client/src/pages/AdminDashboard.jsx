import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("products");
  const [form, setForm] = useState({
    name: "",
    category: "beauty",
    price: "",
    discount: "",
    description: "",
    images: "",
    stock: "",
  });
  const [editingId, setEditingId] = useState(null);

  const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data.products);
  };

  const fetchOrders = async () => {
    const res = await api.get("/orders", authHeader);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchProducts();
    if (user?.role === "admin") fetchOrders();
  }, []);

  if (!user || user.role !== "admin") {
    return <p className="p-6 text-center">Access denied. Admins only.</p>;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      images: [form.images],
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload, authHeader);
      } else {
        await api.post("/products", payload, authHeader);
      }
      setForm({ name: "", category: "beauty", price: "", discount: "", description: "", images: "", stock: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      discount: product.discount,
      description: product.description || "",
      images: product.images?.[0] || "",
      stock: product.stock,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`, authHeader);
    fetchProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status }, authHeader);
    fetchOrders();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-md ${tab === "products" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-md ${tab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Orders
        </button>
      </div>

      {tab === "products" && (
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required className="border border-gray-300 rounded-md px-3 py-2" />
            <select name="category" value={form.category} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2">
              <option value="beauty">Beauty</option>
              <option value="laptop-accessories">Laptop Accessories</option>
              <option value="school">School</option>
              <option value="kitchen">Kitchen</option>
            </select>
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="border border-gray-300 rounded-md px-3 py-2" />
            <input name="discount" type="number" placeholder="Discount %" value={form.discount} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
            <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
            <input name="images" placeholder="Image URL" value={form.images} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2" />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-gray-300 rounded-md px-3 py-2 sm:col-span-2" />
            <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 sm:col-span-2">
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-gray-500">${p.price} • {p.category}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="flex flex-col gap-4">
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                <p className="text-gray-500">Total: ${order.totalAmount}</p>
                <p className="text-gray-500">Address: {order.shippingAddress}</p>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="mt-2 border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    try {
      const { data } = await api.post(
        "/payment/create-payment-intent",
        { amount: total },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        await api.post(
          "/orders",
          {
            products: cart.map((item) => ({
              productId: item._id,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: total,
            shippingAddress: address,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        clearCart();
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Checkout</h1>

      <input
        type="text"
        placeholder="Shipping Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-4 py-2"
      />

      <div className="border border-gray-300 rounded-md px-4 py-3">
        <CardElement />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <p className="text-lg font-semibold">Total: ${total.toFixed(2)}</p>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
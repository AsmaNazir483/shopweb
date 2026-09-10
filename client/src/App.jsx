import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/AdminDashboard";
import Footer from "./components/Footer";
import MyOrdersPage from "./pages/MyOrdersPage";
import AIChatWidget from "./components/AIChatWidget";
import RecentlyViewed from "./components/RecentlyViewed";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
             <Navbar />
             <div className="flex-1">
           <Routes>
                <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListingPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
             </Routes>
          </div>
            <RecentlyViewed />
            <Footer />
            <AIChatWidget />
            
         </div>
           </BrowserRouter>
        
      </CartProvider>
    </AuthProvider>
  );
}
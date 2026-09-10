import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 tracking-wide">COMPANY INFO</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">About ShopEase</a></li>
            <li><a href="#" className="hover:text-black">Careers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 tracking-wide">HELP & SUPPORT</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#" className="hover:text-black">Shipping Info</a></li>
            <li><a href="#" className="hover:text-black">Returns</a></li>
            <li><a href="#" className="hover:text-black">How to Order</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 tracking-wide">SHOP</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/products?category=beauty" className="hover:text-black">Beauty</Link></li>
            <li><Link to="/products?category=kitchen" className="hover:text-black">Kitchen</Link></li>
            <li><Link to="/products?category=school" className="hover:text-black">School</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900 mb-3 tracking-wide">FIND US ON</h4>
          <div className="flex gap-3 text-gray-600">
            <span>FB</span><span>IG</span><span>TW</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 text-center py-4 text-xs text-gray-500">
        © 2026 ShopEase. All rights reserved.
      </div>
    </footer>
  );
}
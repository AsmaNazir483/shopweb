# ShopEase — MERN E-Commerce Platform

A full-stack Amazon-style e-commerce web application built with MongoDB, Express, React, and Node.js.

## Live Demo
- Frontend: [https://shopweb-b8i7wj5gj-asma-nazir.vercel.app/]
- Backend API: [https://shopaseserver-mgjos1c1.b4a.run/]

## Features
- **Authentication**: JWT-based signup/login with role-based access (user/admin)
- **Product Catalog**: 100+ products across 4 categories (beauty, kitchen, school, laptop accessories) with search, filter, and pagination
- **Shopping Cart**: Add/remove/update items, persisted via localStorage
- **Checkout & Orders**: Order placement, order history, order cancellation
- **Admin Dashboard**: Product CRUD, order status management
- **Reviews & Ratings**: Customers can rate and review products
- **AI Shopping Assistant**: Natural language product search powered by Google Gemini API
- **Responsive Design**: Mobile-first, works across devices

## Tech Stack
**Frontend:** React (Vite), React Router, Tailwind CSS, Context API, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**AI Integration:** Google Gemini API
**Images:** Pexels API

## Folder Structure
client/ → React frontend (pages, components, context, services)
server/ → Express backend (models, routes, controllers, middleware)


## Local Setup

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY, PEXELS_API_KEY
npm run dev
```

### Frontend
```bash
cd client
npm install
cp .env.example .env   # fill in VITE_API_URL
npm run dev
```

## Future Enhancements
- Wishlist
- Cloudinary-based image upload from Admin Dashboard
- Real payment integration (Stripe)
- Dark mode

## Author
Built by Asma Nazir as a full-stack MERN portfolio project.
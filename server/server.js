const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ensure DB connects before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

app.get("/", (req, res) => {
  res.send("ShopEase API is running...");
});
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const serverless = require("serverless-http");

if (process.env.VERCEL) {
  module.exports = serverless(app);
} else {
  const PORT = process.env.PORT || 5000;
  connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["beauty", "laptop-accessories", "school", "kitchen"],
      required: true,
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    description: { type: String },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
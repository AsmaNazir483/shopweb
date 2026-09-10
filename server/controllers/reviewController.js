const Review = require("../models/Review");
const Product = require("../models/Product");

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = await Review.create({
      userId: req.user._id,
      productId,
      rating,
      comment,
    });

    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate("userId", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getProductReviews };
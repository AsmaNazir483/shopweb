const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const { protect } = require("../middleware/authMiddleware");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in smallest currency unit (e.g. cents)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    const products = await Product.find().select("name category price discount description");

    const productList = products
      .map((p) => `- ${p.name} (${p.category}) - Rs ${p.price}, ${p.discount}% off`)
      .join("\n");

    const prompt = `You are a helpful shopping assistant for ShopEase, an e-commerce site.
Here is the current product catalog:
${productList}

Based on the user's question, recommend relevant products from this list only.
Keep your answer short (2-4 sentences), friendly, and mention specific product names and prices.
If nothing matches, say so politely and suggest browsing categories instead.

User question: ${message}`;

    const model = genAI.getGenerativeModel({ model: "models/gemini-flash-lite-latest" });
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("AI assistant error:", error);
    res.status(500).json({ message: "AI assistant is unavailable right now." });
  }
};

module.exports = { askAssistant };
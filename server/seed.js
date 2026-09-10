require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Product = require("./models/Product");

const categories = ["beauty", "laptop-accessories", "school", "kitchen"];

const namesByCategory = {
  beauty: ["Face Serum", "Lip Balm", "Body Lotion", "Sunscreen SPF50", "Shampoo", "Conditioner", "Face Wash", "Hair Oil", "Nail Polish", "Perfume", "Eyeliner", "Foundation", "Compact Powder", "Moisturizer", "Hand Cream", "Body Wash", "Face Mask", "Makeup Remover", "Hair Serum", "Lip Gloss", "Blush", "Mascara", "Concealer", "Toner", "Eye Cream"],
  "laptop-accessories": ["Wireless Mouse", "Laptop Bag", "USB-C Hub", "Laptop Stand", "Cooling Pad", "Keyboard Cover", "Webcam", "Bluetooth Speaker", "Laptop Sleeve", "Screen Protector", "External Hard Drive", "Wireless Keyboard", "Laptop Charger", "HDMI Cable", "Mouse Pad", "Cable Organizer", "Laptop Lock", "USB Flash Drive", "Docking Station", "Headphones", "Webcam Cover", "Laptop Skin", "Power Bank", "Adapter", "Stylus Pen"],
  school: ["Notebook Set", "Ballpoint Pens", "Pencil Case", "Backpack", "Geometry Box", "Highlighters", "Sticky Notes", "Whiteboard Marker", "Ruler Set", "Scissors", "Glue Stick", "Crayons", "Sketchbook", "File Folder", "Stapler", "Eraser Pack", "Calculator", "Water Bottle", "Lunch Box", "Pencil Sharpener", "Correction Tape", "Binder", "Index Cards", "Art Supplies Set", "Diary"],
  kitchen: ["Non-Stick Pan", "Chef Knife Set", "Cutting Board", "Mixing Bowls", "Blender", "Electric Kettle", "Spice Rack", "Storage Containers", "Frying Pan", "Pressure Cooker", "Dinner Set", "Cutlery Set", "Tea Set", "Baking Tray", "Grater", "Measuring Cups", "Oven Mitts", "Rolling Pin", "Colander", "Water Bottle Set", "Coffee Maker", "Toaster", "Serving Tray", "Food Storage Jars", "Kitchen Scale"],
};

const categorySearchTerms = {
  beauty: "skincare cosmetics",
  "laptop-accessories": "laptop computer accessories",
  school: "school stationery notebook",
  kitchen: "kitchen cookware utensils",
};

const adjectives = ["Premium", "Classic", "Deluxe", "Essential", "Pro", "Everyday", "Elegant", "Compact", "Modern", "Basic"];

// Fetch real images from Pexels for a given search term
const fetchImagesForCategory = async (searchTerm) => {
  try {
    const res = await axios.get("https://api.pexels.com/v1/search", {
      headers: { Authorization: process.env.PEXELS_API_KEY },
      params: { query: searchTerm, per_page: 25 },
    });
    return res.data.photos.map((photo) => photo.src.medium);
  } catch (error) {
    console.error(`Error fetching images for ${searchTerm}:`, error.message);
    return [];
  }
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Fetch images for each category upfront
    const categoryImages = {};
    for (const category of categories) {
      console.log(`Fetching images for ${category}...`);
      categoryImages[category] = await fetchImagesForCategory(categorySearchTerms[category]);
      console.log(`Got ${categoryImages[category].length} images for ${category}`);
    }

    const products = [];
    let counter = 1;

    categories.forEach((category) => {
      const images = categoryImages[category];
      namesByCategory[category].forEach((baseName) => {
        const adjective = adjectives[counter % adjectives.length];
        const name = `${adjective} ${baseName}`;
        const price = Math.floor(Math.random() * 3000) + 150;
        const discount = [0, 5, 10, 15, 20][counter % 5];
        const stock = Math.floor(Math.random() * 50) + 5;
        const image = images.length > 0 ? images[counter % images.length] : "";

        products.push({
          name,
          category,
          price,
          discount,
          description: `${name} - high quality product for your everyday needs.`,
          images: [image],
          stock,
          rating: Number((Math.random() * 2 + 3).toFixed(1)),
        });

        counter++;
      });
    });

    await Product.deleteMany({});
    console.log("Old products removed");

    await Product.insertMany(products);
    console.log(`${products.length} products added successfully`);

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      bufferCommands: false,
      maxPoolSize: 1,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};
await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
  bufferCommands: false,
  maxPoolSize: 1,
  family: 4,
});

module.exports = connectDB;

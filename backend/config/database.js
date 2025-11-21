const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || typeof uri !== "string" || uri.trim() === "") {
    throw new Error(
      "MONGODB_URI is not configured. Please set MONGODB_URI in your environment."
    );
  }
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
    throw err;
  }
};

module.exports = connectDB;

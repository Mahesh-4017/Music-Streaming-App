import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI|| "mongodb://localhost:27017/pba";

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in .env.local");
}

async function dbConnect() {
  try {
    console.log("🟡 Connecting to MongoDB...");

    const connection = await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB connected successfully");

    return connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message );
    throw error;
  }
}

export default dbConnect;
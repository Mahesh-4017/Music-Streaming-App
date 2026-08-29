import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not defined in environment variables.");
    // In build phase, return null or avoid throwing top level exception
    if (process.env.NODE_ENV === "production" && typeof window === "undefined" && !process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI environment variable is required at runtime.");
    }
    throw new Error("❌ Please define MONGODB_URI in environment variables.");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cache.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    console.error("❌ MongoDB connection failed:", e);
    throw e;
  }

  return cache.conn;
}

export default dbConnect;
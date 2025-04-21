import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your .env.local file"
  );
}

// Create a global cache to prevent multiple connections during hot reloads
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB database
 */
export async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("🔌 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ Connected to MongoDB!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Error connecting to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB database
 */
export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log("🛑 Disconnected from MongoDB");
  }
}

export default connectToDatabase;

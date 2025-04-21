import mongoose from "mongoose";

declare global {
  var mongoose: any;
}
const states = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
  99: "uninitialized",
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    isConnecting: false,
    connectionAttempts: 0,
  };
}

export async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise && cached.isConnecting) {
    return cached.promise;
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable. " +
        "Example: mongodb+srv://username:password@cluster.mongodb.net/database"
    );
  }

  cached.isConnecting = true;
  cached.connectionAttempts++;

  const options = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  console.log(`MongoDB connection attempt ${cached.connectionAttempts}...`);
  console.log(
    `Current connection state: ${
      states[mongoose.connection.readyState as keyof typeof states]
    }`
  );

  try {
    cached.promise = mongoose.connect(MONGODB_URI, options);
    cached.conn = await cached.promise;

    console.log("MongoDB connected successfully!");
    console.log(`Database: ${mongoose.connection?.db?.databaseName}`);
    console.log(`Host: ${mongoose.connection?.host}`);


    cached.connectionAttempts = 0;
    return cached.conn;
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);

    if (error.name === "MongoServerSelectionError") {
      console.error("Could not connect to any MongoDB server. Check your network or MongoDB Atlas settings.");
    } else if (error.name === "MongoNetworkError") {
      console.error("Network error occurred. Check your internet connection and firewall settings.");
    } else if (error.name === "MongoNetworkTimeoutError") {
      console.error("Connection timed out. The MongoDB server might be down or unreachable.");
    } else if (error.name === "MongoError" && error.code === 18) {
      console.error("Authentication failed. Check your username and password in the connection string.");
    } else if (error.name === "MongoError" && error.code === 8000) {
      console.error("DNS resolution failed. Check your cluster address in the connection string.");
    }

    cached.promise = null;
    cached.isConnecting = false;
    throw error;
  } finally {
    cached.isConnecting = false;
  }
}

export default connectToDatabase;

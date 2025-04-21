import mongoose from "mongoose"
import connectToDatabase from "./db"

/**
 * Wraps a function with database connection logic
 * @param fn Function to wrap with database connection
 */
export async function withDatabase<T>(fn: () => Promise<T>): Promise<T> {
  await connectToDatabase()
  return await fn()
}

/**
 * Check if a MongoDB ObjectId is valid
 * @param id ID to validate
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

/**
 * Convert a string ID to MongoDB ObjectId
 * @param id ID to convert
 */
export function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id)
}

/**
 * Handle database errors
 * @param error Error to handle
 */
export function handleDatabaseError(error: any): { message: string; status: number } {
  console.error("Database error:", error)

  if (error.name === "ValidationError") {
    return { message: "Validation error: " + error.message, status: 400 }
  }

  if (error.name === "MongoServerError" && error.code === 11000) {
    return { message: "Duplicate key error", status: 409 }
  }

  return { message: "Database error: " + error.message, status: 500 }
}

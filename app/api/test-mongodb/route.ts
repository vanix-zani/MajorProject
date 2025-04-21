import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET() {
  let client = null

  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI

    if (!uri) {
      return NextResponse.json(
        {
          success: false,
          error: "MONGODB_URI environment variable is not set",
          details:
            "Please set the MONGODB_URI environment variable in your .env.local file or in your deployment environment",
        },
        { status: 500 },
      )
    }

    // Attempt to connect with a short timeout for quick feedback
    client = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    })

    // If we get here, the connection was successful
    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB",
      version: mongoose.version,
      connection: {
        host: client.connection.host,
        port: client.connection.port,
        name: client.connection.name,
      },
    })
  } catch (error: any) {
    // Return detailed error information
    return NextResponse.json(
      {
        success: false,
        error: error.name || "Unknown error",
        message: error.message || "No error message available",
        code: error.code,
        // Additional information that might be helpful
        details: {
          codeName: error.codeName,
          connectionGeneration: error.connectionGeneration,
          errorLabels: error.errorLabels,
        },
      },
      { status: 500 },
    )
  } finally {
    // Close the connection if it was opened
    if (client) {
      await mongoose.disconnect()
    }
  }
}

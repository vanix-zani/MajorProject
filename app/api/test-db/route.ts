import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/lib/models/user"

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase()

    // Try to count users to verify connection
    const userCount = await User.countDocuments()

    return NextResponse.json({
      message: "Database connection successful",
      userCount,
      status: "connected",
    })
  } catch (error: any) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        error: error.message,
        status: "error",
      },
      { status: 500 },
    )
  }
}

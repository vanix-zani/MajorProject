import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/db"
import User from "@/lib/models/user"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, class: studentClass } = await req.json()

    // Validate input
    if (!name || !email || !password || !studentClass) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (studentClass < 6 || studentClass > 12) {
      return NextResponse.json({ message: "Class must be between 6 and 12" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      class: studentClass,
      role: "student",
    })

    // Return success response without password
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          class: user.class,
          role: user.role,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: error.message || "An error occurred during registration" }, { status: 500 })
  }
}

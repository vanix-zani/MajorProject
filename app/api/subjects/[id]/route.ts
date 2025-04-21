import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectToDatabase from "@/lib/db"
import Subject from "@/lib/models/subject"
import { authOptions } from "@/lib/auth"

// GET subject by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Fetch subject
    const subject = await Subject.findById(params.id)

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error: any) {
    console.error("Error fetching subject:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while fetching the subject" },
      { status: 500 },
    )
  }
}

// PUT update subject
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, class: studentClass, description } = await req.json()

    // Validate input
    if (!name || !studentClass || !description) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (studentClass < 6 || studentClass > 12) {
      return NextResponse.json({ message: "Class must be between 6 and 12" }, { status: 400 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if subject exists
    const subject = await Subject.findById(params.id)
    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    // Update subject
    const updatedSubject = await Subject.findByIdAndUpdate(
      params.id,
      {
        name,
        class: studentClass,
        description,
      },
      { new: true },
    )

    return NextResponse.json(updatedSubject)
  } catch (error: any) {
    console.error("Error updating subject:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while updating the subject" },
      { status: 500 },
    )
  }
}

// DELETE subject
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Check if subject exists
    const subject = await Subject.findById(params.id)
    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    // Delete subject
    await Subject.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting subject:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while deleting the subject" },
      { status: 500 },
    )
  }
}

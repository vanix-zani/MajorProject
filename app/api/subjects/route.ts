import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import Subject from "@/lib/models/subject"
import { authOptions } from "@/lib/auth"
import { withDatabase, handleDatabaseError } from "@/lib/db-utils"

// GET all subjects
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(req.url)
    const classParam = url.searchParams.get("class")

    // Build query
    const query: any = {}
    if (classParam) {
      query.class = Number(classParam)
    }

    // Use withDatabase utility to handle connection
    const subjects = await withDatabase(async () => {
      return await Subject.find(query).sort({ name: 1 })
    })

    return NextResponse.json(subjects)
  } catch (error: any) {
    const { message, status } = handleDatabaseError(error)
    return NextResponse.json({ message }, { status })
  }
}

// POST new subject
export async function POST(req: NextRequest) {
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

    // Use withDatabase utility to handle connection
    const subject = await withDatabase(async () => {
      // Check if subject already exists
      const existingSubject = await Subject.findOne({ name, class: studentClass })
      if (existingSubject) {
        throw new Error("Subject already exists for this class")
      }

      // Create new subject
      return await Subject.create({
        name,
        class: studentClass,
        description,
      })
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error: any) {
    if (error.message === "Subject already exists for this class") {
      return NextResponse.json({ message: error.message }, { status: 409 })
    }

    const { message, status } = handleDatabaseError(error)
    return NextResponse.json({ message }, { status })
  }
}

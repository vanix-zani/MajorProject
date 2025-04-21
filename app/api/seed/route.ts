import { type NextRequest, NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"

export async function GET(req: NextRequest) {
  try {
    // In a production environment, you would want to secure this endpoint
    // or remove it entirely after initial setup

    await seedDatabase()

    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error: any) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { message: error.message || "An error occurred while seeding the database" },
      { status: 500 },
    )
  }
}

import connectToDatabase, { disconnectFromDatabase } from "../lib/db"
import { seedDatabase } from "../lib/seed-data"

async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Connect to the database
    await connectToDatabase()

    // Seed the database with initial data
    await seedDatabase()

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  } finally {
    // Disconnect from the database
    await disconnectFromDatabase()
  }
}

// Run the initialization
initializeDatabase()

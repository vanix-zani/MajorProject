import { NextResponse } from "next/server"

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      return NextResponse.json({
        valid: false,
        error: "MONGODB_URI is not set",
      })
    }

    // Parse the MongoDB URI to validate its format
    let parsedUri: URL
    try {
      // Handle mongodb+srv:// protocol
      if (uri.startsWith("mongodb+srv://")) {
        parsedUri = new URL(uri.replace("mongodb+srv://", "https://"))
      } else if (uri.startsWith("mongodb://")) {
        parsedUri = new URL(uri.replace("mongodb://", "https://"))
      } else {
        return NextResponse.json({
          valid: false,
          error: "URI must start with mongodb:// or mongodb+srv://",
        })
      }
    } catch (e) {
      return NextResponse.json({
        valid: false,
        error: "Invalid URI format",
      })
    }

    // Check for username and password
    const hasCredentials = parsedUri.username && parsedUri.password

    // Check for database name
    const pathname = parsedUri.pathname
    const hasDatabase = pathname && pathname !== "/"

    // Validate host
    const hasHost = !!parsedUri.host

    return NextResponse.json({
      valid: hasCredentials && hasHost && hasDatabase,
      format: {
        protocol: uri.startsWith("mongodb+srv://") ? "mongodb+srv" : "mongodb",
        hasCredentials,
        hasHost,
        hasDatabase,
        host: parsedUri.host,
        database: hasDatabase ? pathname.substring(1) : null,
      },
      suggestions: !hasCredentials
        ? "URI is missing username or password"
        : !hasHost
          ? "URI is missing host"
          : !hasDatabase
            ? "URI is missing database name"
            : null,
    })
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      error: error.message,
    })
  }
}

import { NextResponse } from "next/server"

export async function GET() {
  // Check if MongoDB URI is defined
  const mongodbUri = process.env.MONGODB_URI

  return NextResponse.json({
    mongodbUriExists: !!mongodbUri,
    // Show first few characters and last few characters of the URI for verification
    // without exposing the full credentials
    mongodbUriPreview: mongodbUri
      ? `${mongodbUri.substring(0, 20)}...${mongodbUri.substring(mongodbUri.length - 10)}`
      : null,
  })
}

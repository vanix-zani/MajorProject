import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

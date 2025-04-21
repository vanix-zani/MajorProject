"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedDashboard")

    if (!hasVisited) {
      setIsVisible(true)
      localStorage.setItem("hasVisitedDashboard", "true")
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <Card className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Welcome to EduManage!</CardTitle>
            <CardDescription>Your personalized learning platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>We're excited to help you on your learning journey. Here's how to get started:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Browse <strong>Study Materials</strong> to access resources for your class
            </li>
            <li>
              Take <strong>Quizzes</strong> to test your knowledge on various topics
            </li>
            <li>
              Track your <strong>Performance</strong> to see your progress over time
            </li>
            <li>
              Update your <strong>Profile</strong> and <strong>Settings</strong> to personalize your experience
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setIsVisible(false)}>Get Started</Button>
      </CardFooter>
    </Card>
  )
}

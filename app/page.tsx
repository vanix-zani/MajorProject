import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, LineChart, TestTube } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold">EduManage</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Education Management System</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A comprehensive platform for students from class 6 to 12 to access study materials, take quizzes, and track
            their academic progress.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Study Materials</CardTitle>
              <CardDescription>
                Access class-specific study materials including PDFs, notes, and video links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Browse through a comprehensive collection of study materials organized by subjects and topics. Download
                PDFs, read notes, and watch educational videos.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <TestTube className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Interactive Quizzes</CardTitle>
              <CardDescription>Test your knowledge with topic-wise MCQ quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Challenge yourself with multiple-choice quizzes for each topic. Get immediate feedback and see your
                score after submission.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button className="w-full">Try Quizzes</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
              <CardTitle>Performance Tracking</CardTitle>
              <CardDescription>Monitor your progress with detailed analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Track your quiz history and performance over time with visual charts and graphs. Identify your strengths
                and areas for improvement.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/register" className="w-full">
                <Button className="w-full">Track Progress</Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="container mx-auto py-8 px-4 border-t mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold">EduManage</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Education Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

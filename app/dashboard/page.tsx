"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { SessionProvider } from "next-auth/react"
import Link from "next/link"
import { BookOpen, LineChart, TestTube } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import { WelcomeBanner } from "@/components/welcome-banner"

interface Subject {
  _id: string
  name: string
  class: number
  description: string
}

interface QuizResult {
  _id: string
  quiz: {
    _id: string
    title: string
    topic: {
      _id: string
      name: string
      subject: {
        _id: string
        name: string
      }
    }
  }
  score: number
  totalQuestions: number
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [recentQuizzes, setRecentQuizzes] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real application, these would be actual API calls
        // For demo purposes, we're creating mock data

        // Mock subjects for the student's class
        const mockSubjects: Subject[] = [
          { _id: "1", name: "Mathematics", class: 10, description: "Algebra, Geometry, and more" },
          { _id: "2", name: "Science", class: 10, description: "Physics, Chemistry, and Biology" },
          { _id: "3", name: "English", class: 10, description: "Grammar, Literature, and Composition" },
          { _id: "4", name: "History", class: 10, description: "World History and Civics" },
        ]

        // Mock recent quiz results
        const mockQuizResults: QuizResult[] = [
          {
            _id: "1",
            quiz: {
              _id: "1",
              title: "Algebra Basics",
              topic: {
                _id: "1",
                name: "Algebra",
                subject: { _id: "1", name: "Mathematics" },
              },
            },
            score: 8,
            totalQuestions: 10,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: "2",
            quiz: {
              _id: "2",
              title: "Forces and Motion",
              topic: {
                _id: "2",
                name: "Physics",
                subject: { _id: "2", name: "Science" },
              },
            },
            score: 7,
            totalQuestions: 10,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]

        setSubjects(mockSubjects)
        setRecentQuizzes(mockQuizResults)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <WelcomeBanner />

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session?.user?.name}! Here's an overview of your learning progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Enrolled Subjects
              </CardTitle>
              <CardDescription>Class {session?.user?.class} subjects</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="flex items-center justify-between">
                      <span>{subject.name}</span>
                      <Link href={`/materials?subject=${subject._id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TestTube className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Recent Quizzes
              </CardTitle>
              <CardDescription>Your latest quiz results</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : recentQuizzes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuizzes.map((result) => (
                    <div key={result._id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{result.quiz.title}</span>
                        <span className="text-sm text-muted-foreground">{formatDate(result.createdAt)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.quiz.topic.subject.name} - {result.quiz.topic.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(result.score / result.totalQuestions) * 100} className="h-2" />
                        <span className="text-sm font-medium">
                          {result.score}/{result.totalQuestions}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>You haven't taken any quizzes yet.</p>
                  <Link href="/quizzes">
                    <Button variant="outline" className="mt-2">
                      Take a Quiz
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Performance Overview
              </CardTitle>
              <CardDescription>Your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[180px] w-full" />
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Quiz Completion</span>
                      <span>40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Study Materials</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <Link href="/performance">
                    <Button variant="outline" className="w-full mt-2">
                      View Detailed Performance
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Study Materials</CardTitle>
              <CardDescription>Based on your recent activity and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Algebra Fundamentals</CardTitle>
                      <CardDescription>Mathematics</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        Strengthen your understanding of basic algebraic concepts.
                      </p>
                      <Link href="/materials/topic/1">
                        <Button size="sm" variant="outline" className="w-full">
                          View Material
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Newton's Laws of Motion</CardTitle>
                      <CardDescription>Science - Physics</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        Review the fundamental laws of motion in physics.
                      </p>
                      <Link href="/materials/topic/2">
                        <Button size="sm" variant="outline" className="w-full">
                          View Material
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">Grammar Essentials</CardTitle>
                      <CardDescription>English</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        Master the essential grammar rules for better writing.
                      </p>
                      <Link href="/materials/topic/3">
                        <Button size="sm" variant="outline" className="w-full">
                          View Material
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

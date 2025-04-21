"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, Search, TestTube } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"

interface Subject {
  _id: string
  name: string
  class: number
}

interface Topic {
  _id: string
  name: string
  subject: string
}

interface Quiz {
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
  description: string
  questions: any[]
  timeLimit?: number
}

export default function QuizzesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSubject, setActiveSubject] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjectsAndQuizzes = async () => {
      try {
        // In a real application, these would be actual API calls
        // For demo purposes, we're creating mock data

        // Mock subjects
        const mockSubjects: Subject[] = [
          { _id: "1", name: "Mathematics", class: 10 },
          { _id: "2", name: "Science", class: 10 },
          { _id: "3", name: "English", class: 10 },
          { _id: "4", name: "History", class: 10 },
        ]

        // Mock quizzes
        const mockQuizzes: Quiz[] = [
          {
            _id: "1",
            title: "Algebra Basics",
            topic: {
              _id: "1",
              name: "Algebra",
              subject: { _id: "1", name: "Mathematics" },
            },
            description: "Test your knowledge of basic algebraic concepts",
            questions: Array(10).fill({}),
            timeLimit: 15,
          },
          {
            _id: "2",
            title: "Geometry Fundamentals",
            topic: {
              _id: "2",
              name: "Geometry",
              subject: { _id: "1", name: "Mathematics" },
            },
            description: "Test your understanding of geometric principles",
            questions: Array(8).fill({}),
            timeLimit: 12,
          },
          {
            _id: "3",
            title: "Forces and Motion",
            topic: {
              _id: "4",
              name: "Physics",
              subject: { _id: "2", name: "Science" },
            },
            description: "Test your knowledge of Newton's laws and motion concepts",
            questions: Array(12).fill({}),
            timeLimit: 20,
          },
          {
            _id: "4",
            title: "Elements and Compounds",
            topic: {
              _id: "5",
              name: "Chemistry",
              subject: { _id: "2", name: "Science" },
            },
            description: "Test your understanding of chemical elements and compounds",
            questions: Array(15).fill({}),
            timeLimit: 25,
          },
          {
            _id: "5",
            title: "Grammar Rules",
            topic: {
              _id: "7",
              name: "Grammar",
              subject: { _id: "3", name: "English" },
            },
            description: "Test your knowledge of English grammar rules",
            questions: Array(20).fill({}),
            timeLimit: 30,
          },
          {
            _id: "6",
            title: "World War II",
            topic: {
              _id: "9",
              name: "World History",
              subject: { _id: "4", name: "History" },
            },
            description: "Test your knowledge of World War II events and figures",
            questions: Array(15).fill({}),
            timeLimit: 20,
          },
        ]

        setSubjects(mockSubjects)
        setQuizzes(mockQuizzes)

        // Set active subject
        if (mockSubjects.length > 0) {
          setActiveSubject(mockSubjects[0]._id)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching subjects and quizzes:", error)
        setIsLoading(false)
      }
    }

    fetchSubjectsAndQuizzes()
  }, [])

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      (activeSubject ? quiz.topic.subject._id === activeSubject : true) &&
      (searchQuery ? quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) : true),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground mt-2">Test your knowledge with interactive quizzes</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <Tabs
            defaultValue={activeSubject || subjects[0]?._id}
            value={activeSubject || undefined}
            onValueChange={setActiveSubject || undefined}
            className="space-y-6"
          >
            <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0">
              {subjects.map((subject) => (
                <TabsTrigger
                  key={subject._id}
                  value={subject._id}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {subject.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {subjects.map((subject) => (
              <TabsContent key={subject._id} value={subject._id} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes
                    .filter((quiz) => quiz.topic.subject._id === subject._id)
                    .map((quiz) => (
                      <Link key={quiz._id} href={`/quizzes/${quiz._id}`}>
                        <Card className="h-full hover:bg-muted/50 transition-colors">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                              <TestTube className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              {quiz.title}
                            </CardTitle>
                            <CardDescription>
                              {quiz.topic.subject.name} - {quiz.topic.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {quiz.timeLimit} min
                              </Badge>
                              <Badge variant="outline">{quiz.questions.length} questions</Badge>
                            </div>
                            <Button className="w-full mt-4">Take Quiz</Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>

                {filteredQuizzes.filter((quiz) => quiz.topic.subject._id === subject._id).length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No quizzes found</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchQuery
                        ? `No quizzes matching "${searchQuery}" in ${subject.name}`
                        : `No quizzes available for ${subject.name}`}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}

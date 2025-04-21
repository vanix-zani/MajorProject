"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, ChevronRight, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"

interface Subject {
  _id: string
  name: string
  class: number
  description: string
}

interface Topic {
  _id: string
  name: string
  subject: string
  description: string
}

export default function MaterialsPage() {
  const searchParams = useSearchParams()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSubject, setActiveSubject] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubjectsAndTopics = async () => {
      try {
        // In a real application, these would be actual API calls
        // For demo purposes, we're creating mock data

        // Mock subjects
        const mockSubjects: Subject[] = [
          { _id: "1", name: "Mathematics", class: 10, description: "Algebra, Geometry, and more" },
          { _id: "2", name: "Science", class: 10, description: "Physics, Chemistry, and Biology" },
          { _id: "3", name: "English", class: 10, description: "Grammar, Literature, and Composition" },
          { _id: "4", name: "History", class: 10, description: "World History and Civics" },
        ]

        // Mock topics
        const mockTopics: Topic[] = [
          { _id: "1", name: "Algebra", subject: "1", description: "Equations, expressions, and functions" },
          { _id: "2", name: "Geometry", subject: "1", description: "Shapes, angles, and theorems" },
          { _id: "3", name: "Trigonometry", subject: "1", description: "Sine, cosine, and tangent" },
          { _id: "4", name: "Physics", subject: "2", description: "Forces, motion, and energy" },
          { _id: "5", name: "Chemistry", subject: "2", description: "Elements, compounds, and reactions" },
          { _id: "6", name: "Biology", subject: "2", description: "Cells, organisms, and ecosystems" },
          { _id: "7", name: "Grammar", subject: "3", description: "Parts of speech and sentence structure" },
          { _id: "8", name: "Literature", subject: "3", description: "Novels, poetry, and drama" },
          { _id: "9", name: "World History", subject: "4", description: "Ancient civilizations to modern times" },
          { _id: "10", name: "Civics", subject: "4", description: "Government, rights, and responsibilities" },
        ]

        setSubjects(mockSubjects)
        setTopics(mockTopics)

        // Set active subject from URL params if available
        const subjectParam = searchParams.get("subject")
        if (subjectParam) {
          setActiveSubject(subjectParam)
        } else if (mockSubjects.length > 0) {
          setActiveSubject(mockSubjects[0]._id)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching subjects and topics:", error)
        setIsLoading(false)
      }
    }

    fetchSubjectsAndTopics()
  }, [searchParams])

  const filteredTopics = topics.filter(
    (topic) =>
      (activeSubject ? topic.subject === activeSubject : true) &&
      (searchQuery ? topic.name.toLowerCase().includes(searchQuery.toLowerCase()) : true),
  )

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s._id === subjectId)
    return subject ? subject.name : ""
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
            <p className="text-muted-foreground mt-2">Browse through subjects and topics to access study materials</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search topics..."
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
                  {filteredTopics
                    .filter((topic) => topic.subject === subject._id)
                    .map((topic) => (
                      <Link key={topic._id} href={`/materials/topic/${topic._id}`}>
                        <Card className="h-full hover:bg-muted/50 transition-colors">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              {topic.name}
                            </CardTitle>
                            <CardDescription>{getSubjectName(topic.subject)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                            <Button variant="outline" size="sm" className="gap-1">
                              View Materials
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>

                {filteredTopics.filter((topic) => topic.subject === subject._id).length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No topics found</h3>
                    <p className="text-muted-foreground mt-2">
                      {searchQuery
                        ? `No topics matching "${searchQuery}" in ${subject.name}`
                        : `No topics available for ${subject.name}`}
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

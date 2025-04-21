"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Plus, TestTube, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 0,
    subjects: 0,
    topics: 0,
    materials: 0,
    quizzes: 0,
  })

  useEffect(() => {
    // Check if user is admin
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard")
    }

    const fetchAdminStats = async () => {
      try {
        // In a real application, this would be an actual API call
        // For demo purposes, we're creating mock data

        // Mock stats
        const mockStats = {
          users: 125,
          subjects: 8,
          topics: 42,
          materials: 156,
          quizzes: 64,
        }

        setStats(mockStats)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        setIsLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchAdminStats()
    } else if (status !== "loading") {
      setIsLoading(false)
    }
  }, [session, status, router])

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we load the admin dashboard.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (status === "authenticated" && session?.user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-lg font-medium">Access Denied</h2>
            <p className="text-muted-foreground mt-2">You do not have permission to access this page.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage users, subjects, topics, study materials, and quizzes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users}</div>
              <p className="text-sm text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.subjects}</div>
              <p className="text-sm text-muted-foreground">Available subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.topics}</div>
              <p className="text-sm text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.materials}</div>
              <p className="text-sm text-muted-foreground">Study resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TestTube className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.quizzes}</div>
              <p className="text-sm text-muted-foreground">Assessment tests</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Users</h2>
              <Button asChild>
                <Link href="/admin/users/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>View and manage student accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Class</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      { id: "1", name: "John Doe", email: "john@example.com", class: 10, role: "student" },
                      { id: "2", name: "Jane Smith", email: "jane@example.com", class: 9, role: "student" },
                      { id: "3", name: "Admin User", email: "admin@example.com", class: null, role: "admin" },
                    ].map((user) => (
                      <div key={user.id} className="grid grid-cols-12 gap-2 p-4">
                        <div className="col-span-3">{user.name}</div>
                        <div className="col-span-3">{user.email}</div>
                        <div className="col-span-2">{user.class || "N/A"}</div>
                        <div className="col-span-2">{user.role}</div>
                        <div className="col-span-2 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/users/${user.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Subjects</h2>
              <Button asChild>
                <Link href="/admin/subjects/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subjects</CardTitle>
                <CardDescription>View and manage subject offerings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Class</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      { id: "1", name: "Mathematics", class: 10, description: "Algebra, Geometry, and more" },
                      { id: "2", name: "Science", class: 10, description: "Physics, Chemistry, and Biology" },
                      { id: "3", name: "English", class: 10, description: "Grammar, Literature, and Composition" },
                    ].map((subject) => (
                      <div key={subject.id} className="grid grid-cols-12 gap-2 p-4">
                        <div className="col-span-4">{subject.name}</div>
                        <div className="col-span-2">Class {subject.class}</div>
                        <div className="col-span-4">{subject.description}</div>
                        <div className="col-span-2 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/subjects/${subject.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Topics</h2>
              <Button asChild>
                <Link href="/admin/topics/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Topics</CardTitle>
                <CardDescription>View and manage subject topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                    <div className="col-span-3">Name</div>
                    <div className="col-span-3">Subject</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        id: "1",
                        name: "Algebra",
                        subject: "Mathematics",
                        description: "Equations, expressions, and functions",
                      },
                      {
                        id: "2",
                        name: "Geometry",
                        subject: "Mathematics",
                        description: "Shapes, angles, and theorems",
                      },
                      { id: "3", name: "Physics", subject: "Science", description: "Forces, motion, and energy" },
                    ].map((topic) => (
                      <div key={topic.id} className="grid grid-cols-12 gap-2 p-4">
                        <div className="col-span-3">{topic.name}</div>
                        <div className="col-span-3">{topic.subject}</div>
                        <div className="col-span-4">{topic.description}</div>
                        <div className="col-span-2 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/topics/${topic.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Materials</h2>
              <Button asChild>
                <Link href="/admin/materials/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Study Materials</CardTitle>
                <CardDescription>View and manage learning resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                    <div className="col-span-3">Title</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-3">Topic</div>
                    <div className="col-span-2">Subject</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        id: "1",
                        title: "Introduction to Algebra",
                        type: "pdf",
                        topic: "Algebra",
                        subject: "Mathematics",
                      },
                      { id: "2", title: "Geometry Basics", type: "video", topic: "Geometry", subject: "Mathematics" },
                      { id: "3", title: "Newton's Laws", type: "note", topic: "Physics", subject: "Science" },
                    ].map((material) => (
                      <div key={material.id} className="grid grid-cols-12 gap-2 p-4">
                        <div className="col-span-3">{material.title}</div>
                        <div className="col-span-2 capitalize">{material.type}</div>
                        <div className="col-span-3">{material.topic}</div>
                        <div className="col-span-2">{material.subject}</div>
                        <div className="col-span-2 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/materials/${material.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Quizzes</h2>
              <Button asChild>
                <Link href="/admin/quizzes/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quiz
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quizzes</CardTitle>
                <CardDescription>View and manage assessment tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                    <div className="col-span-3">Title</div>
                    <div className="col-span-3">Topic</div>
                    <div className="col-span-2">Subject</div>
                    <div className="col-span-2">Questions</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="divide-y">
                    {[
                      { id: "1", title: "Algebra Basics", topic: "Algebra", subject: "Mathematics", questions: 10 },
                      {
                        id: "2",
                        title: "Geometry Fundamentals",
                        topic: "Geometry",
                        subject: "Mathematics",
                        questions: 8,
                      },
                      { id: "3", title: "Forces and Motion", topic: "Physics", subject: "Science", questions: 12 },
                    ].map((quiz) => (
                      <div key={quiz.id} className="grid grid-cols-12 gap-2 p-4">
                        <div className="col-span-3">{quiz.title}</div>
                        <div className="col-span-3">{quiz.topic}</div>
                        <div className="col-span-2">{quiz.subject}</div>
                        <div className="col-span-2">{quiz.questions}</div>
                        <div className="col-span-2 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/quizzes/${quiz.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

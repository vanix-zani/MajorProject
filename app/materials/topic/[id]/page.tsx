"use client"

import { useEffect, useState } from "react"
import { use } from "react";
import Link from "next/link"
import { ChevronLeft, Download, FileText, Youtube } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"

interface Topic {
  _id: string
  name: string
  subject: {
    _id: string
    name: string
  }
  description: string
}

interface Material {
  _id: string
  title: string
  type: "pdf" | "note" | "video"
  content: string
  url?: string
}

export default function TopicPage({ params }: { params: { id: string } }) {

  const unwrappedParams = use(params);
  const topicId = unwrappedParams.id;

  const [topic, setTopic] = useState<Topic | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTopicAndMaterials = async () => {
      try {
        // Since params is already destructured from props, it's not a Promise
        // No need to use React.use() here
        
        // Mock topic
        const mockTopic: Topic = {
          _id:topicId,
          name:
          topicId === "1"
              ? "Algebra"
              : topicId === "2"
                ? "Newton's Laws of Motion"
                : topicId === "3"
                  ? "Grammar Essentials"
                  : "Topic " + topicId,
          subject: {
            _id: topicId === "1" ? "1" : topicId === "2" ? "2" : topicId === "3" ? "3" : "4",
            name:
            topicId === "1"
                ? "Mathematics"
                : topicId === "2"
                  ? "Science"
                  : topicId === "3"
                    ? "English"
                    : "History",
          },
          description:
          topicId === "1"
              ? "Learn about equations, expressions, and functions"
              : topicId === "2"
                ? "Understand the fundamental laws of motion in physics"
                : topicId === "3"
                  ? "Master the essential grammar rules for better writing"
                  : "Description for Topic " + topicId,
        }

        // Mock materials
        const mockMaterials: Material[] = [
          {
            _id: "1",
            title: "Introduction to " + mockTopic.name,
            type: "pdf",
            content: "Comprehensive guide to " + mockTopic.name,
            url: "#",
          },
          {
            _id: "2",
            title: mockTopic.name + " Explained",
            type: "video",
            content: "Video tutorial explaining " + mockTopic.name + " concepts",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          {
            _id: "3",
            title: mockTopic.name + " Practice Problems",
            type: "pdf",
            content: "Collection of practice problems for " + mockTopic.name,
            url: "#",
          },
          {
            _id: "4",
            title: "Key Concepts in " + mockTopic.name,
            type: "note",
            content: `
              <h2 class="text-xl font-bold mb-4">Key Concepts in ${mockTopic.name}</h2>
              
              <p class="mb-4">This note covers the fundamental concepts you need to understand about ${mockTopic.name}.</p>
              
              <h3 class="text-lg font-semibold mb-2">1. Basic Principles</h3>
              <p class="mb-4">The basic principles of ${mockTopic.name} include understanding the core theories and how they apply to real-world scenarios.</p>
              
              <h3 class="text-lg font-semibold mb-2">2. Important Formulas</h3>
              <p class="mb-4">There are several key formulas that you should memorize:</p>
              <ul class="list-disc pl-6 mb-4">
                <li>Formula 1: E = mc²</li>
                <li>Formula 2: a² + b² = c²</li>
                <li>Formula 3: F = ma</li>
              </ul>
              
              <h3 class="text-lg font-semibold mb-2">3. Applications</h3>
              <p class="mb-4">Understanding how to apply these concepts to solve problems is crucial for mastery.</p>
              
              <h3 class="text-lg font-semibold mb-2">4. Common Mistakes</h3>
              <p>Be aware of these common mistakes students make when working with ${mockTopic.name}:</p>
              <ul class="list-disc pl-6">
                <li>Mistake 1: Forgetting to convert units</li>
                <li>Mistake 2: Applying the wrong formula</li>
                <li>Mistake 3: Calculation errors</li>
              </ul>
            `,
          },
        ]

        setTopic(mockTopic)
        setMaterials(mockMaterials)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching topic and materials:", error)
        setIsLoading(false)
      }
    }

    fetchTopicAndMaterials()
  }, [topicId])

  const pdfMaterials = materials.filter((m) => m.type === "pdf")
  const noteMaterials = materials.filter((m) => m.type === "note")
  const videoMaterials = materials.filter((m) => m.type === "video")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/materials">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Materials
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : topic ? (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{topic.name}</h1>
              <p className="text-muted-foreground mt-2">
                {topic.subject.name} - {topic.description}
              </p>
            </div>

            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Materials</TabsTrigger>
                <TabsTrigger value="pdfs">PDFs</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {materials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {materials.map((material) => (
                      <MaterialCard key={material._id} material={material} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No materials available</h3>
                    <p className="text-muted-foreground mt-2">
                      There are no study materials available for this topic yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pdfs" className="space-y-6">
                {pdfMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pdfMaterials.map((material) => (
                      <MaterialCard key={material._id} material={material} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No PDFs available</h3>
                    <p className="text-muted-foreground mt-2">
                      There are no PDF materials available for this topic yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                {noteMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {noteMaterials.map((material) => (
                      <MaterialCard key={material._id} material={material} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No notes available</h3>
                    <p className="text-muted-foreground mt-2">
                      There are no note materials available for this topic yet.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                {videoMaterials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoMaterials.map((material) => (
                      <MaterialCard key={material._id} material={material} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No videos available</h3>
                    <p className="text-muted-foreground mt-2">
                      There are no video materials available for this topic yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Topic not found</h3>
            <p className="text-muted-foreground mt-2">The requested topic could not be found.</p>
            <Link href="/materials">
              <Button variant="outline" className="mt-4">
                Back to Materials
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function MaterialCard({ material }: { material: Material }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "note":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "video":
        return <Youtube className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {getIcon(material.type)}
          {material.title}
        </CardTitle>
        <CardDescription>
          {material.type === "pdf" ? "PDF Document" : material.type === "note" ? "Study Notes" : "Video Tutorial"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{material.content}</p>

        {material.type === "pdf" && (
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        )}

        {material.type === "video" && (
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4" />
              Watch Video
            </a>
          </Button>
        )}

        {material.type === "note" && (
          <div
            className="mt-4 p-4 bg-muted rounded-md text-sm prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: material.content }}
          />
        )}
      </CardContent>
    </Card>
  )
}

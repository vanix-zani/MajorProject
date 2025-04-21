"use client"

import { useEffect, useState } from "react"
import { BarChart, LineChart, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import DashboardLayout from "@/components/dashboard-layout"

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
  timeTaken?: number
  createdAt: string
}

interface SubjectPerformance {
  subject: string
  score: number
  total: number
  percentage: number
}

interface MonthlyPerformance {
  month: string
  score: number
  total: number
  percentage: number
}

export default function PerformancePage() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([])
  const [monthlyPerformance, setMonthlyPerformance] = useState<MonthlyPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        // In a real application, these would be actual API calls
        // For demo purposes, we're creating mock data

        // Mock quiz results
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
            timeTaken: 720,
            createdAt: "2023-01-15T10:30:00Z",
          },
          {
            _id: "2",
            quiz: {
              _id: "3",
              title: "Forces and Motion",
              topic: {
                _id: "4",
                name: "Physics",
                subject: { _id: "2", name: "Science" },
              },
            },
            score: 7,
            totalQuestions: 12,
            timeTaken: 950,
            createdAt: "2023-02-05T14:20:00Z",
          },
          {
            _id: "3",
            quiz: {
              _id: "5",
              title: "Grammar Rules",
              topic: {
                _id: "7",
                name: "Grammar",
                subject: { _id: "3", name: "English" },
              },
            },
            score: 15,
            totalQuestions: 20,
            timeTaken: 1500,
            createdAt: "2023-02-20T09:15:00Z",
          },
          {
            _id: "4",
            quiz: {
              _id: "2",
              title: "Geometry Fundamentals",
              topic: {
                _id: "2",
                name: "Geometry",
                subject: { _id: "1", name: "Mathematics" },
              },
            },
            score: 6,
            totalQuestions: 8,
            timeTaken: 600,
            createdAt: "2023-03-10T11:45:00Z",
          },
          {
            _id: "5",
            quiz: {
              _id: "4",
              title: "Elements and Compounds",
              topic: {
                _id: "5",
                name: "Chemistry",
                subject: { _id: "2", name: "Science" },
              },
            },
            score: 12,
            totalQuestions: 15,
            timeTaken: 1100,
            createdAt: "2023-03-25T16:30:00Z",
          },
          {
            _id: "6",
            quiz: {
              _id: "6",
              title: "World War II",
              topic: {
                _id: "9",
                name: "World History",
                subject: { _id: "4", name: "History" },
              },
            },
            score: 10,
            totalQuestions: 15,
            timeTaken: 1200,
            createdAt: "2023-04-05T13:20:00Z",
          },
        ]

        // Calculate subject performance
        const subjectMap = new Map<string, { score: number; total: number }>()

        mockQuizResults.forEach((result) => {
          const subject = result.quiz.topic.subject.name

          if (!subjectMap.has(subject)) {
            subjectMap.set(subject, { score: 0, total: 0 })
          }

          const current = subjectMap.get(subject)!
          current.score += result.score
          current.total += result.totalQuestions
          subjectMap.set(subject, current)
        })

        const mockSubjectPerformance: SubjectPerformance[] = Array.from(subjectMap.entries()).map(
          ([subject, data]) => ({
            subject,
            score: data.score,
            total: data.total,
            percentage: Math.round((data.score / data.total) * 100),
          }),
        )

        // Calculate monthly performance
        const monthMap = new Map<string, { score: number; total: number }>()

        mockQuizResults.forEach((result) => {
          const date = new Date(result.createdAt)
          const month = date.toLocaleString("default", { month: "short" })

          if (!monthMap.has(month)) {
            monthMap.set(month, { score: 0, total: 0 })
          }

          const current = monthMap.get(month)!
          current.score += result.score
          current.total += result.totalQuestions
          monthMap.set(month, current)
        })

        const mockMonthlyPerformance: MonthlyPerformance[] = Array.from(monthMap.entries()).map(([month, data]) => ({
          month,
          score: data.score,
          total: data.total,
          percentage: Math.round((data.score / data.total) * 100),
        }))

        setQuizResults(mockQuizResults)
        setSubjectPerformance(mockSubjectPerformance)
        setMonthlyPerformance(mockMonthlyPerformance)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching performance data:", error)
        setIsLoading(false)
      }
    }

    fetchPerformanceData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Tracking</h1>
          <p className="text-muted-foreground mt-2">Monitor your quiz performance and progress over time</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <PieChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>By Subject</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                  <CardDescription>Your average score across all quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px]">
                      <div className="text-5xl font-bold mb-2">
                        {Math.round(
                          (quizResults.reduce((acc, result) => acc + result.score, 0) /
                            quizResults.reduce((acc, result) => acc + result.totalQuestions, 0)) *
                            100,
                        )}
                        %
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quizResults.reduce((acc, result) => acc + result.score, 0)} correct out of{" "}
                        {quizResults.reduce((acc, result) => acc + result.totalQuestions, 0)} questions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quizzes Taken</CardTitle>
                  <CardDescription>Total number of quizzes completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px]">
                      <div className="text-5xl font-bold mb-2">{quizResults.length}</div>
                      <p className="text-sm text-muted-foreground">
                        Across {new Set(quizResults.map((r) => r.quiz.topic.subject.name)).size} subjects
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Distribution</CardTitle>
                  <CardDescription>Breakdown by subject area</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : (
                    <div className="h-[200px]">
                      <Chart>
                        <ChartContainer>
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={subjectPerformance}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="total"
                                nameKey="subject"
                              >
                                {subjectPerformance.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <ChartTooltip
                                content={
                                  <ChartTooltipContent>
                                    {({ payload }) => {
                                      if (!payload?.length) return null
                                      const data = payload[0].payload as SubjectPerformance
                                      return (
                                        <div>
                                          <ChartTooltipItem label="Subject" value={data.subject} />
                                          <ChartTooltipItem label="Questions" value={data.total} />
                                          <ChartTooltipItem
                                            label="Score"
                                            value={`${data.score} (${data.percentage}%)`}
                                          />
                                        </div>
                                      )
                                    }}
                                  </ChartTooltipContent>
                                }
                              />
                              <ChartLegend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </Chart>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Results</CardTitle>
                <CardDescription>Your performance in the most recent quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : quizResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                        <div className="col-span-5">Quiz</div>
                        <div className="col-span-3">Date</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2 text-center">Time</div>
                      </div>
                      <div className="divide-y">
                        {quizResults.map((result) => (
                          <div key={result._id} className="grid grid-cols-12 gap-2 p-4">
                            <div className="col-span-5">
                              <div className="font-medium">{result.quiz.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {result.quiz.topic.subject.name} - {result.quiz.topic.name}
                              </div>
                            </div>
                            <div className="col-span-3 flex items-center">{formatDate(result.createdAt)}</div>
                            <div className="col-span-2 flex items-center justify-center">
                              <span
                                className={`font-medium ${
                                  (result.score / result.totalQuestions) >= 0.7
                                    ? "text-green-600 dark:text-green-400"
                                    : result.score / result.totalQuestions >= 0.5
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {result.score}/{result.totalQuestions}
                              </span>
                            </div>
                            <div className="col-span-2 flex items-center justify-center text-muted-foreground">
                              {formatTime(result.timeTaken)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">No quiz results yet</h3>
                    <p className="text-muted-foreground mt-2">Take some quizzes to see your performance data.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
                <CardDescription>Your score breakdown across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <Chart>
                      <ChartContainer>
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={subjectPerformance}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" angle={-45} textAnchor="end" height={70} />
                            <YAxis
                              label={{
                                value: "Score (%)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                              domain={[0, 100]}
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent>
                                  {({ payload }) => {
                                    if (!payload?.length) return null
                                    const data = payload[0].payload as SubjectPerformance
                                    return (
                                      <div>
                                        <ChartTooltipItem label="Subject" value={data.subject} />
                                        <ChartTooltipItem
                                          label="Score"
                                          value={`${data.score}/${data.total} (${data.percentage}%)`}
                                        />
                                      </div>
                                    )
                                  }}
                                </ChartTooltipContent>
                              }
                            />
                            <Bar dataKey="percentage" fill="#3b82f6" name="Score (%)" />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </Chart>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-[300px] w-full" />
                  <Skeleton className="h-[300px] w-full" />
                </>
              ) : (
                subjectPerformance.map((subject) => (
                  <Card key={subject.subject}>
                    <CardHeader>
                      <CardTitle>{subject.subject}</CardTitle>
                      <CardDescription>Detailed performance analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Overall Score:</span>
                          <span className="font-medium">{subject.percentage}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Questions Answered:</span>
                          <span>{subject.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Correct Answers:</span>
                          <span>{subject.score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Quizzes Taken:</span>
                          <span>{quizResults.filter((r) => r.quiz.topic.subject.name === subject.subject).length}</span>
                        </div>

                        <div className="pt-4">
                          <h4 className="font-medium mb-2">Topics:</h4>
                          <ul className="space-y-2">
                            {Array.from(
                              new Set(
                                quizResults
                                  .filter((r) => r.quiz.topic.subject.name === subject.subject)
                                  .map((r) => r.quiz.topic.name),
                              ),
                            ).map((topic) => (
                              <li key={topic} className="flex justify-between">
                                <span>{topic}</span>
                                <span>
                                  {Math.round(
                                    (quizResults
                                      .filter((r) => r.quiz.topic.name === topic)
                                      .reduce((acc, r) => acc + r.score, 0) /
                                      quizResults
                                        .filter((r) => r.quiz.topic.name === topic)
                                        .reduce((acc, r) => acc + r.totalQuestions, 0)) *
                                      100,
                                  )}
                                  %
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress Over Time</CardTitle>
                <CardDescription>Your performance trend across months</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="h-[400px]">
                    <Chart>
                      <ChartContainer>
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={monthlyPerformance}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 10,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis
                              label={{
                                value: "Score (%)",
                                angle: -90,
                                position: "insideLeft",
                              }}
                              domain={[0, 100]}
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent>
                                  {({ payload }) => {
                                    if (!payload?.length) return null
                                    const data = payload[0].payload as MonthlyPerformance
                                    return (
                                      <div>
                                        <ChartTooltipItem label="Month" value={data.month} />
                                        <ChartTooltipItem
                                          label="Score"
                                          value={`${data.score}/${data.total} (${data.percentage}%)`}
                                        />
                                      </div>
                                    )
                                  }}
                                </ChartTooltipContent>
                              }
                            />
                            <Line
                              type="monotone"
                              dataKey="percentage"
                              stroke="#3b82f6"
                              name="Score (%)"
                              strokeWidth={2}
                              dot={{ r: 6 }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </Chart>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>Analysis of your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Strengths</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <ul className="space-y-2">
                          {subjectPerformance
                            .filter((s) => s.percentage >= 70)
                            .map((subject) => (
                              <li key={subject.subject} className="flex justify-between">
                                <span>{subject.subject}</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  {subject.percentage}%
                                </span>
                              </li>
                            ))}
                          {subjectPerformance.filter((s) => s.percentage >= 70).length === 0 && (
                            <li className="text-muted-foreground">Keep practicing to develop your strengths!</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Areas for Improvement</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <ul className="space-y-2">
                          {subjectPerformance
                            .filter((s) => s.percentage < 70)
                            .map((subject) => (
                              <li key={subject.subject} className="flex justify-between">
                                <span>{subject.subject}</span>
                                <span
                                  className={`font-medium ${
                                    subject.percentage >= 50
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {subject.percentage}%
                                </span>
                              </li>
                            ))}
                          {subjectPerformance.filter((s) => s.percentage < 70).length === 0 && (
                            <li className="text-muted-foreground">
                              Great job! You're performing well in all subjects.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Progress Trend</h3>
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-muted-foreground">
                          {monthlyPerformance.length >= 2
                            ? monthlyPerformance[monthlyPerformance.length - 1].percentage >
                              monthlyPerformance[0].percentage
                              ? "Your performance is improving over time. Keep up the good work!"
                              : monthlyPerformance[monthlyPerformance.length - 1].percentage <
                                  monthlyPerformance[0].percentage
                                ? "Your performance has decreased slightly. Consider reviewing earlier topics."
                                : "Your performance has been consistent. Try challenging yourself with more difficult quizzes."
                            : "Not enough data to determine a trend. Take more quizzes to see your progress over time."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

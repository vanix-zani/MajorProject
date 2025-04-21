"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft, Clock, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { FlaskConical } from "lucide-react"
import { use } from "react"

interface Option {
  text: string
  isCorrect: boolean
}

interface Question {
  text: string
  options: Option[]
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
  questions: Question[]
  timeLimit?: number
}

export default function QuizPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const quizId = unwrappedParams.id;
  
  const router = useRouter()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<"intro" | "quiz" | "results">("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [results, setResults] = useState<{
    score: number
    totalQuestions: number
    correctAnswers: number[]
    timeTaken: number
  } | null>(null)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // In a real application, this would be an actual API call
        // For demo purposes, we're creating mock data

        // Create mock questions with options
        const createMockQuestions = (count: number): Question[] => {
          return Array(count)
            .fill(null)
            .map((_, i) => ({
              text: `Question ${i + 1}:|a × b|2 + |a.b|2 = 144 and |a| = 4, then |b| is equal to `,
              options: [
                { text: "12", isCorrect: i % 4 === 0 },
                { text: "3", isCorrect: i % 4 === 1 },
                { text: "8", isCorrect: i % 4 === 2 },
                { text: "4", isCorrect: i % 4 === 3 },
              ],
            }))
        }

        // Mock quiz based on ID
        let mockQuiz: Quiz

        switch (quizId) {
          case "1":
            mockQuiz = {
              _id: "1",
              title: "Algebra Basics",
              topic: {
                _id: "1",
                name: "Algebra",
                subject: { _id: "1", name: "Mathematics" },
              },
              description: "Test your knowledge of basic algebraic concepts",
              questions: createMockQuestions(10),
              timeLimit: 15,
            }
            break
          case "2":
            mockQuiz = {
              _id: "2",
              title: "Geometry Fundamentals",
              topic: {
                _id: "2",
                name: "Geometry",
                subject: { _id: "1", name: "Mathematics" },
              },
              description: "Test your understanding of geometric principles",
              questions: createMockQuestions(8),
              timeLimit: 12,
            }
            break
          case "3":
            mockQuiz = {
              _id: "3",
              title: "Forces and Motion",
              topic: {
                _id: "4",
                name: "Physics",
                subject: { _id: "2", name: "Science" },
              },
              description: "Test your knowledge of Newton's laws and motion concepts",
              questions: createMockQuestions(12),
              timeLimit: 20,
            }
            break
          default:
            mockQuiz = {
              _id: quizId,
              title: "Sample Quiz",
              topic: {
                _id: "1",
                name: "Sample Topic",
                subject: { _id: "1", name: "Sample Subject" },
              },
              description: "This is a sample quiz description",
              questions: createMockQuestions(5),
              timeLimit: 10,
            }
        }

        setQuiz(mockQuiz)
        setSelectedAnswers(new Array(mockQuiz.questions.length).fill(""))
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching quiz:", error)
        setIsLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  // Rest of your component remains unchanged
  useEffect(() => {
    // Timer logic for quiz
    if (currentStep === "quiz" && quiz?.timeLimit && timeRemaining !== null) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            handleQuizSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentStep, quiz?.timeLimit, timeRemaining])

  const startQuiz = () => {
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60)
    }
    setQuizStartTime(new Date())
    setCurrentStep("quiz")
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answer
    setSelectedAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuizSubmit = () => {
    if (!quiz) return

    // Calculate results
    let correctCount = 0
    const correctAnswers: number[] = []

    quiz.questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index]
      const correctOptionIndex = question.options.findIndex((option) => option.isCorrect)
      const isCorrect = selectedAnswer === String(correctOptionIndex)

      if (isCorrect) {
        correctCount++
        correctAnswers.push(index)
      }
    })

    // Calculate time taken
    const endTime = new Date()
    const timeTaken = quizStartTime ? Math.floor((endTime.getTime() - quizStartTime.getTime()) / 1000) : 0

    setResults({
      score: correctCount,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeTaken,
    })

    setCurrentStep("results")

    // In a real application, you would save the results to the database here
    toast({
      title: "Quiz completed!",
      description: `You scored ${correctCount} out of ${quiz.questions.length}.`,
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    )
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Quiz not found</h3>
          <p className="text-muted-foreground mt-2">The requested quiz could not be found.</p>
          <Link href="/quizzes">
            <Button variant="outline" className="mt-4">
              Back to Quizzes
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {currentStep === "intro" && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/quizzes">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Quizzes
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <CardDescription>
                {quiz.topic.subject.name} - {quiz.topic.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{quiz.description}</p>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time Limit</p>
                    <p className="text-sm text-muted-foreground">{quiz.timeLimit} minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-sm text-muted-foreground">{quiz.questions.length} multiple choice</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Instructions:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Read each question carefully before answering.</li>
                  <li>Select the best answer from the given options.</li>
                  <li>You can navigate between questions using the previous and next buttons.</li>
                  <li>The timer will start once you begin the quiz.</li>
                  <li>Submit your answers before the time runs out.</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startQuiz} className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {currentStep === "quiz" && (
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </CardTitle>
                <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="w-32 h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg font-medium">{quiz.questions[currentQuestionIndex].text}</p>

              <RadioGroup
                value={selectedAnswers[currentQuestionIndex]}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                    <RadioGroupItem value={String(index)} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                Previous
              </Button>

              {currentQuestionIndex < quiz.questions.length - 1 ? (
                <Button onClick={goToNextQuestion}>Next</Button>
              ) : (
                <Button onClick={handleQuizSubmit}>Submit Quiz</Button>
              )}
            </CardFooter>
          </Card>

          <div className="mt-6 flex justify-center">
            <div className="flex flex-wrap gap-2 max-w-md">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[index] ? "default" : "outline"}
                  size="sm"
                  className="w-10 h-10 p-0"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === "results" && results && (
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/quizzes">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Quizzes
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <CardDescription>
                {quiz.title} - {quiz.topic.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {results.score}/{results.totalQuestions}
                </div>
                <p className="text-muted-foreground">
                  You answered {results.score} out of {results.totalQuestions} questions correctly.
                </p>
                <div className="mt-4 flex justify-center">
                  <Progress value={(results.score / results.totalQuestions) * 100} className="w-64 h-3" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Time taken: {formatTime(results.timeTaken)}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Question Review</h3>

                {quiz.questions.map((question, index) => {
                  const selectedAnswer = selectedAnswers[index]
                  const correctOptionIndex = question.options.findIndex((option) => option.isCorrect)
                  const isCorrect = selectedAnswer === String(correctOptionIndex)

                  return (
                    <Card
                      key={index}
                      className={`border ${isCorrect ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800"}`}
                    >
                      <CardHeader className="py-3 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-base">Question {index + 1}</CardTitle>
                          <CardDescription>{question.text}</CardDescription>
                        </div>
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </CardHeader>
                      <CardContent className="py-2">
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded-md ${
                                String(optIndex) === selectedAnswer && !isCorrect
                                  ? "bg-red-100 dark:bg-red-900/20"
                                  : option.isCorrect
                                    ? "bg-green-100 dark:bg-green-900/20"
                                    : ""
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="mr-2">
                                  {String(optIndex) === selectedAnswer && !isCorrect && (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  {option.isCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                </div>
                                <span>{option.text}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/quizzes")}>
                Back to Quizzes
              </Button>
              <Button className="w-full sm:w-auto" onClick={() => router.push("/performance")}>
                View Performance
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
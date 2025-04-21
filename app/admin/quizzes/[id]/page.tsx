"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

const optionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
})

const questionSchema = z.object({
  text: z.string().min(5, "Question text must be at least 5 characters"),
  options: z.array(optionSchema).min(2, "At least 2 options are required"),
})

const quizFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  timeLimit: z.string().refine(
    (val) => {
      const num = Number.parseInt(val)
      return !isNaN(num) && num > 0
    },
    {
      message: "Time limit must be a positive number",
    },
  ),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
})

export default function QuizFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [topics, setTopics] = useState<{ _id: string; name: string; subject: { name: string } }[]>([])
  const isNewQuiz = params.id === "new"

  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: "",
      topic: "",
      description: "",
      timeLimit: "15",
      questions: [
        {
          text: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  })

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  })

  useEffect(() => {
    const fetchTopicsAndQuiz = async () => {
      try {
        // In a real application, these would be actual API calls
        // For demo purposes, we're creating mock data

        // Mock topics
        const mockTopics = [
          { _id: "1", name: "Algebra", subject: { name: "Mathematics" } },
          { _id: "2", name: "Geometry", subject: { name: "Mathematics" } },
          { _id: "3", name: "Trigonometry", subject: { name: "Mathematics" } },
          { _id: "4", name: "Physics", subject: { name: "Science" } },
          { _id: "5", name: "Chemistry", subject: { name: "Science" } },
          { _id: "6", name: "Biology", subject: { name: "Science" } },
          { _id: "7", name: "Grammar", subject: { name: "English" } },
          { _id: "8", name: "Literature", subject: { name: "English" } },
          { _id: "9", name: "World History", subject: { name: "History" } },
          { _id: "10", name: "Civics", subject: { name: "History" } },
        ]

        setTopics(mockTopics)

        if (!isNewQuiz) {
          // Mock quiz data
          const mockQuiz = {
            _id: params.id,
            title: "Algebra Basics",
            topic: "1",
            description: "Test your knowledge of basic algebraic concepts",
            timeLimit: "15",
            questions: [
              {
                text: "What is the value of x in the equation 2x + 5 = 15?",
                options: [
                  { text: "5", isCorrect: true },
                  { text: "7", isCorrect: false },
                  { text: "10", isCorrect: false },
                  { text: "8", isCorrect: false },
                ],
              },
              {
                text: "Which of the following is a quadratic equation?",
                options: [
                  { text: "y = 2x + 3", isCorrect: false },
                  { text: "y = x² + 2x + 1", isCorrect: true },
                  { text: "y = 3x", isCorrect: false },
                  { text: "y = 1/x", isCorrect: false },
                ],
              },
            ],
          }

          form.reset({
            title: mockQuiz.title,
            topic: mockQuiz.topic,
            description: mockQuiz.description,
            timeLimit: mockQuiz.timeLimit,
            questions: mockQuiz.questions,
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTopicsAndQuiz()
  }, [params.id, form, isNewQuiz, toast])

  async function onSubmit(values: z.infer<typeof quizFormSchema>) {
    // Validate that at least one option is marked as correct for each question
    const validQuestions = values.questions.every((question) => question.options.some((option) => option.isCorrect))

    if (!validQuestions) {
      toast({
        title: "Validation Error",
        description: "Each question must have at least one correct answer.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // In a real application, this would be an actual API call
      // For demo purposes, we're just simulating a successful update

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isNewQuiz ? "Quiz created" : "Quiz updated",
        description: isNewQuiz ? "The quiz has been created successfully." : "The quiz has been updated successfully.",
      })

      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: isNewQuiz
          ? "Failed to create quiz. Please try again."
          : "Failed to update quiz. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addQuestion = () => {
    appendQuestion({
      text: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/admin">
              <ChevronLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNewQuiz ? "Create Quiz" : "Edit Quiz"}</h1>
          <p className="text-muted-foreground mt-2">
            {isNewQuiz
              ? "Create a new quiz for students to test their knowledge"
              : "Update the details and questions of an existing quiz"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isNewQuiz ? "Quiz Details" : "Edit Quiz"}</CardTitle>
            <CardDescription>
              Fill in the information below to {isNewQuiz ? "create a new quiz" : "update this quiz"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Algebra Basics" {...field} />
                        </FormControl>
                        <FormDescription>The title of the quiz as it will appear to students.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {topics.map((topic) => (
                              <SelectItem key={topic._id} value={topic._id}>
                                {topic.name} ({topic.subject.name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>The topic this quiz is related to.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a brief description of the quiz..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>A short description of what students will be tested on.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>The time limit for completing the quiz in minutes.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Questions</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>

                  {questionFields.map((questionField, questionIndex) => (
                    <Card key={questionField.id} className="border-dashed">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                          {questionFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(questionIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Question Text</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormLabel>Options</FormLabel>
                          <FormDescription>Mark at least one option as correct.</FormDescription>

                          {[0, 1, 2, 3].map((optionIndex) => (
                            <div key={optionIndex} className="flex items-start space-x-3">
                              <FormField
                                control={form.control}
                                name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-3 space-y-0 pt-2">
                                    <FormControl>
                                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`questions.${questionIndex}.options.${optionIndex}.text`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
              {isSaving ? "Saving..." : isNewQuiz ? "Create Quiz" : "Update Quiz"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

const subjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Subject name must be at least 2 characters.",
  }),
  class: z.string().refine(
    (val) => {
      const num = Number.parseInt(val)
      return num >= 6 && num <= 12
    },
    {
      message: "Class must be between 6 and 12.",
    },
  ),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

export default function SubjectFormPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const isNewSubject = params.id === "new"

  const form = useForm<z.infer<typeof subjectFormSchema>>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      class: "",
      description: "",
    },
  })

  useEffect(() => {
    const fetchSubject = async () => {
      if (isNewSubject) {
        setIsLoading(false)
        return
      }

      try {
        // In a real application, this would be an actual API call
        // For demo purposes, we're creating mock data

        // Mock subject data
        const mockSubject = {
          _id: params.id,
          name: "Mathematics",
          class: "10",
          description: "Algebra, Geometry, and more",
        }

        form.reset({
          name: mockSubject.name,
          class: mockSubject.class,
          description: mockSubject.description,
        })

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching subject:", error)
        toast({
          title: "Error",
          description: "Failed to load subject data. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchSubject()
  }, [params.id, form, isNewSubject, toast])

  async function onSubmit(values: z.infer<typeof subjectFormSchema>) {
    setIsSaving(true)

    try {
      // In a real application, this would be an actual API call
      // For demo purposes, we're just simulating a successful update

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isNewSubject ? "Subject created" : "Subject updated",
        description: isNewSubject
          ? "The subject has been created successfully."
          : "The subject has been updated successfully.",
      })

      router.push("/admin")
    } catch (error) {
      toast({
        title: "Error",
        description: isNewSubject
          ? "Failed to create subject. Please try again."
          : "Failed to update subject. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">{isNewSubject ? "Add Subject" : "Edit Subject"}</h1>
          <p className="text-muted-foreground mt-2">
            {isNewSubject ? "Create a new subject for students to study" : "Update the details of an existing subject"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isNewSubject ? "Subject Details" : "Edit Subject"}</CardTitle>
            <CardDescription>
              Fill in the information below to {isNewSubject ? "create a new subject" : "update this subject"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Mathematics" {...field} />
                      </FormControl>
                      <FormDescription>The name of the subject as it will appear to students.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[6, 7, 8, 9, 10, 11, 12].map((classNum) => (
                            <SelectItem key={classNum} value={classNum.toString()}>
                              Class {classNum}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>The class level for which this subject is intended.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a brief description of the subject..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A short description of what students will learn in this subject.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
              {isSaving ? "Saving..." : isNewSubject ? "Create Subject" : "Update Subject"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

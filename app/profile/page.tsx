"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
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
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(6, {
      message: "New password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export default function ProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      class: "",
    },
  })

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (session?.user) {
      profileForm.reset({
        name: session.user.name,
        email: session.user.email,
        class: String(session.user.class),
      })
      setIsLoading(false)
    }
  }, [session, profileForm])

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true)

    try {
      // In a real application, this would be an actual API call
      // For demo purposes, we're just simulating a successful update

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsChangingPassword(true)

    try {
      // In a real application, this would be an actual API call
      // For demo purposes, we're just simulating a successful update

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })

      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your class" />
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
                          <FormDescription>This determines which study materials are available to you.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>Password must be at least 6 characters.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>View your account details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                    <p className="mt-1">{session?.user?.role === "admin" ? "Administrator" : "Student"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                    <p className="mt-1">{session?.user?.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Joined</h3>
                    <p className="mt-1">January 1, 2023</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
                    <p className="mt-1">Today at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">Need help? Contact support at support@edumanage.com</p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

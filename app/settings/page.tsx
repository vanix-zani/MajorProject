"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [quizReminders, setQuizReminders] = useState(true)
  const [newMaterialAlerts, setNewMaterialAlerts] = useState(true)
  const [performanceReports, setPerformanceReports] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // In a real application, this would be an actual API call
      // For demo purposes, we're just simulating a successful update

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your application preferences and notifications</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      setTheme("dark")
                      console.log("dark")
                    }
                    }
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="quiz-reminders">Quiz Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminders about upcoming and pending quizzes</p>
                </div>
                <Switch id="quiz-reminders" checked={quizReminders} onCheckedChange={setQuizReminders} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-material-alerts">New Material Alerts</Label>
                  <p className="text-sm text-muted-foreground">Be notified when new study materials are added</p>
                </div>
                <Switch id="new-material-alerts" checked={newMaterialAlerts} onCheckedChange={setNewMaterialAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="performance-reports">Weekly Performance Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly reports of your learning progress</p>
                </div>
                <Switch id="performance-reports" checked={performanceReports} onCheckedChange={setPerformanceReports} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="share-progress">Share Progress with Teachers</Label>
                  <p className="text-sm text-muted-foreground">Allow teachers to view your learning progress</p>
                </div>
                <Switch id="share-progress" defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-profile">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Make your profile visible to other students</p>
                </div>
                <Switch id="public-profile" defaultChecked={false} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

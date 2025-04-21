"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { BookOpen, GraduationCap, Home, LineChart, LogOut, Settings, TestTube, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AppSidebar() {
  const pathname = usePathname()
  const { toast } = useToast()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="pb-0">
        <div className="flex items-center gap-2 px-4 py-2">
          <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold">EduManage</h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/materials") || pathname.startsWith("/materials")}>
              <Link href="/materials">
                <BookOpen />
                <span>Study Materials</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/quizzes") || pathname.startsWith("/quizzes")}>
              <Link href="/quizzes">
                <TestTube />
                <span>Quizzes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/performance") || pathname.startsWith("/performance")}>
              <Link href="/performance">
                <LineChart />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/profile")}>
              <Link href="/profile">
                <User />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/settings")}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarSeparator />

          <SidebarMenuItem>
            <Button variant="ghost" className="w-full justify-start px-2 gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

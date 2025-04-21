"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { DatabaseStatus } from "@/components/database-status"
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 border-r">
          <div className="p-4">
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-64 w-full mt-8 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        
      <AppSidebar />
      <SidebarInset>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>{/* Page title is rendered by the page component */}</div>
            <DatabaseStatus />
          </div>
          {children}
        </div>
      </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

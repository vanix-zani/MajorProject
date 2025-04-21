"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, RefreshCw } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState("")
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    setStatus("loading")

    try {
      const response = await fetch("/api/test-db")
      const data = await response.json()

      if (response.ok) {
        setStatus("connected")
        setMessage(`Connected (${data.userCount} users)`)
      } else {
        setStatus("error")
        setMessage(data.error || "Unknown error")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to check connection")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={status === "connected" ? "default" : status === "error" ? "destructive" : "outline"}
        className="gap-1"
      >
        <Database className="h-3 w-3" />
        {status === "loading" ? "Checking..." : status === "connected" ? message : "Connection Error"}
      </Badge>

      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={checkConnection} disabled={isChecking}>
        <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
        <span className="sr-only">Refresh connection status</span>
      </Button>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [details, setDetails] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [uriValidation, setUriValidation] = useState<any>(null)

  const checkConnection = async () => {
    setIsChecking(true)
    setStatus("loading")

    try {
      // Check environment variables
      const envResponse = await fetch("/api/verify-env")
      const envData = await envResponse.json()
      setEnvStatus(envData)

      // Validate URI format
      const uriResponse = await fetch("/api/validate-mongodb-uri")
      const uriData = await uriResponse.json()
      setUriValidation(uriData)

      // Test actual connection
      const response = await fetch("/api/test-mongodb")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
      } else {
        setStatus("error")
      }

      setDetails(data)
    } catch (error) {
      setStatus("error")
      setDetails({ error: "Failed to check connection" })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Database Status</h1>
            <p className="text-muted-foreground mt-2">Check and troubleshoot your MongoDB connection</p>
          </div>
          <Button onClick={checkConnection} disabled={isChecking}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mt-2">
                {status === "loading" ? (
                  <Badge variant="outline" className="gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Checking...
                  </Badge>
                ) : status === "connected" ? (
                  <Badge variant="default" className="bg-green-500 gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Connection Error
                  </Badge>
                )}
              </div>

              {status === "connected" && details && (
                <div className="mt-4 text-sm space-y-2">
                  <div>
                    <strong>Database:</strong> {details.connection?.name}
                  </div>
                  <div>
                    <strong>Host:</strong> {details.connection?.host}
                  </div>
                  <div>
                    <strong>Mongoose Version:</strong> {details.version}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              {envStatus ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <strong>MONGODB_URI:</strong>
                    {envStatus.mongodbUriExists ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Set
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Not Set
                      </Badge>
                    )}
                  </div>

                  {envStatus.mongodbUriExists && (
                    <div className="text-sm text-muted-foreground">Preview: {envStatus.mongodbUriPreview}</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Loading environment information...</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">URI Validation</CardTitle>
            </CardHeader>
            <CardContent>
              {uriValidation ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <strong>Format:</strong>
                    {uriValidation.valid ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                        Invalid
                      </Badge>
                    )}
                  </div>

                  {uriValidation.format && (
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Protocol:</strong> {uriValidation.format.protocol}
                      </div>
                      <div>
                        <strong>Host:</strong> {uriValidation.format.host}
                      </div>
                      <div>
                        <strong>Database:</strong> {uriValidation.format.database || "Not specified"}
                      </div>
                      <div>
                        <strong>Credentials:</strong> {uriValidation.format.hasCredentials ? "Present" : "Missing"}
                      </div>
                    </div>
                  )}

                  {uriValidation.suggestions && (
                    <div className="text-sm text-amber-500 mt-2">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      {uriValidation.suggestions}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Validating URI format...</div>
              )}
            </CardContent>
          </Card>
        </div>

        {status === "error" && details && (
          <Alert variant="destructive">
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <div>
                  <strong>Error Type:</strong> {details.error}
                </div>
                <div>
                  <strong>Message:</strong> {details.message}
                </div>
                {details.code && (
                  <div>
                    <strong>Code:</strong> {details.code}
                  </div>
                )}

                <div className="mt-4">
                  <strong>Troubleshooting Steps:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Check if your MongoDB Atlas cluster is running</li>
                    <li>Verify that your IP address is whitelisted in MongoDB Atlas Network Access</li>
                    <li>Confirm your username and password are correct</li>
                    <li>Make sure your database name is specified in the URI</li>
                    <li>Check if your MongoDB Atlas user has the appropriate permissions</li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>MongoDB Connection Troubleshooting Guide</CardTitle>
            <CardDescription>Common issues and solutions for MongoDB connection problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">1. Correct MongoDB URI Format</h3>
                <p className="text-sm text-muted-foreground mt-1">Your MongoDB URI should follow this format:</p>
                <pre className="bg-muted p-2 rounded-md text-xs mt-2 overflow-x-auto">
                  mongodb+srv://&lt;username&gt;:&lt;password&gt;@&lt;cluster-address&gt;/&lt;database-name&gt;?retryWrites=true&w=majority
                </pre>
              </div>

              <div>
                <h3 className="font-medium">2. Network Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  If you're using MongoDB Atlas, make sure your current IP address is whitelisted:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                  <li>Go to MongoDB Atlas dashboard</li>
                  <li>Navigate to "Network Access" under Security</li>
                  <li>Add your current IP address or set it to allow access from anywhere (0.0.0.0/0) for testing</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium">3. Authentication Issues</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Make sure your username and password are correct and properly URL-encoded.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Special characters in your password (like @, %, /, etc.) need to be URL-encoded.
                </p>
              </div>

              <div>
                <h3 className="font-medium">4. Database User Permissions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ensure your MongoDB user has the appropriate roles (at least readWrite on your database).
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              For more help, refer to the{" "}
              <a
                href="https://docs.mongodb.com/guides/cloud/connectionstring/"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                MongoDB Connection String Documentation
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

"use client"

import type React from "react"

import { useAuth, type UserRole } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const authData = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { user, loading, initialized } = authData
  const router = useRouter()

  useEffect(() => {
    // Only run redirect logic after auth is initialized and not already redirecting
    if (!initialized || isRedirecting) return

    if (!loading) {
      if (!user) {
        setIsRedirecting(true)
        router.push("/login")
        return
      }

      // Allow guest users to access public routes
      if (user.role === "guest") {
        return
      }

      if (!allowedRoles.includes(user.role)) {
        setIsRedirecting(true)
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
          case "admin":
            router.push("/admin")
            break
          case "teacher":
            router.push("/teacher")
            break
          case "parent":
            router.push("/parent")
            break
          case "student":
            router.push("/student")
            break
          default:
            router.push("/login")
        }
      }
    }
  }, [user, loading, initialized, allowedRoles, router, isRedirecting])

  // Show loading while auth is initializing or loading
  if (!initialized || loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!initialized ? "Initializing..." : isRedirecting ? "Redirecting..." : "Loading..."}
          </p>
        </div>
      </div>
    )
  }

  // Show loading if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Show loading if user doesn't have permission (will redirect)
  if (!allowedRoles.includes(user.role) && user.role !== "guest") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

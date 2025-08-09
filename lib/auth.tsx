"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Update the UserRole type to include guest
export type UserRole = "admin" | "teacher" | "parent" | "student" | "guest"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  schoolId?: string
  studentId?: string // For parents - which student they're linked to
  classId?: string // For teachers - which class they teach
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  initialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample users for demonstration
const SAMPLE_USERS: User[] = [
  {
    id: "1",
    email: "admin@mwanacheck.com",
    name: "John Admin",
    role: "admin",
    schoolId: "school1",
  },
  {
    id: "2",
    email: "teacher@mwanacheck.com",
    name: "Mary Teacher",
    role: "teacher",
    schoolId: "school1",
    classId: "class1",
  },
  {
    id: "3",
    email: "parent@mwanacheck.com",
    name: "David Parent",
    role: "parent",
    schoolId: "school1",
    studentId: "student1",
  },
  {
    id: "4",
    email: "student@mwanacheck.com",
    name: "Alice Student",
    role: "student",
    schoolId: "school1",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const context = useContext(AuthContext)

  useEffect(() => {
    // Check for stored auth token
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("mwanacheck_user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("mwanacheck_user")
      } finally {
        setInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const foundUser = SAMPLE_USERS.find((u) => u.email === email)

      if (foundUser && password === "password123") {
        setUser(foundUser)
        localStorage.setItem("mwanacheck_user", JSON.stringify(foundUser))

        // Redirect based on role
        switch (foundUser.role) {
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
        }

        setLoading(false)
        return true
      }

      setLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mwanacheck_user")
    router.push("/login")
  }

  // Always provide a valid context value
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    loading,
    initialized,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  // If context is undefined, provide a safe fallback instead of throwing
  if (context === undefined) {
    console.warn("useAuth called outside of AuthProvider, providing fallback")
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      loading: false,
      initialized: true,
    }
  }

  return context
}

// Safe hook that can be used anywhere without context
export function useSafeAuth() {
  const context = useContext(AuthContext)

  // If context is undefined, provide a safe fallback instead of throwing
  if (context === undefined) {
    console.warn("Auth context not available, using fallback")
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      loading: false,
      initialized: true,
    }
  }

  return context
}

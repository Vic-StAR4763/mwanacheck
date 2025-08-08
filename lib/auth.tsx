"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { auth } from "./firebase"
import { subscribeToAuthState, firebaseSignInWithEmail, firebaseSignOut } from "./firebase-auth-client"
import { ensureSchoolByName, getUserProfile } from "./firestore"
import type { UserProfile, UserRole } from "./models"

// Keep the same public API as before for the rest of the app
export type { UserRole } from "./models"

export interface User extends UserProfile {}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  initialized: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const refreshUser = async () => {
    if (!auth?.currentUser) return
    
    try {
      const profile = await getUserProfile(auth.currentUser.uid)
      if (profile) {
        setUser(profile)
      }
    } catch (e) {
      console.warn("Failed to refresh user profile:", e)
    }
  }

  useEffect(() => {
    // Subscribe to Firebase auth state
    const unsubscribe = subscribeToAuthState(async (fbUser) => {
      if (!fbUser) {
        setUser(null)
        setInitialized(true)
        return
      }

      // Load Firestore profile with role and schoolId
      try {
        const profile = await getUserProfile(fbUser.uid)
        if (profile) {
          setUser(profile)
        } else {
          // If profile missing, create a minimal fallback so app doesn't break.
          // Default role: parent; schoolId unknown -> empty string. You can improve onboarding later.
          const minimal: User = {
            uid: fbUser.uid,
            email: fbUser.email || "",
            name: fbUser.displayName || "User",
            role: "parent",
            schoolId: "",
          }
          setUser(minimal)
        }
      } catch (e) {
        console.warn("Failed to load user profile:", e)
        setUser({
          uid: fbUser.uid,
          email: fbUser.email || "",
          name: fbUser.displayName || "User",
          role: "parent",
          schoolId: "",
        })
      } finally {
        setInitialized(true)
      }
    })
    return () => unsubscribe && unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Check for demo users first
      const demoUsers = [
        { email: "admin@mwanacheck.com", role: "admin" as UserRole, name: "Admin User" },
        { email: "teacher@mwanacheck.com", role: "teacher" as UserRole, name: "Teacher User" },
        { email: "parent@mwanacheck.com", role: "parent" as UserRole, name: "Parent User" },
        { email: "student@mwanacheck.com", role: "student" as UserRole, name: "Student User" },
      ]
      
      const demoUser = demoUsers.find(u => u.email === email)
      if (demoUser && password === "password123") {
        // For demo users, don't try to connect to Firebase
        // Create demo user profile directly
        let schoolId = "demo-school-1"
        
        // Try to ensure school exists, but don't fail if Firebase is offline
        try {
          if (auth && db) {
            schoolId = await ensureSchoolByName("MwanaCheck Demo School")
          }
        } catch (e) {
          console.warn("Could not create school (offline mode):", e)
        }
        
        // Set user directly for demo
        const demoProfile: User = {
          uid: `demo-${demoUser.role}`,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
          schoolId,
          studentId: demoUser.role === "student" ? "demo-student-1" : null,
        }
        
        setUser(demoProfile)
        setInitialized(true)
        return true
      }

      // Only try Firebase auth for non-demo users
      if (!auth) {
        throw new Error("Firebase is not configured. Please check your environment variables.")
      }

      const cred = await firebaseSignInWithEmail(email, password)
      if (!cred) return false
      // After sign-in, listener will populate user
      return true
    } catch (e) {
      console.error("Login error:", e)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (user?.uid?.startsWith('demo-')) {
      // For demo users, just clear the state
      setUser(null)
      return
    }
    
    firebaseSignOut().catch(() => {})
    setUser(null)
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      loading,
      initialized,
      refreshUser,
    }),
    [user, loading, initialized]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // Safe fallback to avoid crashes if used outside provider
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      loading: false,
      initialized: true,
      refreshUser: async () => {},
    } as AuthContextType
  }
  return ctx
}

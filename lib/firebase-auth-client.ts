"use client"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type UserCredential,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

// Safe wrappers around Firebase Auth. They no-op if Firebase isn't configured yet.
export async function firebaseSignInWithEmail(email: string, password: string): Promise<UserCredential | null> {
  if (!auth) {
    console.warn("Firebase not configured. Skipping sign-in.")
    return null
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === 'auth/network-request-failed') {
      throw new Error("Network error. Please check your internet connection.")
    } else if (error.code === 'auth/user-not-found') {
      throw new Error("No account found with this email address.")
    } else if (error.code === 'auth/wrong-password') {
      throw new Error("Incorrect password.")
    } else if (error.code === 'auth/invalid-email') {
      throw new Error("Invalid email address.")
    } else if (error.code === 'auth/user-disabled') {
      throw new Error("This account has been disabled.")
    }
    throw error
  }
}

export async function firebaseCreateUserWithEmail(
  name: string,
  email: string,
  password: string,
  extra: { role?: string; schoolId?: string } = {},
): Promise<UserCredential | null> {
  if (!auth) {
    console.warn("Firebase not configured. Skipping sign-up.")
    return null
  }
  
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)

    // Optional: set displayName
    try {
      await updateProfile(cred.user, { displayName: name })
    } catch {
      // ignore profile update error
    }

    // Optional: create a user profile document in Firestore
    if (db) {
      try {
        await setDoc(
          doc(db, "users", cred.user.uid),
          {
            uid: cred.user.uid,
            name,
            email,
            role: extra.role || "parent",
            schoolId: extra.schoolId || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )
      } catch (e) {
        console.warn("Failed to create Firestore user profile:", e)
      }
    }

    return cred
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === 'auth/network-request-failed') {
      throw new Error("Network error. Please check your internet connection.")
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error("An account with this email already exists.")
    } else if (error.code === 'auth/weak-password') {
      throw new Error("Password should be at least 6 characters.")
    } else if (error.code === 'auth/invalid-email') {
      throw new Error("Invalid email address.")
    }
    throw error
  }
}

export async function firebaseSignOut(): Promise<void> {
  if (!auth) {
    console.warn("Firebase not configured. Skipping sign-out.")
    return
  }
  
  try {
    await signOut(auth)
  } catch (error: any) {
    if (error.code === 'auth/network-request-failed') {
      console.warn("Network error during sign out, clearing local state anyway")
    }
    // Continue with sign out even if there's a network error
  }
}

export function subscribeToAuthState(callback: (user: import("firebase/auth").User | null) => void) {
  if (!auth) {
    // Call back once with null (no user) to avoid dangling listeners in unconfigured state
    callback(null)
    return () => {}
  }
  
  try {
    return onAuthStateChanged(auth, callback)
  } catch (error) {
    console.warn("Error subscribing to auth state:", error)
    callback(null)
    return () => {}
  }
}

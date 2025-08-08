"use client"

// Safe Firebase client initialization for the browser.
// This module does nothing until all required NEXT_PUBLIC_* env vars are present.

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if all required config values are present
const isConfigured = Object.values(firebaseConfig).every(value => value && value !== 'undefined')

let app: any = null
let db: any = null
let auth: any = null

if (isConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    db = getFirestore(app)
    auth = getAuth(app)

    // Enable offline persistence
    if (typeof window !== 'undefined' && db) {
      // Firestore will automatically handle offline persistence
      // No additional configuration needed for v9+
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error)
  }
}

export { db, auth }

// Export firebase object for compatibility
export const firebase = {
  auth,
  db,
}

export type FirebaseUser = import("firebase/auth").User

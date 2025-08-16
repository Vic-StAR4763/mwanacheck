import { createClient } from "@supabase/supabase-js"

// Environment variable validation with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Only throw error in production
if (
  typeof window !== "undefined" &&
  (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
) {
  console.warn("Supabase environment variables not configured. Using fallback values for development.")
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Client-side Supabase client
export function createClientComponentClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Server-side Supabase client
export function createServerComponentClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Database types
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "parent" | "student"
  school_id?: string
  phone?: string
  address?: string
  status: "active" | "inactive" | "suspended"
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  date_of_birth?: string
  admission_number: string
  school_id: string
  class_id?: string
  parent_id?: string
  user_id?: string
  gpa: number
  discipline_points: number
  status: "active" | "inactive" | "suspended" | "graduated"
  gender?: string
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  type: string
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  student_id: string
  subject_id: string
  teacher_id?: string
  grade: number
  max_grade: number
  assessment_type: string
  assessment_date: string
  comments?: string
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  reason?: string
  marked_by?: string
  created_at: string
  updated_at: string
}

export interface DisciplineRecord {
  id: string
  student_id: string
  reported_by?: string
  incident_type: string
  description: string
  action_taken?: string
  points_deducted: number
  incident_date: string
  status: "pending" | "resolved" | "escalated"
  created_at: string
  updated_at: string
}

export interface MeritAward {
  id: string
  student_id: string
  awarded_by?: string
  award_type: string
  description: string
  points_awarded: number
  award_date: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  student_id: string
  amount: number
  payment_type: string
  description?: string
  payment_method?: string
  payment_date: string
  due_date?: string
  status: "pending" | "paid" | "overdue" | "partial"
  reference_number?: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  grade_level: string
  teacher_id?: string
  capacity: number
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  school_id: string
  name: string
  code: string
  description?: string
  created_at: string
  updated_at: string
}

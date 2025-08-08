export type UserRole = "admin" | "teacher" | "parent" | "student"

export interface UserProfile {
  uid: string
  email: string
  name: string
  role: UserRole
  schoolId: string
  classId?: string | null // for teachers - which class they teach
  studentId?: string | null // for parents - which student they're linked to, for students - their own ID
  createdAt?: any
  updatedAt?: any
}

export interface School {
  id: string // slug
  name: string
  address: string
  contact: {
    email: string
    phone: string
  }
  type: string
  disciplineRules: {
    rule: string
    pointsDeducted: number
  }[]
  createdAt?: any
  updatedAt?: any
}

export interface StudentRecord {
  id: string
  name: string
  email?: string
  schoolId: string
  classId?: string
  guardians?: string[] // array of parent user uids - changed from parentIds
  disciplinePoints?: number // starts at 100 by default
  feeBalance?: number
  academicPerformance?: {
    subjects: {
      name: string
      grade: string
      score: number
    }[]
    gpa: number
    term: string
  }
  merits?: {
    id: string
    title: string
    description: string
    points: number
    date: string
    awardedBy: string
  }[]
  disciplineHistory?: {
    id: string
    incident: string
    pointsDeducted: number
    date: string
    reportedBy: string
  }[]
  coCurrenticular?: {
    activity: string
    performance: string
    position?: string
  }[]
  createdAt?: any
  updatedAt?: any
}

export interface Class {
  id: string
  name: string
  teacherId: string
  schoolId: string
  students: string[]
  createdAt?: any
  updatedAt?: any
}

export interface Merit {
  id: string
  studentId: string
  schoolId: string
  title: string
  description: string
  points: number
  awardedBy: string
  awardedByName: string
  date: string
  createdAt?: any
}

export interface DisciplineReport {
  id: string
  studentId: string
  schoolId: string
  incident: string
  description: string
  pointsDeducted: number
  reportedBy: string
  reportedByName: string
  date: string
  createdAt?: any
}

// New models for the discipline system
export interface Offence {
  id: string
  schoolId: string
  name: string
  description: string
  pointsToDeduct: number
  createdAt?: any
  updatedAt?: any
}

export interface DisciplineRecord {
  id: string
  schoolId: string
  studentId: string
  teacherId: string
  teacherName: string
  offenceId: string
  offenceName: string
  offenceDescription: string
  pointsDeducted: number
  date: string
  createdAt?: any
}

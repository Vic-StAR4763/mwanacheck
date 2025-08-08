// Sample data structure for the application

export interface Student {
  id: string
  name: string
  email: string
  classId: string
  parentIds: string[] // Array of parent user UIDs
  schoolId: string
  academicPerformance: {
    subjects: {
      name: string
      grade: string
      score: number
    }[]
    gpa: number
    term: string
  }
  disciplinePoints: number
  merits: {
    id: string
    title: string
    description: string
    points: number
    date: string
    awardedBy: string
  }[]
  disciplineHistory: {
    id: string
    incident: string
    pointsDeducted: number
    date: string
    reportedBy: string
  }[]
  feeBalance: number
  coCurrenticular: {
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

export interface School {
  id: string
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

// Sample data
export const SAMPLE_STUDENTS: Student[] = [
  {
    id: "student1",
    name: "Sheila Mueni",
    email: "sheilamueni@gmail.com",
    classId: "class1",
    parentIds: ["parent1"],
    schoolId: "mwanacheck-high-school",
    academicPerformance: {
      subjects: [
        { name: "Mathematics", grade: "A", score: 85 },
        { name: "English", grade: "B+", score: 78 },
        { name: "Science", grade: "A-", score: 82 },
        { name: "History", grade: "B", score: 75 },
      ],
      gpa: 3.2,
      term: "Term 2, 2024",
    },
    disciplinePoints: 85, // Out of 100
    merits: [
      {
        id: "merit1",
        title: "Academic Excellence",
        description: "Top performer in Mathematics",
        points: 10,
        date: "2024-01-15",
        awardedBy: "Mary Teacher",
      },
      {
        id: "merit2",
        title: "Leadership",
        description: "Class monitor duties",
        points: 5,
        date: "2024-01-10",
        awardedBy: "Mary Teacher",
      },
    ],
    disciplineHistory: [
      {
        id: "discipline1",
        incident: "Late to class",
        pointsDeducted: 5,
        date: "2024-01-20",
        reportedBy: "Mary Teacher",
      },
    ],
    feeBalance: 15000, // KES
    coCurrenticular: [
      { activity: "Football", performance: "Excellent", position: "Captain" },
      { activity: "Debate Club", performance: "Good" },
    ],
  },
]

export const SAMPLE_CLASSES: Class[] = [
  {
    id: "class1",
    name: "Form 4A",
    teacherId: "teacher1",
    schoolId: "mwanacheck-high-school",
    students: ["student1"],
  },
]

export const SAMPLE_SCHOOLS: School[] = [
  {
    id: "mwanacheck-high-school",
    name: "MwanaCheck High School",
    address: "Nairobi, Kenya",
    contact: {
      email: "info@mwanacheck.edu",
      phone: "+254700123456"
    },
    type: "Secondary School",
    disciplineRules: [
      { rule: "Late to class", pointsDeducted: 5 },
      { rule: "Uniform violation", pointsDeducted: 3 },
      { rule: "Disrespectful behavior", pointsDeducted: 10 },
      { rule: "Missing homework", pointsDeducted: 2 },
    ],
  },
]

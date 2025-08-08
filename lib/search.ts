import { SAMPLE_STUDENTS, SAMPLE_SCHOOLS } from "./data"

export interface SearchResult {
  id: string
  type: "student" | "teacher" | "parent" | "school" | "user"
  title: string
  subtitle: string
  description: string
  metadata: Record<string, any>
  relevanceScore: number
}

export interface SearchFilters {
  type?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  gpaRange?: {
    min: number
    max: number
  }
  disciplineRange?: {
    min: number
    max: number
  }
  class?: string[]
  status?: string[]
}

export interface SearchOptions {
  query: string
  filters?: SearchFilters
  page?: number
  limit?: number
  sortBy?: "relevance" | "name" | "date" | "gpa" | "discipline"
  sortOrder?: "asc" | "desc"
}

// Mock data for teachers and parents
const MOCK_TEACHERS = [
  {
    id: "teacher-1",
    name: "John Smith",
    email: "john.smith@school.edu",
    subject: "Mathematics",
    class: "Form 4A",
    phone: "+254700123456",
    joinDate: "2020-01-15",
    status: "active",
  },
  {
    id: "teacher-2",
    name: "Mary Johnson",
    email: "mary.johnson@school.edu",
    subject: "English",
    class: "Form 3B",
    phone: "+254700234567",
    joinDate: "2019-08-20",
    status: "active",
  },
  {
    id: "teacher-3",
    name: "David Wilson",
    email: "david.wilson@school.edu",
    subject: "Science",
    class: "Form 2C",
    phone: "+254700345678",
    joinDate: "2021-03-10",
    status: "active",
  },
]

const MOCK_PARENTS = [
  {
    id: "parent-1",
    name: "Robert Brown",
    email: "robert.brown@email.com",
    phone: "+254700456789",
    children: ["student-1"],
    occupation: "Engineer",
    address: "Nairobi, Kenya",
    status: "active",
  },
  {
    id: "parent-2",
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "+254700567890",
    children: ["student-2"],
    occupation: "Doctor",
    address: "Mombasa, Kenya",
    status: "active",
  },
]

// Search utility functions
function calculateRelevanceScore(item: any, query: string): number {
  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0)
  let score = 0

  // Convert item to searchable text
  const searchableText = JSON.stringify(item).toLowerCase()

  searchTerms.forEach((term) => {
    // Exact matches get higher scores
    if (item.name?.toLowerCase().includes(term)) {
      score += 10
    }
    if (item.email?.toLowerCase().includes(term)) {
      score += 8
    }
    if (item.id?.toLowerCase().includes(term)) {
      score += 6
    }
    // General text matches
    if (searchableText.includes(term)) {
      score += 2
    }
  })

  return score
}

function highlightText(text: string, query: string): string {
  if (!query || !text) return text

  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0)
  let highlightedText = text

  searchTerms.forEach((term) => {
    const regex = new RegExp(`(${term})`, "gi")
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>',
    )
  })

  return highlightedText
}

function applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
  let filteredResults = [...results]

  if (filters.type && filters.type.length > 0) {
    filteredResults = filteredResults.filter((result) => filters.type!.includes(result.type))
  }

  if (filters.gpaRange) {
    filteredResults = filteredResults.filter((result) => {
      const gpa = result.metadata.gpa
      return gpa >= filters.gpaRange!.min && gpa <= filters.gpaRange!.max
    })
  }

  if (filters.disciplineRange) {
    filteredResults = filteredResults.filter((result) => {
      const discipline = result.metadata.disciplinePoints
      return discipline >= filters.disciplineRange!.min && discipline <= filters.disciplineRange!.max
    })
  }

  if (filters.class && filters.class.length > 0) {
    filteredResults = filteredResults.filter((result) => filters.class!.includes(result.metadata.class))
  }

  if (filters.status && filters.status.length > 0) {
    filteredResults = filteredResults.filter((result) => filters.status!.includes(result.metadata.status || "active"))
  }

  return filteredResults
}

export async function performSearch(options: SearchOptions): Promise<{
  results: SearchResult[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}> {
  const { query, filters = {}, page = 1, limit = 10, sortBy = "relevance", sortOrder = "desc" } = options

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  let allResults: SearchResult[] = []

  // Search students
  SAMPLE_STUDENTS.forEach((student) => {
    const score = calculateRelevanceScore(student, query)
    if (score > 0 || !query) {
      allResults.push({
        id: student.id,
        type: "student",
        title: student.name,
        subtitle: `Student ID: ${student.id} | Class: ${student.class}`,
        description: `GPA: ${student.academicPerformance.gpa} | Discipline: ${student.disciplinePoints}/100`,
        metadata: {
          gpa: student.academicPerformance.gpa,
          disciplinePoints: student.disciplinePoints,
          class: student.class,
          status: "active",
          email: student.email,
          phone: student.phone,
          dateOfBirth: student.dateOfBirth,
        },
        relevanceScore: score,
      })
    }
  })

  // Search teachers
  MOCK_TEACHERS.forEach((teacher) => {
    const score = calculateRelevanceScore(teacher, query)
    if (score > 0 || !query) {
      allResults.push({
        id: teacher.id,
        type: "teacher",
        title: teacher.name,
        subtitle: `${teacher.subject} Teacher | Class: ${teacher.class}`,
        description: `Email: ${teacher.email} | Phone: ${teacher.phone}`,
        metadata: {
          subject: teacher.subject,
          class: teacher.class,
          status: teacher.status,
          email: teacher.email,
          phone: teacher.phone,
          joinDate: teacher.joinDate,
        },
        relevanceScore: score,
      })
    }
  })

  // Search parents
  MOCK_PARENTS.forEach((parent) => {
    const score = calculateRelevanceScore(parent, query)
    if (score > 0 || !query) {
      allResults.push({
        id: parent.id,
        type: "parent",
        title: parent.name,
        subtitle: `Parent | ${parent.occupation}`,
        description: `Email: ${parent.email} | Phone: ${parent.phone} | Address: ${parent.address}`,
        metadata: {
          occupation: parent.occupation,
          status: parent.status,
          email: parent.email,
          phone: parent.phone,
          address: parent.address,
          children: parent.children,
        },
        relevanceScore: score,
      })
    }
  })

  // Search schools
  SAMPLE_SCHOOLS.forEach((school) => {
    const score = calculateRelevanceScore(school, query)
    if (score > 0 || !query) {
      allResults.push({
        id: school.id,
        type: "school",
        title: school.name,
        subtitle: `School | ${school.type}`,
        description: `Address: ${school.address} | Contact: ${school.contact.email}`,
        metadata: {
          type: school.type,
          status: "active",
          email: school.contact.email,
          phone: school.contact.phone,
          address: school.address,
        },
        relevanceScore: score,
      })
    }
  })

  // Apply filters
  allResults = applyFilters(allResults, filters)

  // Sort results
  allResults.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      case "date":
        const dateA = new Date(a.metadata.joinDate || a.metadata.dateOfBirth || 0)
        const dateB = new Date(b.metadata.joinDate || b.metadata.dateOfBirth || 0)
        return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
      case "gpa":
        const gpaA = a.metadata.gpa || 0
        const gpaB = b.metadata.gpa || 0
        return sortOrder === "asc" ? gpaA - gpaB : gpaB - gpaA
      case "discipline":
        const discA = a.metadata.disciplinePoints || 0
        const discB = b.metadata.disciplinePoints || 0
        return sortOrder === "asc" ? discA - discB : discB - discA
      default: // relevance
        return b.relevanceScore - a.relevanceScore
    }
  })

  // Pagination
  const total = allResults.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedResults = allResults.slice(startIndex, endIndex)

  // Highlight search terms in results
  if (query) {
    paginatedResults.forEach((result) => {
      result.title = highlightText(result.title, query)
      result.subtitle = highlightText(result.subtitle, query)
      result.description = highlightText(result.description, query)
    })
  }

  return {
    results: paginatedResults,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  }
}

export function getSearchSuggestions(query: string): string[] {
  if (!query || query.length < 2) return []

  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()

  // Add student names
  SAMPLE_STUDENTS.forEach((student) => {
    if (student.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(student.name)
    }
    if (student.class.toLowerCase().includes(searchTerm)) {
      suggestions.add(student.class)
    }
  })

  // Add teacher names and subjects
  MOCK_TEACHERS.forEach((teacher) => {
    if (teacher.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(teacher.name)
    }
    if (teacher.subject.toLowerCase().includes(searchTerm)) {
      suggestions.add(teacher.subject)
    }
  })

  // Add parent names
  MOCK_PARENTS.forEach((parent) => {
    if (parent.name.toLowerCase().includes(searchTerm)) {
      suggestions.add(parent.name)
    }
  })

  return Array.from(suggestions).slice(0, 5)
}

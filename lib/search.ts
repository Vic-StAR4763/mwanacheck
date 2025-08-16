import { supabase } from "./supabase"

export interface SearchResult {
  id: string
  type: "student" | "teacher" | "parent" | "user"
  name: string
  email?: string
  phone?: string
  admission_number?: string
  gpa?: number
  discipline_points?: number
  status: string
  school_name?: string
  role?: string
  metadata?: Record<string, any>
}

export interface SearchFilters {
  type?: "student" | "teacher" | "parent" | "user" | "all"
  status?: string
  gpaMin?: number
  gpaMax?: number
  disciplineMin?: number
  disciplineMax?: number
  schoolId?: string
}

export interface SearchOptions {
  query?: string
  filters?: SearchFilters
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export async function searchDatabase(options: SearchOptions = {}) {
  const { query = "", filters = {}, page = 1, limit = 20, sortBy = "name", sortOrder = "asc" } = options

  try {
    const results: SearchResult[] = []
    const offset = (page - 1) * limit

    // Search students
    if (!filters.type || filters.type === "student" || filters.type === "all") {
      let studentQuery = supabase.from("students").select(`
          id,
          name,
          email,
          phone,
          admission_number,
          gpa,
          discipline_points,
          status,
          school:schools(name)
        `)

      if (query) {
        studentQuery = studentQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,admission_number.ilike.%${query}%`)
      }

      if (filters.status) {
        studentQuery = studentQuery.eq("status", filters.status)
      }

      if (filters.gpaMin !== undefined) {
        studentQuery = studentQuery.gte("gpa", filters.gpaMin)
      }

      if (filters.gpaMax !== undefined) {
        studentQuery = studentQuery.lte("gpa", filters.gpaMax)
      }

      if (filters.disciplineMin !== undefined) {
        studentQuery = studentQuery.gte("discipline_points", filters.disciplineMin)
      }

      if (filters.disciplineMax !== undefined) {
        studentQuery = studentQuery.lte("discipline_points", filters.disciplineMax)
      }

      if (filters.schoolId) {
        studentQuery = studentQuery.eq("school_id", filters.schoolId)
      }

      const { data: students } = await studentQuery
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1)

      if (students) {
        results.push(
          ...students.map((student) => ({
            id: student.id,
            type: "student" as const,
            name: student.name,
            email: student.email,
            phone: student.phone,
            admission_number: student.admission_number,
            gpa: student.gpa,
            discipline_points: student.discipline_points,
            status: student.status,
            school_name: student.school?.name,
            metadata: {
              admission_number: student.admission_number,
              gpa: student.gpa,
              discipline_points: student.discipline_points,
            },
          })),
        )
      }
    }

    // Search users (teachers, parents, admins)
    if (!filters.type || ["teacher", "parent", "user", "all"].includes(filters.type)) {
      let userQuery = supabase.from("users").select(`
          id,
          name,
          email,
          phone,
          role,
          status,
          school:schools(name)
        `)

      if (query) {
        userQuery = userQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      }

      if (filters.type && filters.type !== "all" && filters.type !== "user") {
        userQuery = userQuery.eq("role", filters.type)
      }

      if (filters.status) {
        userQuery = userQuery.eq("status", filters.status)
      }

      if (filters.schoolId) {
        userQuery = userQuery.eq("school_id", filters.schoolId)
      }

      const { data: users } = await userQuery
        .order(sortBy, { ascending: sortOrder === "asc" })
        .range(offset, offset + limit - 1)

      if (users) {
        results.push(
          ...users.map((user) => ({
            id: user.id,
            type: user.role as "teacher" | "parent",
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            role: user.role,
            school_name: user.school?.name,
            metadata: {
              role: user.role,
            },
          })),
        )
      }
    }

    // Sort and paginate combined results
    const sortedResults = results.sort((a, b) => {
      const aValue = a[sortBy as keyof SearchResult] || ""
      const bValue = b[sortBy as keyof SearchResult] || ""

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    const paginatedResults = sortedResults.slice(0, limit)

    return {
      results: paginatedResults,
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
    }
  } catch (error) {
    console.error("Error searching database:", error)
    return {
      results: [],
      total: 0,
      page: 1,
      limit,
      totalPages: 0,
    }
  }
}

export async function getSearchSuggestions(query: string, limit = 5) {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const suggestions: string[] = []

    // Get student name suggestions
    const { data: students } = await supabase
      .from("students")
      .select("name, admission_number")
      .or(`name.ilike.%${query}%,admission_number.ilike.%${query}%`)
      .limit(limit)

    if (students) {
      students.forEach((student) => {
        if (student.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(student.name)
        }
        if (student.admission_number?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(student.admission_number)
        }
      })
    }

    // Get user name suggestions
    const { data: users } = await supabase
      .from("users")
      .select("name, email")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(limit)

    if (users) {
      users.forEach((user) => {
        if (user.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(user.name)
        }
        if (user.email?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.push(user.email)
        }
      })
    }

    // Remove duplicates and limit results
    const uniqueSuggestions = [...new Set(suggestions)]
    return uniqueSuggestions.slice(0, limit)
  } catch (error) {
    console.error("Error getting search suggestions:", error)
    return []
  }
}

export async function getAdvancedSearchFilters(schoolId?: string) {
  try {
    const filters = {
      statuses: ["active", "inactive", "suspended", "graduated"],
      types: ["student", "teacher", "parent", "admin"],
      gpaRange: { min: 0, max: 4.0 },
      disciplineRange: { min: 0, max: 100 },
      schools: [] as Array<{ id: string; name: string }>,
    }

    // Get schools for filter
    const { data: schools } = await supabase.from("schools").select("id, name").order("name")

    if (schools) {
      filters.schools = schools
    }

    // Get actual GPA range from database
    const { data: gpaStats } = await supabase.from("students").select("gpa").not("gpa", "is", null)

    if (gpaStats && gpaStats.length > 0) {
      const gpas = gpaStats.map((s) => s.gpa).filter((gpa) => gpa !== null)
      filters.gpaRange.min = Math.min(...gpas)
      filters.gpaRange.max = Math.max(...gpas)
    }

    // Get actual discipline range from database
    const { data: disciplineStats } = await supabase
      .from("students")
      .select("discipline_points")
      .not("discipline_points", "is", null)

    if (disciplineStats && disciplineStats.length > 0) {
      const points = disciplineStats.map((s) => s.discipline_points).filter((p) => p !== null)
      filters.disciplineRange.min = Math.min(...points)
      filters.disciplineRange.max = Math.max(...points)
    }

    return filters
  } catch (error) {
    console.error("Error getting search filters:", error)
    return {
      statuses: ["active", "inactive", "suspended"],
      types: ["student", "teacher", "parent"],
      gpaRange: { min: 0, max: 4.0 },
      disciplineRange: { min: 0, max: 100 },
      schools: [],
    }
  }
}

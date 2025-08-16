import { supabase } from "./supabase"
import type { User, Student, School, Grade, Attendance, DisciplineRecord, MeritAward, Payment } from "./supabase"

// User operations
export async function getUsers(schoolId?: string) {
  try {
    let query = supabase.from("users").select("*")

    if (schoolId) {
      query = query.eq("school_id", schoolId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function createUser(userData: Omit<User, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("users").insert([userData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: string, userData: Partial<User>) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

export async function deleteUser(id: string) {
  try {
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

// Student operations
export async function getStudents(schoolId?: string) {
  try {
    let query = supabase.from("students").select(`
      *,
      school:schools(name),
      parent:users!students_parent_id_fkey(name, email, phone)
    `)

    if (schoolId) {
      query = query.eq("school_id", schoolId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching students:", error)
    return []
  }
}

export async function createStudent(studentData: Omit<Student, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("students").insert([studentData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating student:", error)
    throw error
  }
}

export async function updateStudent(id: string, studentData: Partial<Student>) {
  try {
    const { data, error } = await supabase
      .from("students")
      .update({ ...studentData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating student:", error)
    throw error
  }
}

export async function deleteStudent(id: string) {
  try {
    const { error } = await supabase.from("students").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting student:", error)
    throw error
  }
}

// School operations
export async function getSchools() {
  try {
    const { data, error } = await supabase.from("schools").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching schools:", error)
    return []
  }
}

export async function createSchool(schoolData: Omit<School, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("schools").insert([schoolData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating school:", error)
    throw error
  }
}

// Grade operations
export async function getGrades(studentId?: string) {
  try {
    let query = supabase.from("grades").select(`
      *,
      student:students(name, admission_number),
      subject:subjects(name, code),
      teacher:users!grades_teacher_id_fkey(name)
    `)

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    const { data, error } = await query.order("assessment_date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching grades:", error)
    return []
  }
}

export async function createGrade(gradeData: Omit<Grade, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("grades").insert([gradeData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating grade:", error)
    throw error
  }
}

// Attendance operations
export async function getAttendance(studentId?: string, date?: string) {
  try {
    let query = supabase.from("attendance").select(`
      *,
      student:students(name, admission_number),
      class:classes(name, grade_level)
    `)

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    if (date) {
      query = query.eq("date", date)
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return []
  }
}

export async function markAttendance(attendanceData: Omit<Attendance, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("attendance").insert([attendanceData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error marking attendance:", error)
    throw error
  }
}

// Discipline operations
export async function getDisciplineRecords(studentId?: string) {
  try {
    let query = supabase.from("discipline_records").select(`
      *,
      student:students(name, admission_number),
      reporter:users!discipline_records_reported_by_fkey(name)
    `)

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    const { data, error } = await query.order("incident_date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching discipline records:", error)
    return []
  }
}

export async function createDisciplineRecord(
  disciplineData: Omit<DisciplineRecord, "id" | "created_at" | "updated_at">,
) {
  try {
    const { data, error } = await supabase.from("discipline_records").insert([disciplineData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating discipline record:", error)
    throw error
  }
}

// Merit awards operations
export async function getMeritAwards(studentId?: string) {
  try {
    let query = supabase.from("merit_awards").select(`
      *,
      student:students(name, admission_number),
      awarder:users!merit_awards_awarded_by_fkey(name)
    `)

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    const { data, error } = await query.order("award_date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching merit awards:", error)
    return []
  }
}

export async function createMeritAward(meritData: Omit<MeritAward, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("merit_awards").insert([meritData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating merit award:", error)
    throw error
  }
}

// Payment operations
export async function getPayments(studentId?: string) {
  try {
    let query = supabase.from("payments").select(`
      *,
      student:students(name, admission_number)
    `)

    if (studentId) {
      query = query.eq("student_id", studentId)
    }

    const { data, error } = await query.order("payment_date", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching payments:", error)
    return []
  }
}

export async function createPayment(paymentData: Omit<Payment, "id" | "created_at" | "updated_at">) {
  try {
    const { data, error } = await supabase.from("payments").insert([paymentData]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

export async function updatePayment(id: string, paymentData: Partial<Payment>) {
  try {
    const { data, error } = await supabase
      .from("payments")
      .update({ ...paymentData, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating payment:", error)
    throw error
  }
}

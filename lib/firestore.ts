"use client"

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  writeBatch,
  runTransaction,
  onSnapshot,
  type DocumentSnapshot,
  type QuerySnapshot,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"
import type {
  UserProfile,
  Student,
  Merit,
  Discipline,
  Payment,
  School,
  Offence,
  DisciplineRecord,
} from "./models"

// Helper function to check if Firestore is available
function checkFirestore() {
  if (!db) {
    throw new Error("Firestore is not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Safe wrapper for Firestore operations
async function safeFirestoreOperation<T>(operation: () => Promise<T>, fallback?: T): Promise<T> {
  try {
    checkFirestore()
    return await operation()
  } catch (error: any) {
    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      console.warn("Firestore is offline, using fallback if available")
      if (fallback !== undefined) {
        return fallback
      }
    }
    throw error
  }
}

// School operations
export async function ensureSchoolByName(name: string): Promise<string> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const schoolsRef = collection(firestore, "schools")
    const q = query(schoolsRef, where("name", "==", name))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      return snapshot.docs[0].id
    }

    // Create new school
    const newSchoolRef = doc(schoolsRef)
    const school: School = {
      id: newSchoolRef.id,
      name,
      address: "",
      phone: "",
      email: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await setDoc(newSchoolRef, {
      ...school,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newSchoolRef.id
  }, "demo-school-1") // Fallback for offline mode
}

// User operations
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const userDoc = await getDoc(doc(firestore, "users", uid))
    if (!userDoc.exists()) return null

    const data = userDoc.data()
    return {
      uid: data.uid,
      email: data.email,
      name: data.name,
      role: data.role,
      schoolId: data.schoolId,
      studentId: data.studentId || null,
      classIds: data.classIds || [],
    } as UserProfile
  }, null)
}

export async function createUserProfile(profile: Omit<UserProfile, "uid"> & { uid: string }): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await setDoc(doc(firestore, "users", profile.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await updateDoc(doc(firestore, "users", uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  })
}

export async function getUsersBySchool(schoolId: string): Promise<UserProfile[]> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const usersRef = collection(firestore, "users")
    const q = query(usersRef, where("schoolId", "==", schoolId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        uid: data.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        schoolId: data.schoolId,
        studentId: data.studentId || null,
        classIds: data.classIds || [],
      } as UserProfile
    })
  }, [])
}

export async function deleteUser(uid: string): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await deleteDoc(doc(firestore, "users", uid))
  })
}

// Student operations
export async function getStudentsBySchool(schoolId: string): Promise<Student[]> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const studentsRef = collection(firestore, "students")
    const q = query(studentsRef, where("schoolId", "==", schoolId))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[]
  }, [])
}

export async function getStudentById(studentId: string): Promise<Student | null> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const studentDoc = await getDoc(doc(firestore, "students", studentId))
    if (!studentDoc.exists()) return null

    return {
      id: studentDoc.id,
      ...studentDoc.data(),
    } as Student
  }, null)
}

export async function createStudent(student: Omit<Student, "id">): Promise<string> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const studentsRef = collection(firestore, "students")
    const newStudentRef = doc(studentsRef)

    await setDoc(newStudentRef, {
      ...student,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newStudentRef.id
  }, "demo-student-id")
}

export async function updateStudent(studentId: string, updates: Partial<Student>): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await updateDoc(doc(firestore, "students", studentId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  })
}

export async function deleteStudent(studentId: string): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await deleteDoc(doc(firestore, "students", studentId))
  })
}

// Merit operations
export async function getMeritsByStudent(studentId: string): Promise<Merit[]> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const meritsRef = collection(firestore, "merits")
    const q = query(meritsRef, where("studentId", "==", studentId), orderBy("date", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Merit[]
  }, [])
}

export async function createMerit(merit: Omit<Merit, "id">): Promise<string> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const meritsRef = collection(firestore, "merits")
    const newMeritRef = doc(meritsRef)

    await setDoc(newMeritRef, {
      ...merit,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newMeritRef.id
  }, "demo-merit-id")
}

// Discipline operations
export async function getDisciplinesByStudent(studentId: string): Promise<Discipline[]> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const disciplinesRef = collection(firestore, "disciplines")
    const q = query(disciplinesRef, where("studentId", "==", studentId), orderBy("date", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Discipline[]
  }, [])
}

export async function createDiscipline(discipline: Omit<Discipline, "id">): Promise<string> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const disciplinesRef = collection(firestore, "disciplines")
    const newDisciplineRef = doc(disciplinesRef)

    await setDoc(newDisciplineRef, {
      ...discipline,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newDisciplineRef.id
  }, "demo-discipline-id")
}

// Payment operations
export async function getPaymentsByStudent(studentId: string): Promise<Payment[]> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const paymentsRef = collection(firestore, "payments")
    const q = query(paymentsRef, where("studentId", "==", studentId), orderBy("date", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Payment[]
  }, [])
}

export async function createPayment(payment: Omit<Payment, "id">): Promise<string> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const paymentsRef = collection(firestore, "payments")
    const newPaymentRef = doc(paymentsRef)

    await setDoc(newPaymentRef, {
      ...payment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newPaymentRef.id
  }, "demo-payment-id")
}

// Statistics operations
export async function getSchoolStats(schoolId: string) {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    
    const [studentsSnapshot, usersSnapshot, meritsSnapshot, disciplinesSnapshot] = await Promise.all([
      getDocs(query(collection(firestore, "students"), where("schoolId", "==", schoolId))),
      getDocs(query(collection(firestore, "users"), where("schoolId", "==", schoolId))),
      getDocs(query(collection(firestore, "merits"), where("schoolId", "==", schoolId))),
      getDocs(query(collection(firestore, "disciplines"), where("schoolId", "==", schoolId))),
    ])

    return {
      totalStudents: studentsSnapshot.size,
      totalUsers: usersSnapshot.size,
      totalMerits: meritsSnapshot.size,
      totalDisciplines: disciplinesSnapshot.size,
    }
  }, {
    totalStudents: 0,
    totalUsers: 0,
    totalMerits: 0,
    totalDisciplines: 0,
  })
}

// Offence operations
export async function getOffencesBySchool(schoolId: string): Promise<Offence[]> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const offencesRef = collection(firestore, "offences")
    const q = query(offencesRef, where("schoolId", "==", schoolId), orderBy("name"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Offence[]
  }, [])
}

export async function createOffence(offence: Omit<Offence, "id">): Promise<string> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const offencesRef = collection(firestore, "offences")
    const newOffenceRef = doc(offencesRef)

    await setDoc(newOffenceRef, {
      ...offence,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return newOffenceRef.id
  }, "demo-offence-id")
}

export async function updateOffence(offenceId: string, updates: Partial<Offence>): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await updateDoc(doc(firestore, "offences", offenceId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  })
}

export async function deleteOffence(offenceId: string): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    await deleteDoc(doc(firestore, "offences", offenceId))
  })
}

// Discipline Record operations
export async function getDisciplineRecordsByStudent(
  studentId: string,
  limitCount: number = 10,
  lastDoc?: DocumentSnapshot
): Promise<{ records: DisciplineRecord[]; lastDoc?: DocumentSnapshot }> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    const recordsRef = collection(firestore, "disciplineRecords")
    let q = query(
      recordsRef,
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )

    if (lastDoc) {
      q = query(
        recordsRef,
        where("studentId", "==", studentId),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(limitCount)
      )
    }

    const snapshot = await getDocs(q)
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DisciplineRecord[]

    return {
      records,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    }
  }, { records: [], lastDoc: undefined })
}

export async function issueDisciplineRecord(
  studentId: string,
  offenceId: string,
  teacherId: string,
  schoolId: string
): Promise<void> {
  return safeFirestoreOperation(async () => {
    const firestore = checkFirestore()
    
    await runTransaction(firestore, async (transaction) => {
      // Get offence details
      const offenceRef = doc(firestore, "offences", offenceId)
      const offenceDoc = await transaction.get(offenceRef)
      
      if (!offenceDoc.exists()) {
        throw new Error("Offence not found")
      }
      
      const offence = offenceDoc.data() as Offence
      
      // Get student details
      const studentRef = doc(firestore, "students", studentId)
      const studentDoc = await transaction.get(studentRef)
      
      if (!studentDoc.exists()) {
        throw new Error("Student not found")
      }
      
      const student = studentDoc.data() as Student
      const currentPoints = student.disciplinePoints || 100
      const newPoints = Math.max(0, currentPoints - offence.points)
      
      // Update student's discipline points
      transaction.update(studentRef, {
        disciplinePoints: newPoints,
        updatedAt: serverTimestamp(),
      })
      
      // Create discipline record
      const recordRef = doc(collection(firestore, "disciplineRecords"))
      transaction.set(recordRef, {
        id: recordRef.id,
        studentId,
        offenceId,
        teacherId,
        schoolId,
        offenceName: offence.name,
        offenceDescription: offence.description,
        pointsDeducted: offence.points,
        previousPoints: currentPoints,
        newPoints,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    })
  })
}

// Real-time listeners
export function subscribeToStudentDisciplineRecords(
  studentId: string,
  callback: (records: DisciplineRecord[]) => void
): Unsubscribe {
  if (!db) {
    console.warn("Firestore not available for real-time updates")
    return () => {}
  }

  try {
    const recordsRef = collection(db, "disciplineRecords")
    const q = query(
      recordsRef,
      where("studentId", "==", studentId),
      orderBy("createdAt", "desc"),
      limit(10)
    )

    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as DisciplineRecord[]
      callback(records)
    }, (error) => {
      console.warn("Error in discipline records subscription:", error)
      callback([])
    })
  } catch (error) {
    console.warn("Failed to set up discipline records subscription:", error)
    return () => {}
  }
}

export function subscribeToStudent(
  studentId: string,
  callback: (student: Student | null) => void
): Unsubscribe {
  if (!db) {
    console.warn("Firestore not available for real-time updates")
    return () => {}
  }

  try {
    const studentRef = doc(db, "students", studentId)
    
    return onSnapshot(studentRef, (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data(),
        } as Student)
      } else {
        callback(null)
      }
    }, (error) => {
      console.warn("Error in student subscription:", error)
      callback(null)
    })
  } catch (error) {
    console.warn("Failed to set up student subscription:", error)
    return () => {}
  }
}

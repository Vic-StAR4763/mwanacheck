"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Award, AlertTriangle, DollarSign, Calendar, Phone } from 'lucide-react'
import { getStudentsByGuardian, getMeritsByStudent, getDisciplineByStudent, getPaymentsByStudent } from "@/lib/firestore"
import type { Student, Merit, Discipline, Payment } from "@/lib/models"

export default function ParentDashboard() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [merits, setMerits] = useState<Merit[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.uid && user?.schoolId) {
      loadStudents()
    }
  }, [user?.uid, user?.schoolId])

  useEffect(() => {
    if (selectedStudent) {
      loadStudentData(selectedStudent.id)
    }
  }, [selectedStudent])

  const loadStudents = async () => {
    if (!user?.uid || !user?.schoolId) return

    try {
      setLoading(true)
      const studentList = await getStudentsByGuardian(user.uid, user.schoolId)
      setStudents(studentList)
      if (studentList.length > 0) {
        setSelectedStudent(studentList[0])
      }
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadStudentData = async (studentId: string) => {
    try {
      const [studentMerits, studentDisciplines, studentPayments] = await Promise.all([
        getMeritsByStudent(studentId),
        getDisciplineByStudent(studentId),
        getPaymentsByStudent(studentId),
      ])

      setMerits(studentMerits)
      setDisciplines(studentDisciplines)
      setPayments(studentPayments)
    } catch (error) {
      console.error("Failed to load student data:", error)
    }
  }

  const totalMeritPoints = merits.reduce((sum, merit) => sum + merit.points, 0)
  const pendingPayments = payments.filter(p => p.status === "pending")
  const overduePayments = payments.filter(p => p.status === "overdue")

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["parent"]}>
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (students.length === 0) {
    return (
      <ProtectedRoute allowedRoles={["parent"]}>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Students Found</h2>
            <p className="text-muted-foreground">
              You are not currently linked to any students. Please contact your school administrator.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["parent"]}>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">Monitor your children's progress</p>
        </div>

        {/* Student Selector */}
        {students.length > 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {students.map((student) => (
                  <Button
                    key={student.id}
                    variant={selectedStudent?.id === student.id ? "default" : "outline"}
                    onClick={() => setSelectedStudent(student)}
                  >
                    {student.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedStudent && (
          <>
            {/* Student Info Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {selectedStudent.name}
                </CardTitle>
                <CardDescription>
                  {selectedStudent.grade} • {selectedStudent.class}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Born: {selectedStudent.dateOfBirth || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Phone: {selectedStudent.phone || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      Emergency: {selectedStudent.emergencyContact || "Not specified"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Merit Points</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalMeritPoints}</div>
                  <p className="text-xs text-muted-foreground">
                    From {merits.length} awards
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Discipline</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{disciplines.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total incidents
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{pendingPayments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    ${pendingPayments.reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{overduePayments.length}</div>
                  <p className="text-xs text-muted-foreground">
                    ${overduePayments.reduce((sum, p) => sum + p.amount, 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="merits" className="space-y-4">
              <TabsList>
                <TabsTrigger value="merits">Merits & Awards</TabsTrigger>
                <TabsTrigger value="discipline">Discipline</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="merits">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Merits & Awards</CardTitle>
                    <CardDescription>
                      Positive recognition for {selectedStudent.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {merits.length === 0 ? (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No merits recorded yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {merits.map((merit) => (
                          <div key={merit.id} className="flex items-start justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{merit.type}</Badge>
                                <span className="text-sm text-muted-foreground">{merit.date}</span>
                              </div>
                              <p className="font-medium mb-1">{merit.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">+{merit.points}</div>
                              <div className="text-xs text-muted-foreground">points</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discipline">
                <Card>
                  <CardHeader>
                    <CardTitle>Discipline Records</CardTitle>
                    <CardDescription>
                      Behavioral incidents for {selectedStudent.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {disciplines.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No discipline records</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {disciplines.map((discipline) => (
                          <div key={discipline.id} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={discipline.severity === "high" ? "destructive" : discipline.severity === "medium" ? "default" : "secondary"}>
                                {discipline.type}
                              </Badge>
                              <Badge variant="outline">{discipline.severity} severity</Badge>
                              <span className="text-sm text-muted-foreground">{discipline.date}</span>
                              {discipline.resolved && (
                                <Badge variant="secondary">Resolved</Badge>
                              )}
                            </div>
                            <p className="font-medium mb-2">{discipline.description}</p>
                            <p className="text-sm text-muted-foreground">Action: {discipline.action}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>
                      Financial records for {selectedStudent.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No payment records</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{payment.type}</Badge>
                                <Badge variant={
                                  payment.status === "paid" ? "secondary" :
                                  payment.status === "overdue" ? "destructive" : "default"
                                }>
                                  {payment.status}
                                </Badge>
                              </div>
                              <p className="font-medium mb-1">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {payment.dueDate}
                                {payment.paidDate && ` • Paid: ${payment.paidDate}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">${payment.amount}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}

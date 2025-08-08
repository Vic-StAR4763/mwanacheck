"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Award, AlertTriangle, DollarSign, BookOpen, Calendar } from 'lucide-react'
import { getStudent, getMeritsByStudent, getDisciplineByStudent, getPaymentsByStudent } from "@/lib/firestore"
import type { Student, Merit, Discipline, Payment } from "@/lib/models"

export default function StudentDashboard() {
  const { user } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [merits, setMerits] = useState<Merit[]>([])
  const [disciplines, setDisciplines] = useState<Discipline[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.studentId) {
      loadStudentData()
    }
  }, [user?.studentId])

  const loadStudentData = async () => {
    if (!user?.studentId) return

    try {
      setLoading(true)
      const [studentData, studentMerits, studentDisciplines, studentPayments] = await Promise.all([
        getStudent(user.studentId),
        getMeritsByStudent(user.studentId),
        getDisciplineByStudent(user.studentId),
        getPaymentsByStudent(user.studentId),
      ])

      setStudent(studentData)
      setMerits(studentMerits)
      setDisciplines(studentDisciplines)
      setPayments(studentPayments)
    } catch (error) {
      console.error("Failed to load student data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalMeritPoints = merits.reduce((sum, merit) => sum + merit.points, 0)
  const pendingPayments = payments.filter(p => p.status === "pending")
  const overduePayments = payments.filter(p => p.status === "overdue")
  const unresolvedDisciplines = disciplines.filter(d => !d.resolved)

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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

  if (!student) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Student Profile Not Found</h2>
            <p className="text-muted-foreground">
              Unable to load your student profile. Please contact your school administrator.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your academic progress</p>
        </div>

        {/* Student Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {student.name}
            </CardTitle>
            <CardDescription>
              {student.grade} • {student.class}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Born: {student.dateOfBirth || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Email: {student.email || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Student ID: {student.id}
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
              <Progress value={Math.min((totalMeritPoints / 100) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discipline</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{unresolvedDisciplines.length}</div>
              <p className="text-xs text-muted-foreground">
                Unresolved incidents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
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
            <TabsTrigger value="merits">My Achievements</TabsTrigger>
            <TabsTrigger value="discipline">Discipline</TabsTrigger>
            <TabsTrigger value="payments">Fees & Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="merits">
            <Card>
              <CardHeader>
                <CardTitle>My Achievements</CardTitle>
                <CardDescription>
                  Your recent merits and awards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {merits.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No achievements yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Keep working hard to earn your first merit points!
                    </p>
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
                  Your behavioral incidents and resolutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {disciplines.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-green-600 font-medium">Excellent Behavior!</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      You have no discipline records. Keep it up!
                    </p>
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
                <CardTitle>Fees & Payments</CardTitle>
                <CardDescription>
                  Your school fees and payment history
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
      </div>
    </ProtectedRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ArrowLeft, Clock, TrendingDown, Award } from 'lucide-react'
import Link from "next/link"
import { getStudent, getDisciplineRecordsByStudent } from "@/lib/firestore"
import type { StudentRecord, DisciplineRecord } from "@/lib/models"

export default function StudentDisciplineProfile() {
  const { user } = useAuth()
  const [student, setStudent] = useState<StudentRecord | null>(null)
  const [disciplineRecords, setDisciplineRecords] = useState<DisciplineRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)

  useEffect(() => {
    if (user?.studentId) {
      loadStudentData()
    }
  }, [user?.studentId])

  const loadStudentData = async () => {
    if (!user?.studentId) return

    try {
      setLoading(true)
      const [studentData, recordsData] = await Promise.all([
        getStudent(user.studentId),
        getDisciplineRecordsByStudent(user.studentId, 10)
      ])

      setStudent(studentData)
      setDisciplineRecords(recordsData.records)
      setLastDoc(recordsData.lastDoc)
      setHasMore(recordsData.records.length === 10)
    } catch (error) {
      console.error("Failed to load student discipline data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreRecords = async () => {
    if (!user?.studentId || !lastDoc || loadingMore) return

    try {
      setLoadingMore(true)
      const recordsData = await getDisciplineRecordsByStudent(user.studentId, 10, lastDoc)
      
      setDisciplineRecords(prev => [...prev, ...recordsData.records])
      setLastDoc(recordsData.lastDoc)
      setHasMore(recordsData.records.length === 10)
    } catch (error) {
      console.error("Failed to load more records:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const getSeverityColor = (points: number) => {
    if (points >= 15) return "destructive"
    if (points >= 8) return "default"
    return "secondary"
  }

  const getPointsColor = (points: number) => {
    if (points >= 80) return "text-green-600"
    if (points >= 60) return "text-yellow-600"
    if (points >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getPointsStatus = (points: number) => {
    if (points >= 80) return "Excellent"
    if (points >= 60) return "Good"
    if (points >= 40) return "Warning"
    return "Critical"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-32 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-muted rounded animate-pulse" />
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
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Student Profile Not Found</h2>
            <p className="text-muted-foreground">
              Unable to load your discipline profile. Please contact your school administrator.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const currentPoints = student.disciplinePoints || 100
  const totalDeducted = disciplineRecords.reduce((sum, record) => sum + record.pointsDeducted, 0)

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/student">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Discipline Profile</h1>
              <p className="text-muted-foreground">Track your discipline points and history</p>
            </div>
          </div>
        </div>

        {/* Discipline Points Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Current Points
              </CardTitle>
              <CardDescription>Your discipline point balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getPointsColor(currentPoints)}`}>
                    {currentPoints}
                  </div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                </div>
                <Progress value={currentPoints} className="h-3" />
                <div className="text-center">
                  <Badge variant={currentPoints >= 60 ? "secondary" : "destructive"}>
                    {getPointsStatus(currentPoints)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Total Deducted
              </CardTitle>
              <CardDescription>Points lost from offences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-red-600">
                  -{totalDeducted}
                </div>
                <div className="text-sm text-muted-foreground">
                  from {disciplineRecords.length} incidents
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest discipline record</CardDescription>
            </CardHeader>
            <CardContent>
              {disciplineRecords.length === 0 ? (
                <div className="text-center py-4">
                  <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-600">Perfect Record!</p>
                  <p className="text-xs text-muted-foreground">No discipline incidents</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium text-sm">{disciplineRecords[0].offenceName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(disciplineRecords[0].date)}
                  </p>
                  <Badge variant={getSeverityColor(disciplineRecords[0].pointsDeducted)}>
                    -{disciplineRecords[0].pointsDeducted} points
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Discipline History */}
        <Card>
          <CardHeader>
            <CardTitle>Discipline History</CardTitle>
            <CardDescription>
              Complete record of all discipline incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {disciplineRecords.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-600 mb-2">Excellent Behavior!</h3>
                <p className="text-muted-foreground">
                  You have no discipline records. Keep up the great work!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {disciplineRecords.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{record.offenceName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {record.offenceDescription}
                        </p>
                      </div>
                      <Badge variant={getSeverityColor(record.pointsDeducted)}>
                        -{record.pointsDeducted} points
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Reported by: {record.teacherName}</span>
                      <span>{formatDate(record.date)}</span>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={loadMoreRecords}
                      disabled={loadingMore}
                    >
                      {loadingMore ? "Loading..." : "Load More Records"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discipline Guidelines */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Understanding Discipline Points</CardTitle>
            <CardDescription>How the discipline system works</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Point System</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Start with 100 points</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Points deducted for offences</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Below 40 points = Critical status</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Status Levels</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">80-100 points</span>
                    <Badge variant="secondary">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">60-79 points</span>
                    <Badge variant="default">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">40-59 points</span>
                    <Badge variant="default">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Below 40 points</span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

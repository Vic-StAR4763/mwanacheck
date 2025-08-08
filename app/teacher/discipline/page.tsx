"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { AlertTriangle, ArrowLeft, Clock, User, FileText } from 'lucide-react'
import Link from "next/link"
import { 
  getOffencesBySchool, 
  getStudentsByClass, 
  createDisciplineRecord,
  getDisciplineRecordsBySchool,
  getClassesByTeacher
} from "@/lib/firestore"
import type { Offence, StudentRecord, DisciplineRecord, Class } from "@/lib/models"

export default function TeacherDiscipline() {
  const { user } = useAuth()
  const [offences, setOffences] = useState<Offence[]>([])
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [recentRecords, setRecentRecords] = useState<DisciplineRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showIssueDialog, setShowIssueDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    offenceId: "",
    additionalNotes: "",
  })
  const [selectedOffence, setSelectedOffence] = useState<Offence | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)

  useEffect(() => {
    if (user?.schoolId) {
      loadData()
    }
  }, [user?.schoolId])

  const loadData = async () => {
    if (!user?.schoolId || !user?.uid) return

    try {
      setLoading(true)
      const [offencesData, classesData, recordsData] = await Promise.all([
        getOffencesBySchool(user.schoolId),
        getClassesByTeacher(user.uid),
        getDisciplineRecordsBySchool(user.schoolId, 20)
      ])
      
      setOffences(offencesData)
      setClasses(classesData)
      setRecentRecords(recordsData)

      // Load students from teacher's classes
      if (classesData.length > 0) {
        const allStudents: StudentRecord[] = []
        for (const cls of classesData) {
          const classStudents = await getStudentsByClass(cls.id)
          allStudents.push(...classStudents)
        }
        setStudents(allStudents)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      toast({
        title: "Error",
        description: "Failed to load discipline data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleIssueOffence = () => {
    setFormData({
      studentId: "",
      offenceId: "",
      additionalNotes: "",
    })
    setSelectedOffence(null)
    setSelectedStudent(null)
    setShowIssueDialog(true)
  }

  const handleStudentChange = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    setSelectedStudent(student || null)
    setFormData(prev => ({ ...prev, studentId }))
  }

  const handleOffenceChange = (offenceId: string) => {
    const offence = offences.find(o => o.id === offenceId)
    setSelectedOffence(offence || null)
    setFormData(prev => ({ ...prev, offenceId }))
  }

  const handleProceedToConfirm = () => {
    if (!formData.studentId || !formData.offenceId) {
      toast({
        title: "Missing Information",
        description: "Please select both a student and an offence.",
        variant: "destructive",
      })
      return
    }

    setShowIssueDialog(false)
    setShowConfirmDialog(true)
  }

  const handleConfirmIssue = async () => {
    if (!user?.schoolId || !user?.uid || !selectedStudent || !selectedOffence) return

    try {
      setSubmitting(true)

      await createDisciplineRecord({
        schoolId: user.schoolId,
        studentId: selectedStudent.id,
        teacherId: user.uid,
        teacherName: user.name,
        offenceId: selectedOffence.id,
        offenceName: selectedOffence.name,
        offenceDescription: selectedOffence.description,
        pointsDeducted: selectedOffence.pointsToDeduct,
        date: new Date().toISOString(),
      })

      toast({
        title: "Offence Issued",
        description: `${selectedOffence.pointsToDeduct} points deducted from ${selectedStudent.name}.`,
      })

      setShowConfirmDialog(false)
      await loadData() // Refresh data
    } catch (error) {
      console.error("Failed to issue offence:", error)
      toast({
        title: "Error",
        description: "Failed to issue offence. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getSeverityColor = (points: number) => {
    if (points >= 15) return "destructive"
    if (points >= 8) return "default"
    return "secondary"
  }

  const getSeverityLabel = (points: number) => {
    if (points >= 15) return "High"
    if (points >= 8) return "Medium"
    return "Low"
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
      <ProtectedRoute allowedRoles={["teacher"]}>
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div className="h-8 bg-muted rounded w-64 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-48 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-16 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/teacher">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Discipline Management</h1>
              <p className="text-muted-foreground">Issue offences to students in your classes</p>
            </div>
          </div>
          <Button onClick={handleIssueOffence} disabled={students.length === 0 || offences.length === 0}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Issue Offence
          </Button>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground">
                You don't have any students assigned to your classes yet.
              </p>
            </CardContent>
          </Card>
        ) : offences.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Offences Configured</h3>
              <p className="text-muted-foreground">
                Your school administrator needs to configure offence types before you can issue discipline.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Classes */}
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Students you can issue offences to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classes.map((cls) => {
                    const classStudents = students.filter(s => s.classId === cls.id)
                    return (
                      <div key={cls.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">{cls.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {classStudents.length} students
                        </p>
                        <div className="space-y-2">
                          {classStudents.slice(0, 3).map((student) => (
                            <div key={student.id} className="flex items-center justify-between text-sm">
                              <span>{student.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {student.disciplinePoints || 100} pts
                              </Badge>
                            </div>
                          ))}
                          {classStudents.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{classStudents.length - 3} more students
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Discipline Records */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Discipline Records</CardTitle>
                <CardDescription>Latest offences issued school-wide</CardDescription>
              </CardHeader>
              <CardContent>
                {recentRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent discipline records</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{record.offenceName}</p>
                            <p className="text-sm text-muted-foreground">
                              Student: {students.find(s => s.id === record.studentId)?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              By: {record.teacherName}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getSeverityColor(record.pointsDeducted)}>
                              -{record.pointsDeducted} pts
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(record.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Issue Offence Dialog */}
        <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Issue Discipline Offence</DialogTitle>
              <DialogDescription>
                Select a student and offence type to deduct discipline points.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student-select">Select Student</Label>
                  <Select value={formData.studentId} onValueChange={handleStudentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => {
                        const classStudents = students.filter(s => s.classId === cls.id)
                        return classStudents.length > 0 ? (
                          <div key={cls.id}>
                            <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                              {cls.name}
                            </div>
                            {classStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{student.name}</span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {student.disciplinePoints || 100} pts
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ) : null
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="offence-select">Select Offence</Label>
                  <Select value={formData.offenceId} onValueChange={handleOffenceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an offence..." />
                    </SelectTrigger>
                    <SelectContent>
                      {offences.map((offence) => (
                        <SelectItem key={offence.id} value={offence.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{offence.name}</span>
                            <Badge variant={getSeverityColor(offence.pointsToDeduct)} className="ml-2">
                              -{offence.pointsToDeduct}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedStudent && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Selected Student</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedStudent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Class: {classes.find(c => c.id === selectedStudent.classId)?.name || "Unknown"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Current Points</p>
                      <p className="text-lg font-bold">{selectedStudent.disciplinePoints || 100}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedOffence && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Selected Offence</h4>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{selectedOffence.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedOffence.description}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(selectedOffence.pointsToDeduct)}>
                      -{selectedOffence.pointsToDeduct} pts
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additional-notes"
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  placeholder="Add any additional context or details about this incident..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowIssueDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProceedToConfirm}
                disabled={!formData.studentId || !formData.offenceId}
              >
                Review & Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Discipline Action</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <p>You are about to issue the following discipline:</p>
                  
                  {selectedStudent && selectedOffence && (
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Student:</span>
                        <span>{selectedStudent.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Offence:</span>
                        <span>{selectedOffence.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Points to Deduct:</span>
                        <Badge variant={getSeverityColor(selectedOffence.pointsToDeduct)}>
                          -{selectedOffence.pointsToDeduct}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">New Point Total:</span>
                        <span className="font-bold">
                          {(selectedStudent.disciplinePoints || 100) - selectedOffence.pointsToDeduct}
                        </span>
                      </div>
                      {formData.additionalNotes && (
                        <div>
                          <span className="font-medium">Notes:</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formData.additionalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone. The student and their parents will be notified.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmIssue}
                disabled={submitting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {submitting ? "Issuing..." : "Issue Offence"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ProtectedRoute>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from "@/lib/auth"
import { createDisciplineReport, getStudentsBySchool } from "@/lib/firestore"
import type { StudentRecord } from "@/lib/models"

interface DisciplineModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function DisciplineModal({ isOpen, onClose, onSuccess }: DisciplineModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [formData, setFormData] = useState({
    studentId: "",
    incident: "",
    description: "",
    pointsDeducted: "",
  })

  useEffect(() => {
    if (isOpen && user?.schoolId) {
      loadStudents()
    }
  }, [isOpen, user?.schoolId])

  const loadStudents = async () => {
    if (!user?.schoolId) return
    try {
      const schoolStudents = await getStudentsBySchool(user.schoolId)
      setStudents(schoolStudents)
    } catch (err) {
      console.error("Failed to load students:", err)
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setError("")

    try {
      const selectedStudent = students.find(s => s.id === formData.studentId)
      if (!selectedStudent) {
        throw new Error("Student not found")
      }

      await createDisciplineReport({
        studentId: formData.studentId,
        schoolId: user.schoolId,
        incident: formData.incident,
        description: formData.description,
        pointsDeducted: parseInt(formData.pointsDeducted),
        reportedBy: user.uid,
        reportedByName: user.name,
        date: new Date().toISOString(),
      })

      onSuccess?.()
      onClose()
      setFormData({ studentId: "", incident: "", description: "", pointsDeducted: "" })
    } catch (err: any) {
      setError(err.message || "Failed to report incident")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const disciplineRules = [
    { rule: "Late to class", points: 5 },
    { rule: "Uniform violation", points: 3 },
    { rule: "Disrespectful behavior", points: 10 },
    { rule: "Missing homework", points: 2 },
    { rule: "Fighting", points: 15 },
    { rule: "Other", points: 0 },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 dark:bg-white/5">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Report Discipline Incident</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Student</label>
            <select
              name="studentId"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.studentId}
              onChange={handleInputChange}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Incident Type</label>
            <select
              name="incident"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formData.incident}
              onChange={(e) => {
                handleInputChange(e)
                const selectedRule = disciplineRules.find((rule) => rule.rule === e.target.value)
                if (selectedRule && selectedRule.points > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    pointsDeducted: selectedRule.points.toString(),
                  }))
                }
              }}
            >
              <option value="">Select Incident</option>
              {disciplineRules.map((rule, index) => (
                <option key={index} value={rule.rule}>
                  {rule.rule} {rule.points > 0 && `(-${rule.points} pts)`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Points to Deduct</label>
            <input
              type="number"
              name="pointsDeducted"
              required
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter points"
              value={formData.pointsDeducted}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe the incident in detail..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reporting...
                </>
              ) : (
                "Report Incident"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

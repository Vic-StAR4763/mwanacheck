"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Award, Loader2 } from 'lucide-react'
import { useAuth } from "@/lib/auth"
import { createMerit, getStudentsBySchool } from "@/lib/firestore"
import type { StudentRecord } from "@/lib/models"

interface AwardMeritModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AwardMeritModal({ isOpen, onClose, onSuccess }: AwardMeritModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    description: "",
    points: "",
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

      await createMerit({
        studentId: formData.studentId,
        schoolId: user.schoolId,
        title: formData.title,
        description: formData.description,
        points: parseInt(formData.points),
        awardedBy: user.uid,
        awardedByName: user.name,
        date: new Date().toISOString(),
      })

      onSuccess?.()
      onClose()
      setFormData({ studentId: "", title: "", description: "", points: "" })
    } catch (err: any) {
      setError(err.message || "Failed to award merit")
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

  const meritTypes = [
    { title: "Academic Excellence", points: 10 },
    { title: "Leadership", points: 8 },
    { title: "Sports Achievement", points: 6 },
    { title: "Community Service", points: 5 },
    { title: "Perfect Attendance", points: 4 },
    { title: "Other", points: 0 },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Award Merit</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
            <select
              name="studentId"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merit Type</label>
            <select
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.title}
              onChange={(e) => {
                handleInputChange(e)
                const selectedMerit = meritTypes.find((merit) => merit.title === e.target.value)
                if (selectedMerit && selectedMerit.points > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    points: selectedMerit.points.toString(),
                  }))
                }
              }}
            >
              <option value="">Select Merit Type</option>
              {meritTypes.map((merit, index) => (
                <option key={index} value={merit.title}>
                  {merit.title} {merit.points > 0 && `(+${merit.points} pts)`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Points to Award</label>
            <input
              type="number"
              name="points"
              required
              min="1"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter points"
              value={formData.points}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe the achievement..."
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
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Awarding...
                </>
              ) : (
                "Award Merit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

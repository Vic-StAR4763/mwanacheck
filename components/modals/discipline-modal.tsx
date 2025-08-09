"use client"

import type React from "react"

import { useState } from "react"
import { X, AlertTriangle, Loader2 } from "lucide-react"

interface DisciplineModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DisciplineModal({ isOpen, onClose }: DisciplineModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    incident: "",
    description: "",
    pointsDeducted: "",
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLoading(false)
    onClose()
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
              <option value="student1">Alice Student</option>
              <option value="student2">Bob Johnson</option>
              <option value="student3">Carol Smith</option>
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

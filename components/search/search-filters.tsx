"use client"

import { useState } from "react"
import type { SearchFilters } from "@/lib/search"
import { X, GraduationCap, Target, Users, Building } from "lucide-react"

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClear: () => void
}

export function SearchFiltersComponent({ filters, onFiltersChange, onClear }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.type || []
    const newTypes = checked ? [...currentTypes, type] : currentTypes.filter((t) => t !== type)

    onFiltersChange({ ...filters, type: newTypes })
  }

  const handleGpaRangeChange = (field: "min" | "max", value: string) => {
    const numValue = Number.parseFloat(value) || 0
    const currentRange = filters.gpaRange || { min: 0, max: 4 }

    onFiltersChange({
      ...filters,
      gpaRange: { ...currentRange, [field]: numValue },
    })
  }

  const handleDisciplineRangeChange = (field: "min" | "max", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const currentRange = filters.disciplineRange || { min: 0, max: 100 }

    onFiltersChange({
      ...filters,
      disciplineRange: { ...currentRange, [field]: numValue },
    })
  }

  const handleClassChange = (className: string, checked: boolean) => {
    const currentClasses = filters.class || []
    const newClasses = checked ? [...currentClasses, className] : currentClasses.filter((c) => c !== className)

    onFiltersChange({ ...filters, class: newClasses })
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatuses = filters.status || []
    const newStatuses = checked ? [...currentStatuses, status] : currentStatuses.filter((s) => s !== status)

    onFiltersChange({ ...filters, status: newStatuses })
  }

  const hasActiveFilters = () => {
    return (
      (filters.type && filters.type.length > 0) ||
      filters.gpaRange ||
      filters.disciplineRange ||
      (filters.class && filters.class.length > 0) ||
      (filters.status && filters.status.length > 0)
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Search Filters
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <button
              onClick={onClear}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            {isExpanded ? <X className="h-5 w-5" /> : <Target className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Content Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { value: "student", label: "Students", icon: GraduationCap },
                { value: "teacher", label: "Teachers", icon: Users },
                { value: "parent", label: "Parents", icon: Users },
                { value: "school", label: "Schools", icon: Building },
                { value: "user", label: "Users", icon: Users },
              ].map(({ value, label, icon: Icon }) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type?.includes(value) || false}
                    onChange={(e) => handleTypeChange(value, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* GPA Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GPA Range (Students Only)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.1"
                  value={filters.gpaRange?.min || ""}
                  onChange={(e) => handleGpaRangeChange("min", e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum</label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  step="0.1"
                  value={filters.gpaRange?.max || ""}
                  onChange={(e) => handleGpaRangeChange("max", e.target.value)}
                  placeholder="4.0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Discipline Points Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Discipline Points Range (Students Only)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.disciplineRange?.min || ""}
                  onChange={(e) => handleDisciplineRangeChange("min", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Maximum</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.disciplineRange?.max || ""}
                  onChange={(e) => handleDisciplineRangeChange("max", e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Class</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Form 1A", "Form 1B", "Form 2A", "Form 2B", "Form 3A", "Form 3B", "Form 4A", "Form 4B"].map(
                (className) => (
                  <label key={className} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.class?.includes(className) || false}
                      onChange={(e) => handleClassChange(className, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{className}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["active", "inactive", "suspended"].map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.status?.includes(status) || false}
                    onChange={(e) => handleStatusChange(status, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

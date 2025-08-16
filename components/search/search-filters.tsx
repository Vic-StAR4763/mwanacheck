"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"
import type { SearchFiltersType } from "@/lib/search"

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onClearFilters: () => void
}

export function SearchFilters({ filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFiltersType>(filters)

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setLocalFilters({})
    onClearFilters()
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">Search Filters</CardTitle>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="type-filter">Type</Label>
          <Select
            value={localFilters.type || "all"}
            onValueChange={(value) => handleFilterChange("type", value || undefined)}
          >
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
              <SelectItem value="parent">Parents</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status-filter">Status</Label>
          <Select
            value={localFilters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value || undefined)}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* GPA Range Filter (only for students) */}
        {(!localFilters.type || localFilters.type === "student") && (
          <div className="space-y-3">
            <Label>GPA Range</Label>
            <div className="px-2">
              <Slider
                value={localFilters.gpaRange || [0, 4]}
                onValueChange={(value) => handleFilterChange("gpaRange", value as [number, number])}
                max={4}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{localFilters.gpaRange?.[0]?.toFixed(1) || "0.0"}</span>
                <span>{localFilters.gpaRange?.[1]?.toFixed(1) || "4.0"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Discipline Points Range Filter (only for students) */}
        {(!localFilters.type || localFilters.type === "student") && (
          <div className="space-y-3">
            <Label>Discipline Points Range</Label>
            <div className="px-2">
              <Slider
                value={localFilters.disciplineRange || [0, 100]}
                onValueChange={(value) => handleFilterChange("disciplineRange", value as [number, number])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{localFilters.disciplineRange?.[0] || 0}</span>
                <span>{localFilters.disciplineRange?.[1] || 100}</span>
              </div>
            </div>
          </div>
        )}

        {/* Class Filter */}
        <div className="space-y-2">
          <Label htmlFor="class-filter">Class</Label>
          <Input
            id="class-filter"
            placeholder="Enter class name..."
            value={localFilters.classId || ""}
            onChange={(e) => handleFilterChange("classId", e.target.value || undefined)}
          />
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Active filters:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {localFilters.type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Type: {localFilters.type}
                  </span>
                )}
                {localFilters.status && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Status: {localFilters.status}
                  </span>
                )}
                {localFilters.gpaRange && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    GPA: {localFilters.gpaRange[0].toFixed(1)}-{localFilters.gpaRange[1].toFixed(1)}
                  </span>
                )}
                {localFilters.disciplineRange && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    Discipline: {localFilters.disciplineRange[0]}-{localFilters.disciplineRange[1]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import type { SearchResult } from "@/lib/search"
import { GraduationCap, Users, Building, Mail, Phone, MapPin, Award, Target, Calendar } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isLoading?: boolean
}

export function SearchResults({ results, query, isLoading = false }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 animate-pulse"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {query ? `No results found for "${query}"` : "Try adjusting your search terms or filters"}
        </p>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          <p>Search tips:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your spelling</li>
            <li>• Try different keywords</li>
            <li>• Use fewer filters</li>
            <li>• Search for partial names or IDs</li>
          </ul>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "student":
        return <GraduationCap className="h-6 w-6 text-blue-600" />
      case "teacher":
        return <Users className="h-6 w-6 text-green-600" />
      case "parent":
        return <Users className="h-6 w-6 text-purple-600" />
      case "school":
        return <Building className="h-6 w-6 text-orange-600" />
      default:
        return <Users className="h-6 w-6 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "teacher":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "parent":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "school":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getDetailUrl = (result: SearchResult) => {
    switch (result.type) {
      case "student":
        return `/student/${result.id}`
      case "teacher":
        return `/teacher/${result.id}`
      case "parent":
        return `/parent/${result.id}`
      case "school":
        return `/school/${result.id}`
      default:
        return "#"
    }
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-900/25 transition-shadow"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {getTypeIcon(result.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3
                  className="text-lg font-medium text-gray-900 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: result.title }}
                />
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getTypeColor(result.type)}`}
                >
                  {result.type}
                </span>
              </div>

              <p
                className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                dangerouslySetInnerHTML={{ __html: result.subtitle }}
              />

              <p
                className="text-sm text-gray-500 dark:text-gray-500 mb-3"
                dangerouslySetInnerHTML={{ __html: result.description }}
              />

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                {result.metadata.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{result.metadata.email}</span>
                  </div>
                )}
                {result.metadata.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{result.metadata.phone}</span>
                  </div>
                )}
                {result.metadata.address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{result.metadata.address}</span>
                  </div>
                )}
                {result.metadata.gpa && (
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3" />
                    <span>GPA: {result.metadata.gpa}</span>
                  </div>
                )}
                {result.metadata.disciplinePoints && (
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>Discipline: {result.metadata.disciplinePoints}/100</span>
                  </div>
                )}
                {(result.metadata.joinDate || result.metadata.dateOfBirth) && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {result.metadata.joinDate
                        ? `Joined: ${new Date(result.metadata.joinDate).toLocaleDateString()}`
                        : `DOB: ${new Date(result.metadata.dateOfBirth).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={getDetailUrl(result)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

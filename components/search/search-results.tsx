"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, GraduationCap, Users, Shield, Mail, Phone, Star, AlertTriangle } from "lucide-react"
import type { SearchResult } from "@/lib/search"

interface SearchResultsProps {
  results: SearchResult[]
  loading?: boolean
  query?: string
}

export function SearchResults({ results, loading = false, query }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300 dark:text-gray-600">
          <User className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {query
            ? `No results found for "${query}". Try adjusting your search terms or filters.`
            : "Try searching for students, teachers, or parents."}
        </p>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "teacher":
        return <User className="h-4 w-4" />
      case "parent":
        return <Users className="h-4 w-4" />
      case "admin":
        return <Shield className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "teacher":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "parent":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/placeholder-user.jpg`} alt={result.title} />
                <AvatarFallback className="bg-gray-100 dark:bg-gray-800">{getInitials(result.title)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                        dangerouslySetInnerHTML={{ __html: result.title }}
                      />
                      <Badge className={`${getTypeBadgeColor(result.type)} flex items-center space-x-1`}>
                        {getTypeIcon(result.type)}
                        <span className="capitalize">{result.type}</span>
                      </Badge>
                    </div>

                    <p
                      className="text-sm text-gray-600 dark:text-gray-400 mb-2"
                      dangerouslySetInnerHTML={{ __html: result.subtitle }}
                    />

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
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
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1 ml-4">
                    {result.type === "student" && (
                      <>
                        {result.metadata.gpa && (
                          <div className="flex items-center space-x-1 text-xs">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="font-medium">GPA: {result.metadata.gpa}</span>
                          </div>
                        )}
                        {result.metadata.disciplinePoints !== undefined && (
                          <div className="flex items-center space-x-1 text-xs">
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                            <span className="font-medium">Discipline: {result.metadata.disciplinePoints}/100</span>
                          </div>
                        )}
                      </>
                    )}
                    {result.metadata.class && (
                      <Badge variant="outline" className="text-xs">
                        {result.metadata.class}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Additional metadata for students */}
                {result.type === "student" && result.metadata.parent && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="h-3 w-3" />
                      <span>Parent: {result.metadata.parent}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

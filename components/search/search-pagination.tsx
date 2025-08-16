"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SearchPaginationProps {
  currentPage: number
  totalResults: number
  resultsPerPage: number
  hasMore: boolean
  onPageChange: (page: number) => void
  loading?: boolean
}

export function SearchPagination({
  currentPage,
  totalResults,
  resultsPerPage,
  hasMore,
  onPageChange,
  loading = false,
}: SearchPaginationProps) {
  const totalPages = Math.ceil(totalResults / resultsPerPage)
  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  if (totalResults === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{startResult}</span> to <span className="font-medium">{endResult}</span>{" "}
        of <span className="font-medium">{totalResults}</span> results
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-1">
          {/* Show page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore || loading}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

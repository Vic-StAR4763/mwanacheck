"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { SearchBar } from "@/components/search/search-bar"
import { SearchFiltersComponent } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { SearchPagination } from "@/components/search/search-pagination"
import { performSearch, type SearchFilters, type SearchResult } from "@/lib/search"
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "date" | "gpa" | "discipline">("relevance")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showFilters, setShowFilters] = useState(false)

  const limit = 10

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = async (searchQuery: string = query, page = 1) => {
    setIsLoading(true)
    setCurrentPage(page)

    try {
      const searchResults = await performSearch({
        query: searchQuery,
        filters,
        page,
        limit,
        sortBy,
        sortOrder,
      })

      setResults(searchResults.results)
      setTotalPages(searchResults.totalPages)
      setTotal(searchResults.total)
      setQuery(searchQuery)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
      setTotal(0)
      setTotalPages(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    handleSearch(query, 1)
  }

  const handleClearFilters = () => {
    setFilters({})
    setCurrentPage(1)
    handleSearch(query, 1)
  }

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("desc")
    }
    setCurrentPage(1)
    handleSearch(query, 1)
  }

  const handlePageChange = (page: number) => {
    handleSearch(query, page)
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher", "parent", "student"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Search className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Search across students, teachers, parents, and schools</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search students, teachers, parents, schools..."
              showFilters={false}
              className="max-w-2xl"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </button>
              </div>

              <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
                <SearchFiltersComponent
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClear={handleClearFilters}
                />
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {query ? `Results for "${query}"` : "All Results"}
                  </h2>
                  {!isLoading && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {total} {total === 1 ? "result" : "results"}
                    </span>
                  )}
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split("-") as [typeof sortBy, typeof sortOrder]
                      setSortBy(newSortBy)
                      setSortOrder(newSortOrder)
                      setCurrentPage(1)
                      handleSearch(query, 1)
                    }}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="relevance-desc">Most Relevant</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="gpa-desc">Highest GPA</option>
                    <option value="gpa-asc">Lowest GPA</option>
                    <option value="discipline-desc">Best Discipline</option>
                    <option value="discipline-asc">Needs Attention</option>
                  </select>
                </div>
              </div>

              {/* Search Results */}
              <SearchResults results={results} query={query} isLoading={isLoading} />

              {/* Pagination */}
              {!isLoading && results.length > 0 && (
                <div className="mt-8">
                  <SearchPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    total={total}
                    limit={limit}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

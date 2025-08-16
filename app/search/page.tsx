"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SearchBar } from "@/components/search/search-bar"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { SearchPagination } from "@/components/search/search-pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { performSearch } from "@/lib/search"
import type { SearchFilters as SearchFiltersType, SearchResult } from "@/lib/search"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState<SearchFiltersType>({})
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const resultsPerPage = 10

  const handleSearch = useCallback(async (searchQuery: string, searchFilters: SearchFiltersType = {}, page = 1) => {
    setLoading(true)
    try {
      const searchResults = await performSearch(searchQuery, searchFilters, page, resultsPerPage)
      setResults(searchResults.results)
      setTotalResults(searchResults.total)
      setHasMore(searchResults.hasMore)
      setCurrentPage(page)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
      setTotalResults(0)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial search on page load
  useEffect(() => {
    if (query) {
      handleSearch(query, filters, 1)
    }
  }, [])

  // Handle search query changes
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery)
    const params = new URLSearchParams(searchParams.toString())
    if (newQuery) {
      params.set("q", newQuery)
    } else {
      params.delete("q")
    }
    router.push(`/search?${params.toString()}`)
    handleSearch(newQuery, filters, 1)
  }

  // Handle filter changes
  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
    handleSearch(query, newFilters, 1)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({})
    handleSearch(query, {}, 1)
  }

  // Handle page changes
  const handlePageChange = (page: number) => {
    handleSearch(query, filters, page)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Search</h1>
        <SearchBar
          onSearch={handleQueryChange}
          placeholder="Search students, teachers, parents..."
          showFilters={false}
          className="max-w-2xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} onClearFilters={handleClearFilters} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Search Results</span>
                {!loading && totalResults > 0 && (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {totalResults} result{totalResults !== 1 ? "s" : ""} found
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchResults results={results} loading={loading} query={query} />

              {totalResults > resultsPerPage && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <SearchPagination
                    currentPage={currentPage}
                    totalResults={totalResults}
                    resultsPerPage={resultsPerPage}
                    hasMore={hasMore}
                    onPageChange={handlePageChange}
                    loading={loading}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore, type Book } from '@/store/useAppStore'
import Header from './Header'
import BookCard from './BookCard'
import BookDetailModal from './BookDetailModal'
import AddBookModal from './AddBookModal'

export default function FeedView() {
  const {
    books,
    categories,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    searchQuery,
    setBooks,
    isLoading,
    setLoading,
    selectedBook,
    setSelectedBook,
    currentView,
    setCategories,
  } = useAppStore()

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Categories that have books (from the categories in store)
  const categoriesWithBooks = categories.filter((c) => c.bookCount > 0)

  // Track the initial mount — if page.tsx already loaded books into the store,
  // we don't need to re-fetch on first render.
  const initialBooksLoaded = useRef(books.length > 0)

  const fetchBooks = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', String(pageNum))
        params.set('limit', '20')
        if (activeCategory) {
          const cat = categories.find((c) => c.slug === activeCategory)
          if (cat) params.set('categoryId', cat.id)
        }
        if (sortBy) params.set('sort', sortBy)
        if (searchQuery) params.set('search', searchQuery)

        const res = await fetch(`/api/books?${params.toString()}`)
        const json = await res.json()
        if (json.success) {
          const data = json.data.books as Book[]
          if (append) {
            const existing = useAppStore.getState().books
            setBooks([...existing, ...data])
          } else {
            setBooks(data)
          }
          setHasMore(data.length === 20)
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    },
    [activeCategory, categories, sortBy, searchQuery, setLoading, setBooks]
  )

  // Re-fetch when filters change (skip the very first render if books already loaded)
  useEffect(() => {
    if (initialBooksLoaded.current && page === 1 && !activeCategory && sortBy === 'popular' && !searchQuery) {
      // First render with pre-loaded data — skip the redundant fetch
      initialBooksLoaded.current = false
      return
    }
    initialBooksLoaded.current = false
    setPage(1)
    setHasMore(true)
    fetchBooks(1, false)
  }, [activeCategory, sortBy])

  // Separate search effect with debounce
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setPage(1)
      setHasMore(true)
      fetchBooks(1, false)
    }, 500)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [searchQuery])

  // Infinite scroll
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchBooks(nextPage, true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoading, page, fetchBooks])

  const sortOptions = [
    { label: 'Popular', value: 'popular' },
    { label: 'Newest', value: 'newest' },
    { label: 'Most Read', value: 'reading' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        {/* Sticky category filter bar */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="max-w-[1600px] mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              <Button
                variant={activeCategory === null ? 'default' : 'outline'}
                size="sm"
                className="shrink-0 rounded-full text-xs h-8"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {categoriesWithBooks.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  className="shrink-0 rounded-full text-xs h-8 gap-1.5"
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                </Button>
              ))}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Sort controls */}
              <div className="flex items-center gap-1 shrink-0">
                {sortOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={sortBy === opt.value ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-full text-xs h-8"
                    onClick={() => setSortBy(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          {isLoading && books.length === 0 ? (
            <div className="masonry-grid">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="masonry-item">
                  <div className="bg-card rounded-xl overflow-hidden">
                    <Skeleton className="w-full aspect-[3/4]" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No books found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your filters or search query to discover more books.
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => {
                  setActiveCategory(null)
                  useAppStore.getState().setSearchQuery('')
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="masonry-grid">
              {books.map((book, index) => (
                <div key={book.id} className="masonry-item">
                  <BookCard book={book} showDescription={index % 2 === 0} />
                </div>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && <div ref={loadMoreRef} className="h-10" />}

          {/* Loading more indicator */}
          {isLoading && books.length > 0 && (
            <div className="flex justify-center py-8">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 py-6 text-center text-sm text-muted-foreground">
        © 2024 BookFriends.lk — Where all the books gather together!
      </footer>

      {/* Book Detail Overlay */}
      {currentView === 'book-detail' && selectedBook && <BookDetailModal />}

      {/* Add Book Dialog */}
      {currentView === 'add-book' && <AddBookModal />}
    </div>
  )
}
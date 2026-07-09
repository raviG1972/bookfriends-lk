'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Library, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { useAppStore } from '@/store/useAppStore'
import Header from './Header'

const statusLabels: Record<string, string> = {
  all: 'All',
  'want-to-read': 'Want to Read',
  reading: 'Currently Reading',
  finished: 'Finished',
}

const statusColors: Record<string, string> = {
  'want-to-read': 'bg-amber-100 text-amber-700',
  reading: 'bg-teal-100 text-teal-700',
  finished: 'bg-green-100 text-green-700',
}

export default function BookshelfView() {
  const {
    user,
    bookshelfItems,
    setBookshelfItems,
    bookshelfFilter,
    setBookshelfFilter,
    setSelectedBook,
    setView,
  } = useAppStore()

  const [loading, setLoading] = useState(true)

  const fetchBookshelf = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/bookshelf?userId=${user.id}`)
      const json = await res.json()
      if (json.success) {
        setBookshelfItems(json.data)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [user, setBookshelfItems])

  useEffect(() => {
    fetchBookshelf()
  }, [fetchBookshelf])

  const handleRemove = async (bookId: string) => {
    if (!user) return
    try {
      const res = await fetch(`/api/bookshelf?userId=${user.id}&bookId=${bookId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        setBookshelfItems(bookshelfItems.filter((item) => item.bookId !== bookId))
        toast.success('Removed from bookshelf')
      } else {
        toast.error(json.error || 'Failed to remove')
      }
    } catch {
      toast.error('Failed to remove')
    }
  }

  const filteredItems = bookshelfItems.filter((item) => {
    if (bookshelfFilter === 'all') return true
    return item.status === bookshelfFilter
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Library className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold">My Bookshelf</h1>
            <Badge variant="secondary" className="text-xs">
              {bookshelfItems.length} books
            </Badge>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(statusLabels).map(([key, label]) => (
              <Button
                key={key}
                variant={bookshelfFilter === key ? 'default' : 'outline'}
                size="sm"
                className="shrink-0 rounded-full text-xs"
                onClick={() => setBookshelfFilter(key)}
              >
                {label}
                {key !== 'all' && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    ({bookshelfItems.filter((i) => i.status === key).length})
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden border">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {bookshelfItems.length === 0
                  ? 'Your bookshelf is empty!'
                  : 'No books in this category'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {bookshelfItems.length === 0
                  ? 'Start exploring books to add them here.'
                  : 'Try a different filter.'}
              </p>
              {bookshelfItems.length === 0 && (
                <Button
                  onClick={() => setView('feed')}
                  className="rounded-full"
                >
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Explore Books
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const book = item.book
                if (!book) return null
                const coverIndex = Math.abs(book.id.charCodeAt(0) % 12) + 1
                const coverSrc = book.coverImage || `/covers/book${coverIndex}.png`

                return (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative"
                    onClick={() => {
                      setSelectedBook(book)
                      setView('book-detail')
                    }}
                  >
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(book.id)
                      }}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Cover */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                      <Image
                        src={coverSrc}
                        alt={book.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {book.author}
                      </p>
                      <div className="mt-2">
                        <Badge
                          className={`text-[10px] px-1.5 py-0 border-0 ${
                            statusColors[item.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {statusLabels[item.status] || item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 py-6 text-center text-sm text-muted-foreground">
        © 2024 BookFriends.lk — Where all the books gather together!
      </footer>
    </div>
  )
}
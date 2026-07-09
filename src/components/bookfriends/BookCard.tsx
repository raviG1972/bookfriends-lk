'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, BookOpen, Headphones, Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useAppStore, type Book } from '@/store/useAppStore'

const langColors: Record<string, string> = {
  sinhala: 'bg-amber-100 text-amber-700',
  english: 'bg-teal-100 text-teal-700',
  tamil: 'bg-purple-100 text-purple-700',
}

const langLabels: Record<string, string> = {
  sinhala: 'සිංහල',
  english: 'EN',
  tamil: 'தமிழ்',
}

interface BookCardProps {
  book: Book
  showDescription?: boolean
}

export default function BookCard({ book, showDescription = false }: BookCardProps) {
  const { setSelectedBook, setView, user } = useAppStore()
  const [addedToShelf, setAddedToShelf] = useState(book.inBookshelf || false)
  const [likeCount, setLikeCount] = useState(book.likes)

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button
    const target = e.target as HTMLElement
    if (target.closest('button')) return
    setSelectedBook(book)
    setView('book-detail')
  }

  const handleAddToBookshelf = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to add books to your bookshelf')
      return
    }
    try {
      const res = await fetch('/api/bookshelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
          status: 'want-to-read',
        }),
      })
      const json = await res.json()
      if (json.success) {
        setAddedToShelf(true)
        toast.success('Added to bookshelf!')
      } else {
        toast.error(json.error || 'Failed to add to bookshelf')
      }
    } catch {
      toast.error('Failed to add to bookshelf')
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLikeCount((prev) => prev + 1)
  }

  // Determine cover image
  const coverIndex = Math.abs(book.id.charCodeAt(0) % 12) + 1
  const coverSrc = book.coverImage || `/covers/book${coverIndex}.png`

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-border/50"
      onClick={handleCardClick}
    >
      {/* Cover image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={coverSrc}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Language badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge
            className={`text-[10px] px-1.5 py-0 font-medium border-0 ${
              langColors[book.language] || 'bg-gray-100 text-gray-700'
            }`}
          >
            {langLabels[book.language] || book.language}
          </Badge>
        </div>
        {/* Verified badge */}
        {book.status === 'verified' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-teal-600 text-white text-[10px] px-1.5 py-0 border-0">
              ✓ Verified
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>

        {/* Description (only if showDescription) */}
        {showDescription && book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
          <span className="flex items-center gap-0.5">
            <Heart className="w-3 h-3" />
            {likeCount}
          </span>
          <span className="flex items-center gap-0.5">
            <BookOpen className="w-3 h-3" />
            {book.readingCount}
          </span>
          <span className="flex items-center gap-0.5">
            <Headphones className="w-3 h-3" />
            {book.listeningCount}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px] rounded-lg px-2 flex-1"
            onClick={handleAddToBookshelf}
            disabled={addedToShelf}
          >
            <Plus className="w-3 h-3 mr-0.5" />
            {addedToShelf ? 'Added' : 'Bookshelf'}
          </Button>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] rounded-lg px-2"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedBook(book)
                setView('book-detail')
              }}
            >
              <FileText className="w-3 h-3 mr-0.5" />
              Pages
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
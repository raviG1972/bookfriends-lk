'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useAppStore } from '@/store/useAppStore'

export default function AddBookModal() {
  const { categories, setView, setBooks, books, user } = useAppStore()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publisher, setPublisher] = useState('')
  const [language, setLanguage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [year, setYear] = useState('')
  const [pageCount, setPageCount] = useState('')
  const [description, setDescription] = useState('')
  const [isbn, setIsbn] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = 'Title is required'
    if (!author.trim()) errs.author = 'Author is required'
    if (!language) errs.language = 'Language is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const body: Record<string, any> = {
        title: title.trim(),
        author: author.trim(),
        language,
      }
      if (publisher.trim()) body.publisher = publisher.trim()
      if (categoryId) body.categoryId = categoryId
      if (year) body.year = parseInt(year)
      if (pageCount) body.pageCount = parseInt(pageCount)
      if (description.trim()) body.description = description.trim()
      if (isbn.trim()) body.isbn = isbn.trim()

      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.success) {
        toast.success('Book added successfully!')
        // Refresh books
        const booksRes = await fetch('/api/books')
        const booksJson = await booksRes.json()
        if (booksJson.success) setBooks(booksJson.data)
        setView('feed')
      } else {
        toast.error(json.error || 'Failed to add book')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={() => setView('feed')}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Add a New Book
          </DialogTitle>
          <DialogDescription>
            Share a book with the BookFriends community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-title"
                placeholder="Book title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-author">
                Author <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-author"
                placeholder="Author name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-lg"
              />
              {errors.author && (
                <p className="text-xs text-destructive">{errors.author}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-language">
                Language <span className="text-destructive">*</span>
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="add-language" className="rounded-lg">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sinhala">සිංහල (Sinhala)</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
              {errors.language && (
                <p className="text-xs text-destructive">{errors.language}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="add-category" className="rounded-lg">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-publisher">Publisher</Label>
              <Input
                id="add-publisher"
                placeholder="Publisher name"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-isbn">ISBN</Label>
              <Input
                id="add-isbn"
                placeholder="978-..."
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-year">Year</Label>
              <Input
                id="add-year"
                type="number"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-pages">Page Count</Label>
              <Input
                id="add-pages"
                type="number"
                placeholder="300"
                value={pageCount}
                onChange={(e) => setPageCount(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="add-desc">Description</Label>
              <Textarea
                id="add-desc"
                placeholder="Brief description of the book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] resize-none rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg flex-1"
              onClick={() => setView('feed')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg flex-1"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Book'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
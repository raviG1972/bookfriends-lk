'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  ArrowLeft,
  Heart,
  BookOpen,
  Headphones,
  Plus,
  FileText,
  Send,
  Calendar,
  Building2,
  Hash,
  Layers,
  Globe,
  BadgeCheck,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useAppStore, type Comment } from '@/store/useAppStore'

export default function BookDetailModal() {
  const {
    selectedBook,
    setSelectedBook,
    setView,
    goBack,
    user,
    bookComments,
    setBookComments,
  } = useAppStore()

  const [activeTab, setActiveTab] = useState('preview')
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  // Page request form state
  const [reqChapter, setReqChapter] = useState('')
  const [reqPages, setReqPages] = useState('')
  const [reqReason, setReqReason] = useState('')
  const [submittingRequest, setSubmittingRequest] = useState(false)
  const [pageRequests, setPageRequests] = useState<any[]>([])

  // Bookshelf status
  const [shelfStatus, setShelfStatus] = useState<string | null>(null)
  const [addedToShelf, setAddedToShelf] = useState(false)

  useEffect(() => {
    if (!selectedBook) return
    // Fetch comments
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?bookId=${selectedBook.id}`)
        const json = await res.json()
        if (json.success) setBookComments(json.data)
      } catch { /* silent */ }
    }
    // Fetch page requests
    const fetchRequests = async () => {
      try {
        const res = await fetch(`/api/page-requests?bookId=${selectedBook.id}`)
        const json = await res.json()
        if (json.success) setPageRequests(json.data)
      } catch { /* silent */ }
    }
    fetchComments()
    fetchRequests()

    // Check bookshelf status
    if (user) {
      setAddedToShelf(selectedBook.inBookshelf || false)
    }
  }, [selectedBook, user, setBookComments])

  if (!selectedBook) return null

  const book = selectedBook

  const handleAddToBookshelf = async () => {
    if (!user) {
      toast.error('Please login to add books to your bookshelf')
      return
    }
    const status = shelfStatus || 'want-to-read'
    try {
      const res = await fetch('/api/bookshelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
          status,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setAddedToShelf(true)
        toast.success(`Added to bookshelf as "${status.replace(/-/g, ' ')}"`)
      } else {
        toast.error(json.error || 'Failed to add')
      }
    } catch {
      toast.error('Failed to add to bookshelf')
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return
    if (!user) {
      toast.error('Please login to comment')
      return
    }
    setSubmittingComment(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
          content: commentText.trim(),
        }),
      })
      const json = await res.json()
      if (json.success) {
        setCommentText('')
        // Refresh comments
        const commentsRes = await fetch(`/api/comments?bookId=${book.id}`)
        const commentsJson = await commentsRes.json()
        if (commentsJson.success) setBookComments(commentsJson.data)
        toast.success('Comment posted!')
      } else {
        toast.error(json.error || 'Failed to post comment')
      }
    } catch {
      toast.error('Failed to post comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleSubmitPageRequest = async () => {
    if (!user) {
      toast.error('Please login to request pages')
      return
    }
    if (!reqReason) {
      toast.error('Please select a reason')
      return
    }
    setSubmittingRequest(true)
    try {
      const res = await fetch('/api/page-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          userId: user.id,
          chapter: reqChapter,
          pages: reqPages,
          reason: reqReason,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setReqChapter('')
        setReqPages('')
        setReqReason('')
        // Refresh requests
        const reqRes = await fetch(`/api/page-requests?bookId=${book.id}`)
        const reqJson = await reqRes.json()
        if (reqJson.success) setPageRequests(reqJson.data)
        toast.success('Page request submitted!')
      } else {
        toast.error(json.error || 'Failed to submit request')
      }
    } catch {
      toast.error('Failed to submit request')
    } finally {
      setSubmittingRequest(false)
    }
  }

  const coverIndex = Math.abs(book.id.charCodeAt(0) % 12) + 1
  const coverSrc = book.coverImage || `/covers/book${coverIndex}.png`

  const statusLabels: Record<string, string> = {
    'want-to-read': 'Want to Read',
    'reading': 'Currently Reading',
    'finished': 'Finished',
  }

  const infoItems = [
    { icon: Building2, label: 'Publisher', value: book.publisher },
    { icon: Calendar, label: 'Year', value: book.year?.toString() },
    { icon: Layers, label: 'Pages', value: book.pageCount?.toString() },
    { icon: Globe, label: 'Language', value: book.language?.charAt(0).toUpperCase() + book.language?.slice(1) },
    { icon: Hash, label: 'Category', value: book.category?.name },
  ].filter((item) => item.value)

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 pt-20">
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedBook(null)
            goBack()
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </button>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 mb-8">
          {/* Left: Cover */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-56 md:w-64 aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={coverSrc}
                alt={book.title}
                fill
                className="object-cover"
                sizes="280px"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {book.status === 'verified' && (
                  <Badge className="bg-teal-600 text-white border-0 gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
                {(book.status === 'community' || book.status === 'pending') && (
                  <Badge variant="secondary" className="gap-1">
                    <Users className="w-3 h-3" />
                    Community
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">{book.title}</h1>
              {book.titleSi && (
                <p className="text-sm text-muted-foreground mt-1">{book.titleSi}</p>
              )}
              <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {infoItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-1.5 text-sm">
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="font-semibold">{book.likes}</span>
                <span className="text-muted-foreground text-xs">likes</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <BookOpen className="w-4 h-4 text-teal-600" />
                <span className="font-semibold">{book.readingCount}</span>
                <span className="text-muted-foreground text-xs">reading</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Headphones className="w-4 h-4 text-primary" />
                <span className="font-semibold">{book.listeningCount}</span>
                <span className="text-muted-foreground text-xs">listening</span>
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="pt-2">
                <p className="text-sm leading-relaxed text-foreground/80">{book.description}</p>
              </div>
            )}

            {/* Bookshelf actions */}
            {user && (
              <div className="flex items-center gap-3 pt-2">
                {!addedToShelf ? (
                  <>
                    <Select value={shelfStatus || 'want-to-read'} onValueChange={setShelfStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="want-to-read">Want to Read</SelectItem>
                        <SelectItem value="reading">Currently Reading</SelectItem>
                        <SelectItem value="finished">Finished</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddToBookshelf} className="rounded-lg">
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add to Bookshelf
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    ✓ In your bookshelf
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="preview" className="gap-1.5">
              <BookOpen className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-1.5">
              <FileText className="w-4 h-4" />
              Comments {book.commentCount ? `(${book.commentCount})` : ''}
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-1.5">
              <Send className="w-4 h-4" />
              Page Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="text-center py-16 px-4">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Preview pages will appear here
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Preview pages will appear here once the author/publisher uploads them.
              </p>
              {user && (
                <Button variant="outline" onClick={() => setActiveTab('requests')} className="rounded-lg">
                  <Send className="w-4 h-4 mr-1.5" />
                  Request Pages
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-4">
            {/* Comment input */}
            {user && (
              <div className="flex gap-3 mb-6">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[80px] resize-none rounded-xl"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={submittingComment || !commentText.trim()}
                  className="self-end h-10 rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-4">
              {bookComments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                bookComments.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.user?.name || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-0.5 text-foreground/80">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            {/* Request form */}
            {user && (
              <div className="bg-secondary/50 rounded-xl p-4 mb-6 space-y-3">
                <h4 className="font-medium text-sm">Request specific pages</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Chapter (optional)"
                    value={reqChapter}
                    onChange={(e) => setReqChapter(e.target.value)}
                  />
                  <Input
                    placeholder="Page range (e.g. 10-20)"
                    value={reqPages}
                    onChange={(e) => setReqPages(e.target.value)}
                  />
                  <Select value={reqReason} onValueChange={setReqReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preview">Preview before buying</SelectItem>
                      <SelectItem value="research">Research / Study</SelectItem>
                      <SelectItem value="accessibility">Accessibility needs</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSubmitPageRequest}
                  disabled={submittingRequest || !reqReason}
                  className="rounded-lg"
                >
                  <Send className="w-4 h-4 mr-1.5" />
                  {submittingRequest ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            )}

            {/* Existing requests */}
            <div className="space-y-3">
              {pageRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No page requests yet for this book.
                </div>
              ) : (
                pageRequests.map((req: any) => (
                  <div
                    key={req.id}
                    className="flex items-start gap-3 p-3 bg-card rounded-lg border"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-teal-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {req.chapter && `Ch. ${req.chapter}`}
                        {req.chapter && req.pages && ' — '}
                        {req.pages && `Pages ${req.pages}`}
                        {!req.chapter && !req.pages && 'General request'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Reason: {req.reason} ·{' '}
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
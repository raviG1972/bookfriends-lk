import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const book = await db.book.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!book) {
      return NextResponse.json(
        { success: false, data: null, error: 'Book not found' },
        { status: 404 }
      )
    }

    const commentCount = await db.comment.count({
      where: { bookId: id },
    })

    let inBookshelf = false
    if (userId) {
      const entry = await db.bookshelf.findUnique({
        where: { userId_bookId: { userId, bookId: id } },
      })
      inBookshelf = !!entry
    }

    return NextResponse.json({
      success: true,
      data: {
        ...book,
        commentCount,
        inBookshelf,
      },
    })
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const book = await db.book.findUnique({ where: { id } })
    if (!book) {
      return NextResponse.json(
        { success: false, data: null, error: 'Book not found' },
        { status: 404 }
      )
    }

    const { title, author, publisher, language, categoryId, description, year, pageCount } = body

    const updated = await db.book.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(publisher !== undefined && { publisher }),
        ...(language !== undefined && { language }),
        ...(categoryId !== undefined && { categoryId }),
        ...(description !== undefined && { description }),
        ...(year !== undefined && { year: year ? parseInt(year, 10) : null }),
        ...(pageCount !== undefined && { pageCount: pageCount ? parseInt(pageCount, 10) : null }),
      },
      include: { category: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating book:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to update book' },
      { status: 500 }
    )
  }
}
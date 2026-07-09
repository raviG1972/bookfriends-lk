import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'userId is required' },
        { status: 400 }
      )
    }

    const bookshelf = await db.bookshelf.findMany({
      where: { userId },
      include: { book: { include: { category: true } } },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: bookshelf })
  } catch (error) {
    console.error('Error fetching bookshelf:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch bookshelf' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, bookId, status } = body

    if (!userId || !bookId) {
      return NextResponse.json(
        { success: false, data: null, error: 'userId and bookId are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['want_to_read', 'currently_reading', 'finished']
    const shelfStatus = status || 'want_to_read'
    if (!validStatuses.includes(shelfStatus)) {
      return NextResponse.json(
        { success: false, data: null, error: `status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    const entry = await db.bookshelf.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { status: shelfStatus },
      create: { userId, bookId, status: shelfStatus },
      include: { book: { include: { category: true } } },
    })

    return NextResponse.json({ success: true, data: entry })
  } catch (error) {
    console.error('Error adding to bookshelf:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to add to bookshelf' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const bookId = searchParams.get('bookId')

    if (!userId || !bookId) {
      return NextResponse.json(
        { success: false, data: null, error: 'userId and bookId are required' },
        { status: 400 }
      )
    }

    await db.bookshelf.delete({
      where: { userId_bookId: { userId, bookId } },
    })

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error('Error removing from bookshelf:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to remove from bookshelf' },
      { status: 500 }
    )
  }
}
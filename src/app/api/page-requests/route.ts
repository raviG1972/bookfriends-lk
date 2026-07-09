import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')

    if (!bookId) {
      return NextResponse.json(
        { success: false, data: null, error: 'bookId is required' },
        { status: 400 }
      )
    }

    const pageRequests = await db.pageRequest.findMany({
      where: { bookId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: pageRequests })
  } catch (error) {
    console.error('Error fetching page requests:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch page requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, userId, chapter, pages, reason } = body

    if (!bookId || !userId) {
      return NextResponse.json(
        { success: false, data: null, error: 'bookId and userId are required' },
        { status: 400 }
      )
    }

    const pageRequest = await db.pageRequest.create({
      data: {
        bookId,
        userId,
        chapter: chapter || null,
        pages: pages || null,
        reason: reason || null,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    })

    return NextResponse.json({ success: true, data: pageRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating page request:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to create page request' },
      { status: 500 }
    )
  }
}
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

    const comments = await db.comment.findMany({
      where: { bookId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, userId, bookId } = body

    if (!content || !userId || !bookId) {
      return NextResponse.json(
        { success: false, data: null, error: 'content, userId, and bookId are required' },
        { status: 400 }
      )
    }

    const comment = await db.comment.create({
      data: { content, userId, bookId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    })

    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
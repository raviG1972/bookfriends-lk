import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    if (!q) {
      return NextResponse.json(
        { success: false, data: null, error: 'q (search query) is required' },
        { status: 400 }
      )
    }

    const books = await db.book.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { author: { contains: q } },
          { publisher: { contains: q } },
        ],
      },
      include: { category: true },
      take: 20,
    })

    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    console.error('Error searching books:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to search books' },
      { status: 500 }
    )
  }
}
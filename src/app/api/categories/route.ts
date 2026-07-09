import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { name: 'asc' },
    })

    const data = categories.map((cat) => ({
      ...cat,
      bookCount: cat._count.books,
      _count: undefined,
    }))

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
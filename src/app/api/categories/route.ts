import { db } from '@/lib/db'
import { SEED_CATEGORIES } from '@/lib/seed-data'
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
    // Database unavailable — use seed data fallback
    console.error('Database unavailable, using seed categories fallback:', error)
    return NextResponse.json({ success: true, data: SEED_CATEGORIES })
  }
}
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const language = searchParams.get('language')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const where: Record<string, unknown> = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (language) {
      const languages = language.split(',').map((l) => l.trim().toLowerCase())
      where.language = { in: languages }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
      ]
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'popular') {
      orderBy = { likes: 'desc' }
    } else if (sort === 'reading') {
      orderBy = { readingCount: 'desc' }
    } else if (sort === 'newest') {
      orderBy = { createdAt: 'desc' }
    }

    const skip = (page - 1) * limit

    const [books, total] = await Promise.all([
      db.book.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: limit,
      }),
      db.book.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        books,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, author, publisher, language, categoryId, description, year, pageCount } = body

    if (!title || !author || !language) {
      return NextResponse.json(
        { success: false, data: null, error: 'title, author, and language are required' },
        { status: 400 }
      )
    }

    const book = await db.book.create({
      data: {
        title,
        author,
        publisher: publisher || null,
        language,
        categoryId: categoryId || null,
        description: description || null,
        year: year ? parseInt(year, 10) : null,
        pageCount: pageCount ? parseInt(pageCount, 10) : null,
        addedById: 'system', // default, should be replaced with auth user id
      },
      include: { category: true },
    })

    return NextResponse.json({ success: true, data: book }, { status: 201 })
  } catch (error) {
    console.error('Error creating book:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to create book' },
      { status: 500 }
    )
  }
}
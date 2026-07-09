import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, preferredLanguages } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, data: null, error: 'name, email, and password are required' },
        { status: 400 }
      )
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Note: In production, password should be hashed with bcrypt
    const user = await db.user.create({
      data: {
        name,
        email,
        password,
        preferredLanguages: preferredLanguages || 'english',
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Failed to register' },
      { status: 500 }
    )
  }
}
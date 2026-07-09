import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

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

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        preferredLanguages: preferredLanguages || 'english',
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, data: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
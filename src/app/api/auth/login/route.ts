import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, data: null, error: 'email and password are required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({ where: { email } })

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, data: null, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, data: userWithoutPassword })
  } catch (error) {
    console.error('Error logging in (database unavailable):', error)
    return NextResponse.json(
      { success: false, data: null, error: 'Database is currently unavailable. Please try the demo login (demo@bookfriends.lk / demo123) or register locally.' },
      { status: 500 }
    )
  }
}
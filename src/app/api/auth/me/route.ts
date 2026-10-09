import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('trainbet_token')?.value
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ user: null })
    }

    const user = db.getUserById(payload.userId)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        balance: user.balance,
        role: user.role,
        stats: user.stats,
        is2FAEnabled: user.is2FAEnabled,
      },
    })
  } catch (error) {
    console.error('Me endpoint error:', error)
    return NextResponse.json({ user: null })
  }
}

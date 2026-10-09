import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('trainbet_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Devi essere autenticato' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Sessione scaduta' }, { status: 401 })
    }

    const result = db.claimDailyBonus(payload.userId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      newBalance: result.newBalance,
    })
  } catch (error: any) {
    console.error('Daily bonus error:', error)
    return NextResponse.json({ error: error.message || 'Errore riscatto bonus' }, { status: 500 })
  }
}

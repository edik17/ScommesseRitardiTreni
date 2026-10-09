import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('trainbet_token')?.value
    if (!token) {
      return NextResponse.json({ balance: 0, transactions: [] })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ balance: 0, transactions: [] })
    }

    const user = db.getUserById(payload.userId)
    if (!user) {
      return NextResponse.json({ balance: 0, transactions: [] })
    }

    const transactions = db.getUserTransactions(user.id)

    return NextResponse.json({
      balance: user.balance,
      stats: user.stats,
      transactions,
    })
  } catch (error) {
    console.error('Wallet error:', error)
    return NextResponse.json({ error: 'Errore portafoglio' }, { status: 500 })
  }
}

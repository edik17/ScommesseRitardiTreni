import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const leaderboard = db.getLeaderboard()
    return NextResponse.json({
      leaderboard,
      season: 'Stagione Autunno 2026',
      totalPrizePool: '500.000 Crediti Virtuali',
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Errore classifica' }, { status: 500 })
  }
}

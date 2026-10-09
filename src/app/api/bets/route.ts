import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { BetSelection } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('trainbet_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Devi essere autenticato per scommettere' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Sessione scaduta' }, { status: 401 })
    }

    const body = await req.json()
    const { selections, stake } = body as { selections: BetSelection[]; stake: number }

    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return NextResponse.json({ error: 'Nessun pronostico selezionato nella schedina' }, { status: 400 })
    }

    if (!stake || typeof stake !== 'number' || stake < 10) {
      return NextResponse.json({ error: 'Puntata minima: 10 crediti virtuali' }, { status: 400 })
    }

    if (stake > 50000) {
      return NextResponse.json({ error: 'Puntata massima: 50.000 crediti virtuali (Limite gioco responsabile)' }, { status: 400 })
    }

    const bet = db.createBet(payload.userId, selections, stake)
    const updatedUser = db.getUserById(payload.userId)

    return NextResponse.json({
      success: true,
      bet,
      newBalance: updatedUser?.balance,
      message: `Scommessa piazzata con successo! Vincita potenziale: ${bet.potentialWin} crediti`,
    })
  } catch (error: any) {
    console.error('Place bet error:', error)
    return NextResponse.json({ error: error.message || 'Errore durante il piazzamento della scommessa' }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('trainbet_token')?.value
    if (!token) {
      return NextResponse.json({ bets: [] })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ bets: [] })
    }

    const bets = db.getUserBets(payload.userId)
    return NextResponse.json({ bets })
  } catch (error) {
    console.error('Get bets error:', error)
    return NextResponse.json({ error: 'Errore recupero scommesse' }, { status: 500 })
  }
}

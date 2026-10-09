import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateMarketsForTrain } from '@/lib/odds'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const operator = searchParams.get('operator')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    let trains = db.getAllTrains()

    if (operator && operator !== 'ALL') {
      trains = trains.filter(t => t.operator === operator)
    }

    if (status && status !== 'ALL') {
      trains = trains.filter(t => t.status === status)
    }

    if (search) {
      const q = search.toLowerCase().trim()
      trains = trains.filter(
        t =>
          t.number.toLowerCase().includes(q) ||
          t.origin.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      )
    }

    // Aggiungi mercati calcolati per ciascun treno
    const trainsWithMarkets = trains.map(t => ({
      ...t,
      markets: generateMarketsForTrain(t),
    }))

    return NextResponse.json({
      trains: trainsWithMarkets,
      total: trainsWithMarkets.length,
      serverTime: new Date().toLocaleTimeString('it-IT'),
    })
  } catch (error) {
    console.error('Trains API error:', error)
    return NextResponse.json({ error: 'Errore recupero treni' }, { status: 500 })
  }
}

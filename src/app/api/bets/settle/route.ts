import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { trainId, finalDelay, status } = body

    if (!trainId) {
      return NextResponse.json({ error: 'ID treno richiesto' }, { status: 400 })
    }

    const train = db.getTrainById(trainId)
    if (!train) {
      return NextResponse.json({ error: 'Treno non trovato' }, { status: 404 })
    }

    const delay = typeof finalDelay === 'number' ? finalDelay : train.currentDelay
    const trainStatus = status || 'ARRIVATO'

    const updated = db.updateTrainDelay(trainId, delay, 'Stazione di destinazione raggiunta', trainStatus)

    return NextResponse.json({
      success: true,
      message: `Treno ${train.number} impostato come ${trainStatus} con ritardo ${delay} min. Scommesse refertate!`,
      train: updated,
    })
  } catch (error: any) {
    console.error('Settle API error:', error)
    return NextResponse.json({ error: error.message || 'Errore refertazione scommesse' }, { status: 500 })
  }
}

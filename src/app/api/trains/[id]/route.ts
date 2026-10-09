import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateMarketsForTrain } from '@/lib/odds'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const train = db.getTrainById(params.id)
    if (!train) {
      return NextResponse.json({ error: 'Treno non trovato' }, { status: 404 })
    }

    const markets = generateMarketsForTrain(train)

    return NextResponse.json({
      train: {
        ...train,
        markets,
      },
    })
  } catch (error) {
    console.error('Train detail API error:', error)
    return NextResponse.json({ error: 'Errore recupero dettagli treno' }, { status: 500 })
  }
}

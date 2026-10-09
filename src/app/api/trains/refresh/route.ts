import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const updatedTrains = db.simulateLiveUpdate()
    return NextResponse.json({
      success: true,
      message: 'Dati telemetria ferroviaria aggiornati in tempo reale',
      trains: updatedTrains,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Refresh API error:', error)
    return NextResponse.json({ error: 'Errore aggiornamento dati' }, { status: 500 })
  }
}

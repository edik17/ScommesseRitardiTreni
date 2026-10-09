import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, displayName, acceptTerms, ageConfirmed } = body

    // 1. Validazione Cybersecurity & Regolamento
    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Compila tutti i campi obbligatori' }, { status: 400 })
    }

    if (!acceptTerms || !ageConfirmed) {
      return NextResponse.json({ error: 'È obbligatorio accettare i termini e confermare la maggiore età (+18)' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato email non valido' }, { status: 400 })
    }

    // Password policy forte
    if (password.length < 8) {
      return NextResponse.json({ error: 'La password deve contenere almeno 8 caratteri' }, { status: 400 })
    }

    // Verifica se esiste già
    const existing = db.getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Un account con questa email esiste già' }, { status: 409 })
    }

    // Hash sicuro
    const passwordHash = await hashPassword(password)

    // Creazione utente con 10.000 crediti virtuali di benvenuto
    const user = db.createUser({
      email: email.trim().toLowerCase(),
      displayName: displayName.trim(),
      passwordHash,
      isEmailVerified: true,
      is2FAEnabled: false,
      role: 'USER',
    })

    const token = signToken({ userId: user.id, email: user.email, role: user.role })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        balance: user.balance,
        role: user.role,
        stats: user.stats,
      },
      message: 'Account creato con successo! Hai ricevuto 10.000 crediti virtuali gratuiti!',
    })

    response.cookies.set('trainbet_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Errore interno durante la registrazione' }, { status: 500 })
  }
}

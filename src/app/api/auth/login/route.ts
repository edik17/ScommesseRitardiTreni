import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, isDemo } = body

    // Supporto accesso rapido DEMO per test immediato
    if (isDemo) {
      const demoUser = db.getUserByEmail('demo@trainbet.it')
      if (demoUser) {
        const token = signToken({ userId: demoUser.id, email: demoUser.email, role: demoUser.role })
        const response = NextResponse.json({
          success: true,
          user: {
            id: demoUser.id,
            email: demoUser.email,
            displayName: demoUser.displayName,
            balance: demoUser.balance,
            role: demoUser.role,
            stats: demoUser.stats,
          },
        })
        response.cookies.set('trainbet_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        return response
      }
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Inserisci email e password' }, { status: 400 })
    }

    const user = db.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
    }

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
    })

    response.cookies.set('trainbet_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 })
  }
}

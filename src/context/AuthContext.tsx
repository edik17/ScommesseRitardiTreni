'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password?: string, isDemo?: boolean) => Promise<{ success: boolean; error?: string }>
  register: (data: { email: string; password: string; displayName: string; acceptTerms: boolean; ageConfirmed: boolean }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  claimDailyBonus: () => Promise<{ success: boolean; message: string }>
  updateBalance: (newBalance: number) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (e) {
      console.error('Error fetching session user:', e)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const login = async (email: string, password?: string, isDemo = false) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isDemo }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error || 'Credenziali non valide' }
    } catch {
      return { success: false, error: 'Errore di connessione al server' }
    }
  }

  const register = async (formData: {
    email: string
    password: string
    displayName: string
    acceptTerms: boolean
    ageConfirmed: boolean
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error || 'Errore durante la registrazione' }
    } catch {
      return { success: false, error: 'Errore di connessione al server' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (e) {
      console.error('Logout error:', e)
      setUser(null)
    }
  }

  const claimDailyBonus = async () => {
    try {
      const res = await fetch('/api/wallet/bonus', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        if (user) {
          setUser({ ...user, balance: data.newBalance })
        }
        return { success: true, message: data.message }
      }
      return { success: false, message: data.error || 'Impossibile riscattare il bonus' }
    } catch {
      return { success: false, message: 'Errore di rete' }
    }
  }

  const updateBalance = (newBalance: number) => {
    if (user) {
      setUser({ ...user, balance: newBalance })
    }
  }

  const refreshUser = async () => {
    await fetchCurrentUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        claimDailyBonus,
        updateBalance,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

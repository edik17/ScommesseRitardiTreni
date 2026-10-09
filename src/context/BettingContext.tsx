'use client'

import React, { createContext, useContext, useState } from 'react'
import { BetSelection } from '@/types'
import { useAuth } from './AuthContext'
import confetti from 'canvas-confetti'

interface BettingContextType {
  selections: BetSelection[]
  stake: number
  isSlipOpen: boolean
  setStake: (amount: number) => void
  setIsSlipOpen: (open: boolean) => void
  addSelection: (selection: BetSelection) => void
  removeSelection: (outcomeId: string) => void
  toggleSelection: (selection: BetSelection) => void
  clearSlip: () => void
  isOutcomeSelected: (outcomeId: string) => boolean
  totalOdds: number
  potentialWin: number
  bonusMultiplier: number
  placeBet: () => Promise<{ success: boolean; message: string }>
  isPlacing: boolean
}

const BettingContext = createContext<BettingContextType | undefined>(undefined)

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const { user, updateBalance } = useAuth()
  const [selections, setSelections] = useState<BetSelection[]>([])
  const [stake, setStake] = useState<number>(100)
  const [isSlipOpen, setIsSlipOpen] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)

  const isOutcomeSelected = (outcomeId: string) => {
    return selections.some(s => s.outcomeId === outcomeId)
  }

  const addSelection = (sel: BetSelection) => {
    // Rimuove eventuali selezioni contrastanti sullo stesso treno e stesso mercato
    setSelections(prev => {
      const filtered = prev.filter(s => !(s.trainId === sel.trainId && s.marketId === sel.marketId))
      return [...filtered, sel]
    })
    setIsSlipOpen(true)
  }

  const removeSelection = (outcomeId: string) => {
    setSelections(prev => prev.filter(s => s.outcomeId !== outcomeId))
  }

  const toggleSelection = (sel: BetSelection) => {
    if (isOutcomeSelected(sel.outcomeId)) {
      removeSelection(sel.outcomeId)
    } else {
      addSelection(sel)
    }
  }

  const clearSlip = () => {
    setSelections([])
  }

  // Calcolo quote totale e bonus multipla
  const rawOdds = selections.reduce((acc, s) => acc * s.odds, 1)
  const bonusMultiplier = selections.length > 1 ? 1 + (selections.length - 1) * 0.05 : 1
  const totalOdds = selections.length > 0 ? Number((rawOdds * bonusMultiplier).toFixed(2)) : 0
  const potentialWin = selections.length > 0 ? Math.round(stake * totalOdds) : 0

  const placeBet = async () => {
    if (!user) {
      return { success: false, message: 'Effettua il login per piazzare la scommessa' }
    }

    if (selections.length === 0) {
      return { success: false, message: 'Seleziona almeno un pronostico nella schedina' }
    }

    if (stake < 10) {
      return { success: false, message: 'Puntata minima: 10 crediti' }
    }

    if (user.balance < stake) {
      return { success: false, message: 'Saldo insufficiente! Riscatta il bonus giornaliero.' }
    }

    setIsPlacing(true)
    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections, stake }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (data.newBalance !== undefined) {
          updateBalance(data.newBalance)
        }
        clearSlip()

        // Effetto grafico
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.8 },
          })
        } catch {}

        return { success: true, message: data.message }
      }
      return { success: false, message: data.error || 'Errore durante la scommessa' }
    } catch {
      return { success: false, message: 'Errore di connessione' }
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <BettingContext.Provider
      value={{
        selections,
        stake,
        isSlipOpen,
        setStake,
        setIsSlipOpen,
        addSelection,
        removeSelection,
        toggleSelection,
        clearSlip,
        isOutcomeSelected,
        totalOdds,
        potentialWin,
        bonusMultiplier,
        placeBet,
        isPlacing,
      }}
    >
      {children}
    </BettingContext.Provider>
  )
}

export function useBetting() {
  const context = useContext(BettingContext)
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider')
  }
  return context
}

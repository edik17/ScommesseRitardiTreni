'use client'

import React, { useState } from 'react'
import { useBetting } from '@/context/BettingContext'
import { useAuth } from '@/context/AuthContext'
import { 
  X, 
  Trash2, 
  Ticket, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Coins
} from 'lucide-react'

export const BettingSlip = () => {
  const {
    selections,
    stake,
    setStake,
    isSlipOpen,
    setIsSlipOpen,
    removeSelection,
    clearSlip,
    totalOdds,
    potentialWin,
    bonusMultiplier,
    placeBet,
    isPlacing,
  } = useBetting()

  const { user } = useAuth()
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  if (!isSlipOpen && selections.length === 0) return null

  const handlePlaceBet = async () => {
    setFeedback(null)
    const res = await placeBet()
    if (res.success) {
      setFeedback({ type: 'success', message: res.message })
      setTimeout(() => setFeedback(null), 4000)
    } else {
      setFeedback({ type: 'error', message: res.message })
    }
  }

  const quickStakes = [50, 100, 250, 500, 1000]

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        isSlipOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Schedina Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Schedina Virtuale
              {selections.length > 0 && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                  {selections.length} {selections.length === 1 ? 'Singola' : 'Multipla'}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400">Pronostici ritardi ferroviari</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {selections.length > 0 && (
            <button
              onClick={clearSlip}
              title="Svuota schedina"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSlipOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Schedina Body */}
      <div className="max-h-80 overflow-y-auto p-4 space-y-3">
        {selections.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Ticket className="mx-auto h-8 w-8 text-slate-600 mb-2" />
            <p className="font-semibold text-slate-300">La tua schedina è vuota</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Clicca sulle quote dei treni per aggiungere i tuoi pronostici!
            </p>
          </div>
        ) : (
          selections.map(sel => (
            <div
              key={sel.outcomeId}
              className="relative rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs space-y-1 group hover:border-slate-700 transition-colors"
            >
              <button
                onClick={() => removeSelection(sel.outcomeId)}
                className="absolute right-2 top-2 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-400">{sel.trainNumber}</span>
                <span className="text-slate-500 text-[10px] truncate max-w-[170px]">
                  {sel.origin} → {sel.destination}
                </span>
              </div>

              <div className="text-[11px] text-slate-400">{sel.marketTitle}</div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-200">{sel.outcomeLabel}</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  @{sel.odds.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedina Footer: Calculation & Action */}
      {selections.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-950/90 p-4 space-y-3">
          {/* Multiplier & Bonus info */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Quota Complessiva:</span>
            <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
              {bonusMultiplier > 1 && (
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Bonus +{Math.round((bonusMultiplier - 1) * 100)}%
                </span>
              )}
              <span className="text-base">@{totalOdds.toFixed(2)}</span>
            </div>
          </div>

          {/* Quick Stake Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Importo Puntata (Crediti):</span>
              {user && (
                <span className="text-[10px] text-slate-500">
                  Disponibili: {user.balance.toLocaleString('it-IT')} 🪙
                </span>
              )}
            </div>

            <div className="flex gap-1.5">
              {quickStakes.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setStake(amt)}
                  className={`flex-1 rounded-lg py-1 text-[11px] font-mono font-bold transition-all ${
                    stake === amt
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="relative">
              <Coins className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="number"
                min="10"
                max="50000"
                step="10"
                value={stake}
                onChange={e => setStake(Math.max(10, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 pl-8 pr-3 text-xs font-mono font-bold text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Potential Win Banner */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Vincita Potenziale:
            </span>
            <span className="font-mono font-black text-amber-400 text-sm">
              {potentialWin.toLocaleString('it-IT')} 🪙
            </span>
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`rounded-lg p-2.5 text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950/60 text-rose-300 border border-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Submit Bet */}
          <button
            onClick={handlePlaceBet}
            disabled={isPlacing || (user ? user.balance < stake : false)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/25"
          >
            {isPlacing ? (
              <span>Registrazione scommessa...</span>
            ) : user && user.balance < stake ? (
              <span>Saldo insufficiente</span>
            ) : (
              <>
                <span>Piazza Scommessa ({stake} 🪙)</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Shield, AlertTriangle, Clock, Ban, CheckCircle } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const ResponsibleGamingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [dailyLimit, setDailyLimit] = useState(5000)
  const [isSelfExcluded, setIsSelfExcluded] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Gioco Responsabile & Sicurezza</h3>
            <p className="text-xs text-slate-400">Strumenti di tutela conformi agli standard ADM</p>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-300 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>Avvertenza Legale:</strong> TrainBet Italia opera attualmente in modalità 
              <strong> simulazione con valuta virtuale</strong> senza valore monetario. 
              Garantiamo tuttavia tutti gli strumenti di auto-tutela previsti dalla legge italiana per promuovere un gioco equilibrato.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              Limite di Scommessa Virtuale Giornaliero
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={dailyLimit}
                onChange={e => setDailyLimit(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="font-mono font-bold text-amber-400 shrink-0 w-24 text-right">
                {dailyLimit.toLocaleString('it-IT')} 🪙
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Imposta un tetto massimo di crediti spendibili ogni 24 ore.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Ban className="h-4 w-4 text-rose-400" /> Auto-Esclusione Temporanea
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sospendi la possibilità di effettuare nuove scommesse per 7 giorni.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isSelfExcluded}
                onChange={e => setIsSelfExcluded(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>Tempo medio sessione attiva consigliato: non superare i 45 minuti consecutivi.</span>
          </div>

          {saved && (
            <div className="rounded-lg bg-emerald-950/40 border border-emerald-800/60 p-3 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" /> Preferenze di tutela salvate con successo!
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Chiudi
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Salva Limiti
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

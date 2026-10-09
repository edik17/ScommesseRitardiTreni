'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bet } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { 
  Ticket, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trophy, 
  Flame, 
  Coins, 
  ArrowRight,
  Sparkles
} from 'lucide-react'

export default function MieScommessePage() {
  const { user } = useAuth()
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'WON' | 'LOST'>('ALL')

  const fetchBets = async () => {
    try {
      const res = await fetch('/api/bets')
      const data = await res.json()
      if (res.ok && data.bets) {
        setBets(data.bets)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBets()
  }, [])

  const filteredBets = bets.filter(b => {
    if (filter === 'ALL') return true
    return b.status === filter
  })

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <Ticket className="h-4 w-4" /> Archivio Scommesse Personale
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Le Mie Scommesse sui Ritardi
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitora lo stato dei tuoi pronostici attivi, lo storico delle vincite e le quote incassate.
        </p>
      </div>

      {/* Stats Overview */}
      {user && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-amber-400" /> Totale Giocate
            </div>
            <div className="text-xl font-black text-white mt-1">
              {user.stats.totalBets}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-emerald-400" /> Scommesse Vinte
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {user.stats.wonBets}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-400" /> Crediti Incassati
            </div>
            <div className="text-xl font-black text-amber-400 mt-1">
              {user.stats.totalWon.toLocaleString('it-IT')} 🪙
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-rose-400" /> Streak Attuale
            </div>
            <div className="text-xl font-black text-rose-400 mt-1">
              {user.stats.streak} consecutive
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-xs">
        {[
          { key: 'ALL', label: 'Tutte le Scommesse' },
          { key: 'PENDING', label: 'In Corso (Live)' },
          { key: 'WON', label: 'Vinte' },
          { key: 'LOST', label: 'Perse' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`pb-3 font-semibold transition-colors ${
              filter === tab.key
                ? 'border-b-2 border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bets List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredBets.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <Ticket className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">Nessuna scommessa trovata</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Non hai ancora scommesso in questa categoria. Consulta il palinsesto e scegli i tuoi treni!
          </p>
          <Link
            href="/scommesse"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
          >
            <span>Vai al Palinsesto Treni</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBets.map(bet => {
            const isWon = bet.status === 'WON'
            const isPending = bet.status === 'PENDING'
            const isLost = bet.status === 'LOST'

            return (
              <div
                key={bet.id}
                className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
                  isWon
                    ? 'border-emerald-800/80 bg-emerald-950/20'
                    : isLost
                    ? 'border-slate-800 bg-slate-900/40 opacity-75'
                    : 'border-slate-800 bg-slate-900/80 shadow-lg'
                }`}
              >
                {/* Header Ticket */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      ID: {bet.id}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      {bet.type === 'MULTIPLE' ? 'Multipla' : 'Singola'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(bet.placedAt).toLocaleString('it-IT')}
                    </span>
                  </div>

                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/60 bg-amber-950/40 px-2.5 py-1 text-xs font-bold text-amber-400 font-mono">
                        <Clock className="h-3.5 w-3.5 animate-spin" /> In Corso
                      </span>
                    )}
                    {isWon && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/60 bg-emerald-950/40 px-2.5 py-1 text-xs font-bold text-emerald-400 font-mono">
                        <CheckCircle2 className="h-3.5 w-3.5" /> VINTA (+{bet.payout?.toLocaleString('it-IT')} 🪙)
                      </span>
                    )}
                    {isLost && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-800/60 bg-rose-950/40 px-2.5 py-1 text-xs font-bold text-rose-400 font-mono">
                        <XCircle className="h-3.5 w-3.5" /> Non vincente
                      </span>
                    )}
                  </div>
                </div>

                {/* Selections inside Ticket */}
                <div className="space-y-2 mb-4">
                  {bet.selections.map((sel, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">
                            {sel.trainNumber}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {sel.origin} → {sel.destination}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {sel.marketTitle}: <strong className="text-slate-200">{sel.outcomeLabel}</strong>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-bold text-amber-400">
                        @{sel.odds.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ticket Summary */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-3 text-xs font-mono">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>
                      Quota Totale: <strong className="text-white">@{bet.totalOdds.toFixed(2)}</strong>
                    </span>
                    <span>
                      Puntata: <strong className="text-white">{bet.stake} 🪙</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">
                      {isWon ? 'Importo Incassato:' : 'Vincita Potenziale:'}
                    </span>
                    <span className={`text-sm font-black ${isWon ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {(isWon ? bet.payout : bet.potentialWin)?.toLocaleString('it-IT')} 🪙
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

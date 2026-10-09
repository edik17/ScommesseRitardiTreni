'use client'

import React, { useState } from 'react'
import { Train, BettingMarket } from '@/types'
import { DelayBadge } from './DelayBadge'
import { getOperatorBadge } from '@/lib/utils'
import { RefreshCw, Radio } from 'lucide-react'
import Link from 'next/link'

interface LiveBoardProps {
  initialTrains: (Train & { markets?: BettingMarket[] })[]
  onRefresh?: () => void
}

export const LiveBoard: React.FC<LiveBoardProps> = ({ initialTrains, onRefresh }) => {
  const [trains, setTrains] = useState(initialTrains)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState<string>('ALL')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/trains/refresh', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.trains) {
        setTrains(data.trains)
        if (onRefresh) onRefresh()
      }
    } catch (e) {
      console.error('Refresh error:', e)
    } finally {
      setTimeout(() => setIsRefreshing(false), 600)
    }
  }

  const filteredTrains = trains.filter(t => {
    if (filter === 'ALL') return true
    return t.operator === filter
  })

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden">
      {/* Board Header styled like digital station LED board */}
      <div className="border-b border-slate-800/80 bg-slate-900/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3 items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              TABELLONE TELEMETRIA LIVE
              <span className="text-[10px] font-mono font-normal text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
                RETE FERROVIARIA ITALIANA
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Monitoraggio ritardi in tempo reale sincronizzato con ViaggiaTreno
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-amber-400 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRefreshing ? 'Sincronizzazione...' : 'Aggiorna Live'}</span>
          </button>
        </div>
      </div>

      {/* Operator Filter Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800/80 bg-slate-900/40 p-2 gap-1.5 text-xs scrollbar-none">
        {[
          { key: 'ALL', label: 'Tutti i Convogli' },
          { key: 'FRECCIAROSSA', label: 'Frecciarossa' },
          { key: 'ITALO', label: 'Italo' },
          { key: 'INTERCITY', label: 'Intercity' },
          { key: 'REGIONALE', label: 'Regionali' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`rounded-lg px-3 py-1.5 font-medium whitespace-nowrap transition-colors ${
              filter === item.key
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Departures Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-800/80 bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Treno</th>
              <th className="py-3 px-4">Tratta</th>
              <th className="py-3 px-4">Orario</th>
              <th className="py-3 px-4">Stato & Posizione</th>
              <th className="py-3 px-4">Ritardo</th>
              <th className="py-3 px-4 text-right">Azione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredTrains.map(train => {
              const op = getOperatorBadge(train.operator)
              return (
                <tr key={train.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${op.bg} ${op.text}`}>
                        {train.operator.substring(0, 3)}
                      </span>
                      <span className="font-bold text-white text-sm">{train.number}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-sans font-semibold text-slate-200">
                      {train.origin} → {train.destination}
                    </div>
                    <div className="text-[10px] text-slate-500">Binario {train.platform}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-slate-300">
                      Part. {train.scheduledDeparture}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Arr. {train.scheduledArrival}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300 font-sans text-xs">
                      <Radio className="h-3 w-3 text-cyan-400 shrink-0" />
                      <span className="truncate max-w-[200px]">{train.currentLocation || 'In orario'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <DelayBadge delay={train.currentDelay} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/treno/${train.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-all font-sans"
                    >
                      Scommetti
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

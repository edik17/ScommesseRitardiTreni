'use client'

import React from 'react'
import Link from 'next/link'
import { Train, BettingMarket } from '@/types'
import { DelayBadge } from './DelayBadge'
import { getOperatorBadge } from '@/lib/utils'
import { useBetting } from '@/context/BettingContext'
import { ArrowRight, Clock, MapPin, ChevronRight, Activity } from 'lucide-react'

interface TrainCardProps {
  train: Train & { markets?: BettingMarket[] }
}

export const TrainCard: React.FC<TrainCardProps> = ({ train }) => {
  const op = getOperatorBadge(train.operator)
  const { toggleSelection, isOutcomeSelected } = useBetting()

  // Prendi il mercato principale (Fascia di Ritardo)
  const delayMarket = train.markets?.find(m => m.type === 'DELAY_RANGE')

  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm transition-all hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-500/5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${op.bg} ${op.text}`}>
            {op.label}
          </span>
          <span className="font-mono text-sm font-black text-white">{train.number}</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
            {train.categoryName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DelayBadge delay={train.currentDelay} size="sm" />
          <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
            Bin. {train.platform}
          </span>
        </div>
      </div>

      {/* Route & Times */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <span className="truncate">{train.origin}</span>
            <ArrowRight className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{train.destination}</span>
          </div>

          <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" /> Part. {train.scheduledDeparture}
            </span>
            <span>Arr. {train.scheduledArrival}</span>
          </div>
        </div>

        {train.currentLocation && (
          <div className="flex items-center gap-1.5 rounded-lg bg-slate-950/60 px-2.5 py-1.5 text-[11px] text-slate-400 border border-slate-800/60">
            <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{train.currentLocation}</span>
          </div>
        )}
      </div>

      {/* Historical Stats Mini Pill */}
      <div className="mb-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/50 pt-2 font-mono">
        <span className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-amber-400" /> Media 30gg: <strong className="text-slate-200">+{train.historicalDelayAverage} min</strong>
        </span>
        <span>
          Puntualità: <strong className="text-emerald-400">{train.onTimePercentage}%</strong>
        </span>
      </div>

      {/* Quick Bet Buttons for Delay Range */}
      {delayMarket && delayMarket.outcomes && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quote Pronostico Arrivo
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {delayMarket.outcomes.map(out => {
              const selected = isOutcomeSelected(out.id)
              return (
                <button
                  key={out.id}
                  onClick={() =>
                    toggleSelection({
                      trainId: train.id,
                      trainNumber: train.number,
                      origin: train.origin,
                      destination: train.destination,
                      marketId: delayMarket.id,
                      marketTitle: delayMarket.title,
                      marketType: out.marketType,
                      outcomeId: out.id,
                      outcomeLabel: out.label,
                      odds: out.odds,
                    })
                  }
                  className={`flex flex-col items-center justify-center rounded-xl p-2 transition-all ${
                    selected
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'border border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-[10px] truncate max-w-full ${selected ? 'text-slate-950' : 'text-slate-400'}`}>
                    {out.label.split('(')[0]}
                  </span>
                  <span className={`font-mono text-xs font-black ${selected ? 'text-slate-950' : 'text-amber-400'}`}>
                    @{out.odds.toFixed(2)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Link to Full Details & All Markets */}
      <div className="mt-3 text-right">
        <Link
          href={`/treno/${train.id}`}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <span>Tutti i mercati e fermate ({train.markets?.length || 4})</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

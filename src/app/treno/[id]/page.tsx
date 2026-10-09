'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Train, BettingMarket } from '@/types'
import { DelayBadge } from '@/components/DelayBadge'
import { getOperatorBadge } from '@/lib/utils'
import { useBetting } from '@/context/BettingContext'
import { useAuth } from '@/context/AuthContext'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  CheckCircle, 
  Radio, 
  Activity, 
  Sparkles,
  Zap
} from 'lucide-react'
import confetti from 'canvas-confetti'

export default function TrainDetailPage() {
  const params = useParams()
  const trainId = params?.id as string
  const { toggleSelection, isOutcomeSelected } = useBetting()
  const { refreshUser } = useAuth()

  const [train, setTrain] = useState<(Train & { markets?: BettingMarket[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [settling, setSettling] = useState(false)
  const [settleResult, setSettleResult] = useState<string | null>(null)

  const fetchTrain = async () => {
    try {
      const res = await fetch(`/api/trains/${trainId}`)
      const data = await res.json()
      if (res.ok && data.train) {
        setTrain(data.train)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (trainId) {
      fetchTrain()
    }
  }, [trainId])

  // Simulazione di arrivo e liquidazione istantanea scommesse
  const handleSimulateArrival = async (simulatedDelay: number) => {
    setSettling(true)
    setSettleResult(null)
    try {
      const res = await fetch('/api/bets/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainId: train?.id,
          finalDelay: simulatedDelay,
          status: 'ARRIVATO',
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSettleResult(data.message)
        await fetchTrain()
        await refreshUser()
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        } catch {}
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSettling(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-center text-slate-400">
        <div className="h-48 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800" />
      </div>
    )
  }

  if (!train) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-400 space-y-4">
        <h2 className="text-xl font-bold text-white">Treno non trovato</h2>
        <Link href="/scommesse" className="text-amber-400 hover:underline text-xs">
          Torna alla lista scommesse
        </Link>
      </div>
    )
  }

  const op = getOperatorBadge(train.operator)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      {/* Back Button */}
      <Link
        href="/scommesse"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Torna al Palinsesto Scommesse</span>
      </Link>

      {/* Main Train Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-md shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ${op.bg} ${op.text}`}>
                {op.label}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {train.number}
              </h1>
              <span className="text-xs text-slate-400 font-mono">
                {train.categoryName}
              </span>
            </div>

            <div className="text-lg font-bold text-slate-200">
              {train.origin} <span className="text-amber-500">→</span> {train.destination}
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Stato Telemetria:</span>
              <DelayBadge delay={train.currentDelay} size="lg" />
            </div>
            <div className="text-xs font-mono text-slate-400">
              Binario di partenza: <strong className="text-slate-200">{train.platform}</strong> • Ultimo sync: {train.lastUpdate}
            </div>
          </div>
        </div>

        {/* Telemetry Location & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold">Posizione Attuale</div>
              <div className="font-semibold text-slate-200">{train.currentLocation || 'In partenza da origine'}</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
            <Activity className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold">Media Ritardi (30gg)</div>
              <div className="font-semibold text-slate-200">+{train.historicalDelayAverage} minuti</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
            <Clock className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[10px] uppercase font-bold">Indice di Puntualità</div>
              <div className="font-semibold text-emerald-400">{train.onTimePercentage}% dei viaggi in orario</div>
            </div>
          </div>
        </div>

        {/* Simulation Sandbox / Admin Control Bar */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Simulatore Arrivo Convoglio & Liquidazione Vincite (Sandbox)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Permette di testare l&apos;incasso immediato delle scommesse
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 mr-1">Simula arrivo con:</span>
            {[
              { label: '0 min (In orario)', delay: 0 },
              { label: '+5 min (Piccolo ritardo)', delay: 5 },
              { label: '+12 min (Medio)', delay: 12 },
              { label: '+25 min (Grave ritardo)', delay: 25 },
            ].map(sim => (
              <button
                key={sim.delay}
                disabled={settling}
                onClick={() => handleSimulateArrival(sim.delay)}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-medium text-slate-200 hover:border-amber-500 hover:text-amber-400 disabled:opacity-50 transition-colors"
              >
                {sim.label}
              </button>
            ))}
          </div>

          {settleResult && (
            <div className="rounded-lg bg-emerald-950/60 border border-emerald-800 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{settleResult}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid: Route Stops vs Betting Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Route Stops Timeline */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400" />
              Itinerario & Fermate
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {train.stops.map((stop, idx) => (
                <div key={idx} className="relative text-xs">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 h-4 w-4 rounded-full border-2 ${
                      stop.passed
                        ? 'border-emerald-500 bg-emerald-950'
                        : 'border-slate-600 bg-slate-900'
                    } flex items-center justify-center`}
                  >
                    {stop.passed && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  </div>

                  <div className="font-semibold text-slate-200">{stop.station}</div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>Part. {stop.scheduledDeparture}</span>
                    {stop.delayMinutes > 0 && (
                      <span className="text-amber-400 font-bold">+{stop.delayMinutes}m</span>
                    )}
                    <span>Bin. {stop.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: All 4-6 Betting Markets */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Mercati di Scommessa Attivi ({train.markets?.length || 0})
          </h2>

          <div className="space-y-6">
            {train.markets?.map(market => (
              <div
                key={market.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-bold text-sm text-slate-100">{market.title}</h3>
                  <span className="text-[10px] font-mono text-slate-500">
                    Chiusura: alla partenza
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {market.outcomes.map(out => {
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
                            marketId: market.id,
                            marketTitle: market.title,
                            marketType: out.marketType,
                            outcomeId: out.id,
                            outcomeLabel: out.label,
                            odds: out.odds,
                          })
                        }
                        className={`flex items-center justify-between rounded-xl p-3 text-left transition-all ${
                          selected
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                            : 'border border-slate-800 bg-slate-950/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className={`text-xs font-semibold ${selected ? 'text-slate-950' : 'text-slate-200'}`}>
                            {out.label}
                          </div>
                          {out.description && (
                            <div className={`text-[10px] ${selected ? 'text-slate-800' : 'text-slate-400'}`}>
                              {out.description}
                            </div>
                          )}
                        </div>

                        <div className="font-mono text-sm font-black shrink-0 ml-3">
                          @{out.odds.toFixed(2)}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

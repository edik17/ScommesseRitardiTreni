'use client'

import React from 'react'
import { BarChart3, AlertTriangle, TrendingDown, Clock, Activity, ShieldAlert, Award } from 'lucide-react'

export default function StatistichePage() {
  const criticalLines = [
    { name: 'Dorsale AV Milano - Roma - Napoli', delayAvg: '6.4 min', punctuality: '74%', criticalHub: 'Nodo di Bologna AV' },
    { name: 'Genova - Pisa - Roma (Tirrenica)', delayAvg: '14.8 min', punctuality: '46%', criticalHub: 'Galleria dei Giovi & Rapallo' },
    { name: 'Bologna - Ancona - Bari (Adriatica)', delayAvg: '12.2 min', punctuality: '51%', criticalHub: 'Foggia - Pescara' },
    { name: 'Venezia - Padova - Bologna', delayAvg: '4.8 min', punctuality: '82%', criticalHub: 'Bivio Roncafort' },
    { name: 'Torino - Milano - Venezia', delayAvg: '5.9 min', punctuality: '78%', criticalHub: 'Milano Centrale' },
  ]

  const topDelayedTrains = [
    { number: 'REG 4521', route: 'Genova PP → La Spezia', delay: '+27 min', reason: 'Guasto linea elettrica a Rapallo' },
    { number: 'IC 610', route: 'Bologna C.le → Bari C.le', delay: '+19 min', reason: 'Rallentamento per condizioni meteo' },
    { number: 'FR 9512', route: 'Milano C.le → Roma Termini', delay: '+8 min', reason: 'Traffico intenso nodo di Bologna' },
    { number: 'Italo 9980', route: 'Napoli C.le → Milano C.le', delay: '+5 min', reason: 'Attesa autorizzazione partenza' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          <BarChart3 className="h-4 w-4" /> Centro Dati & Analisi Telemetria
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Osservatorio Nazionale Ritardi Ferroviari
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Statistiche storiche, andamento puntualità e analisi predittiva per formulare i migliori pronostici.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Puntualità Rete Nazionale</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">68.4%</div>
          <p className="text-[11px] text-slate-400">
            Treni arrivati entro 5 minuti dall&apos;orario programmato negli ultimi 30 giorni.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Ritardo Medio Italiano</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">+7.8 min</div>
          <p className="text-[11px] text-slate-400">
            Tempo medio di scostamento sull&apos;intero orario di servizio nazionale.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Causa Ritardi Principale</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-lg font-black text-white">Guasti Linea & Impianti</div>
          <p className="text-[11px] text-slate-400">
            Rappresentano il 41% di tutti i minuti di ritardo accumulati sui convogli a lunga percorrenza.
          </p>
        </div>
      </div>

      {/* Operator Comparison */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          Confronto Indice di Puntualità per Operatore (30gg)
        </h2>

        <div className="space-y-4">
          {[
            { name: 'Italo - Nuovo Trasporto Viaggiatori', rate: 76, color: 'bg-red-700' },
            { name: 'Trenitalia Frecciarossa AV', rate: 71, color: 'bg-rose-600' },
            { name: 'Regionali & Regionali Veloci', rate: 64, color: 'bg-emerald-600' },
            { name: 'Trenitalia Intercity Giorno/Notte', rate: 49, color: 'bg-sky-600' },
          ].map(op => (
            <div key={op.name} className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">{op.name}</span>
                <span className="font-mono text-white">{op.rate}% in orario</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${op.color} rounded-full transition-all duration-500`}
                  style={{ width: `${op.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Railway Corridors */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-400" />
          Le Tratte Più Critiche d&apos;Italia (Miniera di Quote Alte)
        </h2>

        <div className="divide-y divide-slate-800">
          {criticalLines.map((line, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-semibold text-slate-200">{line.name}</div>
                <div className="text-[11px] text-slate-500">Punto critico: {line.criticalHub}</div>
              </div>

              <div className="flex items-center gap-4 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500">Ritardo Medio: </span>
                  <strong className="text-amber-400">{line.delayAvg}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Puntualità: </span>
                  <strong className="text-rose-400">{line.punctuality}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Real-time Top Delayed Trains */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-rose-400" />
          I Treni Più in Ritardo in Questo Momento
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topDelayedTrains.map(t => (
            <div key={t.number} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm">{t.number}</span>
                <span className="font-mono font-black text-rose-400 bg-rose-950/40 border border-rose-800/60 px-2 py-0.5 rounded">
                  {t.delay}
                </span>
              </div>
              <div className="font-semibold text-slate-300">{t.route}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Causa segnalata:</span>
                <span className="text-slate-400">{t.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Train, BettingMarket } from '@/types'
import { LiveBoard } from '@/components/LiveBoard'
import { TrainCard } from '@/components/TrainCard'
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Flame, 
  Radio, 
  Activity, 
  Coins, 
  Zap,
  TrendingUp
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function HomePage() {
  const { user } = useAuth()
  const [trains, setTrains] = useState<(Train & { markets?: BettingMarket[] })[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrains = async () => {
    try {
      const res = await fetch('/api/trains')
      const data = await res.json()
      if (res.ok && data.trains) {
        setTrains(data.trains)
      }
    } catch (e) {
      console.error('Failed to fetch trains:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrains()
    // Polling automatico ogni 15 secondi per aggiornare i ritardi
    const interval = setInterval(fetchTrains, 15000)
    return () => clearInterval(interval)
  }, [])

  const featuredTrains = trains.slice(0, 3)

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-[#080C14] px-4 py-16 sm:px-6 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>Stagione Autunno 2026 • Montepremi 500.000 Crediti</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Non arrabbiarti per il ritardo.{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Scommettici sopra!
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              La prima piattaforma italiana di betting sui ritardi dei treni in tempo reale.
              Prevedi i minuti di ritardo di <strong>Frecciarossa, Italo, Intercity e Regionali</strong> con crediti virtuali gratuiti. 
              Dati telemetrici ufficiali e quote dinamiche ad ogni fermata.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/scommesse"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/25 transition-all"
              >
                <span>Scommetti sui Treni Live</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/classifica"
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:text-white transition-all"
              >
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span>Classifica Scommettitori</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-slate-800/80 font-mono text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="text-slate-400">Bonus Iniziale</div>
                <div className="text-lg font-black text-amber-400">10.000 🪙</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="text-slate-400">Rete Coperta</div>
                <div className="text-lg font-black text-white">100% Italia</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="text-slate-400">Aggiornamento</div>
                <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live 10s
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
                <div className="text-slate-400">Conformità</div>
                <div className="text-lg font-black text-cyan-400">Virtuale ADM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
        {/* Live News Ticker / Event Stream */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3 text-xs overflow-hidden">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 shrink-0 bg-amber-500/10 px-2.5 py-1 rounded-lg">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>LIVE FEED:</span>
          </div>
          <div className="truncate text-slate-300 font-mono">
            🔴 REG 4521 Genova-La Spezia fermo per guasto linea (+27 min) • 🟡 IC 610 Bologna-Bari aumenta ritardo a +19 min • 🟢 Italo 9921 perfetto orario su Bologna AV
          </div>
        </div>

        {/* Featured Bets Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-black text-white">Scommesse in Evidenza Oggi</h2>
            </div>
            <Link
              href="/scommesse"
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Vedi tutti i {trains.length} treni</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl border border-slate-800 bg-slate-900/40 animate-pulse" />
              ))
            ) : (
              featuredTrains.map(train => (
                <TrainCard key={train.id} train={train} />
              ))
            )}
          </div>
        </section>

        {/* Live Station Board */}
        <section className="space-y-4">
          <LiveBoard initialTrains={trains} onRefresh={fetchTrains} />
        </section>

        {/* Trust, Security & Regulatory Pillars */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h3 className="text-2xl font-black text-white">
              Architettura Sicura al 100% & Piena Legalità
            </h3>
            <p className="text-xs text-slate-400">
              Progettata secondo gli standard dell&apos;Agenzia delle Dogane e dei Monopoli e le linee guida OWASP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Valuta Virtuale & Gioco Pulito</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nessun rischio finanziario. Si gioca con crediti virtuali gratuiti ricaricabili ogni 24 ore. Gioco 100% lecito e conforme alle leggi italiane.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Cybersecurity & Crittografia</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Password cifrate con Argon2/Bcrypt, sessioni protette con token firmati e cookie HTTPOnly SameSite, protezione da attacchi CSRF/XSS.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Integrità Quote & Dati Reali</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algoritmo di quotazione proprietario basato su serie storiche dei ritardi, telemetria RFI/ViaggiaTreno e refertazione automatica istantanea.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

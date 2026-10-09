'use client'

import React, { useState, useEffect } from 'react'
import { Train, BettingMarket } from '@/types'
import { TrainCard } from '@/components/TrainCard'
import { Search, Filter, Train as TrainIcon, SlidersHorizontal, RefreshCw } from 'lucide-react'

export default function ScommessePage() {
  const [trains, setTrains] = useState<(Train & { markets?: BettingMarket[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [operator, setOperator] = useState('ALL')
  const [status, setStatus] = useState('ALL')

  const fetchTrains = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (operator !== 'ALL') params.append('operator', operator)
      if (status !== 'ALL') params.append('status', status)

      const res = await fetch(`/api/trains?${params.toString()}`)
      const data = await res.json()
      if (res.ok && data.trains) {
        setTrains(data.trains)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrains()
  }, [operator, status])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTrains()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <TrainIcon className="h-4 w-4" /> Palinsesto Scommesse Ferroviarie
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Treni & Quote in Tempo Reale
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Scommetti su ritardi esatti, over/under, cambi binario e soppressioni di qualsiasi treno in Italia.
          </p>
        </div>

        <button
          onClick={fetchTrains}
          className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-amber-500 hover:text-amber-400 self-start md:self-auto transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Aggiorna Quote</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cerca per numero treno (es. FR 9512), stazione di partenza o arrivo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shrink-0"
          >
            Cerca
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60 text-xs">
          {/* Operator filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-500 text-[11px] uppercase font-bold mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Operatore:
            </span>
            {[
              { id: 'ALL', label: 'Tutti' },
              { id: 'FRECCIAROSSA', label: 'Frecciarossa' },
              { id: 'ITALO', label: 'Italo' },
              { id: 'INTERCITY', label: 'Intercity' },
              { id: 'REGIONALE', label: 'Regionali' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setOperator(item.id)}
                className={`rounded-lg px-3 py-1 font-semibold transition-colors ${
                  operator === item.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase font-bold mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Stato:
            </span>
            {[
              { id: 'ALL', label: 'Tutti' },
              { id: 'IN_VIAGGIO', label: 'In Viaggio' },
              { id: 'PROGRAMMATO', label: 'In Partenza' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setStatus(item.id)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                  status === item.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Trains */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 rounded-2xl border border-slate-800 bg-slate-900/50 animate-pulse" />
          ))}
        </div>
      ) : trains.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <TrainIcon className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="text-base font-bold text-slate-200">Nessun treno trovato</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Nessun convoglio corrisponde ai criteri di ricerca selezionati. Prova a reimpostare i filtri.
          </p>
          <button
            onClick={() => { setSearch(''); setOperator('ALL'); setStatus('ALL') }}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white"
          >
            Reimposta Filtri
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trains.map(train => (
            <TrainCard key={train.id} train={train} />
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { LeaderboardEntry } from '@/types'
import { Trophy, Medal, Crown, Flame, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function ClassificaPage() {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard')
        const data = await res.json()
        if (res.ok && data.leaderboard) {
          setLeaderboard(data.leaderboard)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Trophy className="h-4 w-4" /> Torneo Stagionale Scommettitori
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Classifica Generale dei Migliori Scommettitori
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            I giocatori con il saldo virtuale più elevato e la migliore accuratezza previsionale sui treni italiani.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-right font-mono text-xs">
          <div className="text-[10px] text-amber-400 font-bold uppercase">Montepremi Stagione</div>
          <div className="text-base font-black text-amber-300">500.000 🪙 Crediti</div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {!loading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 rounded-2xl border border-slate-700/80 bg-slate-900/60 p-5 text-center space-y-2 relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700/40 text-slate-300 text-lg font-black border border-slate-600/50">
              #2
            </div>
            <div className="font-bold text-white text-sm">{leaderboard[1].displayName}</div>
            <div className="text-[11px] text-slate-400">{leaderboard[1].badge}</div>
            <div className="font-mono text-base font-black text-slate-200">
              {leaderboard[1].balance.toLocaleString('it-IT')} 🪙
            </div>
            <div className="text-[10px] font-mono text-emerald-400">
              Win Rate: {leaderboard[1].winRate}%
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 rounded-2xl border border-amber-500/60 bg-gradient-to-b from-amber-500/10 to-slate-900/90 p-6 text-center space-y-2 relative shadow-xl shadow-amber-500/10 md:-translate-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 text-xl font-black shadow-lg shadow-amber-500/30">
              <Crown className="h-7 w-7" />
            </div>
            <div className="font-black text-white text-base">{leaderboard[0].displayName}</div>
            <div className="text-xs text-amber-400 font-semibold">{leaderboard[0].badge}</div>
            <div className="font-mono text-xl font-black text-amber-300">
              {leaderboard[0].balance.toLocaleString('it-IT')} 🪙
            </div>
            <div className="text-[11px] font-mono text-emerald-400 font-bold">
              Win Rate: {leaderboard[0].winRate}% • {leaderboard[0].totalBets} Scommesse
            </div>
          </div>

          {/* Rank 3 */}
          <div className="order-3 md:order-3 rounded-2xl border border-amber-900/40 bg-slate-900/60 p-5 text-center space-y-2 relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-900/30 text-amber-500 text-lg font-black border border-amber-800/40">
              #3
            </div>
            <div className="font-bold text-white text-sm">{leaderboard[2].displayName}</div>
            <div className="text-[11px] text-slate-400">{leaderboard[2].badge}</div>
            <div className="font-mono text-base font-black text-slate-200">
              {leaderboard[2].balance.toLocaleString('it-IT')} 🪙
            </div>
            <div className="text-[10px] font-mono text-emerald-400">
              Win Rate: {leaderboard[2].winRate}%
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Full Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-800 bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-16">Pos.</th>
              <th className="py-3.5 px-4">Giocatore</th>
              <th className="py-3.5 px-4">Titolo / Badge</th>
              <th className="py-3.5 px-4 text-center">Win Rate</th>
              <th className="py-3.5 px-4 text-center">Giocate</th>
              <th className="py-3.5 px-4 text-right">Saldo Crediti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leaderboard.map(item => {
              const isCurrentUser = user && user.displayName === item.displayName
              return (
                <tr
                  key={item.userId}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-amber-500/10 font-bold'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold ${
                        item.rank === 1
                          ? 'bg-amber-500 text-slate-950'
                          : item.rank === 2
                          ? 'bg-slate-400 text-slate-950'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span>{item.displayName}</span>
                      {isCurrentUser && (
                        <span className="rounded bg-amber-500 px-1 py-0.2 text-[9px] font-black text-slate-950">
                          TU
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-400 text-[11px]">
                    {item.badge}
                  </td>

                  <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">
                    {item.winRate}%
                  </td>

                  <td className="py-3.5 px-4 text-center text-slate-400">
                    {item.totalBets}
                  </td>

                  <td className="py-3.5 px-4 text-right font-black text-amber-400 text-sm">
                    {item.balance.toLocaleString('it-IT')} 🪙
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

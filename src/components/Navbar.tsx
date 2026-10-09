'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useBetting } from '@/context/BettingContext'
import { 
  Train, 
  Ticket, 
  Trophy, 
  BarChart3, 
  ShieldCheck, 
  Gift, 
  User, 
  LogOut, 
  Flame,
  Menu,
  X
} from 'lucide-react'
import { AuthModal } from './AuthModal'
import { ResponsibleGamingModal } from './ResponsibleGamingModal'

export const Navbar = () => {
  const pathname = usePathname()
  const { user, logout, claimDailyBonus } = useAuth()
  const { selections, isSlipOpen, setIsSlipOpen } = useBetting()
  
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')
  const [isGamingModalOpen, setIsGamingModalOpen] = useState(false)
  const [bonusToast, setBonusToast] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleClaim = async () => {
    const res = await claimDailyBonus()
    setBonusToast(res.message)
    setTimeout(() => setBonusToast(null), 3500)
  }

  const navLinks = [
    { href: '/', label: 'Live Partenze', icon: Flame },
    { href: '/scommesse', label: 'Treni & Quote', icon: Train },
    { href: '/mie-scommesse', label: 'Le Mie Scommesse', icon: Ticket },
    { href: '/classifica', label: 'Classifica', icon: Trophy },
    { href: '/statistiche', label: 'Osservatorio Ritardi', icon: BarChart3 },
    { href: '/regolamento-adm', label: 'Regolamento ADM', icon: ShieldCheck },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Train className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white">TRAIN<span className="text-amber-500">BET</span></span>
                  <span className="rounded bg-rose-600/20 px-1 py-0.2 text-[9px] font-bold text-rose-400 border border-rose-500/30">IT</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1">RITARDO BETTING PLATFORM</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700/60'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Section: Balance, Schedina, Auth */}
          <div className="flex items-center gap-3">
            {/* Responsible gaming quick button */}
            <button
              onClick={() => setIsGamingModalOpen(true)}
              title="Strumenti Gioco Responsabile ADM"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-amber-400 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Wallet Balance Badge */}
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-semibold uppercase text-amber-400/80 leading-none">Saldo Virtuale</span>
                    <span className="font-mono text-sm font-black text-amber-400 leading-tight">
                      {user.balance.toLocaleString('it-IT')} 🪙
                    </span>
                  </div>

                  <button
                    onClick={handleClaim}
                    title="Riscatta +2.500 Crediti Giornalieri"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
                  >
                    <Gift className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* User Dropdown / Profile */}
                <div className="flex items-center gap-1">
                  <span className="hidden md:inline-block text-xs font-semibold text-slate-300 max-w-[100px] truncate">
                    {user.displayName}
                  </span>
                  <button
                    onClick={logout}
                    title="Disconnetti"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setAuthTab('login'); setIsAuthOpen(true) }}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Accedi
                </button>
                <button
                  onClick={() => { setAuthTab('register'); setIsAuthOpen(true) }}
                  className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
                >
                  Registrati (+10k 🪙)
                </button>
              </div>
            )}

            {/* Schedina Toggle Pill */}
            <button
              onClick={() => setIsSlipOpen(!isSlipOpen)}
              className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                selections.length > 0
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 shadow-lg shadow-orange-500/20 animate-pulse-glow'
                  : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Schedina</span>
              {selections.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[10px] font-black text-amber-400">
                  {selections.length}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
            {navLinks.map(link => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-slate-800 text-amber-400' : 'text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* Bonus Toast Feedback */}
      {bonusToast && (
        <div className="fixed bottom-6 left-6 z-50 rounded-xl border border-amber-500/40 bg-slate-900 p-4 shadow-2xl text-amber-300 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Gift className="h-5 w-5 text-amber-400" />
          <span>{bonusToast}</span>
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultTab={authTab}
      />
      <ResponsibleGamingModal
        isOpen={isGamingModalOpen}
        onClose={() => setIsGamingModalOpen(false)}
      />
    </>
  )
}

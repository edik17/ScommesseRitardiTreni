'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Lock, Mail, User as UserIcon, ShieldCheck, X, Sparkles, AlertCircle } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export const AuthModal: React.FC<Props> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(true)
  const [ageConfirmed, setAgeConfirmed] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDemoLogin = async () => {
    setLoading(true)
    setError(null)
    const res = await login('', '', true)
    setLoading(false)
    if (res.success) {
      onClose()
    } else {
      setError(res.error || 'Errore durante accesso demo')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (tab === 'login') {
      const res = await login(email, password)
      setLoading(false)
      if (res.success) {
        onClose()
      } else {
        setError(res.error || 'Credenziali non valide')
      }
    } else {
      if (!acceptTerms || !ageConfirmed) {
        setError('Devi confermare di avere almeno 18 anni e accettare il regolamento')
        setLoading(false)
        return
      }

      const res = await register({
        email,
        password,
        displayName,
        acceptTerms,
        ageConfirmed,
      })
      setLoading(false)
      if (res.success) {
        onClose()
      } else {
        setError(res.error || 'Errore durante la registrazione')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {tab === 'login' ? 'Bentornato a bordo' : 'Crea il tuo Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login'
              ? 'Accedi alla piattaforma di scommesse sui ritardi ferroviari'
              : 'Registrati e ricevi subito 10.000 Crediti Virtuali gratuiti!'}
          </p>
        </div>

        {/* Demo Fast Access Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-4 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Accesso Rapido Demo (10.000 Crediti Pronti)</span>
          </button>
        </div>

        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => { setTab('login'); setError(null) }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === 'login'
                ? 'border-b-2 border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Accedi
          </button>
          <button
            onClick={() => { setTab('register'); setError(null) }}
            className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === 'register'
                ? 'border-b-2 border-amber-500 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrati
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-800/60 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nome o Nickname</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Es. MarioIlCapotreno"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="nome@esempio.it"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="Minimo 8 caratteri"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-start gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={e => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-amber-500"
                />
                <span>
                  Confermo di avere <strong>almeno 18 anni</strong> di età (D.L. 158/2012).
                </span>
              </label>

              <label className="flex items-start gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 bg-slate-800 text-amber-500"
                />
                <span>
                  Accetto i Termini e la Privacy Policy GDPR. Riconosco che i crediti sono <strong>esclusivamente virtuali</strong>.
                </span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md shadow-amber-500/20"
          >
            {loading ? 'Caricamento...' : tab === 'login' ? 'Accedi al Binario' : 'Registrati e Riscuoti 10.000 Crediti'}
          </button>
        </form>
      </div>
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { Train, Shield, Lock, FileText, ExternalLink } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Concept */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-black">
                <Train className="h-5 w-5" />
              </div>
              <span className="text-base font-black text-white">TRAIN<span className="text-amber-500">BET</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              La prima piattaforma italiana di betting sui ritardi dei treni. Trasforma i disservizi ferroviari nel tuo passatempo preferito.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Telemetria ViaggiaTreno Attiva
            </div>
          </div>

          {/* Navigazione */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Piattaforma</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Tabellone Live Partenze</Link></li>
              <li><Link href="/scommesse" className="hover:text-amber-400 transition-colors">Tutti i Treni & Quote</Link></li>
              <li><Link href="/mie-scommesse" className="hover:text-amber-400 transition-colors">Le Mie Scommesse</Link></li>
              <li><Link href="/classifica" className="hover:text-amber-400 transition-colors">Classifica & Premi</Link></li>
              <li><Link href="/statistiche" className="hover:text-amber-400 transition-colors">Osservatorio Ritardi</Link></li>
            </ul>
          </div>

          {/* Tutela e Gioco Responsabile */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Tutela & Normativa</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/regolamento-adm" className="hover:text-amber-400 transition-colors">Regolamento & Conformità ADM</Link></li>
              <li><Link href="/regolamento-adm" className="hover:text-amber-400 transition-colors">Gioco Responsabile (+18)</Link></li>
              <li><span className="text-slate-500">Numero Verde Nazionale: 800 558822</span></li>
              <li><span className="text-slate-500">Autoesclusione volontaria</span></li>
            </ul>
          </div>

          {/* Cybersecurity & Privacy */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Cybersecurity & Trust</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="h-3.5 w-3.5 text-amber-400" />
                <span>Crittografia End-to-End TLS 1.3</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Shield className="h-3.5 w-3.5 text-cyan-400" />
                <span>Conforme GDPR (Reg. UE 2016/679)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                <span>Timestamping Immutabile Scommesse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-[11px] text-slate-400 leading-relaxed mb-6 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-black text-white">18+</span>
            <span>AVVISO LEGALE IMPORTANTE SULLA CONFORMITÀ ITALIANA</span>
          </div>
          <p>
            TrainBet Italia opera attualmente in regime di <strong>simulazione con crediti virtuali gratuiti privi di qualsiasi valore monetario reale</strong>. 
            I crediti non sono acquistabili con denaro, non sono convertibili né cedibili. La piattaforma non costituisce esercizio di gioco d'azzardo ai sensi dell'art. 718 e ss. c.p. 
            In caso di futura transizione a scommesse con denaro reale, la piattaforma opererà esclusivamente previa concessione formale rilasciata dall&apos;<strong>Agenzia delle Dogane e dei Monopoli (ADM)</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-6 text-[11px] text-slate-500 gap-4">
          <div>
            © 2026 TrainBet Italia. Tutti i diritti riservati. Sviluppato per fini dimostrativi e di intrattenimento.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Cookie Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Termini di Servizio</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

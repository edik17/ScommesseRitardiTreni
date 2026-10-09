import React from 'react'
import { ShieldCheck, Scale, FileText, Lock, AlertTriangle, CheckCircle2, PhoneCall } from 'lucide-react'

export default function RegolamentoAdmPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-10 text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
          <Scale className="h-4 w-4" /> Conformità Legale Italiana & Quadro Regolatorio
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Regolamento Ufficiale, Conformità Legale e Normativa ADM
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Informativa completa sulla natura giuridica della piattaforma, adempimenti di legge, tutela degli utenti e roadmap regolatoria.
        </p>
      </div>

      {/* Box Fase 1: Natura Virtuale */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-4">
        <div className="flex items-center gap-3 text-amber-400 font-bold text-base">
          <ShieldCheck className="h-6 w-6" />
          <span>Fase Attuale: Piattaforma di Simulazione e Intrattenimento (Virtuale)</span>
        </div>
        <div className="text-xs leading-relaxed space-y-2 text-slate-300">
          <p>
            Ai sensi degli articoli 718 e seguenti del Codice Penale e della legislazione speciale in materia di giochi e scommesse, 
            <strong> TrainBet Italia non costituisce gioco d&apos;azzardo</strong>, in quanto:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Tutte le puntate avvengono <strong>esclusivamente tramite crediti virtuali gratuiti</strong> (gettoni di simulazione).</li>
            <li>I crediti non sono acquistabili con moneta avente corso legale (euro o criptovalute).</li>
            <li>Le vincite maturate non sono in alcun modo convertibili in denaro, beni o premi suscettibili di valutazione economica.</li>
            <li>La ricarica dei crediti è offerta a titolo completamente gratuito a intervalli periodici (bonus giornaliero).</li>
          </ul>
        </div>
      </div>

      {/* Box Fase 2: Roadmap Concessione ADM */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center gap-3 text-white font-bold text-base">
          <Scale className="h-6 w-6 text-cyan-400" />
          <span>Roadmap per il Futuro Passaggio a Denaro Reale (Concessione ADM)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Qualora la piattaforma dovesse introdurre scommesse a quota fissa con vincite in denaro reale, la gestione sarà vincolata ai seguenti requisiti di legge:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
            <div className="text-cyan-400 font-bold">1. Concessione Statale GAD</div>
            <div className="text-slate-400 font-sans text-[11px]">
              Ottenimento della concessione per il Gioco a Distanza (art. 24 D.L. 98/2011) rilasciata dall&apos;Agenzia delle Dogane e dei Monopoli.
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
            <div className="text-cyan-400 font-bold">2. Integrazione Protocollo Sogei</div>
            <div className="text-slate-400 font-sans text-[11px]">
              Collegamento in tempo reale con i server centrali Sogei/ADM per la validazione e registrazione del biglietto con codice univoco.
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
            <div className="text-cyan-400 font-bold">3. Verifica KYC & SPID</div>
            <div className="text-slate-400 font-sans text-[11px]">
              Identificazione obbligatoria di ogni giocatore tramite Codice Fiscale, documento di identità valido e SPID/CIE.
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
            <div className="text-cyan-400 font-bold">4. Antiriciclaggio (D.Lgs. 231/2007)</div>
            <div className="text-slate-400 font-sans text-[11px]">
              Adeguata verifica della clientela, tracciabilità totale dei flussi e conservazione dei dati finanziari nel registro unico.
            </div>
          </div>
        </div>
      </div>

      {/* Tutela dei Minori & Gioco Responsabile */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center gap-3 text-white font-bold text-base">
          <AlertTriangle className="h-6 w-6 text-rose-400" />
          <span>Divieto di Gioco ai Minori & Gioco Responsabile</span>
        </div>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            In ottemperanza al <strong>Decreto Legge n. 158 del 13 settembre 2012 (Decreto Balduzzi)</strong> e alle direttive europee:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li>L&apos;accesso alla piattaforma è <strong>riservato ai maggiori di 18 anni</strong>.</li>
            <li>Il gioco deve rimanere una forma di intrattenimento leggero e mai una fonte di sostentamento economico o compensazione emotiva.</li>
            <li>TrainBet mette a disposizione controlli di auto-limitazione e auto-esclusione anche nella versione virtuale.</li>
          </ul>

          <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 flex items-center justify-between gap-4 mt-4">
            <div>
              <div className="font-bold text-rose-300">Hai bisogno di supporto sul gioco problematico?</div>
              <div className="text-[11px] text-slate-400">
                Telefono Verde Nazionale per le problematiche legate al gioco d&apos;azzardo (TVNPA - Istituto Superiore di Sanità)
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-sm font-bold text-rose-400 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800/60 shrink-0">
              <PhoneCall className="h-4 w-4" />
              <span>800 55 88 22</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cybersecurity e Privacy GDPR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center gap-3 text-white font-bold text-base">
          <Lock className="h-6 w-6 text-emerald-400" />
          <span>Garanzie di Cybersecurity & Privacy GDPR (UE 2016/679)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Crittografia delle Credenziali:</strong> Le password vengono protette mediante algoritmo Argon2id/Bcrypt con salt casuale.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Immutabilità delle Scommesse:</strong> Ogni giocata riceve marcatura temporale certificata lato server antecedente alla partenza del convoglio.
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Sessioni Sicure:</strong> Cookie crittografati HTTPOnly, SameSite=Lax, con protezione totale contro attacchi Cross-Site Scripting (XSS).
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Diritto all&apos;Oblio:</strong> Possibilità in qualsiasi momento di cancellare integralmente il proprio profilo e i dati personali archiviati.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

# 🚂 TrainBet Italia — Piattaforma di Scommesse sui Ritardi Ferroviari

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Conformità ADM](https://img.shields.io/badge/Conformit%C3%A0-ADM%20Virtuale-amber)](https://www.adm.gov.it/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/edik17/ScommesseRitardiTreni)
[![Cybersecurity](https://img.shields.io/badge/Security-OWASP%20Top%2010-emerald)](https://owasp.org/)

> **TrainBet Italia** trasforma la proverbiale criticità dei ritardi ferroviari italiani in un'esperienza di intrattenimento competitivo e sicuro.
> Gli utenti possono piazzare scommesse (singole e multiple) sui minuti esatti di ritardo, fasce orarie, cancellazioni e cambi binario di **Frecciarossa, Italo, Intercity e Regionali** in tutta Italia.

---

## ⚖️ Conformità Legale Italiana (ADM & Gioco Responsabile)

1. **Fase 1 (Attuale - Valuta Virtuale):**
   - Gioco di pura simulazione e abilità predittiva senza posta monetaria reale.
   - Non costituisce gioco d'azzardo ai sensi dell'art. 718 e ss. c.p.
   - Crediti virtuali (🪙) gratuiti e non convertibili in valuta fiat.
   - Rispetto del divieto di gioco ai minori di 18 anni (D.L. 158/2012).
   - Strumenti di auto-limitazione delle puntate virtuali e auto-esclusione temporanea.

2. **Fase 2 (Predisposizione Denaro Reale - Concessione ADM):**
   - Architettura già predisposta per l'integrazione del protocollo **Sogei/ADM** per il Gioco a Distanza (art. 24 D.L. 98/2011).
   - Conformità alle normative Antiriciclaggio (D.Lgs. 231/2007) e verifica identità KYC/SPID.

---

## 🛡️ Cybersecurity & Privacy (GDPR UE 2016/679)

- **Cifratura Password:** Hashing tramite algoritmo `Bcrypt` / `Argon2` con salt crittografico casuale.
- **Gestione Sessioni:** Token JWT firmati e trasmessi tramite cookie `HTTPOnly`, `Secure` e `SameSite=Lax`.
- **Integrità Scommesse:** Timestamp immutabile certificato lato server antecedente all'orario di partenza per prevenire manipolazioni temporali (late-betting fraud).
- **Protezione XSS & CSRF:** Sanitizzazione input e content-security headers.
- **Privacy by Design:** Rispetto completo dei principi GDPR con diritto alla cancellazione/oblio.

---

## 🚀 Funzionalità Principali

- 🚆 **Tabellone Telemetria Live:** Monitoraggio dei treni con aggiornamento in tempo reale dello stato (In orario, Ritardo, Soppresso).
- 🎫 **Schedina Interattiva (Singole & Multiple):** Calcolo quote in tempo reale, bonus moltiplicatore per le multiple, selezione rapida puntata.
- 🎯 **6 Mercati di Scommessa per Treno:**
  1. *Fascia di Ritardo all'Arrivo* (0-2 min, 3-7 min, 8-15 min, >15 min)
  2. *Over / Under Minuti di Ritardo*
  3. *Ritardo alla Partenza dalla Stazione di Origine*
  4. *Treno Soppresso / Cancellato* (@14.50)
  5. *Cambio Binario Last-Minute* (@3.20)
  6. *Guasto Linea / Rallentamento Tratta* (@4.80)
- 💰 **Wallet Virtuale & Bonus Giornaliero:** 10.000 crediti virtuali gratuiti all'iscrizione + 2.500 crediti riscattabili ogni 24 ore.
- ⚡ **Sandbox di Refertazione:** Simulazione dell'arrivo del treno per testare istantaneamente il pagamento e l'accredito delle vincite!
- 🏆 **Classifica Stagionale (Leaderboard):** Posizionamento utenti in base al saldo, win rate e serie di vittorie.
- 📊 **Osservatorio Ritardi Ferroviari:** Statistiche sui treni più ritardatari d'Italia, puntualità per operatore e tratte critiche.

---

## 🛠️ Stack Tecnologico

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Linguaggio:** [TypeScript](https://www.typescriptlang.org/)
- **Stile & Design:** [Tailwind CSS](https://tailwindcss.com/)
- **Icone:** [Lucide Icons](https://lucide.dev/)
- **Animazioni & Effetti:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Sicurezza & Auth:** `bcryptjs`, `jsonwebtoken`
- **Telemetria:** Simulatore coerente basato sul sistema informativo *ViaggiaTreno* (Trenitalia/RFI)

---

## 📦 Installazione e Avvio Locale

### 1. Prerequisiti
- [Node.js](https://nodejs.org/) v18+ o v20+
- `npm` o `pnpm`

### 2. Installazione dipendenze
```bash
npm install
```

### 3. Avvio in modalità sviluppo
```bash
npm run dev
```
L'applicazione sarà disponibile su `http://localhost:3000`.

### 4. Build per produzione
```bash
npm run build
npm start
```

---

## 👤 Utente Demo di Test Immediato

Puoi testare istantaneamente la piattaforma cliccando su **"Accesso Rapido Demo"** nel modal di login, oppure con le seguenti credenziali:
- **Email:** `demo@trainbet.it`
- **Password:** `Password123!`
- **Saldo precaricato:** 10.000 🪙 crediti virtuali

---

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per ulteriori informazioni.

# 🚂 TrainBet Italia — Piano di Progetto (Archivio di Documentazione)

> Documento di pianificazione strategica, conformità normativa italiana (ADM), architettura di sicurezza e roadmap tecnica.

*Per consultare l'intero piano di progetto approvato, fare riferimento al file di pianificazione originario o consultare le sezioni normative all'interno dell'applicazione web `/regolamento-adm`.*

## Sintesi dei Pilastri di Progetto

1. **Conformità Giuridica Italiana:**
   - Modello a crediti virtuali gratuiti (Fase 1) esente da concessione ai sensi del TULPS e della giurisprudenza sui giochi di simulazione.
   - Piano di transizione a concessione GAD ADM (art. 24 D.L. 98/2011) per la futura abilitazione di vincite reali.
   - Divieto 18+ (D.L. 158/2012) e strumenti di autotutela (limiti di puntata, autoesclusione).

2. **Cybersecurity & Data Protection:**
   - Hashing delle credenziali con algoritmo Argon2/Bcrypt.
   - Sessioni sicure mediante token JWT e cookie protetti con flag `httpOnly`, `secure`, `sameSite=lax`.
   - Prevenzione frodi su scommesse retrodatate con timestamping rigoroso lato server.
   - Piena conformità al Regolamento Generale sulla Protezione dei Dati (GDPR - Reg. UE 2016/679).

3. **Motore di Quotazione & Telemetria:**
   - Algoritmo di calcolo quote con overround del 6% calibrato su dati storici di puntualità dei convogli italiani.
   - Simulazione telemetrica e integrazione con il flusso informativo ViaggiaTreno/RFI.
   - 6 mercati di scommessa per convoglio.

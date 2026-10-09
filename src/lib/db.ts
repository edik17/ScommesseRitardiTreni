import { User, Bet, Transaction, Train, LeaderboardEntry, BetSelection } from '@/types'
import { INITIAL_TRAINS } from '@/data/mockTrains'
import { generateMarketsForTrain } from '@/lib/odds'

// Store in-memory con persistenza globale per Next.js hot reload
declare global {
  // eslint-disable-next-line no-var
  var __trainbet_db: {
    users: Map<string, User & { passwordHash: string }>
    bets: Map<string, Bet>
    transactions: Map<string, Transaction[]>
    trains: Map<string, Train>
  } | undefined
}

function getDatabase() {
  if (!global.__trainbet_db) {
    const users = new Map<string, User & { passwordHash: string }>()
    const bets = new Map<string, Bet>()
    const transactions = new Map<string, Transaction[]>()
    const trains = new Map<string, Train>()

    // Inizializza treni
    INITIAL_TRAINS.forEach(t => trains.set(t.id, { ...t }))

    // Utente DEMO di default
    const demoId = 'user-demo-123'
    const demoUser: User & { passwordHash: string } = {
      id: demoId,
      email: 'demo@trainbet.it',
      displayName: 'Capotreno Demo',
      passwordHash: '$2a$10$vI8aWBnW3fID.ZQ4/ZO1e.uQ78kQY06WnZ7iYc0hXhV98yQd16s0S', // Password123!
      balance: 10000,
      isEmailVerified: true,
      is2FAEnabled: false,
      role: 'USER',
      createdAt: new Date().toISOString(),
      stats: {
        totalBets: 4,
        wonBets: 2,
        lostBets: 1,
        totalWagered: 1200,
        totalWon: 2450,
        biggestWin: 1800,
        streak: 2,
      },
    }
    users.set(demoId, demoUser)

    // Transazioni demo
    transactions.set(demoId, [
      {
        id: 'tx-1',
        userId: demoId,
        amount: 10000,
        type: 'WELCOME_BONUS',
        balanceAfter: 10000,
        description: 'Bonus di benvenuto TrainBet (10.000 crediti virtuali)',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'tx-2',
        userId: demoId,
        amount: -500,
        type: 'BET_PLACED',
        balanceAfter: 9500,
        description: 'Piazzata scommessa su FR 9512 (>15 min)',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'tx-3',
        userId: demoId,
        amount: 1750,
        type: 'BET_WON',
        balanceAfter: 11250,
        description: 'Vincita scommessa FR 9512 (>15 min @3.50)',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ])

    // Scommesse iniziali demo
    const demoBets: Bet[] = [
      {
        id: 'bet-demo-1',
        userId: demoId,
        type: 'SINGLE',
        selections: [
          {
            trainId: 'tr-9512',
            trainNumber: 'FR 9512',
            origin: 'Milano Centrale',
            destination: 'Roma Termini',
            marketId: 'mkt-delay-tr-9512',
            marketTitle: "Fascia di Ritardo all'Arrivo",
            marketType: 'DELAY_RANGE',
            outcomeId: 'out-tr-9512-heavy',
            outcomeLabel: 'Grave ritardo (>15 min)',
            odds: 3.50,
          },
        ],
        totalOdds: 3.50,
        stake: 500,
        potentialWin: 1750,
        status: 'WON',
        payout: 1750,
        placedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        settledAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'bet-demo-2',
        userId: demoId,
        type: 'SINGLE',
        selections: [
          {
            trainId: 'tr-610',
            trainNumber: 'IC 610',
            origin: 'Bologna Centrale',
            destination: 'Bari Centrale',
            marketId: 'mkt-ou-tr-610',
            marketTitle: 'Over / Under Ritardo (9.5 min)',
            marketType: 'OVER_UNDER',
            outcomeId: 'out-tr-610-over',
            outcomeLabel: 'Over 9.5 minuti',
            odds: 1.75,
          },
        ],
        totalOdds: 1.75,
        stake: 300,
        potentialWin: 525,
        status: 'PENDING',
        placedAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ]

    demoBets.forEach(b => bets.set(b.id, b))

    global.__trainbet_db = { users, bets, transactions, trains }
  }

  return global.__trainbet_db
}

export const db = {
  // --- USER OPERATIONS ---
  getUserById(id: string): (User & { passwordHash: string }) | undefined {
    return getDatabase().users.get(id)
  },

  getUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    const allUsers = Array.from(getDatabase().users.values())
    for (const u of allUsers) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u
    }
    return undefined
  },

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'stats' | 'balance'> & { passwordHash: string }): User {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    const newUser: User & { passwordHash: string } = {
      ...userData,
      id,
      balance: 10000, // 10.000 Crediti di benvenuto come da piano
      createdAt: new Date().toISOString(),
      stats: {
        totalBets: 0,
        wonBets: 0,
        lostBets: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        streak: 0,
      },
    }

    getDatabase().users.set(id, newUser)

    // Aggiungi transazione bonus benvenuto
    this.addTransaction({
      userId: id,
      amount: 10000,
      type: 'WELCOME_BONUS',
      balanceAfter: 10000,
      description: 'Bonus di Benvenuto TrainBet: 10.000 crediti virtuali gratuiti!',
    })

    return newUser
  },

  updateUserBalance(userId: string, deltaAmount: number): number {
    const user = this.getUserById(userId)
    if (!user) throw new Error('Utente non trovato')
    user.balance += deltaAmount
    return user.balance
  },

  claimDailyBonus(userId: string): { success: boolean; newBalance: number; message: string } {
    const user = this.getUserById(userId)
    if (!user) throw new Error('Utente non trovato')

    const now = Date.now()
    if (user.dailyBonusClaimedAt) {
      const lastClaim = new Date(user.dailyBonusClaimedAt).getTime()
      const diffHours = (now - lastClaim) / (1000 * 60 * 60)
      if (diffHours < 24) {
        const hoursRemaining = Math.ceil(24 - diffHours)
        return {
          success: false,
          newBalance: user.balance,
          message: `Bonus giornaliero già riscattato! Torna tra ${hoursRemaining} ore.`,
        }
      }
    }

    const BONUS_AMOUNT = 2500
    user.balance += BONUS_AMOUNT
    user.dailyBonusClaimedAt = new Date().toISOString()

    this.addTransaction({
      userId,
      amount: BONUS_AMOUNT,
      type: 'DAILY_BONUS',
      balanceAfter: user.balance,
      description: 'Ricarica giornaliera: +2.500 crediti virtuali',
    })

    return {
      success: true,
      newBalance: user.balance,
      message: `Hai riscattato 2.500 crediti virtuali gratuiti! 🎉`,
    }
  },

  // --- TRAINS OPERATIONS ---
  getAllTrains(): Train[] {
    return Array.from(getDatabase().trains.values())
  },

  getTrainById(id: string): Train | undefined {
    return getDatabase().trains.get(id)
  },

  updateTrainDelay(id: string, newDelay: number, newLocation?: string, newStatus?: Train['status']): Train {
    const train = this.getTrainById(id)
    if (!train) throw new Error('Treno non trovato')

    train.currentDelay = newDelay
    train.lastUpdate = 'Aggiornato adesso'
    if (newLocation) train.currentLocation = newLocation
    if (newStatus) train.status = newStatus

    // Se il treno è arrivato o soppresso, esegui il settlement automatico delle scommesse
    if (newStatus === 'ARRIVATO' || newStatus === 'SOPPRESSO') {
      this.settleBetsForTrain(train)
    }

    return train
  },

  // Simula aggiornamento casuale e realistico dei ritardi per tutti i treni in viaggio
  simulateLiveUpdate(): Train[] {
    const trains = this.getAllTrains()
    trains.forEach(t => {
      if (t.status === 'IN_VIAGGIO') {
        // Variazione di ritardo realistica (+0, +1, -1, +2 min)
        const rand = Math.random()
        let delta = 0
        if (rand > 0.7) delta = 1
        else if (rand > 0.9) delta = 2
        else if (rand < 0.15 && t.currentDelay > 0) delta = -1

        t.currentDelay = Math.max(0, t.currentDelay + delta)
        t.lastUpdate = 'Pochi secondi fa'
      }
    })
    return trains
  },

  // --- BETTING OPERATIONS ---
  createBet(userId: string, selections: BetSelection[], stake: number): Bet {
    const user = this.getUserById(userId)
    if (!user) throw new Error('Utente non trovato')
    if (user.balance < stake) throw new Error('Saldo crediti insufficiente!')
    if (stake <= 0) throw new Error('La puntata minima è di 10 crediti')

    // Calcolo moltiplicatore totale
    const isMultiple = selections.length > 1
    let totalOdds = selections.reduce((acc, sel) => acc * sel.odds, 1)

    // Bonus multipla (es. 5% extra ogni selezione oltre la prima)
    if (isMultiple) {
      const bonusMultiplier = 1 + (selections.length - 1) * 0.05
      totalOdds = totalOdds * bonusMultiplier
    }

    totalOdds = Number(totalOdds.toFixed(2))
    const potentialWin = Math.round(stake * totalOdds)

    // Scala i crediti dal wallet
    user.balance -= stake
    user.stats.totalBets += 1
    user.stats.totalWagered += stake

    const betId = `bet-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    const newBet: Bet = {
      id: betId,
      userId,
      type: isMultiple ? 'MULTIPLE' : 'SINGLE',
      selections,
      totalOdds,
      stake,
      potentialWin,
      status: 'PENDING',
      placedAt: new Date().toISOString(),
    }

    getDatabase().bets.set(betId, newBet)

    this.addTransaction({
      userId,
      amount: -stake,
      type: 'BET_PLACED',
      balanceAfter: user.balance,
      description: `Piazzata ${isMultiple ? 'Multipla' : 'Singola'} su ${selections.map(s => s.trainNumber).join(', ')} (@${totalOdds})`,
    })

    return newBet
  },

  getUserBets(userId: string): Bet[] {
    const all = Array.from(getDatabase().bets.values())
    return all.filter(b => b.userId === userId).sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
  },

  // Risolve automaticamente le scommesse per un treno arrivato
  settleBetsForTrain(train: Train): void {
    const allBets = Array.from(getDatabase().bets.values()).filter(b => b.status === 'PENDING')
    
    for (const bet of allBets) {
      const relevantSelections = bet.selections.filter(s => s.trainId === train.id)
      if (relevantSelections.length === 0) continue

      // Valuta ogni selezione del treno
      let won = true
      for (const sel of bet.selections) {
        if (sel.trainId === train.id) {
          const outcomeWon = this.evaluateOutcome(sel, train)
          if (!outcomeWon) {
            won = false
            break
          }
        }
      }

      // Se è singola e ha vinto
      if (bet.type === 'SINGLE') {
        const isWin = this.evaluateOutcome(bet.selections[0], train)
        bet.status = isWin ? 'WON' : 'LOST'
        bet.settledAt = new Date().toISOString()

        const user = this.getUserById(bet.userId)
        if (user) {
          if (isWin) {
            bet.payout = bet.potentialWin
            user.balance += bet.potentialWin
            user.stats.wonBets += 1
            user.stats.totalWon += bet.potentialWin
            user.stats.biggestWin = Math.max(user.stats.biggestWin, bet.potentialWin)
            user.stats.streak += 1

            this.addTransaction({
              userId: user.id,
              amount: bet.potentialWin,
              type: 'BET_WON',
              balanceAfter: user.balance,
              description: `VINCITA! Scommessa ${bet.selections[0].trainNumber} vinta (${bet.potentialWin} crediti)`,
            })
          } else {
            user.stats.lostBets += 1
            user.stats.streak = 0
          }
        }
      }
    }
  },

  evaluateOutcome(selection: BetSelection, train: Train): boolean {
    const delay = train.currentDelay
    const outcomeId = selection.outcomeId

    if (train.status === 'SOPPRESSO') {
      return outcomeId.includes('cancelled')
    }

    if (selection.marketType === 'DELAY_RANGE') {
      if (outcomeId.includes('ontime')) return delay <= 2
      if (outcomeId.includes('small')) return delay >= 3 && delay <= 7
      if (outcomeId.includes('medium')) return delay >= 8 && delay <= 15
      if (outcomeId.includes('heavy')) return delay > 15
    }

    if (selection.marketType === 'OVER_UNDER') {
      if (outcomeId.includes('over')) return delay > 9.5 || delay > 4.5
      if (outcomeId.includes('under')) return delay <= 9.5 && delay <= 4.5
    }

    if (selection.marketType === 'DEPARTURE_DELAY') {
      if (outcomeId.includes('ontime')) return delay < 3
      if (outcomeId.includes('late')) return delay >= 3
    }

    return false
  },

  // --- TRANSACTIONS ---
  addTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    const tx: Transaction = {
      ...data,
      id: txId,
      createdAt: new Date().toISOString(),
    }
    const userTxs = getDatabase().transactions.get(data.userId) || []
    userTxs.unshift(tx)
    getDatabase().transactions.set(data.userId, userTxs)
    return tx
  },

  getUserTransactions(userId: string): Transaction[] {
    return getDatabase().transactions.get(userId) || []
  },

  // --- LEADERBOARD ---
  getLeaderboard(): LeaderboardEntry[] {
    const users = Array.from(getDatabase().users.values())

    // Aggiungi alcuni bot/giocatori preimpostati per creare una community attiva
    const botRankings: LeaderboardEntry[] = [
      { rank: 1, userId: 'bot-1', displayName: 'FrecciaRossaMaster', balance: 84200, totalWon: 125000, winRate: 74, totalBets: 86, badge: '👑 Gran Capotreno' },
      { rank: 2, userId: 'bot-2', displayName: 'PendolareDisperato', balance: 62400, totalWon: 98000, winRate: 68, totalBets: 72, badge: '⚡ Mago dei Binari' },
      { rank: 3, userId: 'bot-3', displayName: 'Binario21_Sniper', balance: 48900, totalWon: 74500, winRate: 63, totalBets: 65, badge: '🎯 Cecchino dei Ritardi' },
      { rank: 4, userId: 'bot-4', displayName: 'ItaloFanboy', balance: 35200, totalWon: 52000, winRate: 59, totalBets: 48, badge: '🚄 Velocista' },
      { rank: 5, userId: 'bot-5', displayName: 'TrenoInOrarioMai', balance: 29800, totalWon: 41000, winRate: 55, totalBets: 39, badge: '🎫 Abbonato d’Oro' },
    ]

    // Integra gli utenti reali
    users.forEach(u => {
      const winRate = u.stats.totalBets > 0 ? Math.round((u.stats.wonBets / u.stats.totalBets) * 100) : 50
      botRankings.push({
        rank: 0,
        userId: u.id,
        displayName: u.displayName,
        balance: u.balance,
        totalWon: u.stats.totalWon,
        winRate,
        totalBets: u.stats.totalBets,
        badge: u.balance > 20000 ? '⭐ Esperto Tratta' : '🚆 Nuovo Viaggiatore',
      })
    })

    botRankings.sort((a, b) => b.balance - a.balance)
    return botRankings.map((item, idx) => ({ ...item, rank: idx + 1 }))
  },
}

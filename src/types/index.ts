export type TrainOperator = 'FRECCIAROSSA' | 'ITALO' | 'INTERCITY' | 'REGIONALE'

export type TrainStatus = 'PROGRAMMATO' | 'IN_VIAGGIO' | 'ARRIVATO' | 'SOPPRESSO'

export interface TrainStop {
  station: string
  scheduledArrival: string
  actualArrival?: string
  scheduledDeparture: string
  actualDeparture?: string
  delayMinutes: number
  platform: string
  passed: boolean
}

export interface Train {
  id: string
  number: string
  operator: TrainOperator
  categoryName: string // e.g. "Frecciarossa 1000", "Italo EVO", "Regionale Veloce"
  origin: string
  destination: string
  scheduledDeparture: string
  scheduledArrival: string
  actualDeparture?: string
  actualArrival?: string
  currentDelay: number // in minutes: 0 is on-time, negative is early, positive is delayed
  status: TrainStatus
  currentLocation?: string
  platform: string
  historicalDelayAverage: number // 30-day average delay
  onTimePercentage: number // % of trips within 5 mins
  stops: TrainStop[]
  lastUpdate: string
}

export type MarketType = 
  | 'DELAY_RANGE'       // Fascia di ritardo all'arrivo
  | 'OVER_UNDER'         // Over / Under X minuti
  | 'DEPARTURE_DELAY'    // Ritardo alla partenza
  | 'CANCELLED'          // Treno soppresso
  | 'PLATFORM_CHANGE'    // Cambio binario last-minute
  | 'LINE_FAULT'         // Guasto tecnico / rallentamento linea

export interface MarketOutcome {
  id: string
  marketType: MarketType
  label: string
  description?: string
  odds: number // Quota decimale es. 2.40
  isWinning?: boolean
}

export interface BettingMarket {
  id: string
  trainId: string
  title: string
  type: MarketType
  outcomes: MarketOutcome[]
  closesAt: string
  isSettled: boolean
}

export interface BetSelection {
  trainId: string
  trainNumber: string
  origin: string
  destination: string
  marketId: string
  marketTitle: string
  marketType: MarketType
  outcomeId: string
  outcomeLabel: string
  odds: number
}

export type BetStatus = 'PENDING' | 'WON' | 'LOST' | 'VOID'

export interface Bet {
  id: string
  userId: string
  type: 'SINGLE' | 'MULTIPLE'
  selections: BetSelection[]
  totalOdds: number
  stake: number // In crediti virtuali
  potentialWin: number
  status: BetStatus
  payout?: number
  placedAt: string
  settledAt?: string
}

export interface User {
  id: string
  email: string
  displayName: string
  balance: number // Crediti virtuali
  isEmailVerified: boolean
  is2FAEnabled: boolean
  twoFactorSecret?: string
  dailyBonusClaimedAt?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  stats: {
    totalBets: number
    wonBets: number
    lostBets: number
    totalWagered: number
    totalWon: number
    biggestWin: number
    streak: number
  }
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'WELCOME_BONUS' | 'DAILY_BONUS' | 'BET_PLACED' | 'BET_WON' | 'BET_REFUND'
  balanceAfter: number
  description: string
  createdAt: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  balance: number
  totalWon: number
  winRate: number
  totalBets: number
  badge: string
}

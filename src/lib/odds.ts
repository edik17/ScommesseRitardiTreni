import { Train, BettingMarket, MarketOutcome } from '@/types'

/**
 * Calcola le quote dinamiche per un treno basandosi sullo storico dei ritardi,
 * la tratta e l'overround della piattaforma (5-8%).
 */
export function generateMarketsForTrain(train: Train): BettingMarket[] {
  const avg = train.historicalDelayAverage
  const onTimeRate = train.onTimePercentage / 100

  // 1. Mercato: Fascia di ritardo all'arrivo
  // Calcolo probabilità stimate
  let pOnTime = Math.max(0.15, Math.min(0.65, onTimeRate))
  let pSmall = Math.max(0.15, Math.min(0.40, (1 - pOnTime) * 0.45))
  let pMed = Math.max(0.12, Math.min(0.35, (1 - pOnTime) * 0.35))
  let pHigh = Math.max(0.08, 1 - (pOnTime + pSmall + pMed))

  // Applica un overround del 6% (margine della casa)
  const overround = 1.06
  const oddsOnTime = Number(((1 / pOnTime) * (1 / overround)).toFixed(2))
  const oddsSmall = Number(((1 / pSmall) * (1 / overround)).toFixed(2))
  const oddsMed = Number(((1 / pMed) * (1 / overround)).toFixed(2))
  const oddsHigh = Number(((1 / pHigh) * (1 / overround)).toFixed(2))

  const delayRangeMarket: BettingMarket = {
    id: `mkt-delay-${train.id}`,
    trainId: train.id,
    title: "Fascia di Ritardo all'Arrivo",
    type: 'DELAY_RANGE',
    closesAt: train.scheduledDeparture,
    isSettled: train.status === 'ARRIVATO',
    outcomes: [
      {
        id: `out-${train.id}-ontime`,
        marketType: 'DELAY_RANGE',
        label: 'In orario (0-2 min)',
        description: 'Arrivo previsto in perfetto orario o entro 2 minuti',
        odds: Math.max(1.30, oddsOnTime),
      },
      {
        id: `out-${train.id}-small`,
        marketType: 'DELAY_RANGE',
        label: 'Piccolo ritardo (3-7 min)',
        description: 'Ritardo fisiologico tra 3 e 7 minuti',
        odds: Math.max(1.40, oddsSmall),
      },
      {
        id: `out-${train.id}-medium`,
        marketType: 'DELAY_RANGE',
        label: 'Ritardo medio (8-15 min)',
        description: 'Ritardo consistente tra 8 e 15 minuti',
        odds: Math.max(1.80, oddsMed),
      },
      {
        id: `out-${train.id}-heavy`,
        marketType: 'DELAY_RANGE',
        label: 'Grave ritardo (>15 min)',
        description: 'Oltre 15 minuti di ritardo (diritto bonus indennizzo)',
        odds: Math.max(2.10, oddsHigh),
      },
    ],
  }

  // 2. Mercato: Over / Under Ritardo
  const targetMin = avg > 8 ? 9.5 : 4.5
  const overOdds = avg > targetMin ? 1.75 : 2.15
  const underOdds = avg > targetMin ? 2.05 : 1.70

  const overUnderMarket: BettingMarket = {
    id: `mkt-ou-${train.id}`,
    trainId: train.id,
    title: `Over / Under Ritardo (${targetMin} min)`,
    type: 'OVER_UNDER',
    closesAt: train.scheduledDeparture,
    isSettled: train.status === 'ARRIVATO',
    outcomes: [
      {
        id: `out-${train.id}-over`,
        marketType: 'OVER_UNDER',
        label: `Over ${targetMin} minuti`,
        description: `Il ritardo finale sarà superiore a ${targetMin} minuti`,
        odds: overOdds,
      },
      {
        id: `out-${train.id}-under`,
        marketType: 'OVER_UNDER',
        label: `Under ${targetMin} minuti`,
        description: `Il ritardo finale sarà inferiore a ${targetMin} minuti`,
        odds: underOdds,
      },
    ],
  }

  // 3. Mercato: Ritardo alla partenza
  const depMarket: BettingMarket = {
    id: `mkt-dep-${train.id}`,
    trainId: train.id,
    title: 'Ritardo alla Partenza dalla Stazione di Origine',
    type: 'DEPARTURE_DELAY',
    closesAt: train.scheduledDeparture,
    isSettled: train.status !== 'PROGRAMMATO',
    outcomes: [
      {
        id: `out-${train.id}-dep-ontime`,
        marketType: 'DEPARTURE_DELAY',
        label: 'Partenza in orario (< 3 min)',
        odds: 1.55,
      },
      {
        id: `out-${train.id}-dep-late`,
        marketType: 'DEPARTURE_DELAY',
        label: 'Partenza con ritardo (≥ 3 min)',
        odds: 2.45,
      },
    ],
  }

  // 4. Mercato: Scommesse speciali (Treno soppresso o cambio binario)
  const specialMarket: BettingMarket = {
    id: `mkt-spec-${train.id}`,
    trainId: train.id,
    title: 'Mercati Speciali & Imprevisti',
    type: 'CANCELLED',
    closesAt: train.scheduledDeparture,
    isSettled: train.status === 'ARRIVATO',
    outcomes: [
      {
        id: `out-${train.id}-cancelled`,
        marketType: 'CANCELLED',
        label: 'Treno Soppresso / Cancellato',
        description: 'Cancellazione totale o parziale del convoglio',
        odds: 14.50,
      },
      {
        id: `out-${train.id}-platform-change`,
        marketType: 'PLATFORM_CHANGE',
        label: 'Cambio Binario Last-Minute',
        description: 'Variazione di binario comunicata negli ultimi 15 min',
        odds: 3.20,
      },
      {
        id: `out-${train.id}-line-fault`,
        marketType: 'LINE_FAULT',
        label: 'Guasto Linea / Rallentamento Tratta',
        description: 'Annuncio guasto tecnico a impianti o linea aerea',
        odds: 4.80,
      },
    ],
  }

  return [delayRangeMarket, overUnderMarket, depMarket, specialMarket]
}

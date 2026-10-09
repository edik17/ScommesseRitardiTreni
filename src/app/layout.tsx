import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { BettingProvider } from '@/context/BettingContext'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BettingSlip } from '@/components/BettingSlip'

export const metadata: Metadata = {
  title: 'TrainBet Italia 🚂 | Scommesse sui Ritardi dei Treni',
  description: 'La prima piattaforma italiana di scommesse sui ritardi dei treni con crediti virtuali. Prevedi i ritardi di Frecciarossa, Italo, Intercity e Regionali in tempo reale.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="dark">
      <body className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <AuthProvider>
          <BettingProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <BettingSlip />
            <Footer />
          </BettingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

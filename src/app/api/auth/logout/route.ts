import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Disconnesso' })
  response.cookies.delete('trainbet_token')
  return response
}

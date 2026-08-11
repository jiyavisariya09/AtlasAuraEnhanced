import { NextResponse } from 'next/server'

// Fallback rates if external FX API is temporarily unavailable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 87.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.2,
  CAD: 1.37,
  AUD: 1.52,
  AED: 3.67,
  SGD: 1.35,
  CHF: 0.90,
}

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 }, // Cache rates for 1 hour
    })

    if (!res.ok) {
      return NextResponse.json({
        base: 'USD',
        rates: FALLBACK_RATES,
        source: 'fallback',
        timestamp: new Date().toISOString(),
      })
    }

    const data = await res.json()
    const rates: Record<string, number> = {
      USD: 1.0,
      INR: data.rates?.INR || FALLBACK_RATES.INR,
      EUR: data.rates?.EUR || FALLBACK_RATES.EUR,
      GBP: data.rates?.GBP || FALLBACK_RATES.GBP,
      JPY: data.rates?.JPY || FALLBACK_RATES.JPY,
      CAD: data.rates?.CAD || FALLBACK_RATES.CAD,
      AUD: data.rates?.AUD || FALLBACK_RATES.AUD,
      AED: data.rates?.AED || FALLBACK_RATES.AED,
      SGD: data.rates?.SGD || FALLBACK_RATES.SGD,
      CHF: data.rates?.CHF || FALLBACK_RATES.CHF,
    }

    return NextResponse.json({
      base: 'USD',
      rates,
      source: 'live',
      timestamp: data.time_last_update_utc || new Date().toISOString(),
    })
  } catch (err) {
    console.error('Currency FX rates error:', err)
    return NextResponse.json({
      base: 'USD',
      rates: FALLBACK_RATES,
      source: 'fallback',
      timestamp: new Date().toISOString(),
    })
  }
}

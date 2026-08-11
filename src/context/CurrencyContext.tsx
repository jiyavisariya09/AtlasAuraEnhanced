'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'AED'

export interface CurrencyConfig {
  code: CurrencyCode
  symbol: string
  label: string
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'AED', symbol: 'AED', label: 'AED' },
]

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
  rates: Record<string, number>
  convert: (amountUSD: number) => number
  formatPrice: (amountUSD: number) => string
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  rates: { USD: 1 },
  convert: (amount) => amount,
  formatPrice: (amount) => `$${amount.toFixed(0)}`,
  isLoading: false,
})

const CURRENCY_STORAGE_KEY = 'atlasaura-preferred-currency'

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1, INR: 87.5, EUR: 0.92, GBP: 0.79, JPY: 155.2, CAD: 1.37, AUD: 1.52, AED: 3.67 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null
    if (saved && SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
      setCurrencyState(saved)
    }

    fetch('/api/currency/rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates) {
          setRates(data.rates)
        }
      })
      .catch((err) => console.error('Failed to fetch FX rates:', err))
      .finally(() => setIsLoading(false))
  }, [])

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code)
    localStorage.setItem(CURRENCY_STORAGE_KEY, code)
  }

  const convert = (amountUSD: number): number => {
    const rate = rates[currency] || 1
    return amountUSD * rate
  }

  const formatPrice = (amountUSD: number): string => {
    const converted = convert(amountUSD)
    const config = SUPPORTED_CURRENCIES.find((c) => c.code === currency)
    const symbol = config?.symbol || '$'

    if (currency === 'INR' || currency === 'JPY') {
      return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`
    }

    return `${symbol}${Math.round(converted).toLocaleString('en-US')}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convert,
        formatPrice,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}

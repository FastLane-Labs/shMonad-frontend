'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface UseSimulateQuoteParams {
  sellToken: string
  sellAmount: string
  buyToken: string
}

interface UseSimulateQuoteResult {
  buyAmount: string
  loading: boolean
  error: string | null
}

export function useSimulateQuote({ sellToken, sellAmount, buyToken }: UseSimulateQuoteParams): UseSimulateQuoteResult {
  const [buyAmount, setBuyAmount] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const simulateQuote = async () => {
      if (!sellToken || !sellAmount) {
        setBuyAmount('')
        return
      }

      setLoading(true)
      setError(null)

      try {
        // const response = await axios.post('/api/quote', {
        //   sellToken,
        //   sellAmount,
        // })
        // setBuyAmount(response.data.buyAmount)
        setBuyAmount('6969')
      } catch (error: any) {
        setError(error.message)
        setBuyAmount('')
      } finally {
        setLoading(false)
      }
    }

    simulateQuote()
  }, [sellToken, sellAmount])

  return { buyAmount, loading, error }
}

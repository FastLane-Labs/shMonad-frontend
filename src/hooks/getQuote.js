'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

export function UseSimulateQuote(sellToken, sellAmount, buyToken) {
  const [buyAmount, setBuyAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const simulateQuote = async () => {
      if (!sellToken || !sellAmount) {
        setBuyAmount(0)
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
        setBuyAmount(6969)
      } catch (error) {
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

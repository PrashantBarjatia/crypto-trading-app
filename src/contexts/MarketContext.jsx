import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { openTickerSocket, closeSocket } from '../utils/binanceSocket'

const MarketContext = createContext()

const DEFAULT_SYMBOLS = ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'adausdt', 'solusdt']

export function MarketProvider({ children }) {
  const [prices, setPrices] = useState({})
  const [selected, setSelected] = useState('btcusdt')
  const [transactions, setTransactions] = useState([])
  const [priceHistory, setPriceHistory] = useState({})
  const socketRefs = useRef({})


  useEffect(() => {
    DEFAULT_SYMBOLS.forEach(sym => {
      if (socketRefs.current[sym]) return
      const socket = openTickerSocket(sym, (msg) => {
        try {
          const parsed = JSON.parse(msg.data)
          const priceStr = parsed.c || parsed.a || parsed.p || parsed.lastPrice
          const price = Number(priceStr)
          if (!isFinite(price)) return
          setPrices(prev => ({ ...prev, [sym]: price }))
          setPriceHistory(prev => {
            const arr = (prev[sym] || [])
            const next = [...arr, { t: Date.now(), p: price }]
            if (next.length > 200) next.splice(0, next.length - 200)
            return { ...prev, [sym]: next }
          })
        } catch (e) {        }
      })
      socketRefs.current[sym] = socket
    })

    return () => {
      Object.values(socketRefs.current).forEach(s => {
        try { closeSocket(s) } catch (e) {}
      })
      socketRefs.current = {}
    }
  }, [])

  function addTransaction(tx) {
    setTransactions(prev => [{ ...tx, id: Date.now() }, ...prev].slice(0, 500))
  }

  return (
    <MarketContext.Provider value={{
      prices,
      selected,
      setSelected,
      transactions,
      addTransaction,
      priceHistory,
      symbols: DEFAULT_SYMBOLS
    }}>
      {children}
    </MarketContext.Provider>
  )
}

export const useMarket = () => useContext(MarketContext)

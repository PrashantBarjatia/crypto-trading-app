import React from 'react'
import { Box, Typography } from '@mui/material'
import CoinCard from './CoinCard'
import { useMarket } from '../contexts/MarketContext'

export default function CoinList() {
  const { symbols, selected, setSelected } = useMarket()
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Markets</Typography>
      {symbols.map(s => (
        <CoinCard key={s} symbol={s} onClick={(sym) => setSelected(sym)} selected={selected === s} />
      ))}
    </Box>
  )
}

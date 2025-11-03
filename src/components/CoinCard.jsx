  import React from 'react'
  import { Card, CardContent, Typography, Box } from '@mui/material'
  import PriceChart from './PriceChart'
  import { useMarket } from '../contexts/MarketContext'

  export default function CoinCard({ symbol, onClick, selected }) {
    const { prices, priceHistory } = useMarket()
    const price = prices[symbol] || 0
    const history = priceHistory[symbol] || []

    return (
      <Card
        variant={selected ? 'outlined' : undefined}
        sx={{
          mb: 1,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 3,
          },
        }}
        onClick={() => onClick(symbol)}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.1rem' } }}
              >
                {symbol.toUpperCase()}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  color: 'primary.main',
                  wordBreak: 'break-word',
                }}
              >
                ${Number(price).toLocaleString(undefined, { maximumFractionDigits: 8 })}
              </Typography>
            </Box>

            <Box
              sx={{
                width: { xs: '100%', sm: 120 },
                height: { xs: 60, sm: 48 },
              }}
            >
              <PriceChart compact data={history} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
  }

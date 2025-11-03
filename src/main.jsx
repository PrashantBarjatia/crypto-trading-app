import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { AuthProvider } from './contexts/AuthContext'
import { WalletProvider } from './contexts/WalletContext'
import { MarketProvider } from './contexts/MarketContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <WalletProvider>
          <MarketProvider>
            <App />
          </MarketProvider>
        </WalletProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
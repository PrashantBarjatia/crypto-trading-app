import React, { useState } from 'react'
import { Box, TextField, Button, Tabs, Tab, Typography, Paper } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function AuthForms({ onDone }) {
  const { signup, login } = useAuth()
  const [mode, setMode] = useState(0)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      if (mode === 1) {
        signup({ username, password })
        alert('Signed up')
      } else {
        login({ username, password })
        alert('Logged in')
      }
      setUsername('')
      setPassword('')
      onDone && onDone()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: { xs: '80vh', sm: '70vh' },
        px: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
        }}
      >
        <Tabs
          value={mode}
          onChange={(e, v) => setMode(v)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            {mode === 1 ? 'Signup' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

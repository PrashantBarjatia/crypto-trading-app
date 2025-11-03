import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4caf50' },
    background: { default: '#0b1020', paper: '#0f1724' }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } }
  }
})

export default theme

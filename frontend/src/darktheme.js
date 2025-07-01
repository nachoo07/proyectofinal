// src/darkTheme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = (fontSize = 16) => createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff5252' },
    secondary: { main: '#f48fb1' },
    background: { default: '#121212', paper: '#1d1d1d' },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    action: {
      active: '#ffffff',
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.3)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize,
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    button: { textTransform: 'none' },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
  },
});

export default darkTheme;

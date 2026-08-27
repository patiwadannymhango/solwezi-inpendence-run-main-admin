import type { PaletteMode, ThemeOptions } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

// Material Design 2 palette tuned around the event's brand blue, with the
// standard MD2 gray/green/orange/red ramps used across the MUI dashboard
// template (status chips, charts, hover states).

export const brand = {
  50: '#e9f2ff',
  100: '#cfe4ff',
  200: '#9ccbff',
  300: '#66adff',
  400: '#3d8fff',
  main: '#1565c0',
  500: '#1565c0',
  600: '#0d4fa3',
  700: '#0a3d80',
  800: '#082f63',
  900: '#062244',
}

export const gray = {
  50: '#fafafa',
  100: '#f4f5f7',
  200: '#e6e8ec',
  300: '#d3d7de',
  400: '#a9afbc',
  500: '#7c8494',
  600: '#5a6272',
  700: '#3d4451',
  800: '#252a33',
  900: '#14171c',
}

export const green = { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20', bg: '#e8f5e9' }
export const orange = { main: '#ed6c02', light: '#ff9800', dark: '#c65a00', bg: '#fff3e0' }
export const red = { main: '#d32f2f', light: '#ef5350', dark: '#b71c1c', bg: '#fdecea' }
export const teal = { main: '#00897b', light: '#26a69a', dark: '#00695c', bg: '#e0f2f1' }

export function getDesignTokens(mode: PaletteMode): ThemeOptions {
  return {
    palette: {
      mode,
      primary: {
        main: brand.main,
        light: brand[300],
        dark: brand[700],
        contrastText: '#fff',
      },
      secondary: {
        main: teal.main,
        contrastText: '#fff',
      },
      success: { main: green.main, light: green.light, dark: green.dark },
      warning: { main: orange.main, light: orange.light, dark: orange.dark },
      error: { main: red.main, light: red.light, dark: red.dark },
      info: { main: brand[400] },
      divider: mode === 'dark' ? alpha(gray[600], 0.4) : gray[200],
      background:
        mode === 'dark'
          ? { default: '#0e1117', paper: '#161a21' }
          : { default: gray[50], paper: '#ffffff' },
      text:
        mode === 'dark'
          ? { primary: '#f4f5f7', secondary: gray[400] }
          : { primary: gray[900], secondary: gray[600] },
    },
    typography: {
      // Matches solwezi-inpendence-run-admin's brand font (see its
      // index.html Google Fonts link and index.css --font-mono).
      fontFamily: [
        '"JetBrains Mono"',
        'ui-monospace',
        '"SF Mono"',
        'Menlo',
        'Consolas',
        'monospace',
      ].join(','),
      h1: { fontSize: '2.25rem', fontWeight: 600, lineHeight: 1.2 },
      h2: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.2 },
      h3: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
      h4: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.35 },
      h5: { fontSize: '1.0625rem', fontWeight: 600 },
      h6: { fontSize: '0.95rem', fontWeight: 600 },
      subtitle1: { fontSize: '0.925rem', fontWeight: 500 },
      subtitle2: { fontSize: '0.8125rem', fontWeight: 500 },
      body1: { fontSize: '0.925rem' },
      body2: { fontSize: '0.825rem' },
      caption: { fontSize: '0.75rem' },
    },
    shape: { borderRadius: 10 },
    spacing: 8,
  }
}

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import BrandMark from '../components/BrandMark'
import { extractErrorMessage } from '../lib/http'

export default function LoginPage() {
  const { login, status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (status === 'authenticated') {
    const from = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(extractErrorMessage(err, 'Incorrect email or password.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <BrandMark size={48} />
            <Typography variant="h5">Solwezi Run 2026</Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to the event admin dashboard
            </Typography>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            autoComplete="username"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" size="large" loading={loading}>
            Sign in
          </Button>
          <Typography variant="caption" color="text.secondary" align="center">
            Admin accounts are created by an existing administrator — there is no self sign-up.
          </Typography>
        </Stack>
      </Card>
    </Box>
  )
}

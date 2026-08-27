import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', px: 2 }}>
      <Typography variant="h2">404</Typography>
      <Typography variant="body1" color="text.secondary">
        This page doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Back to dashboard
      </Button>
    </Stack>
  )
}

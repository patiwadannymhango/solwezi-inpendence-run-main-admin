import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { useLocation } from 'react-router-dom'

const LABELS: Record<string, string> = {
  '': 'Overview',
  registrations: 'Registrations',
  payments: 'Payments',
  categories: 'Race categories',
  users: 'Admin users',
  profile: 'My profile',
}

export default function NavbarBreadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)
  const current = segments[0] ?? ''
  const label = LABELS[current] ?? 'Overview'

  return (
    <Breadcrumbs separator={<ChevronRightRoundedIcon fontSize="small" />}>
      <Typography variant="body2" color="text.secondary">
        Admin
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
    </Breadcrumbs>
  )
}

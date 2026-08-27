import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ButtonBase from '@mui/material/ButtonBase'
import { useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
}

export default function OptionsMenu({ compact = false }: { compact?: boolean }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  if (!user) return null

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    handleClose()
    await logout()
    navigate('/login')
  }

  return (
    <>
      <ButtonBase
        onClick={handleOpen}
        sx={{ borderRadius: 8, p: 0.5, display: 'flex', alignItems: 'center', gap: 1, width: compact ? 'auto' : '100%' }}
      >
        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
          {initialsOf(user.full_name || user.email)}
        </Avatar>
        {!compact && (
          <Stack sx={{ minWidth: 0, textAlign: 'left' }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
              {user.full_name || user.email}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user.role === 'ADMIN' ? 'Admin' : 'View only'}
            </Typography>
          </Stack>
        )}
      </ButtonBase>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Box sx={{ px: 2, py: 1, maxWidth: 240 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {user.full_name || user.email}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose()
            navigate('/profile')
          }}
        >
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          My profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

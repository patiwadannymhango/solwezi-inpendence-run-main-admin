import Brightness4RoundedIcon from '@mui/icons-material/Brightness4Rounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useColorScheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useState, type MouseEvent } from 'react'

export default function ColorModeIconDropdown() {
  const { mode, setMode } = useColorScheme()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const icon =
    mode === 'dark' ? <DarkModeRoundedIcon fontSize="small" /> : mode === 'light' ? <LightModeRoundedIcon fontSize="small" /> : <Brightness4RoundedIcon fontSize="small" />

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const choose = (next: 'light' | 'dark' | 'system') => {
    setMode(next)
    handleClose()
  }

  return (
    <>
      <Tooltip title="Theme">
        <IconButton onClick={handleOpen} size="small">
          {icon}
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <MenuItem selected={mode === 'light'} onClick={() => choose('light')}>
          Light
        </MenuItem>
        <MenuItem selected={mode === 'dark'} onClick={() => choose('dark')}>
          Dark
        </MenuItem>
        <MenuItem selected={mode === 'system'} onClick={() => choose('system')}>
          System
        </MenuItem>
      </Menu>
    </>
  )
}

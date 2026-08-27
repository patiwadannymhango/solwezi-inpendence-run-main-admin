import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import BrandMark from '../components/BrandMark'
import ColorModeIconDropdown from './ColorModeIconDropdown'
import SideMenuMobile from './SideMenuMobile'

export default function AppNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{ display: { xs: 'block', md: 'none' }, top: 0 }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => setOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
          <BrandMark size={26} />
          <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Solwezi Run Admin
          </Typography>
          <Stack direction="row">
            <ColorModeIconDropdown />
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
      <SideMenuMobile open={open} onClose={() => setOpen(false)} />
    </>
  )
}

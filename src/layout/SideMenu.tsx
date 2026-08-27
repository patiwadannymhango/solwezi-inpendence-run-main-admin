import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BrandMark from '../components/BrandMark'
import MenuContent from './MenuContent'
import OptionsMenu from './OptionsMenu'

const DRAWER_WIDTH = 260

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', px: 2.5, py: 2.25 }}>
          <BrandMark />
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
              Solwezi Run 2026
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Admin dashboard
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1, px: 1.5, py: 1.5, overflowY: 'auto' }}>
          <MenuContent />
        </Stack>
        <Divider />
        <Stack sx={{ p: 1.5 }}>
          <OptionsMenu />
        </Stack>
      </Stack>
    </Drawer>
  )
}

export { DRAWER_WIDTH }

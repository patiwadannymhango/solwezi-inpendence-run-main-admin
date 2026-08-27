import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BrandMark from '../components/BrandMark'
import MenuContent from './MenuContent'
import OptionsMenu from './OptionsMenu'

export default function SideMenuMobile({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose} sx={{ [`& .MuiDrawer-paper`]: { width: 280 } }}>
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
          <MenuContent onNavigate={onClose} />
        </Stack>
        <Divider />
        <Stack sx={{ p: 1.5 }}>
          <OptionsMenu />
        </Stack>
      </Stack>
    </Drawer>
  )
}

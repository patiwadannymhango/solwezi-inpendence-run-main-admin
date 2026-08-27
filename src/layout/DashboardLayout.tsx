import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Outlet } from 'react-router-dom'
import AppNavbar from './AppNavbar'
import Header from './Header'
import SideMenu from './SideMenu'

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          backgroundColor: 'background.default',
          overflow: 'auto',
        }}
      >
        <Header />
        <Stack sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 1 }, pb: 6 }}>
          <Outlet />
        </Stack>
      </Box>
    </Box>
  )
}

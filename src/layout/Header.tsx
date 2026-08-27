import Stack from '@mui/material/Stack'
import ColorModeIconDropdown from './ColorModeIconDropdown'
import NavbarBreadcrumbs from './NavbarBreadcrumbs'

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 4,
        py: 2,
      }}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  )
}

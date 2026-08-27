import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { primaryNavItems, secondaryNavItems } from './navItems'

export default function MenuContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const go = (path: string) => {
    navigate(path)
    onNavigate?.()
  }

  const renderItems = (items: typeof primaryNavItems) =>
    items
      .filter((item) => !item.adminOnly || isAdmin)
      .map(({ label, path, icon: Icon }) => (
        <ListItem key={path} disablePadding sx={{ display: 'block' }}>
          <ListItemButton selected={location.pathname === path} onClick={() => go(path)}>
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))

  return (
    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <List dense>{renderItems(primaryNavItems)}</List>
      <List dense>{renderItems(secondaryNavItems)}</List>
    </Stack>
  )
}

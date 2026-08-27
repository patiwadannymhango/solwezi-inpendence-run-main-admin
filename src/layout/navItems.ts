import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import type { SvgIconComponent } from '@mui/icons-material'

export interface NavItem {
  label: string
  path: string
  icon: SvgIconComponent
  adminOnly?: boolean
}

export const primaryNavItems: NavItem[] = [
  { label: 'Overview', path: '/', icon: HomeRoundedIcon },
  { label: 'Registrations', path: '/registrations', icon: BarChartRoundedIcon },
  { label: 'Payments', path: '/payments', icon: PaymentsRoundedIcon },
  { label: 'Race categories', path: '/categories', icon: EmojiEventsRoundedIcon },
  { label: 'Vendors', path: '/vendors', icon: StorefrontRoundedIcon },
  { label: 'Vendor categories', path: '/vendor-categories', icon: CategoryRoundedIcon },
  { label: 'Admin users', path: '/users', icon: GroupRoundedIcon },
]

export const secondaryNavItems: NavItem[] = [{ label: 'My profile', path: '/profile', icon: PersonRoundedIcon }]

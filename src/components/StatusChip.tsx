import Chip from '@mui/material/Chip'
import { titleCase } from '../lib/format'
import type { PaymentStatus, RegistrationStatus } from '../types'

type ChipColor = 'success' | 'warning' | 'error' | 'default' | 'info'

const REGISTRATION_COLORS: Record<RegistrationStatus, ChipColor> = {
  CONFIRMED: 'success',
  PAYMENT_PROCESSING: 'warning',
  PENDING_PAYMENT: 'warning',
  CANCELLED: 'error',
  EXPIRED: 'error',
  REFUNDED: 'default',
}

const PAYMENT_COLORS: Record<PaymentStatus, ChipColor> = {
  SUCCESS: 'success',
  PROCESSING: 'warning',
  CREATED: 'info',
  FAILED: 'error',
  CANCELLED: 'error',
  REFUNDED: 'default',
}

export function RegistrationStatusChip({ status }: { status: RegistrationStatus }) {
  return <Chip size="small" label={titleCase(status)} color={REGISTRATION_COLORS[status]} variant="filled" />
}

export function PaymentStatusChip({ status }: { status: PaymentStatus }) {
  return <Chip size="small" label={titleCase(status)} color={PAYMENT_COLORS[status]} variant="filled" />
}

export function RoleChip({ role }: { role: 'ADMIN' | 'VIEW' }) {
  return (
    <Chip size="small" label={role === 'ADMIN' ? 'Admin' : 'View only'} color={role === 'ADMIN' ? 'primary' : 'default'} variant="outlined" />
  )
}

export function ActiveChip({ active }: { active: boolean }) {
  return <Chip size="small" label={active ? 'Active' : 'Deactivated'} color={active ? 'success' : 'default'} variant="outlined" />
}

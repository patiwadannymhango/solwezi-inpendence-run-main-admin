import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { createAdminUser, updateAdminUser } from '../api/users'
import { extractErrorMessage } from '../lib/http'
import type { AdminUser } from '../types'

export default function UserFormDialog({
  open,
  user,
  onClose,
  onSaved,
}: {
  open: boolean
  user: AdminUser | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!user

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'VIEW'>('VIEW')
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setEmail(user?.email ?? '')
    setFirstName(user?.first_name ?? '')
    setLastName(user?.last_name ?? '')
    setPhone(user?.phone ?? '')
    setPassword('')
    setRole(user?.role ?? 'VIEW')
    setIsActive(user?.is_active ?? true)
    setError(null)
  }, [open, user])

  const handleSubmit = async () => {
    setError(null)
    if (!isEdit && (!email.trim() || !firstName.trim() || !lastName.trim() || password.length < 8)) {
      setError('Email, first name, last name and an 8+ character password are required.')
      return
    }
    setSaving(true)
    try {
      if (isEdit && user) {
        await updateAdminUser(user.id, {
          first_name: firstName,
          last_name: lastName,
          phone,
          is_active: isActive,
          role,
        })
      } else {
        await createAdminUser({ email: email.trim(), first_name: firstName, last_name: lastName, phone, password, role })
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save this account.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit admin account' : 'New admin account'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                type="email"
                label="Email"
                value={email}
                disabled={isEdit}
                onChange={(e) => setEmail(e.target.value)}
                helperText={isEdit ? 'Email cannot be changed.' : undefined}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField required fullWidth label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label="Role" value={role} onChange={(e) => setRole(e.target.value as 'ADMIN' | 'VIEW')}>
                <MenuItem value="ADMIN">Admin — full access</MenuItem>
                <MenuItem value="VIEW">View only</MenuItem>
              </TextField>
            </Grid>
            {!isEdit && (
              <Grid size={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  helperText="At least 8 characters."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            )}
            {isEdit && (
              <Grid size={12}>
                <FormControlLabel
                  control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                  label="Account active"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} loading={saving}>
          {isEdit ? 'Save changes' : 'Create account'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

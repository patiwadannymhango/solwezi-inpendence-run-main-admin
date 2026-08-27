import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { createManualRegistration } from '../api/registrations'
import { extractErrorMessage } from '../lib/http'
import { AGE_RANGES, REGISTRATION_STATUSES, T_SHIRT_SIZES, type ManualRegistrationPayload, type RaceCategory } from '../types'
import { titleCase } from '../lib/format'

const EMPTY: ManualRegistrationPayload = {
  category_id: '',
  full_name: '',
  email: '',
  phone: '',
  gender: '',
  age_range: '',
  country: '',
  t_shirt_size: '',
  club_or_institution: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  medical_notes: '',
  status: 'CONFIRMED',
}

export default function NewRegistrationDialog({
  open,
  categories,
  onClose,
  onCreated,
}: {
  open: boolean
  categories: RaceCategory[]
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState<ManualRegistrationPayload>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(EMPTY)
      setError(null)
    }
  }, [open])

  const set = <K extends keyof ManualRegistrationPayload>(key: K, value: ManualRegistrationPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.category_id || !form.full_name.trim()) {
      setError('Race category and full name are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createManualRegistration(form)
      onCreated()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create this registration.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New walk-in registration</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select
                required
                fullWidth
                label="Race category"
                value={form.category_id}
                onChange={(e) => set('category_id', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name} ({category.code})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField required fullWidth label="Full name" value={form.full_name} onChange={(e) => set('full_name', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField select fullWidth label="Gender" value={form.gender} onChange={(e) => set('gender', e.target.value as 'male' | 'female' | '')}>
                <MenuItem value="">—</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField select fullWidth label="Age range" value={form.age_range} onChange={(e) => set('age_range', e.target.value)}>
                <MenuItem value="">—</MenuItem>
                {AGE_RANGES.map((range) => (
                  <MenuItem key={range} value={range}>
                    {range}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField select fullWidth label="T-shirt size" value={form.t_shirt_size} onChange={(e) => set('t_shirt_size', e.target.value)}>
                <MenuItem value="">—</MenuItem>
                {T_SHIRT_SIZES.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Country" value={form.country} onChange={(e) => set('country', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Club / institution"
                value={form.club_or_institution}
                onChange={(e) => set('club_or_institution', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Emergency contact name"
                value={form.emergency_contact_name}
                onChange={(e) => set('emergency_contact_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Emergency contact phone"
                value={form.emergency_contact_phone}
                onChange={(e) => set('emergency_contact_phone', e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Medical notes"
                value={form.medical_notes}
                onChange={(e) => set('medical_notes', e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Status"
                helperText="Walk-ins paying cash on the spot should be marked Confirmed."
                value={form.status}
                onChange={(e) => set('status', e.target.value as ManualRegistrationPayload['status'])}
              >
                {REGISTRATION_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {titleCase(status)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} loading={saving}>
          Create registration
        </Button>
      </DialogActions>
    </Dialog>
  )
}

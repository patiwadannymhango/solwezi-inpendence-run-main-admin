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
import { createManualVendorRegistration } from '../api/vendorRegistrations'
import { extractErrorMessage } from '../lib/http'
import { REGISTRATION_STATUSES, VENDOR_REQUIREMENTS, type ManualVendorRegistrationPayload, type VendorCategory } from '../types'
import { titleCase } from '../lib/format'

const EMPTY: ManualVendorRegistrationPayload = {
  category_id: '',
  business_name: '',
  full_name: '',
  email: '',
  phone: '',
  business_location: '',
  products_services: '',
  requirement: '',
  status: 'CONFIRMED',
}

export default function NewVendorRegistrationDialog({
  open,
  categories,
  onClose,
  onCreated,
}: {
  open: boolean
  categories: VendorCategory[]
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState<ManualVendorRegistrationPayload>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(EMPTY)
      setError(null)
    }
  }, [open])

  const set = <K extends keyof ManualVendorRegistrationPayload>(key: K, value: ManualVendorRegistrationPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.category_id || !form.business_name.trim() || !form.full_name.trim()) {
      setError('Category, business name, and contact person are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createManualVendorRegistration(form)
      onCreated()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not create this vendor registration.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New walk-in vendor registration</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                select
                required
                fullWidth
                label="Vendor category"
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
              <TextField
                required
                fullWidth
                label="Business / company name"
                value={form.business_name}
                onChange={(e) => set('business_name', e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                required
                fullWidth
                label="Contact person"
                value={form.full_name}
                onChange={(e) => set('full_name', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Business location"
                value={form.business_location}
                onChange={(e) => set('business_location', e.target.value)}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Products / services"
                value={form.products_services}
                onChange={(e) => set('products_services', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Requirement"
                value={form.requirement}
                onChange={(e) => set('requirement', e.target.value)}
              >
                <MenuItem value="">—</MenuItem>
                {VENDOR_REQUIREMENTS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Status"
                helperText="Cash taken on the spot should be marked Confirmed."
                value={form.status}
                onChange={(e) => set('status', e.target.value as ManualVendorRegistrationPayload['status'])}
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

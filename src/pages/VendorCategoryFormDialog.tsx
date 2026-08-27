import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { createVendorCategory, updateVendorCategory } from '../api/vendorCategories'
import { extractErrorMessage } from '../lib/http'
import type { AdminVendorCategory, VendorCategoryPayload } from '../types'

const EMPTY: VendorCategoryPayload = {
  name: '',
  code: '',
  description: '',
  price: '',
  currency: 'ZMW',
  capacity: null,
  is_active: true,
}

export default function VendorCategoryFormDialog({
  open,
  category,
  onClose,
  onSaved,
}: {
  open: boolean
  category: AdminVendorCategory | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!category

  const [form, setForm] = useState<VendorCategoryPayload>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      category
        ? {
            name: category.name,
            code: category.code,
            description: category.description,
            price: category.price,
            currency: category.currency,
            capacity: category.capacity,
            is_active: category.is_active,
          }
        : EMPTY,
    )
    setError(null)
  }, [open, category])

  const set = <K extends keyof VendorCategoryPayload>(key: K, value: VendorCategoryPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.code.trim() || !form.price.trim()) {
      setError('Name, code, and price are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (isEdit && category) {
        await updateVendorCategory(category.id, form)
      } else {
        await createVendorCategory(form)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save this vendor category.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit vendor category' : 'New vendor category'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField required fullWidth label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                required
                fullWidth
                label="Code"
                value={form.code}
                onChange={(e) => set('code', e.target.value)}
                helperText="Used by the public registration form."
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField
                required
                fullWidth
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                helperText="0 confirms immediately, no payment step."
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField fullWidth label="Currency" value={form.currency} onChange={(e) => set('currency', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={form.capacity ?? ''}
                onChange={(e) => set('capacity', e.target.value === '' ? null : Number(e.target.value))}
                helperText="Leave blank for unlimited."
              />
            </Grid>
            <Grid size={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={<Switch checked={form.is_active ?? true} onChange={(e) => set('is_active', e.target.checked)} />}
                label="Visible on the public site"
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} loading={saving}>
          {isEdit ? 'Save changes' : 'Create category'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

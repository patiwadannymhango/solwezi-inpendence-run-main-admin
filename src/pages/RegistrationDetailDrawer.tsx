import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { deleteRegistration, fetchRegistration, updateRegistration, updateRegistrationStatus } from '../api/registrations'
import { fetchPayments } from '../api/payments'
import ConfirmDialog from '../components/ConfirmDialog'
import { PaymentStatusChip, RegistrationStatusChip } from '../components/StatusChip'
import { formatDateTime, formatMoney, titleCase } from '../lib/format'
import { extractErrorMessage } from '../lib/http'
import {
  AGE_RANGES,
  REGISTRATION_STATUSES,
  T_SHIRT_SIZES,
  type AdminPayment,
  type AdminRegistration,
  type Gender,
  type RegistrationEditPayload,
  type RegistrationStatus,
} from '../types'

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  )
}

export default function RegistrationDetailDrawer({
  registrationId,
  onClose,
  onChanged,
}: {
  registrationId: string | null
  onClose: () => void
  onChanged: () => void
}) {
  const { isAdmin } = useAuth()
  const [registration, setRegistration] = useState<AdminRegistration | null>(null)
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusDraft, setStatusDraft] = useState<RegistrationStatus | ''>('')
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<RegistrationEditPayload>({})
  const [savingDetails, setSavingDetails] = useState(false)

  useEffect(() => {
    if (!registrationId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setEditMode(false)
    fetchRegistration(registrationId)
      .then((reg) => {
        if (cancelled) return
        setRegistration(reg)
        setStatusDraft(reg.status)
        // No reference number yet (registration hasn't been confirmed) —
        // nothing to search payments by.
        if (!reg.registration_number) return null
        return fetchPayments({ search: reg.registration_number })
      })
      .then((paymentPage) => {
        if (cancelled) return
        setPayments(paymentPage?.results ?? [])
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load this registration.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [registrationId])

  const handleSaveStatus = async () => {
    if (!registration || !statusDraft || statusDraft === registration.status) return
    setSaving(true)
    setError(null)
    try {
      const updated = await updateRegistrationStatus(registration.id, statusDraft)
      setRegistration(updated)
      onChanged()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update status.'))
    } finally {
      setSaving(false)
    }
  }

  const startEdit = () => {
    if (!registration) return
    setEditForm({
      full_name: registration.participant.full_name,
      email: registration.participant.email,
      phone: registration.participant.phone,
      gender: registration.participant.gender,
      age_range: registration.participant.age_range,
      country: registration.participant.country,
      t_shirt_size: registration.t_shirt_size,
      club_or_institution: registration.club_or_institution,
      emergency_contact_name: registration.emergency_contact_name,
      emergency_contact_phone: registration.emergency_contact_phone,
      medical_notes: registration.medical_notes,
    })
    setError(null)
    setEditMode(true)
  }

  const setEditField = <K extends keyof RegistrationEditPayload>(key: K, value: RegistrationEditPayload[K]) =>
    setEditForm((prev) => ({ ...prev, [key]: value }))

  const handleSaveDetails = async () => {
    if (!registration) return
    setSavingDetails(true)
    setError(null)
    try {
      const updated = await updateRegistration(registration.id, editForm)
      setRegistration(updated)
      setEditMode(false)
      onChanged()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save these changes.'))
    } finally {
      setSavingDetails(false)
    }
  }

  const handleDelete = async () => {
    if (!registration) return
    setDeleting(true)
    try {
      await deleteRegistration(registration.id)
      setConfirmDelete(false)
      onChanged()
      onClose()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete this registration.'))
      setDeleting(false)
    }
  }

  return (
    <Drawer anchor="right" open={!!registrationId} onClose={onClose} sx={{ [`& .MuiDrawer-paper`]: { width: { xs: '100%', sm: 440 } } }}>
      <Stack sx={{ height: '100%' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2 }}>
          <Typography variant="h6">Registration</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Divider />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
          {loading && (
            <Stack sx={{ alignItems: 'center', py: 6 }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && registration && (
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography variant="subtitle1" sx={!registration.registration_number ? { fontStyle: 'italic', color: 'text.secondary' } : undefined}>
                    {registration.registration_number ?? 'Reference not yet assigned'}
                  </Typography>
                  <RegistrationStatusChip status={registration.status} />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Registered {formatDateTime(registration.registered_at)}
                </Typography>
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Update status</Typography>
                <TextField
                  select
                  fullWidth
                  disabled={!isAdmin}
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as RegistrationStatus)}
                  helperText={!isAdmin ? 'Your account is view-only.' : undefined}
                >
                  {REGISTRATION_STATUSES.map((status) => (
                    <MenuItem key={status} value={status}>
                      {titleCase(status)}
                    </MenuItem>
                  ))}
                </TextField>
                {isAdmin && (
                  <Button
                    variant="contained"
                    onClick={handleSaveStatus}
                    loading={saving}
                    disabled={statusDraft === registration.status}
                  >
                    Save status
                  </Button>
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2">Participant</Typography>
                  {isAdmin && !editMode && (
                    <Button size="small" startIcon={<EditRoundedIcon fontSize="small" />} onClick={startEdit}>
                      Edit
                    </Button>
                  )}
                </Stack>
                {editMode ? (
                  <>
                    <TextField
                      fullWidth
                      label="Full name"
                      value={editForm.full_name ?? ''}
                      onChange={(e) => setEditField('full_name', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      value={editForm.email ?? ''}
                      onChange={(e) => setEditField('email', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={editForm.phone ?? ''}
                      onChange={(e) => setEditField('phone', e.target.value)}
                    />
                    <TextField
                      select
                      fullWidth
                      label="Gender"
                      value={editForm.gender ?? ''}
                      onChange={(e) => setEditField('gender', e.target.value as Gender | '')}
                    >
                      <MenuItem value="">—</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </TextField>
                    <TextField
                      select
                      fullWidth
                      label="Age range"
                      value={editForm.age_range ?? ''}
                      onChange={(e) => setEditField('age_range', e.target.value)}
                    >
                      <MenuItem value="">—</MenuItem>
                      {AGE_RANGES.map((range) => (
                        <MenuItem key={range} value={range}>
                          {range}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Country"
                      value={editForm.country ?? ''}
                      onChange={(e) => setEditField('country', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Field label="Full name" value={registration.participant.full_name} />
                    <Field label="Email" value={registration.participant.email} />
                    <Field label="Phone" value={registration.participant.phone} />
                    <Field label="Gender" value={titleCase(registration.participant.gender)} />
                    <Field label="Age range" value={registration.participant.age_range} />
                    <Field label="Country" value={registration.participant.country} />
                  </>
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Race details</Typography>
                <Field label="Category" value={registration.category_name} />
                <Field label="Amount" value={formatMoney(registration.amount, registration.currency)} />
                {editMode ? (
                  <>
                    <TextField
                      select
                      fullWidth
                      label="T-shirt size"
                      value={editForm.t_shirt_size ?? ''}
                      onChange={(e) => setEditField('t_shirt_size', e.target.value)}
                    >
                      <MenuItem value="">—</MenuItem>
                      {T_SHIRT_SIZES.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Club / institution"
                      value={editForm.club_or_institution ?? ''}
                      onChange={(e) => setEditField('club_or_institution', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Emergency contact name"
                      value={editForm.emergency_contact_name ?? ''}
                      onChange={(e) => setEditField('emergency_contact_name', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Emergency contact phone"
                      value={editForm.emergency_contact_phone ?? ''}
                      onChange={(e) => setEditField('emergency_contact_phone', e.target.value)}
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      label="Medical notes"
                      value={editForm.medical_notes ?? ''}
                      onChange={(e) => setEditField('medical_notes', e.target.value)}
                    />
                    <Stack direction="row" spacing={1}>
                      <Button onClick={() => setEditMode(false)} disabled={savingDetails}>
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleSaveDetails} loading={savingDetails}>
                        Save changes
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Field label="T-shirt size" value={registration.t_shirt_size} />
                    <Field label="Club / institution" value={registration.club_or_institution} />
                    <Field label="Emergency contact" value={registration.emergency_contact_name} />
                    <Field label="Emergency phone" value={registration.emergency_contact_phone} />
                    <Field label="Medical notes" value={registration.medical_notes} />
                  </>
                )}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Payment history</Typography>
                {!registration.registration_number && (
                  <Typography variant="body2" color="text.secondary">
                    Not available until this registration is confirmed and gets a reference number.
                  </Typography>
                )}
                {registration.registration_number && payments.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No payment attempts recorded yet.
                  </Typography>
                )}
                {payments.map((payment) => (
                  <Stack key={payment.id} direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap>
                        {titleCase(payment.payment_method)} · {formatMoney(payment.amount, payment.currency)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {formatDateTime(payment.created_at)}
                      </Typography>
                    </Stack>
                    <PaymentStatusChip status={payment.status} />
                  </Stack>
                ))}
              </Stack>

              {isAdmin && (
                <>
                  <Divider />
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<DeleteOutlineRoundedIcon />}
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete registration
                  </Button>
                </>
              )}
            </Stack>
          )}
        </Box>
      </Stack>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete registration?"
        description={`This permanently removes ${registration?.registration_number ?? 'this registration'} and its payment records. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Drawer>
  )
}

import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState, type FormEvent } from 'react'
import { changePassword, updateMe } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { RoleChip } from '../components/StatusChip'
import { extractErrorMessage } from '../lib/http'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()

  const [firstName, setFirstName] = useState(user?.first_name ?? '')
  const [lastName, setLastName] = useState(user?.last_name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (!user) return
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setPhone(user.phone)
  }, [user])

  if (!user) return null

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setProfileError(null)
    setProfileSuccess(false)
    setSavingProfile(true)
    try {
      await updateMe({ first_name: firstName, last_name: lastName, phone })
      await refreshUser()
      setProfileSuccess(true)
    } catch (err) {
      setProfileError(extractErrorMessage(err, 'Could not update your profile.'))
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }
    setSavingPassword(true)
    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
    } catch (err) {
      setPasswordError(extractErrorMessage(err, 'Could not change your password.'))
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <Stack spacing={2.5} sx={{ pt: 2, maxWidth: 640 }}>
      <Stack>
        <Typography variant="h4">My profile</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <RoleChip role={user.role} />
        </Stack>
      </Stack>

      <Card component="form" onSubmit={handleProfileSubmit}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1">Personal details</Typography>
            {profileError && <Alert severity="error">{profileError}</Alert>}
            {profileSuccess && <Alert severity="success">Profile updated.</Alert>}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField required fullWidth label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField required fullWidth label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Grid>
            </Grid>
            <Stack direction="row">
              <Button type="submit" variant="contained" loading={savingProfile}>
                Save changes
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card component="form" onSubmit={handlePasswordSubmit}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="subtitle1">Change password</Typography>
            <Divider />
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            {passwordSuccess && <Alert severity="success">Password updated.</Alert>}
            <TextField
              required
              fullWidth
              type="password"
              label="Current password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              required
              fullWidth
              type="password"
              label="New password"
              autoComplete="new-password"
              helperText="At least 8 characters."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              required
              fullWidth
              type="password"
              label="Confirm new password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Stack direction="row">
              <Button type="submit" variant="contained" loading={savingPassword}>
                Update password
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

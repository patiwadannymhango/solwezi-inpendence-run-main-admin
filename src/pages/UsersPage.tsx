import AddRoundedIcon from '@mui/icons-material/AddRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { deactivateAdminUser, fetchAdminUsers } from '../api/users'
import ConfirmDialog from '../components/ConfirmDialog'
import { ActiveChip, RoleChip } from '../components/StatusChip'
import { formatDate } from '../lib/format'
import { extractErrorMessage } from '../lib/http'
import type { AdminUser } from '../types'
import UserFormDialog from './UserFormDialog'

export default function UsersPage() {
  const { isAdmin, user: me } = useAuth()

  const [rows, setRows] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [deactivating, setDeactivating] = useState<AdminUser | null>(null)
  const [deactivateLoading, setDeactivateLoading] = useState(false)

  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 350)
    return () => clearTimeout(handle)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAdminUsers({ search, ordering: '-created_at', page: 1 })
      .then((data) => {
        if (cancelled) return
        setRows(data.results)
        setError(null)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load admin accounts.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [search, refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  const handleDeactivate = async () => {
    if (!deactivating) return
    setDeactivateLoading(true)
    try {
      await deactivateAdminUser(deactivating.id)
      setDeactivating(null)
      refresh()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not deactivate this account.'))
    } finally {
      setDeactivateLoading(false)
    }
  }

  const columns: GridColDef<AdminUser>[] = [
    { field: 'full_name', headerName: 'Name', flex: 1, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    {
      field: 'role',
      headerName: 'Role',
      width: 130,
      renderCell: (params) => <RoleChip role={params.row.role} />,
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <ActiveChip active={params.row.is_active} />,
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 130,
      valueGetter: (_value, row) => formatDate(row.created_at),
    },
    ...(isAdmin
      ? [
          {
            field: 'actions',
            headerName: '',
            width: 100,
            sortable: false,
            renderCell: (params: { row: AdminUser }) => (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditing(params.row)
                      setFormOpen(true)
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {params.row.is_active && params.row.id !== me?.id && (
                  <Tooltip title="Deactivate">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeactivating(params.row)
                      }}
                    >
                      <BlockRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            ),
          } satisfies GridColDef<AdminUser>,
        ]
      : []),
  ]

  return (
    <Stack spacing={2.5} sx={{ pt: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Stack>
          <Typography variant="h4">Admin users</Typography>
          <Typography variant="body2" color="text.secondary">
            Accounts that can sign in to this dashboard
          </Typography>
        </Stack>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            New admin account
          </Button>
        )}
      </Stack>

      {!isAdmin && <Alert severity="info">Your account is view-only — ask an admin to add or edit accounts.</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <Stack sx={{ p: 2 }}>
          <TextField
            placeholder="Search name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ maxWidth: 320 }}
          />
        </Stack>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={loading}
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
        />
      </Card>

      <UserFormDialog open={formOpen} user={editing} onClose={() => setFormOpen(false)} onSaved={refresh} />
      <ConfirmDialog
        open={!!deactivating}
        title="Deactivate account?"
        description={`${deactivating?.full_name ?? 'This account'} will no longer be able to sign in. This can be reversed by re-activating it later.`}
        confirmLabel="Deactivate"
        destructive
        loading={deactivateLoading}
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivating(null)}
      />
    </Stack>
  )
}

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { fetchAdminCategories } from '../api/categories'
import { formatMoney } from '../lib/format'
import { extractErrorMessage } from '../lib/http'
import type { AdminRaceCategory } from '../types'
import CategoryFormDialog from './CategoryFormDialog'

export default function CategoriesPage() {
  const { isAdmin } = useAuth()

  const [rows, setRows] = useState<AdminRaceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminRaceCategory | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAdminCategories()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load race categories.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  const columns: GridColDef<AdminRaceCategory>[] = [
    {
      field: 'code',
      headerName: 'Code',
      width: 160,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.code}
          sx={{ fontFamily: 'inherit', fontWeight: 700 }}
          variant="outlined"
        />
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
    { field: 'distance_label', headerName: 'Distance', width: 110 },
    {
      field: 'price',
      headerName: 'Price',
      width: 130,
      valueGetter: (_value, row) => formatMoney(row.price, row.currency),
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      width: 110,
      valueGetter: (_value, row) => row.capacity ?? 'Unlimited',
    },
    {
      field: 'is_active',
      headerName: 'On public site',
      width: 140,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.is_active ? 'Visible' : 'Hidden'}
          color={params.row.is_active ? 'success' : 'default'}
          variant="outlined"
        />
      ),
    },
    ...(isAdmin
      ? [
          {
            field: 'actions',
            headerName: '',
            width: 70,
            sortable: false,
            renderCell: (params: { row: AdminRaceCategory }) => (
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
            ),
          } satisfies GridColDef<AdminRaceCategory>,
        ]
      : []),
  ]

  return (
    <Stack spacing={2.5} sx={{ pt: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Stack>
          <Typography variant="h4">Race categories</Typography>
          <Typography variant="body2" color="text.secondary">
            Each category's code is what the bulk-upload CSV's category_code column expects.
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
            New category
          </Button>
        )}
      </Stack>

      {!isAdmin && <Alert severity="info">Your account is view-only — ask an admin to add or edit categories.</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={loading}
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          onRowClick={isAdmin ? (params) => {
            setEditing(params.row)
            setFormOpen(true)
          } : undefined}
        />
      </Card>

      <CategoryFormDialog open={formOpen} category={editing} onClose={() => setFormOpen(false)} onSaved={refresh} />
    </Stack>
  )
}

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
import { fetchAdminVendorCategories } from '../api/vendorCategories'
import { formatMoney } from '../lib/format'
import { extractErrorMessage } from '../lib/http'
import type { AdminVendorCategory } from '../types'
import VendorCategoryFormDialog from './VendorCategoryFormDialog'

export default function VendorCategoriesPage() {
  const { isAdmin } = useAuth()

  const [rows, setRows] = useState<AdminVendorCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminVendorCategory | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAdminVendorCategories()
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setError(null)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load vendor categories.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  const columns: GridColDef<AdminVendorCategory>[] = [
    {
      field: 'code',
      headerName: 'Code',
      width: 180,
      renderCell: (params) => (
        <Chip size="small" label={params.row.code} sx={{ fontFamily: 'inherit', fontWeight: 700 }} variant="outlined" />
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
    {
      field: 'price',
      headerName: 'Price',
      width: 140,
      valueGetter: (_value, row) => (Number(row.price) > 0 ? formatMoney(row.price, row.currency) : 'Free'),
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
            renderCell: (params: { row: AdminVendorCategory }) => (
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
          } satisfies GridColDef<AdminVendorCategory>,
        ]
      : []),
  ]

  return (
    <Stack spacing={2.5} sx={{ pt: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
        <Stack>
          <Typography variant="h4">Vendor categories</Typography>
          <Typography variant="body2" color="text.secondary">
            Stall/exhibition packages vendors can register for. A price of 0 confirms instantly, no payment step.
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
          onRowClick={
            isAdmin
              ? (params) => {
                  setEditing(params.row)
                  setFormOpen(true)
                }
              : undefined
          }
        />
      </Card>

      <VendorCategoryFormDialog open={formOpen} category={editing} onClose={() => setFormOpen(false)} onSaved={refresh} />
    </Stack>
  )
}

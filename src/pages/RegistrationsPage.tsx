import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { fetchRaceCategories } from '../api/dashboard'
import { exportRegistrations, fetchRegistrations } from '../api/registrations'
import { RegistrationStatusChip } from '../components/StatusChip'
import { formatDateTime, formatMoney, titleCase } from '../lib/format'
import { extractErrorMessage } from '../lib/http'
import { REGISTRATION_STATUSES, type AdminRegistration, type RaceCategory, type RegistrationStatus } from '../types'
import BulkUploadDialog from './BulkUploadDialog'
import NewRegistrationDialog from './NewRegistrationDialog'
import RegistrationDetailDrawer from './RegistrationDetailDrawer'

const SORT_FIELD_MAP: Record<string, string> = {
  registered_at: 'registered_at',
  amount: 'amount',
  status: 'status',
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function RegistrationsPage() {
  const { isAdmin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [rows, setRows] = useState<AdminRegistration[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [categories, setCategories] = useState<RaceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'registered_at', sort: 'desc' }])

  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get('open'))
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchRaceCategories().then(setCategories).catch(() => undefined)
  }, [])

  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 350)
    return () => clearTimeout(handle)
  }, [searchInput])

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
  }, [search, statusFilter, categoryFilter])

  const ordering = useMemo(() => {
    const sort = sortModel[0]
    if (!sort) return undefined
    const field = SORT_FIELD_MAP[sort.field] ?? sort.field
    return sort.sort === 'desc' ? `-${field}` : field
  }, [sortModel])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchRegistrations({
      page: paginationModel.page + 1,
      page_size: paginationModel.pageSize,
      search,
      status: statusFilter,
      category: categoryFilter,
      ordering,
    })
      .then((data) => {
        if (cancelled) return
        setRows(data.results)
        setRowCount(data.count)
        setError(null)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load registrations.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [paginationModel, search, statusFilter, categoryFilter, ordering, refreshKey])

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), [])

  const closeDrawer = useCallback(() => {
    setSelectedId(null)
    if (searchParams.get('open')) {
      searchParams.delete('open')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportRegistrations()
      downloadBlob(blob, 'solwezi-run-registrations.xlsx')
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not export registrations.'))
    } finally {
      setExporting(false)
    }
  }

  const columns: GridColDef<AdminRegistration>[] = [
    {
      field: 'registration_number',
      headerName: 'Reference',
      width: 150,
      renderCell: (params) =>
        params.row.registration_number ?? (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Not yet assigned
          </Typography>
        ),
    },
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1,
      minWidth: 160,
      valueGetter: (_value, row) => row.participant.full_name,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row) => row.participant.email,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      valueGetter: (_value, row) => row.participant.phone,
    },
    {
      field: 'age_range',
      headerName: 'Age',
      width: 100,
      valueGetter: (_value, row) => row.participant.age_range,
    },
    {
      field: 'category_name',
      headerName: 'Category',
      width: 190,
      renderCell: (params) => {
        const code = categories.find((c) => c.id === params.row.category)?.code
        return (
          <Stack sx={{ minWidth: 0, justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" noWrap>
              {params.row.category_name}
            </Typography>
            {code && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {code}
              </Typography>
            )}
          </Stack>
        )
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 170,
      sortable: true,
      renderCell: (params) => <RegistrationStatusChip status={params.row.status} />,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      sortable: true,
      valueGetter: (_value, row) => formatMoney(row.amount, row.currency),
    },
    {
      field: 'latest_payment_reference',
      headerName: 'Payment ref',
      width: 150,
      valueGetter: (_value, row) => row.latest_payment_reference ?? '—',
    },
    {
      field: 'registered_at',
      headerName: 'Registered',
      width: 170,
      sortable: true,
      valueGetter: (_value, row) => formatDateTime(row.registered_at),
    },
  ]

  return (
    <Stack spacing={2.5} sx={{ pt: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Stack>
          <Typography variant="h4">Registrations</Typography>
          <Typography variant="body2" color="text.secondary">
            {rowCount} total registration{rowCount === 1 ? '' : 's'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button startIcon={<DownloadRoundedIcon />} onClick={handleExport} loading={exporting}>
            Export
          </Button>
          {isAdmin && (
            <>
              <Button startIcon={<UploadFileRoundedIcon />} onClick={() => setBulkDialogOpen(true)}>
                Bulk upload
              </Button>
              <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setNewDialogOpen(true)}>
                New registration
              </Button>
            </>
          )}
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2 }}>
          <TextField
            placeholder="Search reference, name, email, phone…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 220 }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RegistrationStatus | '')}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            {REGISTRATION_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {titleCase(status)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name} ({category.code})
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={rowCount}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableColumnMenu
          disableRowSelectionOnClick
          onRowClick={(params) => setSelectedId(params.row.id)}
        />
      </Card>

      <RegistrationDetailDrawer registrationId={selectedId} onClose={closeDrawer} onChanged={refresh} />
      <NewRegistrationDialog
        open={newDialogOpen}
        categories={categories}
        onClose={() => setNewDialogOpen(false)}
        onCreated={refresh}
      />
      <BulkUploadDialog
        open={bulkDialogOpen}
        categories={categories}
        onClose={() => setBulkDialogOpen(false)}
        onCreated={refresh}
      />
    </Stack>
  )
}

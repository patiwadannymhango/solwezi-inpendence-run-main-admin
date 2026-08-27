import Alert from '@mui/material/Alert'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, type GridColDef, type GridPaginationModel, type GridSortModel } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import { fetchPayments } from '../api/payments'
import { PaymentStatusChip } from '../components/StatusChip'
import { formatDateTime, formatMoney, titleCase } from '../lib/format'
import { extractErrorMessage } from '../lib/http'
import { PAYMENT_METHODS, type AdminPayment, type PaymentMethod, type PaymentStatus } from '../types'

const PAYMENT_STATUSES: PaymentStatus[] = ['CREATED', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED']

export default function PaymentsPage() {
  const [rows, setRows] = useState<AdminPayment[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('')
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | ''>('')
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 25 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])

  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 350)
    return () => clearTimeout(handle)
  }, [searchInput])

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }))
  }, [search, statusFilter, methodFilter])

  const ordering = useMemo(() => {
    const sort = sortModel[0]
    if (!sort) return undefined
    return sort.sort === 'desc' ? `-${sort.field}` : sort.field
  }, [sortModel])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPayments({
      page: paginationModel.page + 1,
      search,
      status: statusFilter,
      payment_method: methodFilter,
      ordering,
    })
      .then((data) => {
        if (cancelled) return
        setRows(data.results)
        setRowCount(data.count)
        setError(null)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load payments.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [paginationModel, search, statusFilter, methodFilter, ordering])

  const columns: GridColDef<AdminPayment>[] = [
    { field: 'reference', headerName: 'Reference', width: 170 },
    {
      field: 'target_type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.target_type === 'vendor' ? 'Vendor' : 'Runner'}
          color={params.row.target_type === 'vendor' ? 'secondary' : 'default'}
          variant="outlined"
        />
      ),
    },
    { field: 'registration_number', headerName: 'Registration', width: 150 },
    { field: 'participant_name', headerName: 'Participant', flex: 1, minWidth: 160 },
    {
      field: 'payment_method',
      headerName: 'Method',
      width: 150,
      valueGetter: (_value, row) => titleCase(row.payment_method),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => <PaymentStatusChip status={params.row.status} />,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      valueGetter: (_value, row) => formatMoney(row.amount, row.currency),
    },
    {
      field: 'created_at',
      headerName: 'Initiated',
      width: 170,
      valueGetter: (_value, row) => formatDateTime(row.created_at),
    },
    {
      field: 'paid_at',
      headerName: 'Paid at',
      width: 170,
      valueGetter: (_value, row) => formatDateTime(row.paid_at),
    },
  ]

  return (
    <Stack spacing={2.5} sx={{ pt: 2 }}>
      <Stack>
        <Typography variant="h4">Payments</Typography>
        <Typography variant="body2" color="text.secondary">
          {rowCount} payment attempt{rowCount === 1 ? '' : 's'} across all registrations
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Card>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2 }}>
          <TextField
            placeholder="Search reference or registration…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 220 }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | '')}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            {PAYMENT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {titleCase(status)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Method"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | '')}
            sx={{ minWidth: 170 }}
          >
            <MenuItem value="">All methods</MenuItem>
            {PAYMENT_METHODS.map((method) => (
              <MenuItem key={method} value={method}>
                {titleCase(method)}
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
        />
      </Card>
    </Stack>
  )
}

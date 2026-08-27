import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { bulkUploadRegistrations } from '../api/registrations'
import { extractErrorMessage } from '../lib/http'
import type { BulkUploadReport, RaceCategory } from '../types'

export default function BulkUploadDialog({
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<BulkUploadReport | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (open) {
      setFile(null)
      setError(null)
      setReport(null)
    }
  }, [open])

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await bulkUploadRegistrations(file)
      setReport(result)
      if (result.created_count > 0) onCreated()
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not process this file.'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk upload registrations</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Upload a CSV or XLSX file with columns <code>full_name</code>, <code>category_code</code>, and optionally{' '}
            <code>email</code>, <code>phone</code>, <code>status</code> (defaults to Confirmed).
          </Typography>

          {categories.length > 0 && (
            <Stack spacing={0.75}>
              <Typography variant="caption" color="text.secondary">
                Valid category_code values:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    size="small"
                    label={`${category.code} — ${category.name}`}
                    sx={{ fontFamily: 'inherit' }}
                  />
                ))}
              </Stack>
            </Stack>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Stack spacing={1} sx={{ alignItems: 'center' }}>
              <CloudUploadRoundedIcon color="action" />
              <Typography variant="body2">{file ? file.name : 'No file selected'}</Typography>
              <Button size="small" onClick={() => fileInputRef.current?.click()}>
                Choose file
              </Button>
            </Stack>
          </Box>

          {report && (
            <Stack spacing={1.5}>
              <Alert severity={report.error_count === 0 ? 'success' : 'warning'}>
                Created {report.created_count} registration{report.created_count === 1 ? '' : 's'}
                {report.error_count > 0 ? `, ${report.error_count} row${report.error_count === 1 ? '' : 's'} failed.` : '.'}
              </Alert>
              {report.errors.length > 0 && (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Row</TableCell>
                      <TableCell>Error</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {report.errors.map((err) => (
                      <TableRow key={err.row}>
                        <TableCell>{err.row}</TableCell>
                        <TableCell>{err.error}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleUpload} disabled={!file} loading={uploading}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  )
}

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { PieChart } from '@mui/x-charts/PieChart'
import { titleCase } from '../lib/format'
import { green, orange, red, gray, teal } from '../theme/themePrimitives'
import type { DashboardStats, RegistrationStatus } from '../types'

const STATUS_COLORS: Record<RegistrationStatus, string> = {
  CONFIRMED: green.main,
  PAYMENT_PROCESSING: orange.main,
  PENDING_PAYMENT: orange.light,
  CANCELLED: red.main,
  EXPIRED: red.dark,
  REFUNDED: teal.main,
}

export default function StatusPieChart({ byStatus }: { byStatus: DashboardStats['by_status'] }) {
  const data = byStatus.map((row, index) => ({
    id: index,
    value: row.count,
    label: titleCase(row.status),
    color: STATUS_COLORS[row.status] ?? gray[400],
  }))
  const total = data.reduce((sum, row) => sum + row.value, 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          <Typography variant="subtitle1">Registrations by status</Typography>
          <Typography variant="caption" color="text.secondary">
            {total} total registrations
          </Typography>
        </Stack>
        {total === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No registrations yet.
          </Typography>
        ) : (
          <PieChart
            height={280}
            series={[{ data, innerRadius: 50, paddingAngle: 2, cornerRadius: 3 }]}
            slotProps={{ legend: { direction: 'vertical', position: { vertical: 'middle', horizontal: 'end' } } }}
          />
        )}
      </CardContent>
    </Card>
  )
}

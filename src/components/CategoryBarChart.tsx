import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { BarChart } from '@mui/x-charts/BarChart'
import { brand } from '../theme/themePrimitives'
import type { DashboardStats } from '../types'

export default function CategoryBarChart({ byCategory }: { byCategory: DashboardStats['by_category'] }) {
  const labels = byCategory.map((row) => row.category__name || 'Uncategorised')
  const counts = byCategory.map((row) => row.count)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          <Typography variant="subtitle1">Registrations by category</Typography>
          <Typography variant="caption" color="text.secondary">
            All-time registrations across every race category
          </Typography>
        </Stack>
        {counts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            No registrations yet.
          </Typography>
        ) : (
          <BarChart
            height={280}
            series={[{ data: counts, label: 'Registrations', color: brand.main }]}
            xAxis={[{ data: labels, scaleType: 'band' }]}
            grid={{ horizontal: true }}
            margin={{ left: 40, right: 10, top: 20, bottom: 40 }}
          />
        )}
      </CardContent>
    </Card>
  )
}

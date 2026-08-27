import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatMoney } from '../lib/format'
import type { DashboardStats, RaceCategory } from '../types'

export default function RaceCategoriesCard({
  categories,
  byCategory,
}: {
  categories: RaceCategory[]
  byCategory: DashboardStats['by_category']
}) {
  const countByName = new Map(byCategory.map((row) => [row.category__name, row.count]))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
          Race categories
        </Typography>
        <Stack spacing={2.5}>
          {categories.map((category) => {
            const registered = countByName.get(category.name) ?? 0
            const pct = category.capacity ? Math.min(100, (registered / category.capacity) * 100) : null
            return (
              <Stack key={category.id} spacing={0.5}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline', minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      ({category.code})
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, pl: 1 }}>
                    {formatMoney(category.price, category.currency)}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {registered} registered{category.capacity ? ` of ${category.capacity} spots` : ''}
                </Typography>
                {pct !== null && <LinearProgress variant="determinate" value={pct} sx={{ borderRadius: 4, height: 6 }} />}
              </Stack>
            )
          })}
          {categories.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No race categories configured yet.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

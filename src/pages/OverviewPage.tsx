import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchDashboardStats, fetchRaceCategories } from '../api/dashboard'
import { fetchRegistrations } from '../api/registrations'
import CategoryBarChart from '../components/CategoryBarChart'
import RaceCategoriesCard from '../components/RaceCategoriesCard'
import StatCard from '../components/StatCard'
import { RegistrationStatusChip } from '../components/StatusChip'
import StatusPieChart from '../components/StatusPieChart'
import { extractErrorMessage } from '../lib/http'
import { formatDateTime, formatMoney } from '../lib/format'
import type { AdminRegistration, DashboardStats, RaceCategory } from '../types'

export default function OverviewPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [categories, setCategories] = useState<RaceCategory[]>([])
  const [recent, setRecent] = useState<AdminRegistration[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      fetchDashboardStats(),
      fetchRaceCategories(),
      fetchRegistrations({ page: 1, page_size: 6, ordering: '-registered_at' }),
    ])
      .then(([statsData, categoryData, registrationPage]) => {
        if (cancelled) return
        setStats(statsData)
        setCategories(categoryData)
        setRecent(registrationPage.results)
        setError(null)
      })
      .catch((err) => !cancelled && setError(extractErrorMessage(err, 'Could not load dashboard data.')))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Stack>
    )
  }

  if (error || !stats) {
    return <Alert severity="error">{error ?? 'Could not load dashboard data.'}</Alert>
  }

  const currency = categories[0]?.currency ?? 'ZMW'

  return (
    <Stack spacing={3} sx={{ pt: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Stack>
          <Typography variant="h4">Overview</Typography>
          <Typography variant="body2" color="text.secondary">
            Live snapshot of registrations, revenue and race capacity
          </Typography>
        </Stack>
        <Button variant="contained" onClick={() => navigate('/registrations')}>
          View all registrations
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total registrations"
            value={stats.total_registrations}
            subtitle={`${stats.today_count} registered today`}
            icon={<GroupsRoundedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Confirmed revenue"
            value={formatMoney(stats.revenue_confirmed, currency)}
            subtitle="Payments received"
            icon={<PaidRoundedIcon fontSize="small" />}
            accent="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending revenue"
            value={formatMoney(stats.revenue_pending, currency)}
            subtitle="Awaiting payment"
            icon={<HourglassTopRoundedIcon fontSize="small" />}
            accent="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Race categories"
            value={categories.length}
            subtitle="Active categories open"
            icon={<EventAvailableRoundedIcon fontSize="small" />}
            accent="secondary.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <CategoryBarChart byCategory={stats.by_category} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <StatusPieChart byStatus={stats.by_status} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1">Recent registrations</Typography>
                <Button size="small" onClick={() => navigate('/registrations')}>
                  See all
                </Button>
              </Stack>
              <Stack divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
                {recent.map((registration) => (
                  <Stack
                    key={registration.id}
                    direction="row"
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: 'center', py: 1.25, cursor: 'pointer' }}
                    onClick={() => navigate(`/registrations?open=${registration.id}`)}
                  >
                    <Stack sx={{ minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                        {registration.participant.full_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {registration.registration_number ?? 'Unconfirmed'} · {registration.category_name}
                      </Typography>
                    </Stack>
                    <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
                      <RegistrationStatusChip status={registration.status} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(registration.registered_at)}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
                {recent.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No registrations yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RaceCategoriesCard categories={categories} byCategory={stats.by_category} />
        </Grid>
      </Grid>
    </Stack>
  )
}

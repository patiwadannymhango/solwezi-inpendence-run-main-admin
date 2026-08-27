import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent = 'primary.main',
}: {
  title: string
  value: ReactNode
  subtitle?: string
  icon: ReactNode
  accent?: string
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          <Stack
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: accent,
              color: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

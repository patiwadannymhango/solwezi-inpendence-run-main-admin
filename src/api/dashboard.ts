import { http } from '../lib/http'
import type { DashboardStats, RaceCategory } from '../types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await http.get<DashboardStats>('/admin/dashboard/')
  return data
}

export async function fetchRaceCategories(): Promise<RaceCategory[]> {
  const { data } = await http.get<RaceCategory[]>('/categories/')
  return data
}

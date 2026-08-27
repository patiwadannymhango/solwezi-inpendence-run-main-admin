import { http } from '../lib/http'
import type { AdminRaceCategory, RaceCategoryPayload } from '../types'

export async function fetchAdminCategories(): Promise<AdminRaceCategory[]> {
  const { data } = await http.get<AdminRaceCategory[]>('/admin/categories/')
  return data
}

export async function createCategory(payload: RaceCategoryPayload): Promise<AdminRaceCategory> {
  const { data } = await http.post<AdminRaceCategory>('/admin/categories/', payload)
  return data
}

export async function updateCategory(id: string, payload: Partial<RaceCategoryPayload>): Promise<AdminRaceCategory> {
  const { data } = await http.patch<AdminRaceCategory>(`/admin/categories/${id}/`, payload)
  return data
}

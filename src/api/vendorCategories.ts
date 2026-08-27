import { http } from '../lib/http'
import type { AdminVendorCategory, VendorCategoryPayload } from '../types'

export async function fetchAdminVendorCategories(): Promise<AdminVendorCategory[]> {
  const { data } = await http.get<AdminVendorCategory[]>('/vendors/admin/categories/')
  return data
}

export async function createVendorCategory(payload: VendorCategoryPayload): Promise<AdminVendorCategory> {
  const { data } = await http.post<AdminVendorCategory>('/vendors/admin/categories/', payload)
  return data
}

export async function updateVendorCategory(
  id: string,
  payload: Partial<VendorCategoryPayload>,
): Promise<AdminVendorCategory> {
  const { data } = await http.patch<AdminVendorCategory>(`/vendors/admin/categories/${id}/`, payload)
  return data
}

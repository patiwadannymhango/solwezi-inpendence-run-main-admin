import { http } from '../lib/http'
import type { AdminUser, CreateAdminUserPayload, Paginated, UpdateAdminUserPayload } from '../types'

export interface AdminUserListParams {
  page?: number
  search?: string
  ordering?: string
}

export async function fetchAdminUsers(params: AdminUserListParams): Promise<Paginated<AdminUser>> {
  const { data } = await http.get<Paginated<AdminUser>>('/auth/admin/users/', {
    params: { page: params.page, search: params.search || undefined, ordering: params.ordering },
  })
  return data
}

export async function createAdminUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
  const { data } = await http.post<AdminUser>('/auth/admin/users/create/', payload)
  return data
}

export async function updateAdminUser(id: string, payload: UpdateAdminUserPayload): Promise<AdminUser> {
  const { data } = await http.patch<AdminUser>(`/auth/admin/users/${id}/`, payload)
  return data
}

export async function deactivateAdminUser(id: string): Promise<void> {
  await http.delete(`/auth/admin/users/${id}/`)
}

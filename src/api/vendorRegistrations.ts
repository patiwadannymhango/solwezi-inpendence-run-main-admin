import { http } from '../lib/http'
import type {
  AdminVendorRegistration,
  ManualVendorRegistrationPayload,
  Paginated,
  RegistrationStatus,
  VendorRegistrationEditPayload,
} from '../types'

export interface VendorRegistrationListParams {
  page?: number
  search?: string
  status?: RegistrationStatus | ''
  category?: string
  ordering?: string
  page_size?: number
}

export async function fetchVendorRegistrations(
  params: VendorRegistrationListParams,
): Promise<Paginated<AdminVendorRegistration>> {
  const { data } = await http.get<Paginated<AdminVendorRegistration>>('/vendors/admin/registrations/', {
    params: {
      page: params.page,
      search: params.search || undefined,
      status: params.status || undefined,
      category: params.category || undefined,
      ordering: params.ordering,
      page_size: params.page_size,
    },
  })
  return data
}

export async function fetchVendorRegistration(id: string): Promise<AdminVendorRegistration> {
  const { data } = await http.get<AdminVendorRegistration>(`/vendors/admin/registrations/${id}/`)
  return data
}

export async function updateVendorRegistration(
  id: string,
  payload: VendorRegistrationEditPayload,
): Promise<AdminVendorRegistration> {
  const { data } = await http.patch<AdminVendorRegistration>(`/vendors/admin/registrations/${id}/`, payload)
  return data
}

export async function updateVendorRegistrationStatus(
  id: string,
  status: RegistrationStatus,
): Promise<AdminVendorRegistration> {
  return updateVendorRegistration(id, { status })
}

export async function deleteVendorRegistration(id: string): Promise<void> {
  await http.delete(`/vendors/admin/registrations/${id}/`)
}

export async function createManualVendorRegistration(
  payload: ManualVendorRegistrationPayload,
): Promise<AdminVendorRegistration> {
  const { data } = await http.post<AdminVendorRegistration>('/vendors/admin/registrations/manual/', payload)
  return data
}

export async function exportVendorRegistrations(): Promise<Blob> {
  const { data } = await http.get('/vendors/admin/registrations/export/', { responseType: 'blob' })
  return data
}

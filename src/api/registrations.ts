import { http } from '../lib/http'
import type {
  AdminRegistration,
  BulkUploadReport,
  ManualRegistrationPayload,
  Paginated,
  RegistrationEditPayload,
  RegistrationStatus,
} from '../types'

export interface RegistrationListParams {
  page?: number
  search?: string
  status?: RegistrationStatus | ''
  category?: string
  ordering?: string
  page_size?: number
}

export async function fetchRegistrations(params: RegistrationListParams): Promise<Paginated<AdminRegistration>> {
  const { data } = await http.get<Paginated<AdminRegistration>>('/admin/registrations/', {
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

export async function fetchRegistration(id: string): Promise<AdminRegistration> {
  const { data } = await http.get<AdminRegistration>(`/admin/registrations/${id}/`)
  return data
}

export async function updateRegistration(id: string, payload: RegistrationEditPayload): Promise<AdminRegistration> {
  const { data } = await http.patch<AdminRegistration>(`/admin/registrations/${id}/`, payload)
  return data
}

export async function updateRegistrationStatus(id: string, status: RegistrationStatus): Promise<AdminRegistration> {
  return updateRegistration(id, { status })
}

export async function deleteRegistration(id: string): Promise<void> {
  await http.delete(`/admin/registrations/${id}/`)
}

export async function createManualRegistration(payload: ManualRegistrationPayload): Promise<AdminRegistration> {
  const { data } = await http.post<AdminRegistration>('/admin/registrations/manual/', payload)
  return data
}

export async function bulkUploadRegistrations(file: File): Promise<BulkUploadReport> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await http.post<BulkUploadReport>('/admin/registrations/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function exportRegistrations(): Promise<Blob> {
  const { data } = await http.get('/admin/registrations/export/', { responseType: 'blob' })
  return data
}

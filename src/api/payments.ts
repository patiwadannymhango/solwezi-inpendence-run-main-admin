import { http } from '../lib/http'
import type { AdminPayment, Paginated, PaymentMethod, PaymentStatus } from '../types'

export interface PaymentListParams {
  page?: number
  search?: string
  status?: PaymentStatus | ''
  payment_method?: PaymentMethod | ''
  ordering?: string
}

export async function fetchPayments(params: PaymentListParams): Promise<Paginated<AdminPayment>> {
  const { data } = await http.get<Paginated<AdminPayment>>('/payments/admin/payments/', {
    params: {
      page: params.page,
      search: params.search || undefined,
      status: params.status || undefined,
      payment_method: params.payment_method || undefined,
      ordering: params.ordering,
    },
  })
  return data
}

import { http } from '../lib/http'
import type { CurrentUser } from '../types'

export interface LoginPayload {
  email: string
  password: string
}

interface TokenPair {
  access: string
  refresh: string
}

export async function login(payload: LoginPayload): Promise<TokenPair> {
  const { data } = await http.post<TokenPair>('/auth/login/', payload)
  return data
}

export async function logout(refresh: string): Promise<void> {
  await http.post('/auth/logout/', { refresh })
}

export async function fetchMe(): Promise<CurrentUser> {
  const { data } = await http.get<CurrentUser>('/auth/me/')
  return data
}

export async function updateMe(payload: Partial<Pick<CurrentUser, 'first_name' | 'last_name' | 'phone'>>) {
  const { data } = await http.patch<CurrentUser>('/auth/me/', payload)
  return data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await http.post('/auth/change-password/', {
    current_password: currentPassword,
    new_password: newPassword,
  })
}

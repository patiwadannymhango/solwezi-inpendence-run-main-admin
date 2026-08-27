import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStore } from './tokens'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const http = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
})

// Fires once the refresh token itself is rejected — the auth context
// subscribes to this to clear state and bounce to /login without the
// two modules importing each other.
type SessionExpiredHandler = () => void
let onSessionExpired: SessionExpiredHandler | null = null
export function setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
  onSessionExpired = handler
}

http.interceptors.request.use((config) => {
  const access = tokenStore.getAccess()
  if (access) {
    config.headers = config.headers ?? new AxiosHeaders()
    config.headers.set('Authorization', `Bearer ${access}`)
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStore.getRefresh()
  if (!refresh) return null

  try {
    const { data } = await axios.post<{ access: string; refresh?: string }>(
      `${API_BASE_URL}/api/v1/auth/refresh/`,
      { refresh },
    )
    tokenStore.set(data.access, data.refresh)
    return data.access
  } catch {
    tokenStore.clear()
    return null
  }
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined
    const status = error.response?.status
    const isAuthEndpoint = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/refresh')

    if (status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true

      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })

      const newAccess = await refreshPromise
      if (newAccess) {
        config.headers = config.headers ?? new AxiosHeaders()
        config.headers.set('Authorization', `Bearer ${newAccess}`)
        return http(config)
      }

      onSessionExpired?.()
    }

    return Promise.reject(error)
  },
)

export function extractErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>
      if (typeof record.detail === 'string') return record.detail

      const firstField = Object.entries(record).find(([, value]) => value !== undefined)
      if (firstField) {
        const [field, value] = firstField
        const message = Array.isArray(value) ? value.join(' ') : String(value)
        return field === 'non_field_errors' || field === 'detail' ? message : `${field}: ${message}`
      }
    }
    if (error.message) return error.message
  }
  return fallback
}

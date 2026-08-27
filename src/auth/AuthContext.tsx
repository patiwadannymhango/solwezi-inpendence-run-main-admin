import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchMe, login as loginRequest, logout as logoutRequest } from '../api/auth'
import { setSessionExpiredHandler } from '../lib/http'
import { tokenStore } from '../lib/tokens'
import type { CurrentUser } from '../types'

interface AuthContextValue {
  user: CurrentUser | null
  status: 'loading' | 'authenticated' | 'anonymous'
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')

  const clearSession = useCallback(() => {
    tokenStore.clear()
    setUser(null)
    setStatus('anonymous')
  }, [])

  useEffect(() => {
    setSessionExpiredHandler(clearSession)
    return () => setSessionExpiredHandler(null)
  }, [clearSession])

  useEffect(() => {
    if (!tokenStore.getAccess()) {
      setStatus('anonymous')
      return
    }
    fetchMe()
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch(() => clearSession())
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await loginRequest({ email, password })
    tokenStore.set(tokens.access, tokens.refresh)
    const me = await fetchMe()
    setUser(me)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    const refresh = tokenStore.getRefresh()
    try {
      if (refresh) await logoutRequest(refresh)
    } catch {
      // Refresh token may already be expired/blacklisted — clear locally regardless.
    }
    clearSession()
  }, [clearSession])

  const refreshUser = useCallback(async () => {
    const me = await fetchMe()
    setUser(me)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, logout, refreshUser, isAdmin: user?.role === 'ADMIN' }),
    [user, status, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

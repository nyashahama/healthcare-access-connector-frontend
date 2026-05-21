import
  { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode }
from 'react'
import { authService } from '@/api/services/authService'
import { sessionManager } from '@/platform/auth/sessionManager'
import type { Role } from '@/types/auth'

interface AuthContextValue {
  user: Record<string, unknown> | null
  loading: boolean
  isAuthenticated: boolean

  register: (data: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  login: (credentials: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
  verifyEmail: (token: string) => Promise<{ success: boolean; data?: unknown; error?: string }>
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; data?: unknown; error?: string }>
  resetPassword: (data: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  registerInvitedStaff: (data: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  generateOTP: (data: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  verifyOTP: (data: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  resendVerification: (email: string) => Promise<{ success: boolean; data?: unknown; error?: string }>
  updatePassword: (userId: string, data: Record<string, unknown>) => Promise<{ success: boolean; data?: unknown; error?: string }>
  getProfile: (userId: string) => Promise<{ success: boolean; data?: unknown; error?: string }>
  getConsent: (userId: string) => Promise<{ success: boolean; data?: unknown; error?: string }>
  updateUser: (userData: Record<string, unknown> | null) => void
  refreshAuth: () => void

  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean

  getToken: () => string | null | undefined
  getCurrentUser: () => Record<string, unknown> | null | undefined
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isMounted = useRef(true)

  useEffect(() => {
    const session = sessionManager.hydrate()
    if (!session) {
      setLoading(false)
      return
    }
    const { token, user: sessionUser, expiresAt } = session
    const isValid = Boolean(token && expiresAt && new Date(expiresAt) > new Date())

    if (isValid && sessionUser) {
      setUser(sessionUser as unknown as Record<string, unknown> | null)
      setIsAuthenticated(true)
    } else {
      sessionManager.clearSession('hydrate-invalid')
      setUser(null)
      setIsAuthenticated(false)
    }

    setLoading(false)

    return () => {
      isMounted.current = false
    }
  }, [])

  const registerInvitedStaff = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.registerInvitedStaff(data)
      const inner = response.data

      if (inner.token && inner.user) {
        sessionManager.saveSession({
          token: inner.token,
          user: inner.user,
          expiresAt: inner.expiresAt,
        })
        setUser(inner.user as unknown as Record<string, unknown> | null)
        setIsAuthenticated(true)
      } else if (inner.user) {
        setUser(inner.user as unknown as Record<string, unknown> | null)
      }

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Staff registration failed'
      console.error('Staff registration error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const register = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.register(data as any)
      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Registration failed'
      console.error('Registration error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setLoading(true)
    try {
      const response = await authService.login(credentials as any)
      const inner = response.data
      sessionManager.saveSession({
        token: inner.token,
        user: inner.user,
        expiresAt: inner.expiresAt,
      })
      setUser(inner.user as unknown as Record<string, unknown> | null)
      setIsAuthenticated(true)
      return { success: true, data: response }
    } catch (error: unknown) {
      return { success: false, error: (error as { message?: string }).message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      await authService.logout()

      sessionManager.clearSession('logout')
      if (isMounted.current) {
        setUser(null)
        setIsAuthenticated(false)
      }

      return { success: true }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Logout failed'
      console.error('Logout error:', error)

      sessionManager.clearSession('logout-error')
      if (isMounted.current) {
        setUser(null)
        setIsAuthenticated(false)
      }

      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const verifyEmail = useCallback(async (token: string) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.verifyEmail(token)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Verification failed'
      console.error('Verification error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const requestPasswordReset = useCallback(async (identifier: string) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.requestPasswordReset(identifier)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'Request failed'
      console.error('Password reset request error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const resetPassword = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.resetPassword(data)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Password reset failed'
      console.error('Password reset error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const generateOTP = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.generateOTP(data)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Failed to generate OTP'
      console.error('OTP generation error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const verifyOTP = useCallback(async (data: Record<string, unknown>) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.verifyOTP(data)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Failed to verify OTP'
      console.error('OTP verification error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const resendVerification = useCallback(async (email: string) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.resendVerification(email)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Failed to resend verification'
      console.error('Resend verification error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const updatePassword = useCallback(async (userId: string, data: Record<string, unknown>) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.updatePassword(userId, data)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Password update failed'
      console.error('Password update error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const getProfile = useCallback(async (userId: string) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.getProfile(userId)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Failed to load profile'
      console.error('Get profile error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const getConsent = useCallback(async (userId: string) => {
    try {
      if (!isMounted.current)
        return { success: false, error: 'Component unmounted' }

      setLoading(true)
      const response = await authService.getConsent(userId)

      return { success: true, data: response }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string }).message || 'Failed to load consent'
      console.error('Get consent error:', error)
      return { success: false, error: errorMessage }
    } finally {
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }, [])

  const updateUser = useCallback((userData: Record<string, unknown> | null) => {
    if (isMounted.current) {
      setUser(userData)
      sessionManager.saveSession({
        user: userData as any,
      } as any)
    }
  }, [])

  const refreshAuth = useCallback(() => {
    if (isMounted.current) {
      const session = sessionManager.hydrate()
      if (!session) {
        setIsAuthenticated(false)
        setUser(null)
        return
      }
      const { token, user: sessionUser, expiresAt } = session
      const isValid = Boolean(token && expiresAt && new Date(expiresAt) > new Date())

      setIsAuthenticated(isValid)
      setUser((sessionUser as unknown as Record<string, unknown> | null) ?? null)
    }
  }, [])

  const hasRole = useCallback(
    (role: Role) => {
      return (user as any)?.role === role
    },
    [user]
  )

  const hasAnyRole = useCallback(
    (roles: Role[]) => {
      return roles.includes((user as any)?.role as Role)
    },
    [user]
  )

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        refreshAuth()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refreshAuth])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,

      register,
      login,
      logout,
      verifyEmail,
      requestPasswordReset,
      resetPassword,
      registerInvitedStaff,
      generateOTP,
      verifyOTP,
      resendVerification,
      updatePassword,
      getProfile,
      getConsent,
      updateUser,
      refreshAuth,

      hasRole,
      hasAnyRole,

      getToken: () => sessionManager.hydrate()?.token,
      getCurrentUser: () => sessionManager.hydrate()?.user as unknown as Record<string, unknown> | null | undefined,
    }),
    [
      user,
      loading,
      isAuthenticated,
      register,
      login,
      logout,
      verifyEmail,
      requestPasswordReset,
      resetPassword,
      registerInvitedStaff,
      generateOTP,
      verifyOTP,
      resendVerification,
      updatePassword,
      getProfile,
      getConsent,
      updateUser,
      refreshAuth,
      hasRole,
      hasAnyRole,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext

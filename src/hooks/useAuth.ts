import { authService } from '@/api/services/authService'
import { useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { sessionManager } from '@/platform/auth/sessionManager'

export const useAuth = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.register(data as any)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Registration failed'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const registerInvitedStaff = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.registerInvitedStaff(data)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string }).message || 'Staff registration failed'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const login = useCallback(async (credentials: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials as any)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Login unsuccessful'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await authService.logout()
      navigate({ to: '/auth/sign-in' as any })
      setLoading(false)
      return { success: true }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || "Couldn't log out"
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [navigate])

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.verifyEmail(token)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Verification failed'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const requestPasswordReset = useCallback(async (identifier: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.requestPasswordReset(identifier)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Request failed'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const resetPassword = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.resetPassword(data)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Password reset failed'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const generateOTP = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.generateOTP(data)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string }).message || 'Failed to generate OTP'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const verifyOTP = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.verifyOTP(data)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage = (err as { message?: string }).message || 'Failed to generate OTP'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const resendVerification = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.resendVerification(email)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string }).message || 'Failed to resend verification'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const updatePassword = useCallback(async (userId: string, data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.updatePassword(userId, data)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string }).message || 'Password update failed'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const getProfile = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.getProfile(userId)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string }).message || 'Failed to load profile'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const getConsent = useCallback(async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.getConsent(userId)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string }).message || 'Failed to load consent'
      setError(errorMessage)
      setLoading(false)
      return { success: false, error: errorMessage }
    }
  }, [])

  const getCurrentUser = useCallback(() => {
    return sessionManager.hydrate()?.user
  }, [])

  const getToken = useCallback(() => {
    return sessionManager.hydrate()?.token
  }, [])

  const isAuthenticated = () => {
    const session = sessionManager.hydrate()
    if (!session) return false
    const { token, expiresAt } = session
    return Boolean(token && expiresAt && new Date(expiresAt) > new Date())
  }

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    register,
    registerInvitedStaff,
    login,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    generateOTP,
    verifyOTP,
    resendVerification,
    updatePassword,
    getProfile,
    getConsent,
    clearError,

    loading,
    error,

    isAuthenticated: isAuthenticated(),
    getCurrentUser,
    getToken,
  }
}

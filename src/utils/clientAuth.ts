"use client"

// Client-side auth utility for checking authentication status
export async function isAuthenticated(): Promise<boolean> {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        const response = await fetch('/api/auth/status', {
            credentials: 'include',
            cache: 'no-store'
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        return Boolean(data?.authenticated)
    } catch (error) {
        console.error('Failed to verify auth status', error)
        return false
    }
}

// Get auth token from cookies
export function getAuthToken(): null {
    // auth-token cookie is httpOnly; return null to avoid exposing it client-side
    return null
}

// Check if user is authenticated and show login alert if not
export async function requireAuth(): Promise<boolean> {
    return isAuthenticated()
}
